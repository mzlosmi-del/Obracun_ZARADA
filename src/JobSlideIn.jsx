import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { activeJobs, scrollToJobs, trackJobEvent } from "./jobs.js";

// ── JOB SLIDE-IN (affiliate) ──────────────────────────────────────────────────
// A generic nudge toward the partner listings at the moment of highest intent:
// just after the visitor sees what they actually earn (calculator), or as they
// leave a guide (blog). It deliberately names NO job and quotes NO salary — the
// pitch is "there may be something better for you", and the on-page JobsWidget
// does the actual selling once they scroll to it.
//
// The CTA stays on-site rather than linking out: every affiliate URL in jobs.js
// is a per-job deep link carrying the agency's ?promotion=... attribution, and
// there is no generic landing page that would still pay commission. Scrolling to
// the widget hands the visitor the full list with every tracked link intact.
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

// Tracking subid. The old slide-in reported which job it showed; a generic one
// has none, so use a stable sentinel to keep the event path well-formed.
const TRACK_ID = "generic";

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

// Serbian plural: 1 pozicija, 2-4 pozicije, 5+ pozicija
function pozicijaLabel(n) {
  if (n % 10 === 1 && n % 100 !== 11) return "otvorena pozicija";
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return "otvorene pozicije";
  return "otvorenih pozicija";
}

export function JobSlideIn({ trigger = "calc", placement, neto }) {
  const [open, setOpen] = useState(false);
  const shownRef = useRef(false);         // once per session, per mount
  const cardRef = useRef(null);
  const showTimer = useRef(null);         // the pending 4s reveal, if any
  const navigate = useNavigate();

  const jobCount = activeJobs().length;

  // Reveal, but only if nothing has claimed the slot yet this session, and only
  // when there is actually something to send the visitor to.
  const reveal = () => {
    if (shownRef.current || jobCount === 0 || dismissedRecently()) return;
    shownRef.current = true;
    setOpen(true);
  };

  const close = () => {
    rememberDismissal();
    setOpen(false);
  };

  // Clicking through is not a dismissal in spirit, but it is in effect: the
  // visitor has been handed the list, so don't nag them again this week.
  const goToJobs = () => {
    trackJobEvent({ gcPath: "job-slidein-click", vercelEvent: "job_slidein_click" }, TRACK_ID, placement);
    rememberDismissal();
    setOpen(false);
    scrollToJobs(navigate);
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
    // reveal. Once armed, the 4s countdown is left alone.
    const settle = setTimeout(() => {
      clearTimeout(showTimer.current);
      showTimer.current = setTimeout(reveal, DELAY_MS);
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
      reveal();
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, [trigger]);

  // ── Escape closes; focus is never taken from the page ──────────────────────
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // ── Impression ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    trackJobEvent({ gcPath: "job-slidein-view", vercelEvent: "job_slidein_view" }, TRACK_ID, placement);
  }, [open, placement]);

  // The mobile sticky footer (.jobs-sticky) is also pinned to the bottom edge,
  // at a higher z-index, and funnels to the same partner. Two stacked affiliate
  // bars is worse than either alone, so the sheet takes the slot while it is
  // open. Flagged via a body class so neither component knows the other exists.
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("has-job-slidein");
    return () => document.body.classList.remove("has-job-slidein");
  }, [open]);

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

  if (!open) return null;

  return (
    <aside
      className="job-slidein"
      role="dialog"
      aria-label="Otvorene pozicije partnerske agencije"
      ref={cardRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="job-slidein-grip" aria-hidden="true" />
      <button className="job-slidein-close" onClick={close} aria-label="Zatvori">×</button>

      <div className="job-slidein-eyebrow">Posao · partner</div>
      <div className="job-slidein-title">Ima li posla koji plaća bolje?</div>

      <p className="job-slidein-hook">
        Pogledajte {jobCount} {pozicijaLabel(jobCount)} kod partnerske agencije — proverene
        ponude, mnoge sa jasno navedenom platom.
      </p>

      <button type="button" className="job-slidein-cta" onClick={goToJobs}>
        Pogledaj oglase →
      </button>

      <div className="job-slidein-disclosure">
        Oglasi partnera — ako se zaposlite preko njih, ostvarujemo proviziju.
      </div>
    </aside>
  );
}
