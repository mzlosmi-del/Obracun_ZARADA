# Calculator-page dominance sprint — design

**Date:** 2026-07-08
**Goal:** Close the content gap between our thin calculator pages (235–714 words) and
competitors (pitajknjigovodju.rs, platica.rs — 1,500–3,000 words). GSC shows our blog
ranks pos 3–6 but calculator pages rank 9–11 on head terms. Deepen every calculator page
to 1,000+ words of accurate, non-boilerplate Serbian, add two new calculator pages, and
funnel blog authority to money pages.

## Hard rules (non-negotiable)

- **All figures from `src/rates.js`** (`DEFAULT_RATES`, `REFERENCE_DATA`, `PAUSAL_RATES`)
  or verified official sources (Sl. glasnik RS, RZS, Poreska uprava) with the existing
  verification-stamp convention. **Never invent figures.**
- **Do not change any calculator logic.** The compute function in `App.jsx` is frozen;
  new pages may add *presentation-only* mini-calculators (like the existing
  `OtpremninaCalculator`/`PausalCalculator`) but must not touch the core engine.
- **Keep the bundle lean** — no new dependencies. Content is JSX inside existing `cfg`
  objects.
- **Every page must pass `node scripts/check-seo.mjs`** (title ≤65, description ≤165,
  exactly one `<h1>`, canonical www + slug, valid JSON-LD).
- **Quality over keyword stuffing.** No repeated template sentences across pages. Content
  a knjigovođa would sign off on.

## Verified calculation anchor

From `App.jsx` compute function (lines ~77–96):

```
contribBase = clamp(bruto1, minBase 51.297, maxBase 732.820)
doprinosi zaposlenog = contribBase × 19,90%   (PIO 14 + zdravstvo 5,15 + nezap. 0,75)
taxBase = max(bruto1 − 34.221, 0)
porez   = taxBase × 10%
neto    = bruto1 − doprinosi − porez
bruto2  = bruto1 × 1,1515   (+ PIO 10 + zdravstvo 5,15 poslodavac)
```

Verified examples (must match calculator output exactly):

| Bruto 1 | Doprinosi (19,90%) | Poreska osnovica | Porez (10%) | Neto | Bruto 2 |
|---|---|---|---|---|---|
| 50.000 | 9.950 | 15.779 | 1.578 | 38.472 | 57.575 |
| 87.207 (minimalac) | 17.354 | 52.986 | 5.299 | 64.554 | 100.428 |
| 100.000 | 19.900 | 65.779 | 6.578 | 73.522 | 115.150 |
| 150.000 | 29.850 | 115.779 | 11.578 | 108.572 | 172.725 |

These reconcile with the existing homepage/bruto-neto example tables — confirmed.

## Architecture

No new infrastructure. The codebase is already factored for this:

- `ToolPage` / `ReferencePage` (`pages.jsx`) render everything from a `cfg` object:
  `{ slug, title, description, h1, breadcrumbName, intro, guide (JSX), faq, related, calc }`.
- `FreshnessStamp` and `PovezaniKalkulatori` are already shared components (`ui.jsx`).
- `webAppLd` / `breadcrumbLd` builders exist (`schema.js`); `ToolPage` already emits
  breadcrumb + webApp + FAQPage LD. `useSeo({ faq })` auto-generates FAQPage JSON-LD from
  the same array rendered visibly — so visible FAQ and schema never drift.

Therefore the work is: (a) extend `cfg.guide` JSX + `cfg.faq` on existing pages, (b) two
new page configs + two presentation-only mini-calculators, (c) register new routes in
three places, (d) markdown edits in `posts.js` for interlinking.

## Execution order & commits

Sequential; `npm run build` + `node scripts/check-seo.mjs` green before each commit.

1. **§3 New pages** (first, so hub + interlinks can reference real routes)
2. **§1 Homepage**
3. **§2 Deepen calculator pages** (may span multiple commits by priority)
4. **§4 Interlinking**
5. **§5 Schema/tech polish + final verification**

---

## §3 — New calculator pages

### a) `/godisnji-odmor`

