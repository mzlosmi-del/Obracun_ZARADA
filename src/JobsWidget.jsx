import { track } from "@vercel/analytics";
import { matchJobs, activeJobs, withTracking } from "./jobs.js";

// ── JOBS WIDGET (affiliate) ───────────────────────────────────────────────────
// Renders partner job offers, or an "uskoro" teaser while there are none.
// `neto`      – optional calculated neto salary; filters jobs to a relevant range
// `placement` – tracking label for the spot ("kalkulator" | "blog")
//
// Every affiliate link carries rel="sponsored" (Google link-scheme safety) and
// a visible partner disclosure (trust + legal).

const fmtRsd = (n) => new Intl.NumberFormat("sr-RS").format(n);

function salaryLabel(j) {
  if (j.salaryMin == null && j.salaryMax == null) return null;
  if (j.salaryMin != null && j.salaryMax != null) return `${fmtRsd(j.salaryMin)} – ${fmtRsd(j.salaryMax)} RSD neto`;
  return `od ${fmtRsd(j.salaryMin ?? j.salaryMax)} RSD neto`;
}

export function JobsWidget({ neto, placement = "site" }) {
  const jobs = neto ? matchJobs(neto) : activeJobs();

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
      <div className="jobs-widget-eyebrow">Poslovi · partner</div>
      <div className="jobs-widget-title">Otvorene pozicije</div>
      <div className="jobs-widget-list">
        {jobs.map((j) => (
          <a
            key={j.id}
            className="jobs-widget-item"
            href={withTracking(j.link, placement, j.id)}
            target="_blank"
            rel="sponsored noopener noreferrer"
            onClick={() => { try { track("job_click", { job: j.id, placement }); } catch { /* no-op */ } }}
          >
            <span className="jobs-widget-item-main">
              <span className="jobs-widget-item-title">{j.title}</span>
              <span className="jobs-widget-item-meta">
                {j.location}{salaryLabel(j) ? ` · ${salaryLabel(j)}` : ""}
              </span>
            </span>
            <span className="jobs-widget-item-cta" aria-hidden="true">Pogledaj oglas →</span>
          </a>
        ))}
      </div>
      <div className="jobs-widget-disclosure">
        Oglasi partnera — ako se prijavite i zaposlite preko ovog linka, ostvarujemo proviziju. To ne utiče na uslove posla.
      </div>
    </aside>
  );
}
