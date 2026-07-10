import { track } from "@vercel/analytics";

// ── AFFILIATE JOB LISTINGS ────────────────────────────────────────────────────
// Single source of truth for partner (job agency) affiliate links.
// One entry = one landing page = one job. Links rotate: when a job closes,
// set `active: false` and push — every placement updates on deploy.
//
// Array order = display order. Put the strongest converters (salary shown,
// broad audience) first — placements may show only the top N.
//
// Fields:
//   id         – stable slug, also used as tracking subid
//   title      – job title shown to the user (Serbian)
//   hook       – 1 sentence benefit-first sell: WHO is it for + WHY apply.
//                Lead with the reader ("Govoriš nemački?"), not the company.
//   perks      – 3-4 short benefit chips (emoji + 2-3 words each)
//   badge      – small attention label ("NOVO", "TOP PLATA") or null
//   location   – city / "Remote"
//   salaryMin/salaryMax – RSD range if the agency lists it (null = unknown).
//                Used to match jobs to the visitor's calculated salary.
//   salaryNeto – true ONLY if the ad explicitly says the range is neto.
//                Accuracy is our moat — never claim neto when unspecified.
//   link       – the agency's landing-page URL WITH the ?promotion=...
//                trackable-share-link param (their native attribution — keep it!)
//   active     – false hides the job everywhere without deleting the entry

