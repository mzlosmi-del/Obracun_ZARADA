# Dedicated Calculator & Reference Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 15 SEO-optimized, intent-specific landing pages (6 Phase-1 tools, 3 Phase-1 references, 3 Phase-2 tools, 3 Phase-2 references) to the PlatniListić site without changing the existing homepage calculator's behavior.

**Architecture:** Vite + React SPA with `react-router-dom`. New pages are prerendered to static HTML by the existing Puppeteer script (`scripts/prerender.mjs`) for indexability. Tax rates are extracted into a single source of truth (`src/rates.js`). Tool pages embed the **unchanged** `CalculatorPage`; `/pausal` uses a new `PausalCalculator`. SEO/JSON-LD is set per page via the existing `useSeo` hook.

**Tech Stack:** React 18, react-router-dom 6, Vite 5, Puppeteer (build-time prerender), no test runner (verification = `npm run build` + `scripts/check-seo.mjs`).

## Global Constraints

- The homepage calculator must render byte-for-byte identically. Additive only — never delete/fragment/rewrite calculator logic.
- All tax/contribution/reference rates come from `src/rates.js`. No hardcoded rate literals in page components.
- Every new page: exactly one `<h1>` containing the target keyword; canonical = `https://www.platnilistic.rs/<slug>`; `index, follow`; server-rendered (prerendered) HTML must contain H1/intro/FAQ text.
- Paušal rates: porez 10%, PIO **24%**, zdravstveno 10,3%, **no nezaposlenost line** (per live blog + user decision; NOT the 25,5% from the source spec).
- Prosečna zarada (RZS, mart 2026): neto 121.650 RSD, bruto 167.263 RSD, medijalna 91.399, kurs 117,40 din/€.
- Minimalna zarada (config-authoritative): neto 69.000, bruto 93.264, važi od februar 2026.
- Titles ≤ ~60 chars; meta descriptions ≤ ~160 chars; unique per page.
- Serbian-language copy (sr-RS), matching the tone of existing pages.
- Commit after every task. Run `npm run build` before each commit that touches routes/pages/prerender.
- Site canonical host is `www.` only — never introduce a non-www variant.

---

## File Structure

- `src/rates.js` (NEW) — single source of truth: `getNonTaxable()`, `DEFAULT_RATES`, `PAUSAL_RATES`, `REFERENCE_DATA`.
- `src/schema.js` (NEW) — JSON-LD builders: `breadcrumbLd()`, `webAppLd()`.
- `src/pages.jsx` (NEW) — `ToolPage`, `ReferencePage`, `PausalCalculator`, `PovezaniKalkulatori` consumers, and the per-slug config map `PAGE_CONFIG`. Exports one component per route.
- `src/ui.jsx` (MODIFY) — add `PovezaniKalkulatori` component + `Breadcrumb` + `FreshnessStamp`.
- `src/App.jsx` (MODIFY) — import rates from `rates.js`; lift `useSeo` out of `CalculatorPage`; add 15 routes; add "Alati" nav links + homepage tools section + cluster links in "Popularni vodiči".
- `src/posts.js` (MODIFY) — add blog→tool contextual links in 5 posts.
- `scripts/prerender.mjs` (MODIFY) — add 15 slugs to `STATIC_ROUTES`; add sitemap `meta` entries.
- `scripts/check-seo.mjs` (NEW) — post-build per-route SEO assertions.

---

## Task 1: Extract rates into `src/rates.js` (no behavior change)

**Files:**
- Create: `src/rates.js`
- Modify: `src/App.jsx` (remove local `getNonTaxable`/`DEFAULT_RATES` ~lines 16–43, import from rates.js)
- Verify: build output `dist/index.html`

**Interfaces:**
- Produces: `export function getNonTaxable()`, `export const DEFAULT_RATES`, `export const PAUSAL_RATES`, `export const REFERENCE_DATA`.

- [ ] **Step 1: Create `src/rates.js`** with the exact values currently in App.jsx plus the new objects:

```js
// src/rates.js — single source of truth for all tax/contribution/reference figures.
// Cite sources in page footnotes. Do not hardcode these values anywhere else.

export function getNonTaxable() {
  const now = new Date();
  const yr = now.getFullYear();
  const mo = now.getMonth() + 1;
  if (yr > 2026 || (yr === 2026 && mo >= 2)) return 34221;
  return 28423;
}

export const DEFAULT_RATES = {
  taxRate: 10,
  nonTaxable: getNonTaxable(),
  pioPct_emp: 14,
  health_emp: 5.15,
  unemp_emp: 0.75,
  pio_er: 10,
  health_er: 5.15,
  overtimeCoef: 26,
  nightCoef: 26,
  weekendCoef: 26,
  holidayCoef: 26,
  minBase: 45950,
  maxBase: 656425,
  mealDaily: 1490,
  transportMax: 5782,
  minWage: 93264,
};

// Paušal regime — porez 10% + doprinosi on the Tax-Authority-assigned base.
// VERIFY: PIO 24% per live blog `koliko-pausalac-placa-mesecno` (jun 2026) + CROSO.
// The source spec said PIO 25,5% + nezaposlenost 0,75%; user chose 24%, no unemployment.
export const PAUSAL_RATES = {
  porez: 10,
  pio: 24,
  zdravstveno: 10.3,
  limitGodisnji: 6000000, // RSD promet limit for paušal status
};

export const REFERENCE_DATA = {
  // Minimalna zarada — config is authoritative (Vlada RS). Sl. glasnik RS.
  // NOTE: blog `prosecna-plata-srbija` cites a different minimalac figure (~64.554);
  // config wins per spec. cenaRadnogCasaNeto is the official published per-hour figure.
  minimalnaZarada2026: {
    netoMesecno: 69000,
    brutoMesecno: 93264,
    cenaRadnogCasaNeto: null, // VERIFY: insert official 2026 per-hour neto figure (Sl. glasnik RS) before merge
    vaziOd: "februar 2026",
    izvor: "Sl. glasnik RS",
  },
  // Prosečna zarada — RZS, mart 2026.
  prosecnaZarada2026: {
    neto: 121650,
    bruto: 167263,
    medijalnaNeto: 91399,
    mesec: "mart 2026",
    kursEur: 117.40,
    izvor: "RZS",
  },
};
```

- [ ] **Step 2: Edit `src/App.jsx`** — delete the local `getNonTaxable` function (~lines 16–27) and the `DEFAULT_RATES` const (~lines 29–43), and add to the existing import block near the top:

```js
import { getNonTaxable, DEFAULT_RATES } from "./rates.js";
```

(Keep the `MONTHS` const in App.jsx — it is unrelated to rates.)

- [ ] **Step 3: Build to verify no behavior change**

Run: `npm run build`
Expected: build succeeds; `Prerendered N routes successfully.`

- [ ] **Step 4: Verify homepage HTML unchanged**

Run: `grep -c "Kalkulator zarade 2026" dist/index.html`
Expected: `1` (the homepage H1 still present and unchanged)

- [ ] **Step 5: Commit**

```bash
git add src/rates.js src/App.jsx
git commit -m "refactor: extract rates into src/rates.js single source of truth"
```

---

## Task 2: JSON-LD schema helpers (`src/schema.js`)

**Files:**
- Create: `src/schema.js`

