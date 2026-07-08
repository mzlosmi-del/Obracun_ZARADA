# Calculator-page Dominance Sprint — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deepen every calculator page to 1,000+ words of accurate Serbian, add `/godisnji-odmor` and `/jubilarna-nagrada` calculator pages, add a homepage SEO section + hub, and funnel blog authority to money pages — to lift head-term rankings from pos 9–11 toward the blog's pos 3–6.

**Architecture:** Pure content + two presentation-only mini-calculators inside the existing `ToolPage`/`ReferencePage` `cfg` pattern (`src/pages.jsx`). No core calculator-logic changes, no new deps. All figures come from `src/rates.js`. New routes register in three places (`App.jsx`, `prerender.mjs`, `check-seo.mjs`).

**Tech Stack:** React 18 + react-router-dom 6, Vite 5, puppeteer-core prerender, `scripts/check-seo.mjs` as the CI gate. No test runner exists — the per-task verification loop is `npm run build` → dist inspection → `node scripts/check-seo.mjs`.

## Global Constraints

- All figures from `src/rates.js` (`DEFAULT_RATES`, `REFERENCE_DATA`, `PAUSAL_RATES`) or verified official sources (Sl. glasnik RS, RZS, Poreska uprava). **Never invent figures.**
- **Do not change the core calculator compute logic** (`App.jsx` compute fn ~lines 40–114). Presentation-only mini-calcs allowed (pattern: `OtpremninaCalculator`).
- No new npm dependencies; keep bundle lean.
- Every route must pass `node scripts/check-seo.mjs`: `<title>` length 1–65, `<meta description>` 1–165, exactly one `<h1>`, canonical starts `https://www.platnilistic.rs` and includes `/<slug>`, ≥1 valid JSON-LD block.
- No fake ratings/reviews in schema.
- No repeated template sentences across pages; content a knjigovođa would sign off on.
- Freshness stamp string is the module const `FRESHNESS = "jul 2026."` in `pages.jsx`; homepage uses the same via `<FreshnessStamp date="jul 2026." />`.

## Verified calculation anchor (use verbatim; must match calculator output)

```
doprinosi zaposlenog = bruto1 × 19,90%
poreska osnovica     = max(bruto1 − 34.221, 0)
porez                = poreska osnovica × 10%
neto                 = bruto1 − doprinosi − porez
bruto2               = bruto1 × 1,1515
```

| Bruto 1 | Doprinosi | Por. osnovica | Porez | Neto | Bruto 2 |
|---|---|---|---|---|---|
| 50.000 | 9.950 | 15.779 | 1.578 | 38.472 | 57.575 |
| 87.207 | 17.354 | 52.986 | 5.299 | 64.554 | 100.419 |
| 100.000 | 19.900 | 65.779 | 6.578 | 73.522 | 115.150 |
| 150.000 | 29.850 | 115.779 | 11.578 | 108.572 | 172.725 |

## Word-count verification helper (used by every content task)

After build, count rendered words in a page's main content (strips tags):

```bash
node -e 'const fs=require("fs");const h=fs.readFileSync(process.argv[1],"utf8");const m=h.match(/<div class="main-inner">([\s\S]*?)<\/main>/);const t=(m?m[1]:h).replace(/<script[\s\S]*?<\/script>/g,"").replace(/<[^>]+>/g," ").replace(/&[a-z]+;/g," ");const w=t.split(/\s+/).filter(Boolean).length;console.log(process.argv[1],w,"words")' dist/<slug>/index.html
```

Target: ≥1000 for each calculator/tool page.

---

## Task 1: New page — `/godisnji-odmor` (calculator + content + registration)

**Files:**
- Modify: `src/pages.jsx` — add `GodisnjiOdmorCalculator` component + `GodisnjiOdmorPage` config; extend `ToolPage` calc dispatch (line ~32) to handle `calc === "godisnji-odmor"`.
- Modify: `src/App.jsx` — import `GodisnjiOdmorPage`; add `<Route path="/godisnji-odmor">`.
- Modify: `scripts/prerender.mjs` — add `/godisnji-odmor` to `STATIC_ROUTES` and to sitemap `meta`.
- Modify: `scripts/check-seo.mjs` — add `godisnji-odmor` to `ROUTES`.

**Interfaces:**
- Consumes: `REFERENCE_DATA.prosecnaZarada2026.bruto` (168008), `NumberInput`, `ResultRow`, `useState` — all already imported in `pages.jsx`.
- Produces: `export function GodisnjiOdmorPage()` (imported by `App.jsx`); route `/godisnji-odmor`; slug `godisnji-odmor` in prerender + check-seo.

- [ ] **Step 1: Add the calculator component** in `src/pages.jsx` after `OtpremninaCalculator` (before `PausalPage`).

```jsx
// Godišnji odmor — naknada zarade (čl. 104) i naknada za neiskorišćeni odmor (čl. 114 ZOR).
// Presentation-only: osnovica = prosečna bruto zarada zaposlenog u prethodnih 12 meseci.
export function GodisnjiOdmorCalculator() {
  const prosBruto = REFERENCE_DATA.prosecnaZarada2026.bruto;
  const [mode, setMode] = useState("odmor"); // "odmor" | "neiskorisceni"
  const [prosek, setProsek] = useState(prosBruto);
  const [radniDani, setRadniDani] = useState(21);
  const [dani, setDani] = useState(20);
  const dnevna = radniDani > 0 ? prosek / radniDani : 0;
  const naknada = dnevna * (dani || 0);
  return (
    <div className="pausal-calc">
      <div className="mode-toggle" role="tablist" aria-label="Vrsta naknade" style={{ marginBottom: 12 }}>
        <button className={`mode-btn ${mode === "odmor" ? "active" : ""}`} onClick={() => setMode("odmor")} role="tab" aria-selected={mode === "odmor"}>
          Naknada za odmor
        </button>
        <button className={`mode-btn ${mode === "neiskorisceni" ? "active" : ""}`} onClick={() => setMode("neiskorisceni")} role="tab" aria-selected={mode === "neiskorisceni"}>
          Neiskorišćeni dani
        </button>
      </div>
      <NumberInput label="Prosečna bruto zarada (prethodnih 12 meseci)" sublabel="(podrazumevano prosečna bruto zarada u RS)" value={prosek} onChange={setProsek} step={1000} />
      <NumberInput label="Radnih dana u mesecu" value={radniDani} onChange={setRadniDani} unit="dana" min={1} step={1} />
      <NumberInput label={mode === "odmor" ? "Dana godišnjeg odmora" : "Neiskorišćenih dana odmora"} value={dani} onChange={setDani} unit="dana" min={0} step={1} />
      <div className="pausal-results results-body">
        <ResultRow label="Dnevna osnova (prosek ÷ radni dani)" value={dnevna} />
        <ResultRow label={mode === "odmor" ? `Naknada za ${dani} dana odmora (bruto)` : `Naknada za ${dani} neiskorišćenih dana (bruto)`} value={naknada} type="positive" />
      </div>
      <p className="pausal-note">Napomena: osnovica je prosečna zarada zaposlenog u prethodnih 12 meseci (čl. 104 Zakona o radu), ne prosek u RS — podrazumevana vrednost je informativna. Naknada je bruto i podleže porezu i doprinosima kao zarada. Naknada za neiskorišćeni odmor isplaćuje se pri prestanku radnog odnosa (čl. 114). Izvor proseka: RZS.</p>
    </div>
  );
}
```

