import { activeEsimOffers, withEsimTracking, trackEsimEvent } from "./esim.js";

// ── eSIM WIDGET (affiliate) ───────────────────────────────────────────────────
// A single contextual travel-eSIM card, rendered ONLY on the handful of posts
// listed in ESIM_POSTS (see src/esim.js for why it is not sitewide).
//
// Differences from JobsWidget, all deliberate:
//  • Renders NOTHING when there is no live offer. The jobs widget shows an
//    "uskoro" teaser because open positions are the promise of the site; a
//    missing eSIM card promises nothing, and an empty box on a payroll article
//    is just noise.
//  • Blue (--accent), not green. The green blocks are ours (calculator, jobs);
//    a different colour reads as "different thing", not "another job ad".
//  • One offer, not a list. This is a nudge inside someone else's article, not
//    a marketplace — a scrollable list here would outweigh the content.
//
// Every affiliate link carries rel="sponsored" (Google link-scheme safety) and
// a visible partner disclosure (trust + legal).

const trackEsimClick = (offerId, placement) =>
  trackEsimEvent({ gcPath: "esim-click", vercelEvent: "esim_click" }, offerId, placement);

export function EsimWidget({ placement = "blog" }) {
  const offers = activeEsimOffers();
  if (offers.length === 0) return null;

  const o = offers[0];

  return (
    <aside className="esim-widget" aria-label="Partnerska ponuda — eSIM za putovanje">
      <div className="esim-widget-eyebrow">Putujete? · partner</div>
      <a
        className="esim-widget-card"
        href={withEsimTracking(o.link, placement, o.id)}
        target="_blank"
        rel="sponsored noopener noreferrer"
        onClick={() => trackEsimClick(o.id, placement)}
      >
        <span className="esim-widget-card-top">
          {o.badge && <span className="esim-widget-badge">{o.badge}</span>}
          <span className="esim-widget-brand">{o.brand}</span>
          {o.priceFrom && <span className="esim-widget-price">{o.priceFrom}</span>}
        </span>
        <span className="esim-widget-card-title">{o.title}</span>
        {o.hook && <span className="esim-widget-hook">{o.hook}</span>}
        {o.perks && o.perks.length > 0 && (
          <span className="esim-widget-perks">
            {o.perks.map((p, i) => <span className="esim-widget-perk" key={i}>{p}</span>)}
          </span>
        )}
        <span className="esim-widget-cta-row">
          <span className="esim-widget-cta-btn">Pogledaj pakete →</span>
          <span className="esim-widget-cta-sub">Aktivacija pre polaska · bez ugovora</span>
        </span>
      </a>
      <div className="esim-widget-disclosure">
        Ponuda partnera — ako kupite preko ovog linka, ostvarujemo proviziju. Cena za vas je ista.
      </div>
    </aside>
  );
}