export const JOBS = [
  {
    id: "agent-kontakt-centra-de",
    title: "Agent kontakt centra — nemački jezik",
    hook: "Govoriš nemački (B2+)? Plata 120–140.000 RSD neto plus dnevni, nedeljni i mesečni bonusi — radno vreme 9–17, vikendi uvek slobodni.",
    perks: ["🗓️ Slobodni vikendi", "🌴 26 dana odmora", "🎯 Sistem bonusa", "📄 Ugovor na neodređeno"],
    badge: "TOP PLATA",
    location: "Beograd (Zemun)",
    salaryMin: 120000, salaryMax: 140000, salaryNeto: true,
    link: "https://poslovi.friendlyhr.rs/jobs/7841857-agent-kontakt-centra-nemacki-jezik?promotion=2090520-trackable-share-link-platnilistic",
    active: true,
  },
  {
    id: "glavni-knjigovodja",
    title: "Glavni knjigovođa",
    hook: "Vodiš knjige za više firmi bez po muke? Grupacija kompanija nudi 200–250.000 RSD mesečno, rad u senior timu i punu autonomiju u organizaciji procesa.",
    perks: ["👥 Senior tim", "🏢 Više industrija", "🎯 Autonomija u radu", "📈 Stabilna grupacija"],
    badge: "TOP PLATA",
    location: "Beograd",
    salaryMin: 200000, salaryMax: 250000, salaryNeto: false,
    link: "https://poslovi.friendlyhr.rs/jobs/7673251-glavni-knjigovoda?promotion=2090634-trackable-share-link-platnilistic",
    active: true,
  },
  {
    id: "glavni-knjigovodja-ns",
    title: "Glavni knjigovođa (Novi Sad)",
    hook: "Iskusan si knjigovođa (4+ godine) i želiš da zarada prati rezultate? Računovodstvena agencija u Novom Sadu nudi fiksni + varijabilni deo (procenat od fakturisanja) i radno vreme 7–15h.",
    perks: ["🕖 Radno vreme 7–15h", "💰 Fiks + procenat", "🏢 Različiti klijenti", "📚 Usavršavanje"],
    badge: null,
    location: "Novi Sad",
    salaryMin: null, salaryMax: null, salaryNeto: false,
    link: "https://poslovi.friendlyhr.rs/jobs/7211882-glavni-knjigovoda?promotion=2095203-trackable-share-link-platnilistic",
    active: true,
  },
  {
    id: "sef-gradilista",
    title: "Šef gradilišta",
    hook: "Znaš kako gradilište treba da „diše“? Kompanija specijalizovana za fasadne sisteme i stolariju traži iskusnog šefa gradilišta (3+ godine) za značajne projekte u Beogradu.",
    perks: ["🏗️ Značajni projekti", "🤝 Dugoročna saradnja", "📈 Profesionalni razvoj"],
    badge: "NOVO",
    location: "Beograd",
    salaryMin: null, salaryMax: null, salaryNeto: false,
    link: "https://poslovi.friendlyhr.rs/jobs/7994428-sef-gradilista?promotion=2090408-trackable-share-link-platnilistic",
    active: true,
  },
  {
    id: "specijalista-led",
    title: "Specijalista za LED i digitalnu oglasnu opremu",
    hook: "Razumeš se u LED displeje i digital signage? Vodi projekte savremenih digitalnih oglasnih sistema — od instalacije do razvoja mreže ekrana.",
    perks: ["📺 Moderne tehnologije", "🚀 Vođenje projekata", "📚 Usavršavanje"],
    badge: null,
    location: "Beograd",
    salaryMin: null, salaryMax: null, salaryNeto: false,
    link: "https://poslovi.friendlyhr.rs/jobs/7870034-specijalista-za-led-i-digitalnu-oglasnu-opremu?promotion=2090623-trackable-share-link-platnilistic",
    active: true,
  },
  {
    id: "menadzer-javne-nabavke",
    title: "Menadžer za javne nabavke",
    hook: "Imaš 5+ godina u komercijali i poznaješ tendere? Preuzmi ključnu ulogu u javnim nabavkama u stabilnoj kompaniji prisutnoj na domaćem i međunarodnom tržištu.",
    perks: ["📑 Ključna pozicija", "🏢 Stabilna kompanija", "🌍 Međunarodno tržište"],
    badge: null,
    location: "Beograd",
    salaryMin: null, salaryMax: null, salaryNeto: false,
    link: "https://poslovi.friendlyhr.rs/jobs/7059608-menadzer-za-javne-nabavke?promotion=2090528-trackable-share-link-platnilistic",
    active: true,
  },
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

// Jobs that state a salary range — the only ones the slide-in may promote,
// since its whole pitch is comparing the job's pay to the visitor's own.
export const salariedJobs = () =>
  activeJobs().filter(j => j.salaryMin != null || j.salaryMax != null);

// Midpoint of a job's stated range (a one-sided range is its own midpoint).
const midpoint = (j) => ((j.salaryMin ?? j.salaryMax) + (j.salaryMax ?? j.salaryMin)) / 2;

// The single job to promote in the slide-in for a visitor earning `neto`.
// Upsell angle: prefer the closest job that pays ABOVE what they earn today;
// if every match pays less, fall back to the closest one by midpoint.
// Returns null when nothing matches — the caller must then render nothing.
export function bestSlideInJob(neto) {
  const pool = matchJobs(neto).filter(j => j.salaryMin != null || j.salaryMax != null);
  if (pool.length === 0) return null;
  const closest = (list) =>
    [...list].sort((a, b) => Math.abs(midpoint(a) - neto) - Math.abs(midpoint(b) - neto))[0];
  const above = pool.filter(j => midpoint(j) > neto);
  return above.length > 0 ? closest(above) : closest(pool);
}

// Blog exit-intent has no calculated neto to match against, so promote the
// best-paying open job instead. Same "must state a salary" rule as above.
export function topPayingJob() {
  const pool = salariedJobs();
  if (pool.length === 0) return null;
  return [...pool].sort((a, b) => midpoint(b) - midpoint(a))[0];
}

// How much more the job's floor pays than the visitor's neto, as a percentage.
// Only meaningful when the ad explicitly states its range is NETO — otherwise
// we would be comparing a bruto range to a neto figure and overstating the gap.
// Rounds DOWN, and returns null below +5% so we never dress up a rounding error
// as a raise. Accuracy is the brand: understate or say nothing.
export function upliftPct(job, neto) {
  if (!job?.salaryNeto || job.salaryMin == null) return null;
  if (!neto || neto <= 0 || neto >= job.salaryMin) return null;
  const pct = Math.floor(((job.salaryMin - neto) / neto) * 100);
  return pct >= 5 ? pct : null;
}

const fmtRsd = (n) => new Intl.NumberFormat("sr-RS").format(n);

// Human-readable pay range, e.g. "120.000 – 140.000 RSD neto".
// Never appends "neto" unless the ad said so explicitly.
export function salaryLabel(j) {
  if (j.salaryMin == null && j.salaryMax == null) return null;
  const suffix = j.salaryNeto ? " RSD neto" : " RSD";
  if (j.salaryMin != null && j.salaryMax != null) return `${fmtRsd(j.salaryMin)} – ${fmtRsd(j.salaryMax)}${suffix}`;
  return `od ${fmtRsd(j.salaryMin ?? j.salaryMax)}${suffix}`;
}

// Count an affiliate event in GoatCounter (free, cookieless) AND Vercel
// Analytics (activates automatically if the site ever moves to a Pro plan).
// Production only — Vercel preview deploys (*.vercel.app) and localhost must
// not pollute the stats.
//
// The two sinks take DIFFERENT names by convention and always have: GoatCounter
// buckets by URL-ish path ("job-click/…"), Vercel by snake_case event name
// ("job_click"). Passing one string to both would silently rename the existing
// Vercel `job_click` metric, so callers pass an explicit pair.
export function trackJobEvent({ gcPath, vercelEvent }, jobId, placement) {
  if (typeof window === "undefined") return;
  if (!/(^|\.)platnilistic\.rs$/.test(window.location.hostname)) return;
  try {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: `${gcPath}/${jobId}/${placement}`, event: true });
    }
  } catch { /* no-op */ }
  try { track(vercelEvent, { job: jobId, placement }); } catch { /* no-op */ }
}

// Append placement tracking without clobbering the agency's own params
// (their ?promotion=... trackable link must survive untouched).
// `placement` tells us WHICH spot converted (kalkulator vs blog).
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