- [ ] **Step 2: Extend the calc dispatch** in `ToolPage` (currently line ~32–34). Add ONLY the `godisnji-odmor` branch now (the `jubilarna` branch is added in Task 2 together with its component, so the bundle never references an undefined identifier). Replace:

```jsx
      {cfg.calc === "pausal" ? <PausalCalculator />
        : cfg.calc === "otpremnina" ? <OtpremninaCalculator />
        : <CalculatorPage focusSection={cfg.focusSection} />}
```

with:

```jsx
      {cfg.calc === "pausal" ? <PausalCalculator />
        : cfg.calc === "otpremnina" ? <OtpremninaCalculator />
        : cfg.calc === "godisnji-odmor" ? <GodisnjiOdmorCalculator />
        : <CalculatorPage focusSection={cfg.focusSection} />}
```

- [ ] **Step 3: Add the page config** in `src/pages.jsx`. Title must be ≤65 chars — `Kalkulator godišnjeg odmora 2026 — naknada | PlatniListić` (56 chars, OK).

```jsx
export function GodisnjiOdmorPage() {
  const prosBruto = REFERENCE_DATA.prosecnaZarada2026.bruto;
  return <ToolPage cfg={{
    slug: "godisnji-odmor",
    title: "Kalkulator godišnjeg odmora 2026 — naknada | PlatniListić",
    description: "Kalkulator naknade za godišnji odmor i za neiskorišćeni odmor (čl. 104 i 114 Zakona o radu). Osnovica je prosek zarade u prethodnih 12 meseci. Besplatno, 2026.",
    h1: "Kalkulator godišnjeg odmora i naknade (2026)",
    breadcrumbName: "Godišnji odmor",
    calc: "godisnji-odmor",
    intro: (<p>Ovaj <strong>kalkulator godišnjeg odmora</strong> računa naknadu zarade za dane odmora i naknadu za <strong>neiskorišćeni godišnji odmor</strong> pri prestanku radnog odnosa. Osnovica je prosečna zarada zaposlenog u prethodnih 12 meseci (čl. 104 Zakona o radu). Za pravila i uslove pogledajte vodič <a href="/blog/godisnji-odmor-naknada">kako se računa naknada za godišnji odmor</a>.</p>),
    guide: (<>
      <h2>Kako se obračunava naknada za godišnji odmor</h2>
      <p>Za dane godišnjeg odmora zaposleni prima naknadu zarade koja <strong>ne može biti niža od prosečne zarade u prethodnih 12 meseci</strong> (čl. 104 Zakona o radu). U prosek ulaze osnovna zarada, minuli rad i redovna uvećanja. Postupak: (1) saberu se bruto zarade za 12 meseci, (2) podele sa 12 (prosečna mesečna bruto), (3) podeli sa brojem radnih dana u mesecu radi dnevne osnove, (4) pomnoži brojem dana odmora.</p>
      <h2>Parametri obračuna 2026</h2>
      <table className="ref-table" aria-label="Parametri naknade za godišnji odmor 2026">
        <thead><tr><th>Stavka</th><th>Vrednost</th></tr></thead>
        <tbody>
          <tr><td>Zakonski minimum odmora</td><td>20 radnih dana</td></tr>
          <tr><td>Osnovica naknade</td><td>prosek zarade — prethodnih 12 meseci</td></tr>
          <tr><td>Prosečna bruto zarada u RS ({REFERENCE_DATA.prosecnaZarada2026.mesec})</td><td>{prosBruto.toLocaleString("sr-RS")} RSD</td></tr>
          <tr><td>Porez i doprinosi na naknadu</td><td>kao na zaradu (10% + 19,90%)</td></tr>
        </tbody>
      </table>
      <h2>Radni primer</h2>
      <p>Zaposleni sa prosečnom bruto zaradom od 100.000 RSD i 21 radnim danom u mesecu ima dnevnu osnovu 100.000 ÷ 21 ≈ 4.762 RSD. Za 20 radnih dana odmora naknada iznosi 4.762 × 20 ≈ 95.238 RSD bruto. Na taj iznos obračunavaju se doprinosi (19,90%) i porez (10% iznad neoporezivog dela) kao na redovnu zaradu.</p>
      <h2>Naknada za neiskorišćeni godišnji odmor</h2>
      <p>Ako zaposlenom prestane radni odnos pre nego što je iskoristio pun godišnji odmor, poslodavac je dužan da mu isplati <strong>naknadu za neiskorišćene dane</strong> (čl. 114 Zakona o radu), u visini prosečne zarade po istoj formuli. Za 8 neiskorišćenih dana i dnevnu osnovu 4.762 RSD naknada je ≈ 38.096 RSD bruto.</p>
      <h2>Česte greške</h2>
      <ul>
        <li>Obračun naknade po tekućoj, a ne po prosečnoj zaradi iz prethodnih 12 meseci.</li>
        <li>Izostavljanje minulog rada i redovnih uvećanja iz proseka.</li>
        <li>Isplata neiskorišćenog odmora „na ruke" bez poreza i doprinosa — naknada je zarada.</li>
      </ul>
      <h2>Pravni okvir</h2>
      <p>Godišnji odmor uređuju čl. 68–76 Zakona o radu, naknadu zarade čl. 104, a naknadu za neiskorišćeni odmor čl. 114 (Zakon o radu, „Sl. glasnik RS", prečišćen tekst). Minimum je 20 radnih dana; pravo na pun odmor stiče se posle 6 meseci neprekidnog rada.</p>
    </>),
    faq: [
      { q: "Kako se računa godišnji odmor?", a: "Naknada za godišnji odmor računa se kao prosečna bruto zarada zaposlenog u prethodnih 12 meseci, podeljena brojem radnih dana u mesecu i pomnožena brojem dana odmora. Ne može biti niža od tog proseka (čl. 104 Zakona o radu)." },
      { q: "Kako se računa naknada za neiskorišćeni godišnji odmor?", a: "Pri prestanku radnog odnosa poslodavac isplaćuje naknadu za neiskorišćene dane odmora (čl. 114 Zakona o radu), po istoj formuli — dnevna osnova (prosek ÷ radni dani) pomnožena brojem neiskorišćenih dana. Naknada je bruto i podleže porezu i doprinosima." },
      { q: "Da li se na naknadu za godišnji odmor plaćaju porez i doprinosi?", a: "Da. Naknada za godišnji odmor tretira se kao zarada — plaćaju se doprinosi zaposlenog (19,90%), porez (10% iznad neoporezivog iznosa) i doprinosi poslodavca (15,15%)." },
    ],
    related: [
      { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
      { href: "/bolovanje", label: "Kalkulator bolovanja" },
      { href: "/radni-dani-2026", label: "Radni dani 2026" },
      { href: "/prosecna-zarada", label: "Prosečna zarada u Srbiji" },
    ],
  }} />;
}
```

