# Implementation Notes — Dedicated Calculator & Reference Pages

Branch: `feat/dedicated-calculator-pages`. Adds 15 SEO landing pages (6 Phase-1 tools, 3 Phase-1 references, 3 Phase-2 tools, 3 Phase-2 references) without changing the homepage calculator.

## Stack notes (Vite + React SPA, not Next.js)

- Routing: `react-router-dom` `<Routes>` in `src/App.jsx`; new pages lazy-loaded from `src/pages.jsx`.
- SEO/JSON-LD: per-page via the existing `useSeo` hook (`src/seo.jsx`); schema builders in `src/schema.js`.
- Server-rendered HTML (for view-source / indexing): `scripts/prerender.mjs` Puppeteer-renders every route in `STATIC_ROUTES` to `dist/<slug>/index.html`, and generates `dist/sitemap.xml` from the same list.
- Single source of truth for all rates/figures: `src/rates.js` (`DEFAULT_RATES`, `PAUSAL_RATES`, `REFERENCE_DATA`). No rate literals in page components.
- New page templates: `ToolPage` / `ReferencePage` / `PausalCalculator` in `src/pages.jsx`.

## Build & verify

- Production build (Vercel): `npm run build` — uses bundled `@sparticuz/chromium`.
- Local build: set `PUPPETEER_EXECUTABLE_PATH` to a system Chrome, e.g.
  `PUPPETEER_EXECUTABLE_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe" npm run build`
  (Env var unset on Vercel → falls back to `@sparticuz/chromium`; production build path is unchanged.)
- SEO gate: `npm run check:seo` — asserts, per new route: exactly one `<h1>`, title ≤65 chars, description ≤165 chars, canonical = www host + slug, ≥1 parseable JSON-LD block. Currently: all 15 routes pass.
- Last full build: 45 routes prerendered; sitemap contains all 15 new URLs; homepage H1 + calculator unchanged.

## Manual steps for the site owner

1. **Verify paušal PIO rate (24%)** in `src/rates.js` (`PAUSAL_RATES.pio`). We used 24% to match the live blog post `koliko-pausalac-placa-mesecno` and CROSO; the original audit spec said 25,5%. Confirm against the latest CROSO figure.
2. **Verify `cenaRadnogCasaNeto`** in `src/rates.js` (`REFERENCE_DATA.minimalnaZarada2026`) — currently `null`. Insert the official 2026 per-hour neto figure (Sl. glasnik RS). Until set, the `/minimalna-zarada-2026` page cleanly omits that row.
3. **Verify `radniDani2026` and `praznici2026`** in `src/rates.js` against the official 2026 calendar and the Vlada RS decision on neradni dani (moveable feasts in particular — Vaskrs 12–13. april). These are flagged `// VERIFY` in the file.
4. **Google Search Console — Request indexing** (no GSC API connected; done by hand in the GSC web UI):
   - The 15 new URLs: `/bruto-neto`, `/neto-bruto`, `/pausal`, `/bolovanje`, `/otpremnina`, `/minuli-rad`, `/minimalna-zarada-2026`, `/radni-dani-2026`, `/praznici-2026`, `/dodaci-na-zaradu`, `/godisnji-porez`, `/ugovor-o-delu`, `/prosecna-zarada`, `/neoporezivi-iznos-2026`, `/stope-doprinosa-2026`.
   - The existing June cluster (now cross-linked from homepage + tools): `/blog/pausalno-oporezivanje`, `/blog/porez-za-frilensere`, `/blog/ugovor-o-delu`.

## Post-deploy checks (Vercel preview)

- Lighthouse SEO ≥ 95 on a sample of new pages; confirm no CLS regression from the calculator embed.
- Mobile layout spot-check on a tool page and a reference page.
- Validate JSON-LD on a tool page with Google Rich Results Test.
