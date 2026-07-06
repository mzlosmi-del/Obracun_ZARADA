// ── AFFILIATE JOB LISTINGS ────────────────────────────────────────────────────
// Single source of truth for partner (job agency) affiliate links.
// One entry = one landing page = one job. Links rotate: when a job closes,
// set `active: false` and push — every placement updates on deploy.
//
// Fields:
//   id         – stable slug, also used as tracking subid
//   title      – job title shown to the user (Serbian)
//   location   – city / "Remote"
//   salaryMin/salaryMax – NETO RSD range if the agency provides it (null = unknown).
//                Used to match jobs to the visitor's calculated salary.
//   link       – the agency's affiliate landing-page URL (paste as received)
//   active     – false hides the job everywhere without deleting the entry
//
// Example:
// {
//   id: "racunovodja-bg",
//   title: "Samostalni računovođa",
//   location: "Beograd",
//   salaryMin: 90000, salaryMax: 130000,
//   link: "https://agencija.example/landing/xyz?aff=platnilistic",
//   active: true,
// },

export const JOBS = [
  // Uskoro — paste agency links here.
];

// Jobs currently open.
export const activeJobs = () => JOBS.filter(j => j.active);

// Jobs relevant for a given calculated neto salary: within ±30% of the job's
// range (or all active jobs when the job has no range / no salary given).
export function matchJobs(neto) {
  const open = activeJobs();
  if (!neto || neto <= 0) return open;
  const matched = open.filter(j => {
    if (j.salaryMin == null && j.salaryMax == null) return true;
    const lo = (j.salaryMin ?? j.salaryMax) * 0.7;
    const hi = (j.salaryMax ?? j.salaryMin) * 1.3;
    return neto >= lo && neto <= hi;
  });
  // Never show an empty widget if there ARE open jobs — fall back to all.
  return matched.length > 0 ? matched : open;
}

// Append placement tracking without clobbering the agency's own params.
// `placement` tells us WHICH spot converted (kalkulator vs blog) — this is
// our only leverage when reconciling CPA payouts with the agency.
export function withTracking(link, placement, jobId) {
  try {
    const u = new URL(link);
    if (!u.searchParams.has("utm_source")) u.searchParams.set("utm_source", "platnilistic");
    if (!u.searchParams.has("utm_medium")) u.searchParams.set("utm_medium", "affiliate");
    u.searchParams.set("utm_campaign", placement);
    u.searchParams.set("utm_content", jobId);
    return u.toString();
  } catch {
    return link; // malformed URL — ship it untouched rather than break the click
  }
}
