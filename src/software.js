// ── CUSTOM-SOFTWARE CTA PLACEMENT ────────────────────────────────────────────
// Single source of truth for which blog posts carry the "softver po meri" CTA.
// Built like src/esim.js and src/jobs.js so every contextual surface behaves the
// same way: data here, presentation in the component, one allowlist.
//
// WHY THIS IS NOT SITEWIDE
// The jobs widget works everywhere because "I just checked my salary" is one
// step from "maybe I can earn more". Custom software is the opposite: it is
// bought by the person who SIGNS for the company, and most of this site's
// readers are employees checking their own net pay. Blanketing the blog would
// show a business offer to people who cannot buy it, at the cost of the slot
// that jobs already converts in.
//
// THE BAR FOR ADDING A POST
// You must be able to name, in one sentence, why THIS post's reader runs a
// business with a process that can break. "It is tagged Biznis" is not a
// reason. Growth-threshold posts are the strongest signal on the whole site: a
// paušalac reading about the 8-million limit is, by definition, a business that
// grew — which is the exact moment the case study describes.
//
// DELIBERATELY EXCLUDED, so nobody "fixes" it later:
//   kako-registrovati-firmu, registracija-pausalca, kosta-otvaranje-firme
//     → pre-revenue founders. Real business intent, but they have no process to
//       automate yet and no budget. Premature; revisit if the page ever needs
//       volume more than it needs qualified readers.
//   pausalno-oporezivanje, koliko-pausalac-placa-mesecno, sifre-delatnosti-pausal
//     → one-person paušalci doing an admin lookup. No employees, no handoffs.
//   godisnji-porez-na-dohodak, neoporezivi-2026, doprinosi-srbija, ugovor-o-delu
//     → read by employees at least as often as by employers. Mixed intent.
//   uplate-iz-inostranstva → solo freelancers receiving payments.

export const SOFTWARE_POSTS = {
  // Growth thresholds — the reader is provably scaling right now.
  "limit-za-pausalce": "hit the 6/8M cap — the business outgrew what one person can track by hand",
  "pdv-prag-preduzetnik": "crossing the PDV threshold means order volume already grew",
  "pausal-ili-doo": "outgrowing the simple structure; deciding how to run a real company",
  "frilenser-pausalac-firma": "becoming a firm with people — the moment handoffs start to exist",

  // Employer signals — the reader demonstrably has staff and a payroll process.
  "porez-na-bonus": "pays bonuses, therefore has employees, therefore has a process",
  "registracija-doo": "a DOO is founded to employ people, unlike a paušal registration",
};

export const showsSoftwareCTA = (postId) =>
  Object.prototype.hasOwnProperty.call(SOFTWARE_POSTS, postId);
