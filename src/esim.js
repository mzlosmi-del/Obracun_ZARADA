import { track } from "@vercel/analytics";

// ── AFFILIATE eSIM OFFERS ─────────────────────────────────────────────────────
// Single source of truth for travel-eSIM partner links (Impact.com network).
// Deliberately built like src/jobs.js so both affiliate surfaces behave the
// same: data here, presentation in the widget, one `active` flag per offer.
//
// WHY THIS IS NOT A SITEWIDE WIDGET
// The jobs widget works everywhere because "I just calculated my salary" is one
// step from "maybe I can earn more". A travel eSIM is NOT one step from a
// payroll query — a visitor checking doprinosi is not packing a bag. Blanketing
// the site would buy impressions at a ~0% CTR and put a second affiliate block
// in the slot that jobs already converts in. So placement is an explicit
// allowlist (ESIM_POSTS below): only pages whose reader is provably about to
// travel. Add a page to that list ONLY when you can name the travel intent.
//
// Fields:
//   id         – stable slug, also used as tracking subid
//   brand      – merchant name shown to the user (Airalo, Saily, Holafly…)
//   title      – headline of the card (Serbian)
//   hook       – 1 sentence, benefit-first, leads with the reader
//   perks      – 3-4 short benefit chips (emoji + 2-3 words each)
//   badge      – small attention label or null
//   priceFrom  – free-text price teaser ("od ~4 €") or null if unverified.
//                Accuracy is the moat: never invent or round a price. If you
//                cannot verify it today, leave null — the card sells fine
//                without it and a wrong price costs more than it earns.
//   link       – the FULL Impact tracking URL. Never hand-edit its params.
//   active     – false hides the offer everywhere without deleting the entry

export const ESIM_OFFERS = [
  {
    id: "airalo-esim",
    brand: "Airalo",
    // ⚠️ PLACEHOLDER — nothing renders while the link is a TODO.
    // To go live: paste the Impact tracking URL into `link`, verify `priceFrom`
    // against the merchant's page that day, set active: true.
    title: "eSIM za internet u inostranstvu",
    hook: "Putujete van Srbije? eSIM se aktivira skeniranjem koda pre polaska — internet radi čim sletite, bez roaming računa i bez menjanja SIM kartice.",
    perks: ["📲 Aktivacija za 2 minuta", "🚫 Bez roaminga", "🌍 200+ zemalja", "🔁 Zadržavate svoj broj"],
    badge: null,
    priceFrom: null,
    link: "https://TODO-IMPACT-TRACKING-LINK",
    active: false,
  },
];

// ── PLACEMENT ALLOWLIST ───────────────────────────────────────────────────────
// Blog post ids where the eSIM card is allowed to render, each with the travel
// intent that earns it the slot. Anything not listed here shows nothing.
export const ESIM_POSTS = {
  "godisnji-odmor-naknada": "naknada za godišnji odmor — reader is planning the trip",
  "topli-obrok-i-regres": "regres = holiday allowance — same reader, money in hand",
  "uplate-iz-inostranstva": "foreign clients / earning across borders",
  "porez-za-frilensere": "freelancers — the closest thing we have to digital nomads",
  // Next one to add: a "dnevnice za službeni put u inostranstvo" article —
  // a payroll query whose reader is literally booking a foreign business trip.
};

export const showsEsim = (postId) => Object.prototype.hasOwnProperty.call(ESIM_POSTS, postId);

// Offers currently live. An offer whose link is still a placeholder can never
// render, whatever `active` says — a broken affiliate click is worse than none.
export const activeEsimOffers = () =>
  ESIM_OFFERS.filter((o) => o.active && /^https:\/\//.test(o.link) && !o.link.includes("TODO"));

// Count an affiliate event in GoatCounter (free, cookieless) AND Vercel
// Analytics. Same two-sink convention as jobs.js: GoatCounter buckets by
// URL-ish path, Vercel by snake_case event name — never pass one string to both.
export function trackEsimEvent({ gcPath, vercelEvent }, offerId, placement) {
  if (typeof window === "undefined") return;
  if (!/(^|\.)platnilistic\.rs$/.test(window.location.hostname)) return;
  try {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: `${gcPath}/${offerId}/${placement}`, event: true });
    }
  } catch { /* no-op */ }
  try { track(vercelEvent, { offer: offerId, placement }); } catch { /* no-op */ }
}

// Append placement tracking without clobbering Impact's own params (irclickid,
// clickref and friends must survive untouched).
//
// `subId1` is Impact's native sub-id: setting it means the placement shows up
// in the Impact dashboard next to the actual payout, not only in our own
// analytics — that is the number that tells us which page earns money.
export function withEsimTracking(link, placement, offerId) {
  try {
    const u = new URL(link);
    if (!u.searchParams.has("utm_source")) u.searchParams.set("utm_source", "platnilistic");
    if (!u.searchParams.has("utm_medium")) u.searchParams.set("utm_medium", "affiliate");
    u.searchParams.set("utm_campaign", placement);
    u.searchParams.set("utm_content", offerId);
    if (!u.searchParams.has("subId1")) u.searchParams.set("subId1", placement);
    return u.toString();
  } catch {
    return link; // malformed URL — ship it untouched rather than break the click
  }
}
