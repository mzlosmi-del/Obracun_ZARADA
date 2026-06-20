# Design — Dedicated Calculator & Reference Pages (PlatniListić)

**Date:** 2026-06-20
**Repo:** `Obracun_ZARADA` (= PlatniListić — confirmed via `SITE_URL = https://www.platnilistic.rs` in both `src/seo.jsx` and `scripts/prerender.mjs`)
**Source spec:** the Next.js-flavored "Implementation Spec — Dedicated Calculator & Reference Pages" provided by the user.
**This document:** that spec **adapted to the actual stack** (Vite + React SPA, not Next.js), with user-approved decisions baked in.

---

## 0. Hard constraint (unchanged from source spec)

The existing homepage calculator must keep working **exactly as today**. Additive only. No deleting/fragmenting/rewriting the calculator. All rates from a single source of truth. If the only way to build a page is to alter shared calc logic, stop and surface it.

---

## 1. Stack reality (the key adaptation)

The source spec assumes Next.js. **This repo is a Vite + React SPA** with `react-router-dom` and a custom Puppeteer prerender script. Mapping:

| Spec assumes (Next.js) | Reality here (Vite SPA) |
|---|---|
| App/Pages Router | `react-router-dom` `<Routes>` in `src/App.jsx` (~line 1064) |
| `metadata` export / `next-seo` | `useSeo()` hook in `src/seo.jsx` — sets title/desc/canonical/OG/Twitter/JSON-LD/FAQ at runtime |
| Server-rendered HTML for view-source | `scripts/prerender.mjs` puppeteer-renders every route in `ROUTES` → static `dist/<slug>/index.html` (true SSG) |
| `next-sitemap` | `sitemapXml()` inside `prerender.mjs` (~line 34), built from the route list |
| Rates config module | `DEFAULT_RATES` + `getNonTaxable()` currently **inside** `App.jsx` (~lines 16–43), **not exported** |
| Tailwind / CSS modules | Single global stylesheet `src/index.css`; shared UI primitives in `src/ui.jsx` |

`vercel.json` already: `cleanUrls:true`, catch-all rewrite `/((?!api/).*) → /index.html`, and non-www → www 301 redirect. `public/robots.txt` already `Allow: /` + sitemap reference. **No changes needed to `vercel.json` or `robots.txt`.**

---

## 2. User-approved decisions