**Interfaces:**
- Produces:
  - `export function breadcrumbLd(items)` where `items = [{name, path}]` → BreadcrumbList object.
  - `export function webAppLd({name, description, path})` → WebApplication object (FinanceApplication, price 0, sr-RS).
- Consumed by: `src/pages.jsx` (Task 4+), passed into `useSeo({ jsonLd: [...] })` (the hook already JSON.stringifies arrays).

- [ ] **Step 1: Create `src/schema.js`**

```js
// src/schema.js — JSON-LD builders. Pages pass data; no raw JSON in page files.
const SITE = "https://www.platnilistic.rs";

export function breadcrumbLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((it, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": it.name,
      "item": `${SITE}${it.path}`,
    })),
  };
}

export function webAppLd({ name, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "url": `${SITE}${path}`,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "inLanguage": "sr-RS",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "RSD" },
  };
}
```

- [ ] **Step 2: Build to verify it imports/parses**

Run: `npm run build`
Expected: build succeeds (file is imported once pages exist; for now just no syntax error — confirm by importing in a throwaway check is unnecessary, build of the module graph is enough once Task 4 imports it. For this task, verify with: `node -e "import('./src/schema.js').then(m=>console.log(Object.keys(m)))"`)

Run: `node --input-type=module -e "import('./src/schema.js').then(m=>console.log(Object.keys(m).join(',')))"`
Expected: `breadcrumbLd,webAppLd`

- [ ] **Step 3: Commit**

```bash
git add src/schema.js
git commit -m "feat: add JSON-LD schema builders (breadcrumb, webApp)"
```

---

## Task 3: Shared UI — `PovezaniKalkulatori`, `Breadcrumb`, `FreshnessStamp`

**Files:**
- Modify: `src/ui.jsx` (append components)

**Interfaces:**
- Produces:
  - `export function Breadcrumb({ items })` — `items = [{name, path}]`; last item is current (no link).
  - `export function FreshnessStamp({ date })` — renders "Ažurirano: {date}".
  - `export function PovezaniKalkulatori({ links })` — `links = [{href, label}]`; renders a nav block of 3–4 descriptive links.

- [ ] **Step 1: Append to `src/ui.jsx`** (after the existing exports):

