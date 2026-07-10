import { matchJobs, activeJobs, withTracking, salaryLabel, trackJobEvent } from "./jobs.js";

// ── JOBS WIDGET (affiliate) ───────────────────────────────────────────────────
// Renders partner job offers, or an "uskoro" teaser while there are none.
// `neto`      – optional calculated neto salary; filters jobs to a relevant range
// `placement` – tracking label for the spot ("kalkulator" | "blog")
//
// Every affiliate link carries rel="sponsored" (Google link-scheme safety) and
// a visible partner disclosure (trust + legal).

// Names are load-bearing: both metrics predate this widget's refactor and
// renaming either would split its history. Keep them exactly as they were.
const trackJobClick = (jobId, placement) =>
  trackJobEvent({ gcPath: "job-click", vercelEvent: "job_click" }, jobId, placement);

// Serbian plural: 1 pozicija, 2-4 pozicije, 5+ pozicija
function pozicijaLabel(n) {
  if (n % 10 === 1 && n % 100 !== 11) return "otvorena pozicija";
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return "otvorene pozicije";
  return "otvorenih pozicija";
}

export function JobsWidget({ neto, placement = "site" }) {
  // Always show ALL active jobs; when we know the visitor's calculated neto,
  // sort salary-relevant jobs to the top instead of hiding the rest.
  let jobs = activeJobs();
  if (neto) {
    const matched = new Set(matchJobs(neto).map((j) => j.id));
    jobs = [...jobs].sort((a, b) => (matched.has(b.id) ? 1 : 0) - (matched.has(a.id) ? 1 : 0));
  }

  if (jobs.length === 0) {
    return (
      <aside className="jobs-widget jobs-widget-soon" aria-label="Otvorene pozicije — uskoro">
        <div className="jobs-widget-eyebrow">Poslovi · partner</div>
        <div className="jobs-widget-soon-row">
          <span className="jobs-widget-soon-badge">USKORO</span>
          <p>Otvorene pozicije od partnerske agencije za zapošljavanje — proverene ponude sa jasno navedenom platom.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="jobs-widget" aria-label="Otvorene pozicije partnera">
      <div className="jobs-widget-head">
        <div>
          <div className="jobs-widget-eyebrow">Poslovi · licencirana agencija</div>
          <div className="jobs-widget-title">
            Otvorene pozicije ove nedelje
            <span className="jobs-widget-count">{jobs.length} {pozicijaLabel(jobs.length)}</span>
          </div>
        </div>
      </div>
      <div className={`jobs-widget-list${jobs.length > 1 ? " jobs-widget-list-scroll" : ""}`}>
        {jobs.map((j) => (
          <a
            key={j.id}
            className="jobs-widget-card"
            href={withTracking(j.link, placement, j.id)}
            target="_blank"
            rel="sponsored noopener noreferrer"
            onClick={() => trackJobClick(j.id, placement)}
          >
            <span className="jobs-widget-card-top">
              {j.badge && <span className="jobs-widget-badge">{j.badge}</span>}
              <span className="jobs-widget-location">📍 {j.location}</span>
              {salaryLabel(j) && <span className="jobs-widget-salary">{salaryLabel(j)}</span>}
            </span>
            <span className="jobs-widget-card-title">{j.title}</span>
            {j.hook && <span className="jobs-widget-hook">{j.hook}</span>}
            {j.perks && j.perks.length > 0 && (
              <span className="jobs-widget-perks">
                {j.perks.map((p, i) => <span className="jobs-widget-perk" key={i}>{p}</span>)}
              </span>
            )}
            <span className="jobs-widget-cta-row">
              <span className="jobs-widget-cta-btn">Prijavi se besplatno →</span>
              <span className="jobs-widget-cta-sub">Prijava online · bez registracije</span>
            </span>
          </a>
        ))}
      </div>
      <div className="jobs-widget-disclosure">
        Oglasi partnera — ako se prijavite i zaposlite preko ovog linka, ostvarujemo proviziju. To ne utiče na uslove posla ni na vašu platu.
      </div>
    </aside>
  );
}
