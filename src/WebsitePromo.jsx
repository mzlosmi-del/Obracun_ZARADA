// src/WebsitePromo.jsx — the on-site hints for the combined offer:
// "sajtovi i softver po meri" for business owners.
//
// 17.11.2026 (Milos): the partner job ads are off the site. Every slot they
// held now points at ONE landing page, /softver-po-meri, which covers both
// website building and custom software:
//   • WebsitePromo          — the card (under the calculator result, end of blog posts)
//   • WebsiteCTABanner      — bottom of the homepage
//   • SidebarWebsiteTeaser  — sidebar card
//   • WebsiteStickyFooter   — mobile bottom bar
//
// Primary action is always the landing page (lead_page_click); the card also
// offers the form modal directly (lead_form_open) for a reader already sold.
// Same rule as ProCTA: a cold reader gets the argument before the ask. There is
// deliberately no mailto: and no phone number — form-only intake.
//
// ACCURACY RULES — same moat as the calculators:
//  1. Every figure comes from ONE primary source, the RZS publication below,
//     and is worded the way the publication words it (who was asked, what
//     period). When RZS publishes the 2027 edition (October), update all three
//     figures and the title together — never mix years. The landing page reads
//     the same constants, so one edit covers both.
//  2. The enterprise figure covers enterprises with 10+ employees only. Say so
//     wherever it is shown; it is NOT "85,8% of all firms".
//  3. No outcome promises ("+X% prometa", "prvi na Guglu"), no invented client
//     results, no prices. Benefits are things the delivered work HAS, not
//     results it guarantees.
import { Link, useLocation } from "react-router-dom";
import { track } from "./track.js";
import { LEAD_PATH } from "./lead.jsx";

// Republički zavod za statistiku: „Upotreba informaciono-komunikacionih
// tehnologija u Republici Srbiji, 2026” (objavljeno 23.10.2026).
//   91,8% — lica 16–74 koja su koristila internet u poslednja tri meseca (1.3.6)
//   56,8% — korisnici interneta koji su kupili/poručili onlajn u poslednja tri meseca (1.3.8)
//   85,8% — preduzeća sa 10+ zaposlenih koja poseduju veb-sajt (2.3; mala 83,2%)
export const WEB_STATS_URL = "https://publikacije.stat.gov.rs/G2026/pdf/G202616021.pdf";
export const WEB_STATS_TITLE = "„Upotreba informaciono-komunikacionih tehnologija u Republici Srbiji, 2026”";
export const WEB_STATS = [
  { value: "91,8%", label: "građana Srbije od 16 do 74 godine koristi internet" },
  { value: "56,8%", label: "korisnika interneta kupilo je ili poručilo robu ili usluge onlajn u poslednja tri meseca" },
  { value: "85,8%", label: "preduzeća sa 10 i više zaposlenih već ima svoj veb-sajt" },
];

const BENEFITS = [
  "Sajt: brz, pregledan na telefonu, sa ponudom i kontaktom dostupnim 24 sata dnevno.",
  "Upiti stižu direktno vama — kontakt forma i poziv jednim dodirom, bez posrednika i provizije.",
  "Softver po meri: porudžbine, kupci i izveštaji na jednom mestu umesto u svesci i Excel tabeli.",
  "Svako u firmi vidi samo svoj deo posla — prava pristupa po ulozi.",
];

// `placement` is one of the fixed "promo-*" labels in src/track.js — never a
// visitor value.
function openLeadForm(placement) {
  track("lead_form_open", placement);
  window.dispatchEvent(new Event("open-lead-modal"));
}

export function StatsSource() {
  return (
    <div className="web-promo-source">
      Izvor: Republički zavod za statistiku,{" "}
      <a href={WEB_STATS_URL} target="_blank" rel="noopener noreferrer">{WEB_STATS_TITLE}</a>.
    </div>
  );
}

function PromoActions({ placement }) {
  return (
    <div className="web-promo-cta-row">
      <Link className="web-promo-btn" to={LEAD_PATH} onClick={() => track("lead_page_click", placement)}>
        Pogledajte šta radim i kako →
      </Link>
      <button type="button" className="web-promo-link" onClick={() => openLeadForm(placement)}>
        ili odmah zakažite besplatan razgovor
      </button>
    </div>
  );
}