```jsx
import { Link } from "react-router-dom";

export function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Putanja">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <span key={it.path}>
            {last ? <span aria-current="page">{it.name}</span> : <Link to={it.path}>{it.name}</Link>}
            {!last && <span className="breadcrumb-sep" aria-hidden="true"> › </span>}
          </span>
        );
      })}
    </nav>
  );
}

export function FreshnessStamp({ date }) {
  return <div className="freshness-stamp">Ažurirano: {date}</div>;
}

export function PovezaniKalkulatori({ links }) {
  return (
    <nav className="povezani-kalkulatori" aria-label="Povezani kalkulatori">
      <h2 className="povezani-title">Povezani kalkulatori</h2>
      <ul>
        {links.map((l) => (
          <li key={l.href}><Link to={l.href}>{l.label}</Link></li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: Add minimal styles to `src/index.css`** (append):

```css
.breadcrumb { font-size: 0.85rem; opacity: 0.75; margin-bottom: 12px; }
.breadcrumb a { color: inherit; text-decoration: none; }
.breadcrumb a:hover { text-decoration: underline; }
.freshness-stamp { font-size: 0.8rem; opacity: 0.7; margin: 6px 0 18px; }
.povezani-kalkulatori { margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--border, #2a2a35); }
.povezani-title { font-size: 1.1rem; margin-bottom: 10px; }
.povezani-kalkulatori ul { list-style: none; padding: 0; display: grid; gap: 8px; }
.povezani-kalkulatori a { color: var(--accent, #6ea8fe); text-decoration: none; }
.povezani-kalkulatori a:hover { text-decoration: underline; }
```

- [ ] **Step 3: Build to verify**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/ui.jsx src/index.css
git commit -m "feat: add Breadcrumb, FreshnessStamp, PovezaniKalkulatori UI components"
```

---

## Task 4: Lift `useSeo` out of `CalculatorPage`

**Files:**
- Modify: `src/App.jsx` (remove `useSeo` call from `CalculatorPage` ~lines 515–519; add it to the `/` route element)

**Interfaces:**
- Produces: `CalculatorPage` with NO SEO side effect (presentation-only, reusable on any page).
- Consumed by: every tool page (Task 6+) which renders `<CalculatorPage />` below its own `useSeo`.

- [ ] **Step 1: Remove the `useSeo({...})` block from `CalculatorPage`** (the call at ~lines 515–519 that sets `title/description/path:"/"`). Leave the rest of `CalculatorPage` untouched.

- [ ] **Step 2: Add the homepage `useSeo` to the `/` route.** In `App()`'s `/` route element (the `<>` fragment starting ~line 1066), add at the very top of the fragment a small inline component or a `useSeo` call. Since route elements are JSX (not component bodies), wrap the homepage content in a `HomePage` component:

In `App.jsx`, define above `App()`:

```jsx
function HomePage() {
  useSeo({
    title: "Bruto u Neto Kalkulator — Obračun Zarade Srbija 2026 | PlatniListić",
    description: "Besplatni kalkulator bruto u neto zarade u Srbiji 2026. Obračun zarade, poreza i doprinosa, prekovremeni i minuli rad, bolovanje, otpremnina i regres. PDF platni listić i PPP-PD XML.",
    path: "/",
  });
  return (
    <>
      {/* MOVE the entire existing `/` route fragment contents here:
          page-header, home-intro, CalculatorPage, disclaimer, home-faq, home-guides, LeadForm */}
    </>
  );
}
```

Then change the route to: `<Route path="/" element={<HomePage />} />`.

- [ ] **Step 3: Build and verify homepage SEO + content unchanged**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -c "Bruto u Neto Kalkulator — Obračun Zarade Srbija 2026" dist/index.html`
Expected: `1` (title still set on homepage)

Run: `grep -c "Kalkulator zarade 2026 — bruto u neto za Srbiju" dist/index.html`
Expected: `1` (homepage H1 still present)

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "refactor: lift useSeo out of CalculatorPage so pages own their SEO"
```

---

## Task 5: `src/pages.jsx` scaffold — `ToolPage` + `ReferencePage` templates + `PAGE_CONFIG`

**Files:**
- Create: `src/pages.jsx`

**Interfaces:**
- Consumes: `CalculatorPage` (default... note: it is NOT exported). **Action:** add `export` to `function CalculatorPage()` in App.jsx so pages.jsx can import it. Import: `import { CalculatorPage } from "./App.jsx";` — but App.jsx default-exports `App`. Add a named export: in App.jsx change `function CalculatorPage()` → `export function CalculatorPage()`.
- Consumes: `useSeo`, `breadcrumbLd`, `webAppLd`, `Breadcrumb`, `FreshnessStamp`, `PovezaniKalkulatori`, `REFERENCE_DATA`, `PAUSAL_RATES`.
- Produces: `export function ToolPage({ cfg })`, `export function ReferencePage({ cfg })`, and one exported wrapper per slug (e.g. `export function BrutoNetoPage()`).

- [ ] **Step 1: Export `CalculatorPage` from App.jsx.** Change `function CalculatorPage() {` to `export function CalculatorPage() {`.

- [ ] **Step 2: Create `src/pages.jsx`** with the two templates and a config-driven generic. The FRESHNESS date constant:

```jsx
import { useSeo } from "./seo.jsx";
import { CalculatorPage } from "./App.jsx";
import { breadcrumbLd, webAppLd } from "./schema.js";
import { Breadcrumb, FreshnessStamp, PovezaniKalkulatori } from "./ui.jsx";
import { REFERENCE_DATA, PAUSAL_RATES } from "./rates.js";

const FRESHNESS = "jun 2026.";
const DISCLAIMER = "⚠️ PlatniListić pruža informativne obračune. Rezultati ne predstavljaju pravni ni poreski savet. Za zvanični obračun konsultujte računovođu ili nadležni organ.";

// cfg shape:
// { slug, title, description, h1, breadcrumbName, intro (JSX), guide (JSX),
//   faq: [{q,a}], related: [{href,label}], calc: "full" | "pausal",
//   sourceNote (JSX, optional) }
export function ToolPage({ cfg }) {
  useSeo({
    title: cfg.title,
    description: cfg.description,
    path: `/${cfg.slug}`,
    jsonLd: [
      breadcrumbLd([{ name: "Početna", path: "/" }, { name: cfg.breadcrumbName, path: `/${cfg.slug}` }]),
      webAppLd({ name: cfg.h1, description: cfg.description, path: `/${cfg.slug}` }),
    ],
    faq: cfg.faq,
  });
  return (
    <div className="tool-page">
      <Breadcrumb items={[{ name: "Početna", path: "/" }, { name: cfg.breadcrumbName, path: `/${cfg.slug}` }]} />
      <h1>{cfg.h1}</h1>
      <FreshnessStamp date={FRESHNESS} />
      <div className="tool-intro">{cfg.intro}</div>
      {cfg.calc === "pausal" ? <PausalCalculator /> : <CalculatorPage />}
      <div className="disclaimer">{DISCLAIMER}</div>
      <section className="tool-guide">{cfg.guide}</section>
      {cfg.faq && cfg.faq.length > 0 && (
        <section className="tool-faq" aria-label="Često postavljana pitanja">
          <h2>Često postavljana pitanja</h2>
          {cfg.faq.map((f, i) => (
            <div className="tool-faq-item" key={i}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </section>
      )}
      <PovezaniKalkulatori links={cfg.related} />
    </div>
  );
}

export function ReferencePage({ cfg }) {
  useSeo({
    title: cfg.title,
    description: cfg.description,
    path: `/${cfg.slug}`,
    jsonLd: [breadcrumbLd([{ name: "Početna", path: "/" }, { name: cfg.breadcrumbName, path: `/${cfg.slug}` }])],
    faq: cfg.faq,
  });
  return (
    <div className="reference-page">
      <Breadcrumb items={[{ name: "Početna", path: "/" }, { name: cfg.breadcrumbName, path: `/${cfg.slug}` }]} />
      <h1>{cfg.h1}</h1>
      <FreshnessStamp date={FRESHNESS} />
      <div className="reference-body">{cfg.body}</div>
      {cfg.faq && cfg.faq.length > 0 && (
        <section className="tool-faq" aria-label="Često postavljana pitanja">
          <h2>Često postavljana pitanja</h2>
          {cfg.faq.map((f, i) => (
            <div className="tool-faq-item" key={i}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </section>
      )}
      {cfg.sourceNote && <div className="source-note">{cfg.sourceNote}</div>}
      <PovezaniKalkulatori links={cfg.related} />
    </div>
  );
}

// PausalCalculator defined in Task 7; placeholder import-safe stub removed there.
export function PausalCalculator() {
  return <div className="pausal-calc-stub" />; // REPLACED in Task 7
}
```

- [ ] **Step 3: Build to verify scaffold compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/pages.jsx
git commit -m "feat: add ToolPage/ReferencePage templates and export CalculatorPage"
```

---

## Task 6: Phase-1 tool pages — `/bruto-neto` and `/neto-bruto` (prove the reuse pattern)

**Files:**
- Modify: `src/pages.jsx` (add config + exported `BrutoNetoPage`, `NetoBrutoPage`)
- Modify: `src/App.jsx` (lazy import + 2 routes)
- Modify: `scripts/prerender.mjs` (add slugs to `STATIC_ROUTES` + sitemap meta)

**Interfaces:**
- Produces: `export function BrutoNetoPage()`, `export function NetoBrutoPage()`.

- [ ] **Step 1: Add to `src/pages.jsx`** the two configs and wrappers. Example for `/bruto-neto` (write `/neto-bruto` analogously with its own copy from the spec's Section 6 table):

```jsx
const TOOL_RELATED = [
  { href: "/neto-bruto", label: "Neto u bruto kalkulator" },
  { href: "/pausal", label: "Paušal kalkulator" },
  { href: "/minuli-rad", label: "Kalkulator minulog rada" },
  { href: "/bolovanje", label: "Kalkulator bolovanja" },
];

export function BrutoNetoPage() {
  return <ToolPage cfg={{
    slug: "bruto-neto",
    title: "Bruto u neto kalkulator 2026 — Srbija | PlatniListić",
    description: "Pretvorite bruto u neto zaradu za 2026. Tačan obračun poreza i doprinosa, PDF platni listić i PPP-PD XML. Besplatno, bez registracije.",
    h1: "Bruto u neto kalkulator za Srbiju (2026)",
    breadcrumbName: "Bruto u neto",
    calc: "full",
    intro: (<p>Ovaj <strong>bruto u neto kalkulator</strong> za 2026. pretvara bruto 1 zaradu u neto iznos na račun, uz tačan obračun poreza (10% iznad neoporezivih 34.221 RSD) i doprinosa zaposlenog (19,90%). Rezultat preuzimate kao PDF platni listić i PPP-PD XML.</p>),
    guide: (<><h2>Kako se računa bruto u neto</h2>
      <p>Neto = Bruto 1 − doprinosi zaposlenog (19,90%) − porez (10% na deo iznad neoporezivog iznosa). Primer: za bruto 100.000 RSD doprinosi iznose 19.900 RSD, poreska osnovica je 65.779 RSD (100.000 − 34.221), porez 6.578 RSD, pa je neto ≈ 73.522 RSD. Detaljan vodič: <a href="/blog/bruto-neto-razlika">razlika između bruto i neto zarade</a>.</p></>),
    faq: [
      { q: "Kako izračunati neto iz bruto u Srbiji?", a: "Neto = Bruto 1 − doprinosi zaposlenog (19,90%) − porez 10% na deo iznad neoporezivog iznosa (34.221 RSD za 2026). Kalkulator radi obračun u oba smera." },
      { q: "Koliki su doprinosi zaposlenog?", a: "19,90% — PIO 14%, zdravstvo 5,15%, nezaposlenost 0,75%." },
      { q: "Da li je obračun besplatan?", a: "Da, kalkulator je besplatan i ne zahteva registraciju. Rezultat preuzimate kao PDF i PPP-PD XML." },
    ],
    related: TOOL_RELATED,
  }} />;
}
```

(Write `NetoBrutoPage` with the `/neto-bruto` title/description/h1 from Section 6 and `related` reordered so it doesn't link to itself.)

- [ ] **Step 2: Add lazy imports + routes in `src/App.jsx`.** Near the other `lazy(...)` imports:

```jsx
const BrutoNetoPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.BrutoNetoPage })));
const NetoBrutoPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.NetoBrutoPage })));
```

In `<Routes>` (after the `/` route):

```jsx
<Route path="/bruto-neto" element={<Suspense fallback={<RouteLoader />}><BrutoNetoPage /></Suspense>} />
<Route path="/neto-bruto" element={<Suspense fallback={<RouteLoader />}><NetoBrutoPage /></Suspense>} />
```

- [ ] **Step 3: Add slugs to `scripts/prerender.mjs`.** Change `STATIC_ROUTES`:

```js
const STATIC_ROUTES = ["/", "/blog", "/o-nama", "/privatnost", "/uslovi",
  "/bruto-neto", "/neto-bruto"];