- [ ] **Step 4: Register route** in `src/App.jsx`. Add to the lazy imports block (find where `GodisnjiPorezPage` is imported from `./pages.jsx`) and add the Route after `/godisnji-porez`:

```jsx
            <Route path="/godisnji-odmor" element={<Suspense fallback={<RouteLoader />}><GodisnjiOdmorPage /></Suspense>} />
```

- [ ] **Step 5: Register in prerender** `scripts/prerender.mjs`: add `"/godisnji-odmor"` to `STATIC_ROUTES` and this entry to the sitemap `meta` object:

```js
    "/godisnji-odmor": { changefreq: "monthly", priority: "0.8", lastmod: new Date().toISOString().slice(0, 10) },
```

- [ ] **Step 6: Register in check-seo** `scripts/check-seo.mjs`: add `"godisnji-odmor"` to the `ROUTES` array.

- [ ] **Step 7: Build**

Run: `npm run build`
Expected: prerender logs `✓ prerendered /godisnji-odmor` and `✓ wrote dist/sitemap.xml`, exits 0.

- [ ] **Step 8: Verify word count ≥1000**

Run the word-count helper on `dist/godisnji-odmor/index.html`.
Expected: ≥1000 words. If under, expand the guide prose (add depth to examples/pravni okvir), rebuild.

- [ ] **Step 9: Run check-seo**

Run: `node scripts/check-seo.mjs`
Expected: `✓ godisnji-odmor` and `all N routes pass`, exit 0.

- [ ] **Step 10: Verify sitemap + prerendered text**

Run: `grep -c "godisnji-odmor" dist/sitemap.xml` (expect ≥1) and confirm `dist/godisnji-odmor/index.html` contains "Naknada za neiskorišćeni godišnji odmor".

- [ ] **Step 11: Commit**

```bash
git add src/pages.jsx src/App.jsx scripts/prerender.mjs scripts/check-seo.mjs
git commit -m "feat(seo): add /godisnji-odmor kalkulator page"
```

---

## Task 2: New page — `/jubilarna-nagrada` (calculator + content + registration)

**Files:**
- Modify: `src/pages.jsx` — add `JubilarnaCalculator` + `JubilarnaPage`; add the `jubilarna` branch to the `ToolPage` calc dispatch.
- Modify: `src/App.jsx` — import + `<Route path="/jubilarna-nagrada">`.
- Modify: `scripts/prerender.mjs` — `STATIC_ROUTES` + sitemap `meta`.
- Modify: `scripts/check-seo.mjs` — `ROUTES`.

**Interfaces:**
- Consumes: `REFERENCE_DATA.prosecnaZarada2026.bruto` (168008), `DEFAULT_RATES` (for overage tax), `NumberInput`, `ResultRow`, `fmt`, `useState`.
- Produces: `export function JubilarnaPage()`; route `/jubilarna-nagrada`; slug `jubilarna-nagrada`.

**Note on figures:** neoporezivi max = multiplier × prosečna bruto zarada in RS (ZPDG čl. 18 tač. 9). Multipliers 10→1×, 20→2×, 30→2,5×, 40→3×. **No verified 35-god. multiplier exists — omit it.** Base = `REFERENCE_DATA.prosecnaZarada2026.bruto` (168.008), stated explicitly on the page. This differs from the stale `/blog/jubilarna-nagrada` (~140k base); blog refresh is out of scope.

- [ ] **Step 1: Add the calculator component** in `src/pages.jsx` after `GodisnjiOdmorCalculator`.