// No <h2>/<p>/<ul> on purpose: the card sits inside the calculator page and
// next to .post-body, and both scopes style those elements (the specificity
// trap from the blue lead panels). Divs keep the card's own classes in charge
// and keep an off-topic heading out of the homepage outline.
export function WebsitePromo({ placement, compact = false }) {
  if (compact) {
    return (
      <aside className="web-promo web-promo-blog" aria-label="Sajtovi i softver po meri za firme">
        <div className="web-promo-eyebrow">Za vlasnike firmi · sajtovi i softver po meri</div>
        <div className="web-promo-title">Više od polovine korisnika interneta u Srbiji kupuje onlajn. Mogu li da kupe od vas?</div>
        <div className="web-promo-body">
          U poslednja tri meseca robu ili usluge je preko interneta kupilo ili poručilo <strong>56,8%</strong> korisnika
          interneta, a svoj veb-sajt već ima <strong>85,8%</strong> preduzeća sa 10 i više zaposlenih. Pravim moderne
          sajtove i softver po meri za male firme u Srbiji — od sajta preko kog vas kupci nalaze do alata koji sve
          porudžbine drži na jednom mestu.
        </div>
        <PromoActions placement={placement} />
        <StatsSource />
      </aside>
    );
  }
  return (
    <aside className="web-promo" aria-label="Sajtovi i softver po meri za firme">
      <div className="web-promo-eyebrow">Za vlasnike firmi · sajtovi i softver po meri</div>
      <div className="web-promo-title">Vaši kupci su već na internetu. Da li tamo nalaze vas — ili konkurenciju?</div>
      <div className="web-promo-stats">
        {WEB_STATS.map((s) => (
          <div className="web-promo-stat" key={s.value}>
            <span className="web-promo-stat-value">{s.value}</span>
            <span className="web-promo-stat-label">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="web-promo-body">
        Pravim moderne sajtove i softver po meri za male firme u Srbiji. Sajt koji upravo koristite napravio sam na
        isti način.
      </div>
      <div className="web-promo-list" role="list">
        {BENEFITS.map((b) => (
          <div className="web-promo-item" role="listitem" key={b}>{b}</div>
        ))}
      </div>
      <PromoActions placement={placement} />
      <StatsSource />
    </aside>
  );
}

// Full-width banner at the bottom of the homepage.
export function WebsiteCTABanner() {
  return (
    <section className="web-cta" aria-label="Sajtovi i softver po meri za firme">
      <div className="web-cta-text">
        <div className="web-cta-eyebrow">Za vlasnike firmi</div>
        <div className="web-cta-title">Sajt i softver po meri za vašu firmu</div>
        <div className="web-cta-body">
          Svoj veb-sajt već ima 85,8% preduzeća sa 10 i više zaposlenih (RZS, 2026). Pravim moderne sajtove i alate po
          meri za male firme. Prvi razgovor je besplatan i bez obaveze.
        </div>
      </div>
      <Link className="web-cta-btn" to={LEAD_PATH} onClick={() => track("lead_page_click", "promo-banner")}>
        Pogledajte ponudu →
      </Link>
    </section>
  );
}

// Compact sidebar card. No figure here: there is no room for its caveat.
export function SidebarWebsiteTeaser({ onGo }) {
  return (
    <div className="sidebar-promo">
      <div className="sidebar-promo-title">Imate firmu?</div>
      <div className="sidebar-promo-sub">Sajtovi i softver po meri za male firme</div>
      <Link
        className="sidebar-promo-btn"
        to={LEAD_PATH}
        onClick={() => { track("lead_page_click", "promo-sidebar"); onGo?.(); }}
      >
        Pogledajte ponudu →
      </Link>
    </div>
  );
}

// Mobile-only sticky footer, mounted once at the App root. The bottom edge is
// a single slot (see body.sidebar-open in index.css). Hidden on the landing
// page itself, which is where it leads.
export function WebsiteStickyFooter() {
  const location = useLocation();
  if (location.pathname === LEAD_PATH) return null;
  return (
    <Link
      className="promo-sticky"
      to={LEAD_PATH}
      onClick={() => track("lead_page_click", "promo-sticky")}
      aria-label="Sajtovi i softver po meri za firme — pogledajte ponudu"
    >
      <span className="promo-sticky-text">Imate firmu? Sajtovi i softver po meri</span>
      <span className="promo-sticky-cta" aria-hidden="true">Ponuda →</span>
    </Link>
  );
}