```

And add to the `meta` map inside `sitemapXml()`:

```js
"/bruto-neto": { changefreq: "monthly", priority: "0.8", lastmod: new Date().toISOString().slice(0, 10) },
"/neto-bruto": { changefreq: "monthly", priority: "0.8", lastmod: new Date().toISOString().slice(0, 10) },
```

- [ ] **Step 4: Build and verify prerendered HTML**

Run: `npm run build`
Expected: `✓ prerendered /bruto-neto` and `✓ prerendered /neto-bruto` appear; build succeeds.

Run: `grep -c "Bruto u neto kalkulator za Srbiju (2026)" dist/bruto-neto/index.html`
Expected: `1` (H1 in static HTML)

Run: `grep -o "rel=\"canonical\"[^>]*bruto-neto" dist/bruto-neto/index.html | head -1`
Expected: a match containing `bruto-neto` (canonical correct)

- [ ] **Step 5: Commit**

```bash
git add src/pages.jsx src/App.jsx scripts/prerender.mjs
git commit -m "feat: add /bruto-neto and /neto-bruto tool pages"
```

---

## Task 7: `PausalCalculator` + `/pausal` page

**Files:**
- Modify: `src/pages.jsx` (replace `PausalCalculator` stub with real component; add `PausalPage`)
- Modify: `src/App.jsx` (lazy import + route)
- Modify: `scripts/prerender.mjs` (add `/pausal`)

**Interfaces:**
- Consumes: `PAUSAL_RATES`, `fmt` from ui.jsx, `NumberInput` from ui.jsx, `ResultRow` from ui.jsx.
- Produces: real `PausalCalculator`, `export function PausalPage()`.

- [ ] **Step 1: Replace the `PausalCalculator` stub in `src/pages.jsx`.** Modify the EXISTING ui.jsx import line (from Task 5) to also pull `NumberInput, ResultRow, fmt`, and add a `useState` import. The two import lines become:

```jsx
import { useState } from "react";
import { Breadcrumb, FreshnessStamp, PovezaniKalkulatori, NumberInput, ResultRow, fmt } from "./ui.jsx";