1. **Adapt the spec to this stack and build everything** (all 15 pages — Phase 1 + Phase 2).
2. **Calculator reuse = "full calc + keyword copy"** (the spec's accepted fallback). Each tool page embeds the **unchanged** `CalculatorPage` below page-specific SEO/H1/intro/guide/FAQ. No focus-prop surgery on the homepage component (lower regression risk). Optional anchor-scroll to the relevant tab is allowed but must not change default behavior.
3. **Paušal PIO rate = 24%** (matches the live blog post `koliko-pausalac-placa-mesecno`), **not** the source spec's 25,5%. Paušalci pay **porez 10% + PIO 24% + zdravstveno 10,3%** on the Tax-Authority-assigned base; **no separate nezaposlenost line** for paušal. This overrides the source spec's `/pausal` figures.
4. **Prosečna zarada figure** sourced by the assistant from the live post `prosecna-plata-srbija` (RZS): neto **121.650 RSD**, bruto **167.263 RSD** (mart 2026), medijalna 91.399, kurs 117,40 din/€. Cited to RZS.
5. **GSC "Request indexing"** is handled by the user (note it in the PR description; do not attempt programmatically).
6. **`useSeo` is lifted out of `CalculatorPage`** so the homepage `/` route owns homepage SEO and each new page owns its own — no SEO collision. `CalculatorPage` becomes presentation-only and renders byte-for-byte identically.

---

## 3. Architecture

### 3.1 `src/rates.js` (NEW — single source of truth)

Extract from `App.jsx` (no value change): `getNonTaxable()` and `DEFAULT_RATES`, both `export`ed. `App.jsx` imports them — homepage behavior unchanged.

Add:
- `PAUSAL_RATES = { porez: 10, pio: 24, zdravstveno: 10.3 }` — `// VERIFY: blog koliko-pausalac-placa-mesecno (jun 2026); source spec said PIO 25,5% + nezaposlenost 0,75% — using blog/CROSO 24% per user.`
- `REFERENCE_DATA`:
  - `minimalnaZarada2026 = { netoMesecno: 69000, brutoMesecno: 93264, cenaRadnogCasaNeto: <official Vlada RS figure for 2026, cited to Sl. glasnik RS — NOT silently computed>, vaziOd: "februar 2026" }` (config wins over the 64.554 figure in the prosečna-plata post; note the discrepancy in a code comment). The cena radnog časa is a published government value, not a derived one — the implementation must use the official figure and cite it; if it cannot be confirmed at build time, surface that rather than guessing.
  - `prosecnaZarada2026 = { neto: 121650, bruto: 167263, medijalna: 91399, mesec: "mart 2026", kursEur: 117.40, izvor: "RZS" }`.
  - `radniDani2026` — array of 12 `{ mesec, radniDani, radniSati }` (fond sati = radniDani × 8), computed from a weekday count minus `praznici2026` non-working days.
  - `praznici2026` — list of `{ datum, naziv, neradno }` (državni + verski praznici).
  - `stopeDoprinosa` — already implied by `DEFAULT_RATES` (PIO 14/10, zdravstvo 5.15/5.15, nezaposlenost 0.75); reference page reads these.

All figures carry a source citation (Sl. glasnik RS / RZS / CROSO) rendered in a footnote.

### 3.2 `src/pages.jsx` (NEW — all new page components)

Lazy-loaded from `App.jsx` exactly like `Blog.jsx`/`Legal.jsx`/`About.jsx`. Exports:
- `ToolPage` — reusable template, parametrized by a per-slug config object.
- `ReferencePage` — lighter reusable template.
- `PausalCalculator` — self-contained calculator (the only new calc), reads `PAUSAL_RATES`.
- One thin wrapper component per slug (or a single config-driven router element) — TBD-free: implemented as a config map `{ slug: {...} }` consumed by `ToolPage`/`ReferencePage`.

**`ToolPage` structure (top→bottom):** Breadcrumb (Početna › name) → single `<h1>` (target keyword) → freshness stamp ("Ažurirano: jun 2026", single date constant) → intro (keyword in first 100 words) → `<CalculatorPage />` (full, unchanged) [or `<PausalCalculator />` for `/pausal`] → guide `<h2>` + 200–400-word worked example using current rates → FAQ `<h2>` (3–6 Q&A) → `<PovezaniKalkulatori />` → reuse existing disclaimer text. SEO + JSON-LD via `useSeo({ title, description, path, jsonLd, faq })`.

**`ReferencePage` structure:** single `<h1>` (keyword + year) → freshness → primary data table/list (from `REFERENCE_DATA`) → 150–300 words → 2–3 FAQ → `<PovezaniKalkulatori />` → source citation. SEO + FAQ JSON-LD via `useSeo`.

### 3.3 `src/ui.jsx` additions

- `PovezaniKalkulatori({ links })` — renders 3–4 descriptive-anchor links to sibling tools. Placed at the bottom of every tool/reference page.

### 3.4 `CalculatorPage` change (surgical, in `App.jsx`)

Remove the internal `useSeo({...path:"/"})` call from `CalculatorPage`. Move that exact call into the `/` route element so homepage SEO is identical. `CalculatorPage` now renders with no SEO side effect → reusable on any page without fighting that page's SEO. **This is the only change to the calculator component, and it is presentation-neutral.**

---

## 4. Routing, prerender, sitemap (SSG wiring)

1. **Routes** — add 15 `<Route path="/<slug>" element={<Suspense fallback={<RouteLoader/>}>…}/>` entries in `App.jsx`, lazy-loaded.
2. **Prerender** — add all 15 slugs to `STATIC_ROUTES` in `prerender.mjs`. The puppeteer loop renders each to `dist/<slug>/index.html`. The script's existing canonical-match `waitForFunction` validates each page's canonical for free. New pages render synchronously (no async data), so the `#root has children` + canonical waits suffice (no `.post-body` wait needed).
3. **Sitemap** — extend the `meta` map in `sitemapXml()` with per-slug `changefreq`/`priority`/`lastmod` (tools: monthly/0.8; references: yearly/0.7). Entries auto-emit from `STATIC_ROUTES`.
4. **`vercel.json` / `robots.txt`** — no change (already correct).

### Slugs

**Phase 1 — tools:** `/bruto-neto`, `/neto-bruto`, `/pausal`, `/bolovanje`, `/otpremnina`, `/minuli-rad`.
**Phase 1 — references:** `/minimalna-zarada-2026`, `/radni-dani-2026`, `/praznici-2026`.
**Phase 2 — tools:** `/dodaci-na-zaradu`, `/godisnji-porez`, `/ugovor-o-delu`.
**Phase 2 — references:** `/prosecna-zarada`, `/neoporezivi-iznos-2026`, `/stope-doprinosa-2026`.

> Note: a blog post `/blog/ugovor-o-delu` already exists; the new **tool** page is `/ugovor-o-delu` (no `/blog`). They cross-link, not collide.

### Metadata (Phase 1)

Use the source spec's Section 6 table verbatim **except** rate figures, which must match `rates.js` (config wins). Titles ≤ ~60 chars, descriptions ≤ ~160 chars, canonical `https://www.platnilistic.rs/<slug>`. Phase 2 pages get analogous metadata authored to the same rules.

---

## 5. Structured data (JSON-LD)

Reuse `useSeo`'s existing `jsonLd` (single object) and `faq` (array → FAQPage) params — already implemented in `seo.jsx`. Per page:
- **All:** `BreadcrumbList` (passed via `jsonLd`).
- **Tool pages:** `WebApplication`, `applicationCategory:"FinanceApplication"`, `offers.price:0`, `inLanguage:"sr-RS"` — combined with BreadcrumbList using a `@graph` array in the `jsonLd` object.
- **Tool + reference with Q&A:** `FAQPage` via the `faq` param (content must match visible FAQ text).
- A small `src/schema.js` helper builds Breadcrumb/WebApplication graph objects so pages pass data, not raw JSON. (Maps to the spec's `lib/schema.ts`.)

---

## 6. Internal linking

1. **Nav "Alati" group** — add the 6 tool links to the sidebar nav in `App.jsx` so they're one click from every page.
2. **`PovezaniKalkulatori`** — 3–4 sibling links at the bottom of each tool/reference page (descriptive anchors, e.g. "Paušal kalkulator").
3. **Blog → tool** contextual links in matching posts: `pausalno-oporezivanje`→`/pausal`, `kako-se-obracunava-bolovanje`→`/bolovanje`, `minuli-rad-obracun`→`/minuli-rad`, `otpremnina-obracun`→`/otpremnina`, `ugovor-o-delu`→`/ugovor-o-delu`.
4. **Tool → blog** — each tool's guide section links to its deep-dive post for "detaljan vodič".
5. **Homepage** — add an "Alati / kalkulatori" section linking to the dedicated tool pages.

### 6b. Indexation fix for the existing June cluster (independent quick win)

The cluster posts (`pausalno-oporezivanje`, `porez-za-frilensere`, `ugovor-o-delu`, and the other recent posts) are already prerendered + sitemapped + `index,follow` (verified: all live in `posts.js`, all go through `prerender.mjs`). The technical side is clean; the fix is **inbound internal links**:
- Add the cluster posts to the homepage "Popularni vodiči" `<nav>` (~`App.jsx:1169`).
- Confirm `/blog` index surfaces them (it iterates POSTS — it does).
- Cross-link from topically related older posts.
- Once tool pages exist, cross-link them ↔ cluster posts.
- **User handles** GSC "Request indexing" (note in PR description).

---

## 7. QA / verification (no test runner in repo)

`package.json` has no `test` script and no vitest/jest. QA is build-and-inspect:
- **Build gate:** `npm run build` must pass. `prerender.mjs` `process.exit(1)`s on any route failure or canonical mismatch → a broken new page fails the build.
- **`scripts/check-seo.mjs` (NEW):** post-build, per new route assert: exactly one `<h1>`, title + meta description present and within length, canonical = `www.` URL, JSON-LD parses, H1/intro/FAQ text present in the static HTML (view-source requirement).
- **Homepage regression:** confirm `dist/index.html` H1/intro/title unchanged after the `useSeo` lift.
- **Manual (user/preview):** Lighthouse SEO ≥ 95, no CLS regression, mobile layout — on the Vercel preview.

---

## 8. Acceptance criteria

- [ ] Homepage calculator renders/behaves identically (the `useSeo` lift is presentation-neutral; `dist/index.html` H1/intro/title unchanged).
- [ ] New pages embed the unchanged `CalculatorPage` (or `PausalCalculator`); no duplicated calc logic.
- [ ] All rates read from `src/rates.js`; no hardcoded rate literals in page files.
- [ ] Exactly one `<h1>` per page, containing the target keyword.
- [ ] Title + meta description present, within limits, unique per page.
- [ ] Canonical = `www.` URL; OG/Twitter set (via `useSeo`).
- [ ] JSON-LD present, valid (Google Rich Results), FAQ JSON matches visible FAQ.
- [ ] H1/intro/FAQ in server-rendered `dist/<slug>/index.html` (view-source check via `check-seo.mjs`).
- [ ] Freshness stamp visible.
- [ ] `PovezaniKalkulatori` + blog cross-links in place.
- [ ] Pages in sitemap; return 200; not robots-blocked.
- [ ] Lighthouse SEO ≥ 95, no CLS regression (preview).
- [ ] Mobile layout verified (preview).
- [ ] Paušal uses PIO 24% (not 25,5%); prosečna zarada figures cited to RZS.

---

## 9. Commit staging (single branch, logically ordered commits)

1. `rates.js` extraction + `useSeo` lift out of `CalculatorPage` (no behavior change) + Section 6b indexation links.
2. Infrastructure: `ToolPage` / `ReferencePage` / `PovezaniKalkulatori` / `PausalCalculator` / `schema.js`.
3. Phase 1 pages (6 tools + 3 references) + routes + prerender + sitemap.
4. Phase 2 pages (3 tools + 3 references).
5. Nav "Alati" + blog↔tool cross-links + homepage tools section.
6. `check-seo.mjs` + final QA pass.

### Manual steps for the user (PR description)
- Verify paušal PIO 24% vs any newer official figure.
- Verify minimalna-zarada cena radnog časa value once derived.
- GSC URL Inspection → "Request indexing" for new + cluster URLs.

---

## 10. Do NOT (unchanged from source spec)

- Don't change the homepage calculator's default behavior/appearance.
- Don't hardcode tax rates / neoporezivi iznos / minimalna zarada in page components.
- Don't create client-only pages for SEO content (prerender must cover them).
- Don't noindex/canonicalize-away/duplicate against the homepage.
- Don't introduce a non-www host variant.
