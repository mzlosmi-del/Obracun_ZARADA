import { useEffect, useRef, useState } from "react";
import { bestSlideInJob, topPayingJob, salaryLabel, upliftPct, withTracking, trackJobEvent } from "./jobs.js";

// ── JOB SLIDE-IN (affiliate) ──────────────────────────────────────────────────
// Promotes ONE job at the moment of highest intent: just after the visitor sees
// what they actually earn (calculator), or as they leave a guide (blog).
//
// Deliberately NOT an interstitial. Google demotes mobile pages that cover the
// content on load, so on phones this is a short bottom sheet (≤35vh) with no
// backdrop, and the page underneath stays scrollable and clickable. On desktop
// it is a bottom-right card. Neither ever steals focus — it is non-modal.
//
//   trigger="calc"  – armed by a real input change, shows DELAY_MS later
//   trigger="exit"  – desktop-only exit-intent (pointer leaves via the top edge)

const DISMISS_KEY = "pl_jobslidein_dismissed";
const SUPPRESS_DAYS = 7;
const DELAY_MS = 4000;          // after the result settles
const SETTLE_MS = 1200;         // typing must stop this long to count as "done"
const DESKTOP_MIN_W = 761;      // must match the CSS breakpoint (and .jobs-sticky's)
const SWIPE_CLOSE_PX = 60;      // drag distance that dismisses the sheet

// Every localStorage touch is wrapped: Safari private mode throws on write, and
// a storage error must never take the calculator down with it.
function dismissedRecently() {
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < SUPPRESS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false; // storage unavailable — fall back to session-only suppression
  }
}

function rememberDismissal() {
  try { window.localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* no-op */ }
}

const isDesktop = () =>
  typeof window !== "undefined" && window.innerWidth >= DESKTOP_MIN_W;

export function JobSlideIn({ neto, trigger = "calc", placement }) {
  const [job, setJob] = useState(null);   // non-null ⇒ visible
  const shownRef = useRef(false);         // once per session, per mount
  const cardRef = useRef(null);
  const showTimer = useRef(null);         // the pending 4s reveal, if any

  // Reveal, but only if nothing has claimed the slot yet this session.
  const reveal = (candidate) => {
    if (shownRef.current || !candidate || dismissedRecently()) return;
    shownRef.current = true;
    setJob(candidate);
  };

  const close = () => {
    rememberDismissal();
    setJob(null);
  };

  // ── Trigger: calculator ────────────────────────────────────────────────────
  // `calculate()` re-runs on every keystroke and once on mount with the default
  // inputs, so "a calculation finished" has to be inferred. We ignore the very
  // first neto we see (that's the mount default, not the visitor's number), then
  // wait for typing to settle before starting the 4s delay.
  const baselineNeto = useRef(null);
  useEffect(() => {
    if (trigger !== "calc" || shownRef.current) return;
    if (!neto || neto <= 0) return;

    if (baselineNeto.current === null) {
      baselineNeto.current = neto;   // mount value — user has done nothing yet
      return;
    }
    if (neto === baselineNeto.current) return;

    // Each keystroke restarts the settle timer; only a pause actually arms the
    // reveal. Once armed, the 4s countdown is left alone — further edits don't
    // keep pushing it back, they just refresh which job it will show.
    const settle = setTimeout(() => {
      const candidate = bestSlideInJob(neto);
      if (!candidate) return;        // no salaried match → show nothing at all
      clearTimeout(showTimer.current);
      showTimer.current = setTimeout(() => reveal(candidate), DELAY_MS);
    }, SETTLE_MS);

    return () => clearTimeout(settle);
  }, [neto, trigger]);

  // A pending reveal must not fire into an unmounted component (route change).
  useEffect(() => () => clearTimeout(showTimer.current), []);

  // ── Trigger: desktop exit-intent ───────────────────────────────────────────
  // Mouse leaving through the TOP edge ⇒ heading for the tab bar / address bar.
  // Never on touch devices: they have no cursor, and a sheet on the way out of a
  // page is exactly the interstitial pattern we're avoiding.
  useEffect(() => {
    if (trigger !== "exit" || !isDesktop()) return;
    if (dismissedRecently()) return;

    const onLeave = (e) => {
      if (e.clientY > 0 || e.relatedTarget) return;   // not the top edge
      reveal(topPayingJob());
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, [trigger]);

  // ── Escape closes; focus is never taken from the page ──────────────────────
  useEffect(() => {
    if (!job) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [job]);

  // ── Impression ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!job) return;
    trackJobEvent({ gcPath: "job-slidein-view", vercelEvent: "job_slidein_view" }, job.id, placement);
  }, [job, placement]);

  // The mobile sticky footer (.jobs-sticky) is also pinned to the bottom edge,
  // at a higher z-index, and funnels to the same partner. Two stacked affiliate
  // bars is worse than either alone, so the sheet — which names an actual job
  // and its salary — takes the slot while it is open. Flagged via a body class
  // so neither component has to know the other exists.
  useEffect(() => {
    if (!job) return;
    document.body.classList.add("has-job-slidein");
    return () => document.body.classList.remove("has-job-slidein");
  }, [job]);

  // ── Swipe-down to dismiss (mobile) ─────────────────────────────────────────
  const dragStartY = useRef(null);
  const onTouchStart = (e) => { dragStartY.current = e.touches[0].clientY; };
  const onTouchMove = (e) => {
    if (dragStartY.current === null || !cardRef.current) return;
    const dy = e.touches[0].clientY - dragStartY.current;
    if (dy > 0) cardRef.current.style.transform = `translateY(${dy}px)`;
  };
  const onTouchEnd = (e) => {
    if (dragStartY.current === null) return;
    const dy = e.changedTouches[0].clientY - dragStartY.current;
    dragStartY.current = null;
    if (dy > SWIPE_CLOSE_PX) { close(); return; }
    if (cardRef.current) cardRef.current.style.transform = "";  // snap back
  };

  if (!job) return null;

  const pay = salaryLabel(job);
  const uplift = upliftPct(job, neto);

  return (
    <aside
      className="job-slidein"
      role="dialog"
      aria-label={`Preporučen posao: ${job.title}`}
      ref={cardRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="job-slidein-grip" aria-hidden="true" />
      <button className="job-slidein-close" onClick={close} aria-label="Zatvori">×</button>

      <div className="job-slidein-eyebrow">Posao · partner</div>
      <div className="job-slidein-title">{job.title}</div>

      <div className="job-slidein-meta">
        {pay && <span className="job-slidein-salary">{pay}</span>}
        <span className="job-slidein-location">📍 {job.location}</span>
      </div>

      {uplift !== null && (
        <div className="job-slidein-uplift">≈ {uplift}% više od tvoje plate</div>
      )}

      {job.hook && <p className="job-slidein-hook">{job.hook}</p>}

      <a
        className="job-slidein-cta"
        href={withTracking(job.link, placement, job.id)}
        target="_blank"
        rel="sponsored noopener noreferrer"
        onClick={() => trackJobEvent({ gcPath: "job-slidein-click", vercelEvent: "job_slidein_click" }, job.id, placement)}
      >
        Pogledaj oglas →
      </a>

      <div className="job-slidein-disclosure">
        Oglas partnera — ako se zaposlite preko ovog linka, ostvarujemo proviziju.
      </div>
    </aside>
  );
}