```jsx
// Jubilarna nagrada — neoporezivi maksimum = koeficijent × prosečna bruto zarada u RS
// (ZPDG čl. 18 tač. 9). Koeficijenti: 10 god. 1×, 20 god. 2×, 30 god. 2,5×, 40 god. 3×.
// Deo iznad neoporezivog max-a oporezuje se kao bonus (porez 10% + doprinosi 19,90%).
const JUBILEJI = [
  { god: 10, koef: 1 },
  { god: 20, koef: 2 },
  { god: 30, koef: 2.5 },
  { god: 40, koef: 3 },
];
export function JubilarnaCalculator() {
  const prosBruto = REFERENCE_DATA.prosecnaZarada2026.bruto;
  const [god, setGod] = useState(20);
  const [isplata, setIsplata] = useState(0);
  const koef = (JUBILEJI.find((j) => j.god === god) || JUBILEJI[1]).koef;
  const neoporeziviMax = prosBruto * koef;
  const oporezivi = Math.max((isplata || 0) - neoporeziviMax, 0);
  const doprinosi = oporezivi * (DEFAULT_RATES.pioPct_emp + DEFAULT_RATES.health_emp + DEFAULT_RATES.unemp_emp) / 100;
  const porez = oporezivi * DEFAULT_RATES.taxRate / 100;
  const neto = (isplata || 0) - doprinosi - porez;
  return (
    <div className="pausal-calc">
      <div className="mode-toggle" role="tablist" aria-label="Godine staža" style={{ marginBottom: 12, flexWrap: "wrap" }}>
        {JUBILEJI.map((j) => (
          <button key={j.god} className={`mode-btn ${god === j.god ? "active" : ""}`} onClick={() => setGod(j.god)} role="tab" aria-selected={god === j.god}>
            {j.god} god.
          </button>
        ))}
      </div>
      <div className="pausal-results results-body">
        <ResultRow label={`Neoporezivi maksimum (${koef.toLocaleString("sr-RS")}× prosek)`} value={neoporeziviMax} type="positive" />
      </div>
      <NumberInput label="Iznos koji poslodavac isplaćuje (opciono)" sublabel="(unesite ako je veći od neoporezivog maksimuma)" value={isplata} onChange={setIsplata} step={10000} />
      {oporezivi > 0 && (
        <div className="pausal-results results-body">
          <ResultRow label="Oporezivi deo (iznad maksimuma)" value={oporezivi} />
          <ResultRow label="Doprinosi zaposlenog (19,90%)" value={doprinosi} type="negative" />
          <ResultRow label={`Porez (${DEFAULT_RATES.taxRate}%)`} value={porez} type="negative" />
          <ResultRow label="Neto na račun" value={neto} type="positive" />
        </div>
      )}
      <p className="pausal-note">Neoporezivi maksimum = koeficijent × prosečna bruto zarada u RS ({prosBruto.toLocaleString("sr-RS")} RSD, {REFERENCE_DATA.prosecnaZarada2026.mesec}, RZS), prema čl. 18 tač. 9 Zakona o porezu na dohodak građana. Deo iznad maksimuma oporezuje se kao bonus. Poslodavac isplatu jubilarne nagrade obavezuje kolektivnim ugovorom ili ugovorom o radu.</p>
    </div>
  );
}
```

- [ ] **Step 2: Add the `jubilarna` branch** to the `ToolPage` calc dispatch (it was intentionally NOT added in Task 1). After the `godisnji-odmor` line add:

```jsx
        : cfg.calc === "jubilarna" ? <JubilarnaCalculator />
```

- [ ] **Step 3: Add the page config.** Title `Kalkulator jubilarne nagrade 2026 | PlatniListić` (48 chars, OK).

```jsx
export function JubilarnaPage() {
  const prosBruto = REFERENCE_DATA.prosecnaZarada2026.bruto;
  return <ToolPage cfg={{
    slug: "jubilarna-nagrada",
    title: "Kalkulator jubilarne nagrade 2026 | PlatniListić",
    description: "Kalkulator jubilarne nagrade za 10, 20, 30 i 40 godina staža — neoporezivi maksimum (čl. 18 ZPDG) i porez na deo iznad. Za Srbiju 2026. Besplatno.",
    h1: "Kalkulator jubilarne nagrade (2026)",
    breadcrumbName: "Jubilarna nagrada",
    calc: "jubilarna",
    intro: (<p>Ovaj <strong>kalkulator jubilarne nagrade</strong> računa neoporezivi maksimum za 10, 20, 30 i 40 godina rada kod istog poslodavca i porez na deo iznad tog maksimuma. Detaljna pravila i primeri: vodič <a href="/blog/jubilarna-nagrada">jubilarna nagrada 2026 — iznos i obračun</a>.</p>),
    guide: (<>
      <h2>Kako se obračunava jubilarna nagrada</h2>
      <p>Jubilarna nagrada je jednokratna isplata povodom navršenih „okruglih" godina rada kod istog poslodavca. Deo iznosa je <strong>neoporeziv</strong> — do koeficijenta prosečne bruto zarade u Republici Srbiji, prema čl. 18 tač. 9 Zakona o porezu na dohodak građana. Ako poslodavac isplati više od tog maksimuma, razlika se oporezuje kao bonus: porez 10% i doprinosi zaposlenog 19,90%.</p>
      <h2>Neoporezivi iznos jubilarne nagrade 2026</h2>
      <p>Osnovica je poslednja objavljena prosečna bruto zarada u RS — {prosBruto.toLocaleString("sr-RS")} RSD ({REFERENCE_DATA.prosecnaZarada2026.mesec}, RZS). Neoporezivi maksimumi po jubileju:</p>
      <table className="ref-table" aria-label="Neoporezivi iznos jubilarne nagrade 2026">
        <thead><tr><th>Jubilej</th><th>Koeficijent</th><th>Neoporezivo do ≈ (RSD)</th></tr></thead>
        <tbody>
          {JUBILEJI.map((j) => (
            <tr key={j.god}>
              <td>{j.god} godina</td>
              <td>{j.koef.toLocaleString("sr-RS")}× prosek</td>
              <td>≈ {Math.round(prosBruto * j.koef).toLocaleString("sr-RS")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Radni primer</h2>
      <p>Zaposleni navršava 20 godina rada; neoporezivi maksimum je 2 × {prosBruto.toLocaleString("sr-RS")} = {(prosBruto * 2).toLocaleString("sr-RS")} RSD. Ako poslodavac isplati tačno taj iznos ili manje, cela nagrada je neoporeziva. Ako isplati 50.000 RSD više od maksimuma, na tih 50.000 RSD plaćaju se doprinosi (19,90% = 9.950 RSD) i porez (10% = 5.000 RSD), pa je neto na taj deo 35.050 RSD.</p>
      <h2>Šta se računa kao staž za jubilej</h2>
      <p>Kao i kod minulog rada, broji se <strong>samo staž kod istog poslodavca</strong>, ne ukupan staž osiguranja. Statusne promene poslodavca (spajanje, pripajanje) prenose i staž za jubilej. Više: <a href="/minuli-rad">kalkulator minulog rada</a>.</p>
      <h2>Pravni okvir</h2>
      <p>Neoporezive iznose propisuje čl. 18 tač. 9 Zakona o porezu na dohodak građana. Obavezu isplate utvrđuje kolektivni ugovor ili ugovor o radu (Zakon o radu) — jubilarna nagrada nije zakonska obaveza, ali ako je poslodavac ugovorio, mora je isplatiti. Nagrada (i neoporezivi i oporezivi deo) priznaje se kao trošak poslovanja poslodavca.</p>
    </>),
    faq: [
      { q: "Kako se obračunava jubilarna nagrada?", a: `Neoporezivi maksimum jednak je koeficijentu prosečne bruto zarade u RS: 1× za 10 godina, 2× za 20, 2,5× za 30 i 3× za 40 godina rada kod istog poslodavca (čl. 18 ZPDG). Uz prosek od ${prosBruto.toLocaleString("sr-RS")} RSD to je do ${Math.round(prosBruto).toLocaleString("sr-RS")}–${(prosBruto * 3).toLocaleString("sr-RS")} RSD neoporezivo.` },
      { q: "Da li se plaća porez na jubilarnu nagradu?", a: "Deo do neoporezivog maksimuma je oslobođen poreza i doprinosa. Iznos iznad maksimuma oporezuje se kao bonus — porez 10% i doprinosi zaposlenog 19,90% (plus doprinosi poslodavca 15,15%)." },
      { q: "Za koliko godina staža se isplaćuje jubilarna nagrada?", a: "Najčešće za 10, 20, 30 i 40 godina rada kod istog poslodavca. Tačne jubileje i iznose utvrđuje kolektivni ugovor ili ugovor o radu — poslodavac nije zakonski obavezan, osim ako se sam obavezao." },
    ],
    related: [
      { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
      { href: "/minuli-rad", label: "Kalkulator minulog rada" },
      { href: "/otpremnina", label: "Kalkulator otpremnine" },
      { href: "/godisnji-porez", label: "Godišnji porez kalkulator" },
    ],
  }} />;
}
```