- New `GodisnjiOdmorCalculator` (presentation-only, pattern of `OtpremninaCalculator`):
  - Mode toggle: **naknada za odmor** vs **naknada za neiskorišćeni odmor**.
  - Inputs: prosečna bruto zarada (prethodnih 12 meseci, default
    `REFERENCE_DATA.prosecnaZarada2026.bruto` = 168.008), broj radnih dana u mesecu
    (default 21), broj dana odmora / neiskorišćenih dana.
  - Output: dnevna osnova = prosek / radnih dana; naknada = dnevna × dani.
  - Legal basis: čl. 104 (osnovica = prosek 12 mes.) + čl. 114 (naknada za neiskorišćeni
    odmor pri prestanku radnog odnosa), Zakon o radu.
- `cfg` title: `Kalkulator godišnjeg odmora 2026 — naknada i neiskorišćeni dani | PlatniListić`
  (verify ≤65 chars incl. suffix — trim if needed).
- `webAppLd` name: `Kalkulator godišnjeg odmora 2026`.
- Guide H2s: kako se računa naknada (formula + primer), tabela parametara, neiskorišćeni
  odmor (čl. 114), česte greške, pravni okvir. FAQ targets: "kako se racuna godisnji odmor",
  "kalkulator za obračun naknade za neiskorišćeni godišnji odmor", "kako se racuna godisnji
  odmor kalkulator".
- Cross-link ↔ `/blog/godisnji-odmor-naknada` with intent split (blog = pravila,
  page = kalkulator).
- `related`: bruto-neto, bolovanje, radni-dani-2026, prosecna-zarada.

### b) `/jubilarna-nagrada`

- New `JubilarnaCalculator` (presentation-only):
  - Staž selector: 10 / 20 / 30 / 35 / 40 godina → multiplier of prosečna bruto zarada.
    Multipliers (neoporezivi max, ZPDG čl. 18): 10→1×, 20→2×, 30→2,5×, 35→ (interpolate to
    2,75× — **VERIFY against source; if unverifiable, drop the 35-god. row rather than
    invent**), 40→3×.
  - Base = `REFERENCE_DATA.prosecnaZarada2026.bruto` (168.008) — **derived live**, shown
    with source note "(RZS, {mesec})" so it stays self-consistent.
  - Optional "isplaćeni iznos" input → computes taxable overage above neoporezivi max
    (porez 10% + doprinosi 19,90% zaposleni), like the blog Scenario B.
- **Known discrepancy:** the live figures (~168k/336k/420k/504k) differ from the
  `/blog/jubilarna-nagrada` post (140k/280k/350k/420k, stale ~140k base). Per decision,
  the blog refresh is a **separate follow-up**, not part of this sprint. The calculator
  page states its base figure explicitly so it is internally correct.
- `cfg` title: `Kalkulator jubilarne nagrade 2026 — neoporezivi iznos | PlatniListić`
  (verify ≤65).
- `webAppLd` name: `Kalkulator jubilarne nagrade 2026`.
- Guide H2s + FAQ target: "kalkulator za obracun jubilarne nagrade" (26,8% CTR — pure
  calculator intent). Prominent calculator→blog and blog→calculator links.
- `related`: bruto-neto, minuli-rad, otpremnina, godisnji-porez.

### Registration (both pages)

- `App.jsx`: import + `<Route>` with `<Suspense>` wrapper.
- `prerender.mjs`: add to `STATIC_ROUTES` and to sitemap `meta` (`monthly`, `0.8`,
  `lastmod` = build date).
- `check-seo.mjs`: add both slugs to `ROUTES`.

---

## §1 — Homepage (`App.jsx` `HomePage` + `HOME_FAQ`)

- **Title** → `Kalkulator zarada 2026 — bruto u neto plata, Srbija | PlatniListić`
  (plural "zarada"; verify ≤60 chars).
- Add `<FreshnessStamp date="jul 2026." />` near the top + matching `dateModified`
  (already emitted by `webAppLd`; confirm it renders).
- **New SEO section below calculator** (~1,200–1,800 words, H2-structured):
  - Kako se obračunava zarada 2026 — korak po korak sa primerom.
  - Tabela "Parametri obračuna 2026" — porez 10%, neoporezivi 34.221, PIO/zdravstvo/
    nezaposlenost stope (emp + er), najniža 51.297 / najviša 732.820 osnovica — all pulled
    from `DEFAULT_RATES`; cite Sl. glasnik RS 115/2025 (neoporezivi) + CROSO (stope).
  - Bruto 1 vs bruto 2 explanation.
  - Primer za 3 iznosa: minimalac (87.207), 100.000, 150.000 bruto — computed with real
    formula, outputs verified above.
  - Uvećana zarada overview → link `/dodaci-na-zaradu` + `/minuli-rad`.