export function PausalCalculator() {
  const [prihod, setPrihod] = useState(50000); // mesečna paušalna osnovica iz rešenja PU
  const porez = prihod * PAUSAL_RATES.porez / 100;
  const pio = prihod * PAUSAL_RATES.pio / 100;
  const zdravstveno = prihod * PAUSAL_RATES.zdravstveno / 100;
  const ukupno = porez + pio + zdravstveno;
  const neto = prihod - ukupno;
  const efektivna = prihod > 0 ? (ukupno / prihod) * 100 : 0;
  return (
    <div className="pausal-calc">
      <NumberInput label="Mesečna paušalna osnovica (iz rešenja PU)" value={prihod} onChange={setPrihod} step={1000} />
      <div className="pausal-results">
        <ResultRow label={`Porez (${PAUSAL_RATES.porez}%)`} value={`${fmt(porez)} RSD`} />
        <ResultRow label={`PIO (${PAUSAL_RATES.pio}%)`} value={`${fmt(pio)} RSD`} />
        <ResultRow label={`Zdravstveno (${PAUSAL_RATES.zdravstveno}%)`} value={`${fmt(zdravstveno)} RSD`} />
        <ResultRow label="Ukupne mesečne obaveze" value={`${fmt(ukupno)} RSD`} type="negative" />
        <ResultRow label="Neto nakon obaveza" value={`${fmt(neto)} RSD`} type="positive" />
        <ResultRow label="Efektivna stopa" value={`${efektivna.toFixed(2)}%`} />
        <ResultRow label="Godišnje obaveze" value={`${fmt(ukupno * 12)} RSD`} />
      </div>
      <p className="pausal-note">Napomena: paušalnu osnovicu i tačan mesečni iznos određuje rešenje Poreske uprave. Izvor stopa: CROSO / Sl. glasnik RS.</p>
    </div>
  );
}
```

- [ ] **Step 2: Add `PausalPage`** (config from spec Section 6):

```jsx
export function PausalPage() {
  return <ToolPage cfg={{
    slug: "pausal",
    title: "Paušal kalkulator 2026 — porez i doprinosi | PlatniListić",
    description: "Izračunajte mesečne obaveze paušalca: porez 10%, PIO 24%, zdravstveno 10,3%. Neto nakon obaveza i efektivna stopa za 2026.",
    h1: "Paušal kalkulator za preduzetnike (2026)",
    breadcrumbName: "Paušal",
    calc: "pausal",
    intro: (<p>Ovaj <strong>paušal kalkulator</strong> računa mesečne obaveze paušalca u 2026: porez na prihod (10%) i doprinose (PIO 24%, zdravstveno 10,3%) na paušalnu osnovicu iz rešenja Poreske uprave.</p>),
    guide: (<><h2>Kako se obračunava paušal</h2>
      <p>Paušalac plaća porez i doprinose na <strong>paušalno utvrđenu osnovicu</strong> koju određuje Poreska uprava (ne na stvarni prihod). Osnovica zavisi od šifre delatnosti, opštine i drugih koeficijenata. Na nju se primenjuju: porez 10%, PIO 24% i zdravstveno 10,3%. Detaljan vodič: <a href="/blog/koliko-pausalac-placa-mesecno">koliko paušalac plaća mesečno</a> i <a href="/blog/pausalno-oporezivanje">paušalno oporezivanje</a>.</p></>),
    faq: [
      { q: "Koliko paušalac plaća mesečno u 2026?", a: "Najčešće okvirno 30.000–45.000 RSD, u zavisnosti od šifre delatnosti i opštine. Tačan iznos je u rešenju Poreske uprave." },
      { q: "Šta čini mesečnu obavezu paušalca?", a: "Porez 10% i doprinosi — PIO 24% i zdravstveno 10,3% — na paušalnu osnovicu." },
      { q: "Koji je limit za paušal?", a: "Paušalni status važi dok godišnji promet ne pređe 6.000.000 RSD." },
    ],
    related: [
      { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
      { href: "/ugovor-o-delu", label: "Ugovor o delu kalkulator" },
      { href: "/godisnji-porez", label: "Godišnji porez kalkulator" },
    ],
  }} />;
}
```

- [ ] **Step 3: Route + prerender.** In App.jsx:

```jsx
const PausalPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.PausalPage })));
```
```jsx
<Route path="/pausal" element={<Suspense fallback={<RouteLoader />}><PausalPage /></Suspense>} />
```
In prerender.mjs add `"/pausal"` to `STATIC_ROUTES` and a `meta` entry (`monthly`/`0.8`/today).

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: `✓ prerendered /pausal`; build succeeds.

Run: `grep -c "Paušal kalkulator za preduzetnike (2026)" dist/pausal/index.html`
Expected: `1`

Run: `grep -c "PIO (24%)" dist/pausal/index.html`
Expected: `1` (rate from config rendered, not hardcoded 25,5)

- [ ] **Step 5: Commit**

```bash
git add src/pages.jsx src/App.jsx scripts/prerender.mjs
git commit -m "feat: add PausalCalculator and /pausal page (PIO 24%)"
```

---

## Task 8: Remaining Phase-1 tool pages — `/bolovanje`, `/otpremnina`, `/minuli-rad`

**Files:**
- Modify: `src/pages.jsx` (3 configs + wrappers, all `calc:"full"`)
- Modify: `src/App.jsx` (3 lazy imports + routes)
- Modify: `scripts/prerender.mjs` (3 slugs + meta)

**Interfaces:**
- Produces: `export function BolovanjePage()`, `OtpremninaPage()`, `MinuliRadPage()`.

- [ ] **Step 1: Add 3 configs to `src/pages.jsx`** using spec Section 6 metadata. Each is a `ToolPage` with `calc:"full"`. Copy this `/bolovanje` config and write the other two analogously (titles/descriptions/H1 from Section 6; guide cites the matching blog post: bolovanje→`/blog/kako-se-obracunava-bolovanje`, otpremnina→`/blog/otpremnina-obracun`, minuli-rad→`/blog/minuli-rad-obracun`):

```jsx
export function BolovanjePage() {
  return <ToolPage cfg={{
    slug: "bolovanje",
    title: "Kalkulator bolovanja 2026 — naknada zarade | PlatniListić",
    description: "Obračun naknade za bolovanje do 30 dana (min. 65%) i od 31. dana (RFZO). Primeri i PDF platni listić. Besplatno, za Srbiju 2026.",
    h1: "Kalkulator bolovanja i naknade zarade (2026)",
    breadcrumbName: "Bolovanje",
    calc: "full",
    intro: (<p>Ovaj <strong>kalkulator bolovanja</strong> računa naknadu zarade za 2026: do 30 dana najmanje 65% osnovice (na teret poslodavca), a od 31. dana na teret RFZO. Unesite broj dana bolovanja u kalkulatoru ispod.</p>),
    guide: (<><h2>Kako se obračunava naknada za bolovanje</h2>
      <p>Za prvih 30 dana naknadu plaća poslodavac, najmanje 65% prosečne osnovice (100% za povredu na radu ili profesionalno oboljenje). Od 31. dana naknadu preuzima RFZO. Osnovica je prosek zarade za prethodnih 12 meseci. Detaljan vodič: <a href="/blog/kako-se-obracunava-bolovanje">kako se obračunava bolovanje</a>.</p></>),
    faq: [
      { q: "Koliki je procenat naknade za bolovanje?", a: "Najmanje 65% osnovice za prvih 30 dana; 100% za povredu na radu ili profesionalno oboljenje. Od 31. dana naknadu isplaćuje RFZO." },
      { q: "Ko plaća bolovanje preko 30 dana?", a: "Od 31. dana naknadu zarade isplaćuje Republički fond za zdravstveno osiguranje (RFZO)." },
      { q: "Kako se određuje osnovica?", a: "Osnovica je prosečna zarada zaposlenog u prethodnih 12 meseci pre meseca bolovanja." },
    ],
    related: [
      { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
      { href: "/minuli-rad", label: "Kalkulator minulog rada" },
      { href: "/otpremnina", label: "Kalkulator otpremnine" },
      { href: "/radni-dani-2026", label: "Radni dani 2026" },
    ],
  }} />;
}
```

- [ ] **Step 2: Add 3 lazy imports + routes in App.jsx** (pattern from Task 6 Step 2).

- [ ] **Step 3: Add 3 slugs to `STATIC_ROUTES` + 3 sitemap `meta` entries** (`monthly`/`0.8`/today).

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: `✓ prerendered /bolovanje`, `/otpremnina`, `/minuli-rad`; build succeeds.

Run: `grep -c "Kalkulator bolovanja i naknade zarade (2026)" dist/bolovanje/index.html`
Expected: `1`

- [ ] **Step 5: Commit**

```bash
git add src/pages.jsx src/App.jsx scripts/prerender.mjs
git commit -m "feat: add /bolovanje, /otpremnina, /minuli-rad tool pages"
```

---

## Task 9: Phase-1 reference pages — `/minimalna-zarada-2026`, `/radni-dani-2026`, `/praznici-2026`

**Files:**
- Modify: `src/rates.js` (add `radniDani2026`, `praznici2026` to `REFERENCE_DATA`)
- Modify: `src/pages.jsx` (3 `ReferencePage` wrappers)
- Modify: `src/App.jsx` (3 lazy imports + routes)
- Modify: `scripts/prerender.mjs` (3 slugs + meta)

**Interfaces:**
- Consumes: `REFERENCE_DATA.minimalnaZarada2026`, `.radniDani2026`, `.praznici2026`.
- Produces: `export function MinimalnaZaradaPage()`, `RadniDaniPage()`, `PrazniciPage()`.

- [ ] **Step 1: Add to `REFERENCE_DATA` in `src/rates.js`** the praznici list and radni dani table (computed values — fill the real 2026 weekday counts; these are the standard Serbian holidays):

```js
  praznici2026: [
    { datum: "1–2. januar", naziv: "Nova godina", neradno: true },
    { datum: "7. januar", naziv: "Božić (pravoslavni)", neradno: true },
    { datum: "15–16. februar", naziv: "Dan državnosti (Sretenje)", neradno: true },
    { datum: "10. april", naziv: "Veliki petak", neradno: true },
    { datum: "12–13. april", naziv: "Vaskrs (Uskrs)", neradno: true },
    { datum: "1–2. maj", naziv: "Praznik rada", neradno: true },
    { datum: "11. novembar", naziv: "Dan primirja", neradno: true },
  ],
  // radniDani2026 — broj radnih dana i fond sati (radniDani×8) po mesecima.
  // VERIFY counts against the official 2026 calendar before merge.
  radniDani2026: [
    { mesec: "Januar", radniDani: 20, radniSati: 160 },
    { mesec: "Februar", radniDani: 18, radniSati: 144 },
    { mesec: "Mart", radniDani: 22, radniSati: 176 },
    { mesec: "April", radniDani: 20, radniSati: 160 },
    { mesec: "Maj", radniDani: 19, radniSati: 152 },
    { mesec: "Jun", radniDani: 22, radniSati: 176 },
    { mesec: "Jul", radniDani: 23, radniSati: 184 },
    { mesec: "Avgust", radniDani: 21, radniSati: 168 },
    { mesec: "Septembar", radniDani: 22, radniSati: 176 },
    { mesec: "Oktobar", radniDani: 22, radniSati: 176 },
    { mesec: "Novembar", radniDani: 21, radniSati: 168 },
    { mesec: "Decembar", radniDani: 23, radniSati: 184 },
  ],
```

> NOTE for implementer: the radni dani / praznici dates above are marked VERIFY — confirm against the official 2026 calendar (and the Vlada RS decision on neradni dani) before merge; the table is the page's primary value so accuracy matters.

- [ ] **Step 2: Add 3 `ReferencePage` wrappers to `src/pages.jsx`.** Example `/minimalna-zarada-2026` (reads config — no hardcoded rate literals):

```jsx
export function MinimalnaZaradaPage() {
  const m = REFERENCE_DATA.minimalnaZarada2026;
  return <ReferencePage cfg={{
    slug: "minimalna-zarada-2026",
    title: "Minimalna zarada 2026 u Srbiji — bruto i neto | PlatniListić",
    description: `Minimalna neto zarada ${(m.netoMesecno/1000)} hiljada RSD, bruto ${m.brutoMesecno.toLocaleString("sr-RS")} RSD (od ${m.vaziOd}). Ko ima pravo i kako se obračunava.`,
    h1: "Minimalna zarada u Srbiji za 2026.",
    breadcrumbName: "Minimalna zarada 2026",
    body: (<>
      <p>Minimalna zarada u Srbiji za 2026. godinu (važi od {m.vaziOd}):</p>
      <table className="ref-table">
        <tbody>
          <tr><th>Minimalna neto zarada</th><td>{m.netoMesecno.toLocaleString("sr-RS")} RSD</td></tr>
          <tr><th>Minimalna bruto zarada</th><td>{m.brutoMesecno.toLocaleString("sr-RS")} RSD</td></tr>
        </tbody>
      </table>
      <p>Minimalna zarada se obračunava po ceni radnog časa pomnoženoj fondom sati u mesecu, pa se mesečni iznos razlikuje po mesecima zbog različitog broja radnih dana. Pogledajte <a href="/radni-dani-2026">radne dane u 2026</a>.</p>
    </>),
    faq: [
      { q: "Kolika je minimalna zarada u Srbiji 2026?", a: `Minimalna neto zarada je ${m.netoMesecno.toLocaleString("sr-RS")} RSD, a bruto ${m.brutoMesecno.toLocaleString("sr-RS")} RSD, sa primenom od ${m.vaziOd}.` },
      { q: "Kako se obračunava minimalna zarada?", a: "Po ceni radnog časa × fond sati u mesecu, pa mesečni iznos varira zbog različitog broja radnih dana." },
    ],
    related: [
      { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
      { href: "/radni-dani-2026", label: "Radni dani 2026" },
      { href: "/prosecna-zarada", label: "Prosečna zarada u Srbiji" },
    ],
    sourceNote: (<>Izvor: {m.izvor}.</>),
  }} />;
}
```

(Write `RadniDaniPage` rendering `REFERENCE_DATA.radniDani2026` as a 12-row table, and `PrazniciPage` rendering `REFERENCE_DATA.praznici2026` as a list — metadata from Section 6.)

- [ ] **Step 3: Add 3 lazy imports + routes in App.jsx; 3 slugs + meta in prerender.mjs** (references: `yearly`/`0.7`/today).

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: `✓ prerendered /minimalna-zarada-2026`, `/radni-dani-2026`, `/praznici-2026`.

Run: `grep -c "Minimalna zarada u Srbiji za 2026" dist/minimalna-zarada-2026/index.html`
Expected: `1`

Run: `grep -c "93.264" dist/minimalna-zarada-2026/index.html`
Expected: `1` (bruto figure from config rendered)

- [ ] **Step 5: Commit**

```bash
git add src/rates.js src/pages.jsx src/App.jsx scripts/prerender.mjs
git commit -m "feat: add minimalna-zarada, radni-dani, praznici reference pages"
```

---

## Task 10: Phase-2 tool pages — `/dodaci-na-zaradu`, `/godisnji-porez`, `/ugovor-o-delu`

**Files:**
- Modify: `src/pages.jsx` (3 `ToolPage` wrappers, `calc:"full"`)
- Modify: `src/App.jsx` (3 lazy imports + routes)
- Modify: `scripts/prerender.mjs` (3 slugs + meta)

**Interfaces:**
- Produces: `export function DodaciPage()`, `GodisnjiPorezPage()`, `UgovorODeluPage()`.

- [ ] **Step 1: Add 3 `ToolPage` configs to `src/pages.jsx`.** Author metadata to the Global Constraints rules (≤60 title, ≤160 desc, keyword in H1). Each `calc:"full"`. Guide cross-links: dodaci→`/blog/prekovremeni-rad`, godisnji-porez→(no exact post; link `/blog/doprinosi-srbija`), ugovor-o-delu→`/blog/ugovor-o-delu`. Example:

```jsx
export function UgovorODeluPage() {
  return <ToolPage cfg={{
    slug: "ugovor-o-delu",
    title: "Ugovor o delu kalkulator 2026 — porez i doprinosi | PlatniListić",
    description: "Obračun ugovora o delu za 2026: porez 20% na 50% prihoda i doprinosi. Bruto, neto i ukupan trošak. Besplatno, za Srbiju.",
    h1: "Kalkulator ugovora o delu (2026)",
    breadcrumbName: "Ugovor o delu",
    calc: "full",
    intro: (<p>Ovaj <strong>kalkulator ugovora o delu</strong> računa porez i doprinose za honorarni angažman u 2026. Za detaljan obračun po vrsti angažmana koristite kalkulator ispod.</p>),
    guide: (<><h2>Kako se obračunava ugovor o delu</h2>
      <p>Kod ugovora o delu primenjuju se normirani troškovi i porez na deo prihoda, uz doprinose za PIO (i zdravstveno ako lice nije osigurano po drugom osnovu). Detaljan vodič sa primerom: <a href="/blog/ugovor-o-delu">ugovor o delu 2026</a>.</p></>),
    faq: [
      { q: "Koliki je porez na ugovor o delu?", a: "Porez se plaća po stopi 20% na oporezivi deo prihoda (posle normiranih troškova), uz odgovarajuće doprinose. Tačan obračun zavisi od osnova osiguranja." },
      { q: "Da li se plaćaju doprinosi na ugovor o delu?", a: "Da — PIO, a zdravstveno ako lice nije osigurano po drugom osnovu. Detalje vidite u vodiču." },
    ],
    related: [
      { href: "/pausal", label: "Paušal kalkulator" },
      { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
      { href: "/godisnji-porez", label: "Godišnji porez kalkulator" },
    ],
  }} />;
}
```

> NOTE: the `/ugovor-o-delu` **tool** page is distinct from the `/blog/ugovor-o-delu` **post** — they cross-link, not collide.

- [ ] **Step 2: Add 3 lazy imports + routes; 3 slugs + meta** (`monthly`/`0.8`/today).

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: `✓ prerendered /dodaci-na-zaradu`, `/godisnji-porez`, `/ugovor-o-delu`.

Run: `grep -c "Kalkulator ugovora o delu (2026)" dist/ugovor-o-delu/index.html`
Expected: `1`

- [ ] **Step 4: Commit**

```bash
git add src/pages.jsx src/App.jsx scripts/prerender.mjs
git commit -m "feat: add /dodaci-na-zaradu, /godisnji-porez, /ugovor-o-delu tool pages"
```

---

## Task 11: Phase-2 reference pages — `/prosecna-zarada`, `/neoporezivi-iznos-2026`, `/stope-doprinosa-2026`

**Files:**
- Modify: `src/pages.jsx` (3 `ReferencePage` wrappers)
- Modify: `src/App.jsx` (3 lazy imports + routes)
- Modify: `scripts/prerender.mjs` (3 slugs + meta)

**Interfaces:**
- Consumes: `REFERENCE_DATA.prosecnaZarada2026`, `DEFAULT_RATES` (for stope + neoporezivi).
- Produces: `export function ProsecnaZaradaPage()`, `NeoporeziviPage()`, `StopeDoprinosaPage()`.

- [ ] **Step 1: Import `DEFAULT_RATES` in pages.jsx** (add to the rates import): `import { REFERENCE_DATA, PAUSAL_RATES, DEFAULT_RATES } from "./rates.js";`

- [ ] **Step 2: Add 3 `ReferencePage` wrappers.** `/prosecna-zarada` reads `prosecnaZarada2026`; `/neoporezivi-iznos-2026` reads `DEFAULT_RATES.nonTaxable`; `/stope-doprinosa-2026` reads the PIO/health/unemp rates from `DEFAULT_RATES`. Example `/prosecna-zarada`:

```jsx
export function ProsecnaZaradaPage() {
  const p = REFERENCE_DATA.prosecnaZarada2026;
  return <ReferencePage cfg={{
    slug: "prosecna-zarada",
    title: "Prosečna zarada u Srbiji 2026 — neto i bruto | PlatniListić",
    description: `Prosečna neto zarada ${p.neto.toLocaleString("sr-RS")} RSD, bruto ${p.bruto.toLocaleString("sr-RS")} RSD (${p.mesec}, RZS). Medijalna i poređenje.`,
    h1: "Prosečna zarada u Srbiji 2026.",
    breadcrumbName: "Prosečna zarada",
    body: (<>
      <table className="ref-table">
        <tbody>
          <tr><th>Prosečna neto zarada</th><td>{p.neto.toLocaleString("sr-RS")} RSD</td></tr>
          <tr><th>Prosečna bruto zarada</th><td>{p.bruto.toLocaleString("sr-RS")} RSD</td></tr>
          <tr><th>Medijalna neto zarada</th><td>{p.medijalnaNeto.toLocaleString("sr-RS")} RSD</td></tr>
        </tbody>
      </table>
      <p>Podaci su za {p.mesec} (RZS). Medijalna zarada (polovina zaposlenih zarađuje manje) realnije opisuje tipičnu platu od proseka. Detaljan pregled po sektorima i gradovima: <a href="/blog/prosecna-plata-srbija">prosečna plata u Srbiji 2026</a>.</p>
    </>),
    faq: [
      { q: "Kolika je prosečna plata u Srbiji 2026?", a: `Prosečna neto plata za ${p.mesec} iznosi ${p.neto.toLocaleString("sr-RS")} RSD, a bruto ${p.bruto.toLocaleString("sr-RS")} RSD (RZS).` },
      { q: "Kolika je medijalna plata?", a: `Medijalna neto zarada iznosi oko ${p.medijalnaNeto.toLocaleString("sr-RS")} RSD — polovina zaposlenih zarađuje manje od tog iznosa.` },
    ],
    related: [
      { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
      { href: "/minimalna-zarada-2026", label: "Minimalna zarada 2026" },
      { href: "/stope-doprinosa-2026", label: "Stope doprinosa 2026" },
    ],
    sourceNote: (<>Izvor: {p.izvor}, {p.mesec}. Kurs: 1 € = {p.kursEur} RSD (NBS).</>),
  }} />;
}
```

(Write `NeoporeziviPage` — H1 "Neoporezivi iznos zarade za 2026.", body states `DEFAULT_RATES.nonTaxable` RSD; and `StopeDoprinosaPage` — table of PIO 14%/10%, zdravstveno 5,15%/5,15%, nezaposlenost 0,75%, all from `DEFAULT_RATES`.)

- [ ] **Step 3: Add 3 lazy imports + routes; 3 slugs + meta** (`yearly`/`0.7`/today).

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: `✓ prerendered /prosecna-zarada`, `/neoporezivi-iznos-2026`, `/stope-doprinosa-2026`.

Run: `grep -c "121.650" dist/prosecna-zarada/index.html`
Expected: `1` (RZS neto figure rendered)

Run: `grep -c "34.221" dist/neoporezivi-iznos-2026/index.html`
Expected: `1` (neoporezivi from config)

- [ ] **Step 5: Commit**

```bash
git add src/pages.jsx src/App.jsx scripts/prerender.mjs
git commit -m "feat: add prosecna-zarada, neoporezivi-iznos, stope-doprinosa reference pages"
```

---

## Task 12: Internal linking — nav "Alati", homepage tools section, blog→tool, cluster fix

**Files:**
- Modify: `src/App.jsx` (nav items + homepage tools section + cluster links in "Popularni vodiči")
- Modify: `src/posts.js` (blog→tool contextual links in 5 posts)

**Interfaces:** none new.

- [ ] **Step 1: Expand the sidebar nav in `App.jsx`.** Replace the `navItems` array (~line 1014) with grouped tools:

```jsx
const navItems = [
  { path: "/", icon: "⚡", label: "Kalkulator" },
  { path: "/bruto-neto", icon: "🔁", label: "Bruto u neto" },
  { path: "/neto-bruto", icon: "🔁", label: "Neto u bruto" },
  { path: "/pausal", icon: "🧾", label: "Paušal" },
  { path: "/bolovanje", icon: "🏥", label: "Bolovanje" },
  { path: "/otpremnina", icon: "📤", label: "Otpremnina" },
  { path: "/minuli-rad", icon: "📈", label: "Minuli rad" },
  { path: "/blog", icon: "📰", label: "Blog" },
];
```

- [ ] **Step 2: Add a homepage "Alati" section** in `HomePage` (after `home-guides` nav, before `LeadForm`):

```jsx
<nav className="home-tools" aria-label="Kalkulatori i alati">
  <h2 className="home-tools-title">Kalkulatori i alati</h2>
  <ul>
    <li><a href="/bruto-neto">Bruto u neto kalkulator</a></li>
    <li><a href="/neto-bruto">Neto u bruto kalkulator</a></li>
    <li><a href="/pausal">Paušal kalkulator</a></li>
    <li><a href="/bolovanje">Kalkulator bolovanja</a></li>
    <li><a href="/otpremnina">Kalkulator otpremnine</a></li>
    <li><a href="/minuli-rad">Kalkulator minulog rada</a></li>
    <li><a href="/ugovor-o-delu">Ugovor o delu kalkulator</a></li>
    <li><a href="/minimalna-zarada-2026">Minimalna zarada 2026</a></li>
    <li><a href="/radni-dani-2026">Radni dani 2026</a></li>
    <li><a href="/praznici-2026">Praznici 2026</a></li>
  </ul>
</nav>
```

- [ ] **Step 3: Add cluster posts to homepage "Popularni vodiči"** (~line 1171 `<ul>`), adding the unindexed June cluster:

```jsx
<li><a href="/blog/pausalno-oporezivanje">Paušalno oporezivanje 2026</a></li>
<li><a href="/blog/porez-za-frilensere">Porez za frilensere 2026</a></li>
<li><a href="/blog/ugovor-o-delu">Ugovor o delu — porez i doprinosi</a></li>
```

- [ ] **Step 4: Add blog→tool contextual links in `src/posts.js`.** In each of these posts' `body`, add one prominent contextual link near the top of the body (after the first intro paragraph):
  - `pausalno-oporezivanje` → `Izračunajte obaveze: [paušal kalkulator](/pausal).`
  - `kako-se-obracunava-bolovanje` → `[kalkulator bolovanja](/bolovanje)`
  - `minuli-rad-obracun` → `[kalkulator minulog rada](/minuli-rad)`
  - `otpremnina-obracun` → `[kalkulator otpremnine](/otpremnina)`
  - `ugovor-o-delu` → `[kalkulator ugovora o delu](/ugovor-o-delu)`

- [ ] **Step 5: Build and verify links present in HTML**

Run: `npm run build`
Expected: build succeeds.

Run: `grep -c "home-tools" dist/index.html`
Expected: `1`

Run: `grep -c "/pausal" dist/blog/pausalno-oporezivanje/index.html`
Expected: `1` or more (blog→tool link rendered)

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/posts.js
git commit -m "feat: internal linking — nav tools, homepage tools section, blog->tool, cluster links"
```

---

## Task 13: `scripts/check-seo.mjs` post-build SEO verification

**Files:**
- Create: `scripts/check-seo.mjs`
- Modify: `package.json` (add `"check:seo"` script)

**Interfaces:** standalone Node script run after build.

- [ ] **Step 1: Create `scripts/check-seo.mjs`** asserting per new route: exactly one `<h1>`, title present + ≤65 chars, meta description present + ≤165 chars, canonical contains the slug, at least one JSON-LD block parses:

```js
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = join(process.cwd(), "dist");
const ROUTES = [
  "bruto-neto", "neto-bruto", "pausal", "bolovanje", "otpremnina", "minuli-rad",
  "minimalna-zarada-2026", "radni-dani-2026", "praznici-2026",
  "dodaci-na-zaradu", "godisnji-porez", "ugovor-o-delu",
  "prosecna-zarada", "neoporezivi-iznos-2026", "stope-doprinosa-2026",
];

let failures = 0;
function check(cond, msg) { if (!cond) { console.error(`✗ ${msg}`); failures++; } }

for (const slug of ROUTES) {
  let html;
  try { html = await readFile(join(DIST, slug, "index.html"), "utf8"); }
  catch { console.error(`✗ ${slug}: missing dist/${slug}/index.html`); failures++; continue; }

  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  check(h1Count === 1, `${slug}: expected exactly 1 <h1>, found ${h1Count}`);

  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  check(title.length > 0 && title.length <= 65, `${slug}: title length ${title.length} (want 1..65)`);

  const desc = (html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/) || [])[1] || "";
  check(desc.length > 0 && desc.length <= 165, `${slug}: description length ${desc.length} (want 1..165)`);

  const canon = (html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/) || [])[1] || "";
  check(canon.includes(`/${slug}`), `${slug}: canonical missing slug (${canon})`);
  check(canon.startsWith("https://www.platnilistic.rs"), `${slug}: canonical not www (${canon})`);

  const ldBlocks = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g) || [];
  check(ldBlocks.length >= 1, `${slug}: no JSON-LD found`);
  for (const b of ldBlocks) {
    const json = b.replace(/<script[^>]*>/, "").replace(/<\/script>/, "");
    try { JSON.parse(json); } catch { check(false, `${slug}: JSON-LD does not parse`); }
  }
  if (failures === 0 || true) console.log(`✓ ${slug}`);
}

if (failures > 0) { console.error(`\ncheck-seo: ${failures} failure(s).`); process.exit(1); }
console.log(`\ncheck-seo: all ${ROUTES.length} routes pass.`);
```

- [ ] **Step 2: Add npm script** to `package.json` `scripts`:

```json
"check:seo": "node scripts/check-seo.mjs"
```

- [ ] **Step 3: Build then run the check**

Run: `npm run build && npm run check:seo`
Expected: `check-seo: all 15 routes pass.`

- [ ] **Step 4: Fix any failures** surfaced (e.g. a title >65 chars → shorten in the page config), rebuild, re-run until green.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-seo.mjs package.json
git commit -m "test: add post-build SEO verification for new pages"
```

---

## Task 14: Final QA pass + homepage regression confirmation

**Files:** none (verification only; fixes if needed)

- [ ] **Step 1: Full clean build**

Run: `npm run build && npm run check:seo`
Expected: prerender reports all routes, `check-seo: all 15 routes pass.`

- [ ] **Step 2: Confirm sitemap contains all 15 new URLs**

Run: `grep -c "platnilistic.rs/bruto-neto\|platnilistic.rs/pausal\|platnilistic.rs/prosecna-zarada\|platnilistic.rs/stope-doprinosa-2026" dist/sitemap.xml`
Expected: `4` (spot-check of representative slugs present)

Run: `grep -c "<loc>" dist/sitemap.xml` (total URL count) — expect the pre-change count + 15.

- [ ] **Step 3: Homepage regression — confirm calculator HTML unchanged**

Run: `grep -c "Kalkulator zarade 2026 — bruto u neto za Srbiju" dist/index.html`
Expected: `1`

Run: `grep -c "hero-card" dist/index.html`
Expected: `> 0` (calculator hero cards still rendered on homepage)

- [ ] **Step 4: Confirm no hardcoded paušal 25,5 anywhere**

Run: `grep -rn "25,5\|25.5" src/ || echo "none"`
Expected: `none` (paušal uses PIO 24 from config)

- [ ] **Step 5: Update PR description note** — create `IMPLEMENTATION-NOTES.md` summarizing manual follow-ups:

```markdown
# Implementation Notes

## Manual steps (site owner)
- Verify `cenaRadnogCasaNeto` in src/rates.js (official 2026 per-hour neto, Sl. glasnik RS) — currently null.
- Verify radniDani2026 / praznici2026 dates against the official 2026 calendar.
- Verify paušal PIO 24% against latest CROSO figure.
- Google Search Console → URL Inspection → "Request indexing" for the 15 new URLs AND the existing June cluster (/blog/pausalno-oporezivanje, /blog/porez-za-frilensere, /blog/ugovor-o-delu).

## Stack notes
- Vite + React SPA; prerender via scripts/prerender.mjs (SSG for view-source).
- Single source of truth for rates: src/rates.js.
- New pages: src/pages.jsx (ToolPage/ReferencePage/PausalCalculator).
```

- [ ] **Step 6: Commit**

```bash
git add IMPLEMENTATION-NOTES.md
git commit -m "docs: implementation notes and manual follow-up checklist"
```

---

## Self-Review Notes (for the executor)

- **Rate accuracy is the product differentiator.** The `// VERIFY` items in `rates.js` (paušal PIO 24%, cena radnog časa, radni dani/praznici dates) are intentional flags — do not silently invent; surface to the user if unconfirmed.
- **Homepage must stay identical.** Tasks 1 and 4 are the only ones touching homepage code paths, and both are explicitly behavior-neutral with grep-based regression checks.
- **No test runner exists** — every task's "test" is `npm run build` (prerender fails on broken routes) plus `check-seo.mjs`. That is by design for this repo.