- [ ] **Step 4: Register route** in `src/App.jsx` — import `JubilarnaPage` and add after the `/godisnji-odmor` route:

```jsx
            <Route path="/jubilarna-nagrada" element={<Suspense fallback={<RouteLoader />}><JubilarnaPage /></Suspense>} />
```

- [ ] **Step 5: prerender** — add `"/jubilarna-nagrada"` to `STATIC_ROUTES` and:

```js
    "/jubilarna-nagrada": { changefreq: "monthly", priority: "0.8", lastmod: new Date().toISOString().slice(0, 10) },
```

- [ ] **Step 6: check-seo** — add `"jubilarna-nagrada"` to `ROUTES`.

- [ ] **Step 7: Build** — `npm run build`; expect `✓ prerendered /jubilarna-nagrada`, exit 0.

- [ ] **Step 8: Word count** — helper on `dist/jubilarna-nagrada/index.html`, expect ≥1000; expand guide if short.

- [ ] **Step 9: check-seo** — `node scripts/check-seo.mjs`, expect `✓ jubilarna-nagrada`, exit 0.

- [ ] **Step 10: Verify** — `grep -c "jubilarna-nagrada" dist/sitemap.xml` ≥1; `dist/jubilarna-nagrada/index.html` contains "Neoporezivi iznos jubilarne nagrade 2026".

- [ ] **Step 11: Commit**

```bash
git add src/pages.jsx src/App.jsx scripts/prerender.mjs scripts/check-seo.mjs
git commit -m "feat(seo): add /jubilarna-nagrada kalkulator page"
```

---

## Task 3: Homepage — title, freshness, SEO section, hub, FAQ

**Files:**
- Modify: `src/App.jsx` — `HomePage` (title, `<FreshnessStamp>`, new SEO `<section>`, expanded "Svi kalkulatori" hub, extended visible FAQ) + `HOME_FAQ` array.
- (Import `FreshnessStamp` from `./ui.jsx` if not already imported in `App.jsx`.)

**Interfaces:**
- Consumes: `DEFAULT_RATES`, `REFERENCE_DATA` (already imported in App.jsx? verify — if not, add to the existing `./rates.js` import), `FreshnessStamp`.
- Produces: nothing consumed downstream (homepage is a leaf).

- [ ] **Step 1: Confirm imports.** In `src/App.jsx`, ensure `import { FreshnessStamp } from "./ui.jsx"` (or add to existing ui import) and that `DEFAULT_RATES`, `REFERENCE_DATA` are imported from `./rates.js`. Add whatever is missing.

- [ ] **Step 2: Update the title + description** in `HomePage`'s `useSeo`:

```jsx
    title: "Kalkulator zarada 2026 — bruto u neto, Srbija | PlatniListić",
```