- **"Svi kalkulatori" hub**: expand existing "Kalkulatori i alati" nav to include all
  calculator + reference pages (add godisnji-odmor, jubilarna-nagrada, dodaci-na-zaradu,
  godisnji-porez, neoporezivi-iznos-2026, stope-doprinosa-2026, prosecna-zarada) with
  keyword-rich anchors ("bruto neto kalkulator", "paušal kalkulator", "kalkulator
  bolovanja"…).
- **Extend `HOME_FAQ`** (and visible `.home-faq`, kept in sync) with:
  "Kako se računa plata iz bruto u neto?", "Koliko iznosi porez i doprinosi na zaradu
  2026?", "Šta je bruto 2?", "Ako je bruto plata 50.000, kolika je neto?" (50.000→38.472
  already present — verify/keep). Answers use real computed figures.

---

## §2 — Deepen calculator pages to 1,000+ words

Priority order by impressions: bruto-neto (673), neto-bruto (174, weakest at pos 9.3),
pausal (1.100), bolovanje (1.406), otpremnina (1.373), minuli-rad (738), ugovor-o-delu
(572), godisnji-porez (550), dodaci-na-zaradu (272), prosecna-zarada.

Each page's `cfg.guide` gains (where not already present):
- H2: kako funkcioniše obračun (sa formulom)
- H2: tabela parametara 2026 (from `rates.js`)
- H2: radni primer sa konkretnim brojevima (computed correctly)
- H2: česte greške
- H2: pravni okvir (cite zakon + Sl. glasnik / član)
- +2–3 FAQ entries targeting real GSC queries (e.g. ugovor-o-delu: "kalkulator ugovora o
  delu 2026"; minuli-rad: "minuli rad kako se računa", "da li se minuli rad računa na
  godišnji odmor").
- `PovezaniKalkulatori` already present on all — verify anchors are descriptive.

Word count measured on rendered text (post-build dist inspection), not JSX source.

---

## §4 — Interlinking (`posts.js`)

Grep each post first; add a keyword-anchor link to its calculator in the **first third**
of the body, **only where missing**:

- bruto-neto-razlika → `/bruto-neto` ("bruto neto kalkulator")
- kako-se-obracunava-bolovanje → `/bolovanje`
- minuli-rad-obracun → `/minuli-rad`
- godisnji-odmor-naknada → `/godisnji-odmor`
- jubilarna-nagrada → `/jubilarna-nagrada`
- ugovor-o-delu → `/ugovor-o-delu`

---

## §5 — Schema / tech polish

- Every calculator page: `webAppLd` + `breadcrumbLd` + FAQPage (verify via existing
  builders — `ToolPage` already wires all three).
- `WebApplication` `name` contains the target keyword ("Bruto neto kalkulator 2026",
  "Kalkulator godišnjeg odmora 2026", …).
- **No fake ratings/reviews.**
- Final verification:
  1. `npm run build` (vite + prerender).
  2. Inspect `dist/<slug>/index.html` — confirm new text is present in prerendered HTML.
  3. `node scripts/check-seo.mjs` — all routes pass (now including 2 new).
  4. Confirm `dist/sitemap.xml` includes both new routes with correct `lastmod`.

## Out of scope (explicit)

- Refreshing `/blog/jubilarna-nagrada` figures to the rates.js base (separate follow-up).
- Any change to the core calculator compute logic.
- New dependencies or bundle-affecting libraries.
- Ratings/review schema.

## Risks

- **Volume of expert prose**: 1,000+ non-boilerplate words × ~12 pages + 2 new + homepage
  is the bulk of effort. Mitigation: distinct per-page examples/figures, multi-commit,
  each verified against the formula.
- **35-god. jubilej multiplier** unverified — drop the row rather than invent if no source.
- **check-seo title cap (65)**: new titles must be counted; trim suffix if over.