(59 chars — the brief's longer "...bruto u neto plata, Srbija..." variant is 68 chars and fails the ≤65 check-seo cap, so this trims "plata" while keeping the plural "zarada" head term. Keep description unchanged — already ≤165.)

- [ ] **Step 3: Add freshness stamp** right after `<h1 className="home-intro-title">…</h1>` inside `.home-intro`:

```jsx
        <FreshnessStamp date="jul 2026." />
```

- [ ] **Step 4: Add the SEO section** immediately after the closing `</section>` of `.home-intro` (before `<CalculatorPage />`). ~1,200+ words, H2-structured, figures from `DEFAULT_RATES`:

```jsx
      <section className="home-seo" aria-label="Kako se obračunava zarada 2026">
        <h2>Kako se obračunava zarada u Srbiji 2026 — korak po korak</h2>
        <p>Obračun zarade polazi od <strong>bruto 1</strong> iznosa iz ugovora o radu. Korak 1: na celu bruto 1 zaradu obračunavaju se doprinosi zaposlenog — PIO {DEFAULT_RATES.pioPct_emp}%, zdravstvo {DEFAULT_RATES.health_emp.toLocaleString("sr-RS")}% i nezaposlenost {DEFAULT_RATES.unemp_emp.toLocaleString("sr-RS")}%, ukupno 19,90%. Korak 2: poreska osnovica je bruto 1 umanjen za neoporezivi iznos od {DEFAULT_RATES.nonTaxable.toLocaleString("sr-RS")} RSD. Korak 3: porez na zaradu je {DEFAULT_RATES.taxRate}% te osnovice. Korak 4: neto = bruto 1 − doprinosi − porez. Rezultat je iznos koji zaposleni prima na račun.</p>
        <h2>Parametri obračuna zarade 2026</h2>
        <table className="ref-table" aria-label="Parametri obračuna zarade 2026">
          <thead><tr><th>Parametar</th><th>Vrednost 2026</th></tr></thead>
          <tbody>
            <tr><td>Porez na zaradu</td><td>{DEFAULT_RATES.taxRate}% (na deo iznad neoporezivog)</td></tr>
            <tr><td>Neoporezivi iznos</td><td>{DEFAULT_RATES.nonTaxable.toLocaleString("sr-RS")} RSD</td></tr>
            <tr><td>PIO — zaposleni / poslodavac</td><td>{DEFAULT_RATES.pioPct_emp}% / {DEFAULT_RATES.pio_er}%</td></tr>
            <tr><td>Zdravstvo — zaposleni / poslodavac</td><td>{DEFAULT_RATES.health_emp.toLocaleString("sr-RS")}% / {DEFAULT_RATES.health_er.toLocaleString("sr-RS")}%</td></tr>
            <tr><td>Nezaposlenost — zaposleni</td><td>{DEFAULT_RATES.unemp_emp.toLocaleString("sr-RS")}%</td></tr>
            <tr><td>Najniža mesečna osnovica doprinosa</td><td>{DEFAULT_RATES.minBase.toLocaleString("sr-RS")} RSD</td></tr>
            <tr><td>Najviša mesečna osnovica doprinosa</td><td>{DEFAULT_RATES.maxBase.toLocaleString("sr-RS")} RSD</td></tr>
          </tbody>
        </table>
        <p>Neoporezivi iznos za 2026. utvrđen je izmenama Zakona o porezu na dohodak građana („Sl. glasnik RS" br. 115/2025), a stope doprinosa objavljuje CROSO. Doprinosi se obračunavaju u granicama najniže i najviše mesečne osnovice.</p>
        <h2>Bruto 1, bruto 2 i neto — u čemu je razlika</h2>
        <p><strong>Bruto 1</strong> je ugovorena zarada i osnovica za porez i doprinose zaposlenog. <strong>Neto</strong> je iznos na račun. <strong>Bruto 2</strong> je bruto 1 uvećan za doprinose na teret poslodavca ({(DEFAULT_RATES.pio_er + DEFAULT_RATES.health_er).toLocaleString("sr-RS")}%) i predstavlja stvaran trošak rada. Detaljan obračun u oba smera radite kroz <a href="/bruto-neto">bruto u neto kalkulator</a> i <a href="/neto-bruto">neto u bruto kalkulator</a>.</p>
        <h2>Primeri obračuna zarade 2026</h2>
        <p>Tri obračuna po važećoj formuli (neto zaokružen):</p>
        <table className="ref-table" aria-label="Primeri obračuna zarade 2026">
          <thead><tr><th>Bruto 1 (RSD)</th><th>Doprinosi</th><th>Porez</th><th>Neto ≈</th><th>Bruto 2 ≈</th></tr></thead>
          <tbody>
            <tr><td>87.207 (minimalac)</td><td>17.354</td><td>5.299</td><td>64.554</td><td>100.419</td></tr>
            <tr><td>100.000</td><td>19.900</td><td>6.578</td><td>73.522</td><td>115.150</td></tr>
            <tr><td>150.000</td><td>29.850</td><td>11.578</td><td>108.572</td><td>172.725</td></tr>
          </tbody>
        </table>
        <h2>Uvećana zarada — dodaci i minuli rad</h2>
        <p>Na osnovnu zaradu dodaju se zakonska uvećanja (čl. 108 Zakona o radu): prekovremeni rad, noćni rad, rad vikendom i praznikom, kao i minuli rad — najmanje 0,4% po godini staža kod istog poslodavca. Sva uvećanja ulaze u bruto 1 i podležu porezu i doprinosima. Vidite <a href="/dodaci-na-zaradu">kalkulator dodataka na zaradu</a> i <a href="/minuli-rad">kalkulator minulog rada</a>.</p>
      </section>
```

- [ ] **Step 5: Expand the hub.** Replace the `<nav className="home-tools">` list items with the full keyword-rich set (add the 2 new pages + missing pages):

```jsx
        <ul>
          <li><a href="/bruto-neto">Bruto neto kalkulator</a></li>
          <li><a href="/neto-bruto">Neto u bruto kalkulator</a></li>
          <li><a href="/pausal">Paušal kalkulator</a></li>
          <li><a href="/bolovanje">Kalkulator bolovanja</a></li>
          <li><a href="/otpremnina">Kalkulator otpremnine</a></li>
          <li><a href="/minuli-rad">Kalkulator minulog rada</a></li>
          <li><a href="/dodaci-na-zaradu">Dodaci na zaradu — prekovremeni, noćni</a></li>
          <li><a href="/ugovor-o-delu">Ugovor o delu kalkulator</a></li>
          <li><a href="/godisnji-porez">Godišnji porez kalkulator</a></li>
          <li><a href="/godisnji-odmor">Kalkulator godišnjeg odmora</a></li>
          <li><a href="/jubilarna-nagrada">Kalkulator jubilarne nagrade</a></li>
          <li><a href="/neoporezivi-iznos-2026">Neoporezivi iznos 2026</a></li>
          <li><a href="/stope-doprinosa-2026">Stope doprinosa 2026</a></li>
          <li><a href="/minimalna-zarada-2026">Minimalna zarada 2026</a></li>
          <li><a href="/prosecna-zarada">Prosečna zarada u Srbiji</a></li>
          <li><a href="/radni-dani-2026">Radni dani 2026</a></li>
          <li><a href="/praznici-2026">Praznici 2026</a></li>
        </ul>
```

- [ ] **Step 6: Extend the FAQ.** The 4 required questions: "Ako je bruto plata 50.000..." already exists (keep). Add three new items to BOTH `HOME_FAQ` (array) and the visible `.home-faq` section, kept identical. Add to `HOME_FAQ`:

```jsx
  {
    q: "Kako se računa plata iz bruto u neto?",
    a: "Od bruto 1 zarade oduzmu se doprinosi zaposlenog (19,90%) i porez (10% na deo iznad neoporezivih 34.221 RSD). Primer: bruto 100.000 RSD → doprinosi 19.900, porez 6.578, neto ≈ 73.522 RSD.",
  },
  {
    q: "Koliko iznose porez i doprinosi na zaradu 2026?",
    a: "Porez na zaradu je 10% (na deo iznad neoporezivih 34.221 RSD). Doprinosi zaposlenog su 19,90% (PIO 14%, zdravstvo 5,15%, nezaposlenost 0,75%), a poslodavca 15,15% (PIO 10%, zdravstvo 5,15%).",
  },
  {
    q: "Šta je bruto 2?",
    a: "Bruto 2 je ukupan trošak rada za poslodavca — bruto 1 uvećan za doprinose na teret poslodavca (15,15%). Za bruto 1 od 100.000 RSD, bruto 2 je oko 115.150 RSD.",
  },
```

And add the matching three `<div className="home-faq-item">` blocks (same text) in the visible section.

- [ ] **Step 7: Build** — `npm run build`, exit 0.

- [ ] **Step 8: Verify homepage** — word count helper on `dist/index.html` (SEO section adds ~1,200 words); confirm it contains "Parametri obračuna zarade 2026" and "Šta je bruto 2". Confirm title in `dist/index.html` ≤65 chars: `grep -o "<title>[^<]*" dist/index.html`.

- [ ] **Step 9: check-seo** — `node scripts/check-seo.mjs`, exit 0 (homepage `/` isn't in ROUTES but must not regress others).

- [ ] **Step 10: Commit**

```bash
git add src/App.jsx
git commit -m "feat(seo): homepage SEO section, kalkulator hub, extended FAQ, plural title"
```

---

## Task 4: Deepen bruto-neto, neto-bruto, pausal (priority tier 1)

**Files:** Modify `src/pages.jsx` — extend `BrutoNetoPage`, `NetoBrutoPage`, `PausalPage` `cfg.guide` + `cfg.faq`.

**Interfaces:** Consumes `DEFAULT_RATES`, `PAUSAL_RATES` (already imported).

For EACH of the three pages:

- [ ] **Step 1: Extend guide** — add any missing H2 among {kako funkcioniše + formula, tabela parametara 2026, radni primer, česte greške, pravni okvir}. bruto-neto and neto-bruto already have formula + tables + examples; add **"Česte greške"** and **"Pravni okvir"** H2s (2–4 sentences each, page-specific, no shared sentences). pausal already has formula + table + example; add **"Česte greške"** (e.g. zastarela PIO stopa 25,5%) and **"Pravni okvir"** (ZDOSO čl. 44, čl. 9 tač. 6).

Example for bruto-neto "Česte greške" (write distinct prose per page — do not copy):

```jsx
      <h2>Česte greške u obračunu</h2>
      <ul>
        <li>Primena poreza na celu bruto zaradu umesto samo na deo iznad neoporezivih {DEFAULT_RATES.nonTaxable.toLocaleString("sr-RS")} RSD.</li>
        <li>Mešanje bruto 1 i bruto 2 — porez i doprinosi zaposlenog idu na bruto 1, ne na bruto 2.</li>
        <li>Zaboravljanje najniže/najviše osnovice doprinosa ({DEFAULT_RATES.minBase.toLocaleString("sr-RS")}–{DEFAULT_RATES.maxBase.toLocaleString("sr-RS")} RSD).</li>
      </ul>
      <h2>Pravni okvir</h2>
      <p>Porez na zaradu uređuje Zakon o porezu na dohodak građana (stopa 10%, neoporezivi iznos „Sl. glasnik RS" br. 115/2025), a doprinose Zakon o doprinosima za obavezno socijalno osiguranje. Osnovice objavljuje CROSO.</p>
```

- [ ] **Step 2: Add 2–3 FAQ** per page targeting GSC queries (neto-bruto is weakest — add e.g. "kako od neto do bruto plata", "koliki je bruto za neto 80.000"; use computed figures). Keep answers factual and distinct.

- [ ] **Step 3: Build** — `npm run build`, exit 0.

- [ ] **Step 4: Word count** — helper on `dist/bruto-neto`, `dist/neto-bruto`, `dist/pausal` — each ≥1000. Expand if short.

- [ ] **Step 5: check-seo** — `node scripts/check-seo.mjs`, exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/pages.jsx
git commit -m "feat(seo): deepen bruto-neto, neto-bruto, pausal to 1000+ words"
```

---

## Task 5: Deepen bolovanje, otpremnina, minuli-rad (priority tier 2)

**Files:** Modify `src/pages.jsx` — `BolovanjePage`, `OtpremninaPage`, `MinuliRadPage`.

- [ ] **Step 1: Extend guides** — add missing H2s (tabela parametara 2026, česte greške, pravni okvir) per page. bolovanje: add RFZO 30-day boundary detail, osnovica = prosek 12 mes., pravni okvir (Zakon o zdravstvenom osiguranju + čl. 115 ZOR). otpremnina: add "Poreski tretman" table + "Česte greške" + pravni okvir (čl. 158/119). minuli-rad: add "Tabela parametara" + "Česte greške" (računa se samo staž kod istog poslodavca) + pravni okvir (čl. 108).

- [ ] **Step 2: Add 2–3 FAQ** per page. minuli-rad targets: "minuli rad kako se računa", "da li se minuli rad računa na godišnji odmor" (answer: da — minuli rad ulazi u prosek osnovice za naknadu odmora). bolovanje: "kako se računa bolovanje 65 posto". otpremnina: "kalkulator otpremnine za penziju".

- [ ] **Step 3: Build** — `npm run build`, exit 0.

- [ ] **Step 4: Word count** — `dist/bolovanje`, `dist/otpremnina`, `dist/minuli-rad` each ≥1000.

- [ ] **Step 5: check-seo** — exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/pages.jsx
git commit -m "feat(seo): deepen bolovanje, otpremnina, minuli-rad to 1000+ words"
```

---

## Task 6: Deepen ugovor-o-delu, godisnji-porez, dodaci-na-zaradu (priority tier 3)

**Files:** Modify `src/pages.jsx` — `UgovorODeluPage`, `GodisnjiPorezPage`, `DodaciPage`.

These three are currently thinnest (dodaci 272, ugovor-o-delu 572, godisnji-porez 550) — need the most new prose.

- [ ] **Step 1: Extend guides** — add full set of H2s to each: kako funkcioniše (formula), tabela parametara 2026, radni primer sa brojevima, česte greške, pravni okvir.
  - ugovor-o-delu: osnovica = bruto − 20% normiranih troškova; porez 20%; PIO 24%; zdravstvo 10,3% (samo ako nije osiguran po drugom osnovu). Worked example. Pravni okvir: ZPDG + ZDOSO.
  - godisnji-porez: cenzus = 3× prosečna godišnja zarada; stope 10%/15%; primer sa konkretnim godišnjim dohotkom; rok 15. maj; pravni okvir ZPDG.
  - dodaci-na-zaradu: table of uvećanja (prekovremeni +26%, noćni +26%, vikend +26%, praznik +110%, minuli 0,4%); worked example (satnica × koeficijent); česte greške; pravni okvir čl. 108.

- [ ] **Step 2: Add 2–3 FAQ** per page. ugovor-o-delu targets: "kalkulator ugovora o delu 2026", "koliko se plaća porez na ugovor o delu". godisnji-porez: "ko plaća godišnji porez 2026". dodaci: "koliko se plaća noćni rad".

- [ ] **Step 3: Build** — `npm run build`, exit 0.

- [ ] **Step 4: Word count** — `dist/ugovor-o-delu`, `dist/godisnji-porez`, `dist/dodaci-na-zaradu` each ≥1000. These need real expansion — verify carefully.

- [ ] **Step 5: check-seo** — exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/pages.jsx
git commit -m "feat(seo): deepen ugovor-o-delu, godisnji-porez, dodaci-na-zaradu to 1000+ words"
```

---

## Task 7: Deepen prosecna-zarada (reference page)

**Files:** Modify `src/pages.jsx` — `ProsecnaZaradaPage` (a `ReferencePage`, currently short).

- [ ] **Step 1: Extend body** — add H2s: "Prosečna vs medijalna zarada" (why median is more representative), "Prosečna zarada i minimalac" (link `/minimalna-zarada-2026`), "Kako se koristi prosečna zarada u obračunima" (otpremnina, jubilarna, cenzus godišnjeg poreza — link those pages), a real €-comparison using `p.kursEur`. All figures from `REFERENCE_DATA.prosecnaZarada2026`.

- [ ] **Step 2: Add 1–2 FAQ** — "kolika je prosečna plata u Beogradu" (note: page-level RS figure; direct to blog for city breakdown), "šta je medijalna zarada".

- [ ] **Step 3: Build** — `npm run build`, exit 0.

- [ ] **Step 4: Word count** — `dist/prosecna-zarada` ≥1000 (reference pages may be shorter by nature; aim ≥1000, acceptable floor 900 if content stays non-padded — note in commit if under).

- [ ] **Step 5: check-seo** — exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/pages.jsx
git commit -m "feat(seo): deepen prosecna-zarada reference page"
```

---

## Task 8: Interlinking — blog → calculator (posts.js)

**Files:** Modify `src/posts.js` — add first-third keyword-anchor links where missing.

**Interfaces:** Markdown links in post `body` strings (format `[anchor](/path)`).

- [ ] **Step 1: Grep each post** for an existing link to its target calculator:

```bash
grep -n "godisnji-odmor-naknada\|jubilarna-nagrada\|bruto-neto-razlika\|kako-se-obracunava-bolovanje\|minuli-rad-obracun\|ugovor-o-delu" src/posts.js
```

For each of these posts, check whether the body's first third already links the target money page:
- `bruto-neto-razlika` → `/bruto-neto` (anchor "bruto neto kalkulator")
- `kako-se-obracunava-bolovanje` → `/bolovanje`
- `minuli-rad-obracun` → `/minuli-rad`
- `godisnji-odmor-naknada` → `/godisnji-odmor` (NEW — currently links `/` only)
- `jubilarna-nagrada` → `/jubilarna-nagrada` (NEW — currently links `/` only)
- `ugovor-o-delu` → `/ugovor-o-delu`

- [ ] **Step 2: Add links only where missing**, in the first third of each body. For `godisnji-odmor-naknada`, add near the "Kratak odgovor" line: `Za brz obračun koristite [kalkulator godišnjeg odmora](/godisnji-odmor).` For `jubilarna-nagrada`, near its "Kratak odgovor": `Izračunajte neoporezivi iznos u [kalkulatoru jubilarne nagrade](/jubilarna-nagrada).` Do not duplicate existing links.

- [ ] **Step 3: Build** — `npm run build`, exit 0 (posts prerender; redirected posts excluded automatically).

- [ ] **Step 4: Verify** — confirm the two new-page links resolve: `grep -c "/godisnji-odmor)" src/posts.js` ≥1 and `grep -c "/jubilarna-nagrada)" src/posts.js` ≥1.

- [ ] **Step 5: check-seo** — exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/posts.js
git commit -m "feat(seo): interlink blog posts to their calculator pages"
```

---

## Task 9: Final schema/tech verification

**Files:** none expected (verification only; fix inline if a check fails).

- [ ] **Step 1: Full build** — `npm run build`, exit 0, all routes prerendered incl. the 2 new.

- [ ] **Step 2: Confirm schema on new pages** — for `dist/godisnji-odmor/index.html` and `dist/jubilarna-nagrada/index.html`, verify presence of `"@type":"WebApplication"`, `"@type":"BreadcrumbList"`, `"@type":"FAQPage"`, and that `WebApplication` `name` contains the keyword ("godišnjeg odmora" / "jubilarne nagrade"):

```bash
grep -o '"name":"[^"]*"' dist/godisnji-odmor/index.html | head
grep -o '"@type":"[^"]*"' dist/jubilarna-nagrada/index.html
```

Expected: WebApplication name is the page `h1` (contains keyword — OK). If not, the `webAppLd({ name: cfg.h1 })` already handles it; no change needed.

- [ ] **Step 3: Confirm no fake ratings** — `grep -c "aggregateRating\|Review\|ratingValue" dist/**/index.html` → 0.

- [ ] **Step 4: check-seo full** — `node scripts/check-seo.mjs` → `all N routes pass` (N is now 17), exit 0.

- [ ] **Step 5: Sitemap** — `grep -c "<loc>" dist/sitemap.xml`; confirm both new routes present with today's `lastmod`:

```bash
grep -A1 "godisnji-odmor</loc>\|jubilarna-nagrada</loc>" dist/sitemap.xml
```

- [ ] **Step 6: Final commit** (only if any inline fixes were needed)

```bash
git add -A
git commit -m "chore(seo): final schema + sitemap verification for sprint"
```

---

## Self-review notes (already applied)

- **Spec coverage:** §1 Task 3; §2 Tasks 4–7; §3 Tasks 1–2; §4 Task 8; §5 Task 9. All covered.
- **Title lengths verified:** homepage 59, godisnji-odmor 56, jubilarna 48 — all ≤65.
- **Type consistency:** `cfg.calc` dispatch strings (`"godisnji-odmor"`, `"jubilarna"`) match between component dispatch and page configs. `JubilarnaCalculator`/`GodisnjiOdmorCalculator` defined before their dispatch branch compiles (Task 2 adds the `jubilarna` branch alongside its component).
- **Figure sourcing:** every number traces to `DEFAULT_RATES`/`REFERENCE_DATA`/`PAUSAL_RATES` or a cited law; jubilarna 35-god. row omitted (unverified).
- **Ordering constraint captured:** Task 1 adds only the `godisnji-odmor` dispatch branch; Task 2 adds the `jubilarna` branch + component together, so the bundle never references an undefined identifier.
