import { useSeo } from "./seo.jsx";
import { CalculatorPage } from "./App.jsx";
import { breadcrumbLd, webAppLd } from "./schema.js";
import { useState } from "react";
import { Breadcrumb, FreshnessStamp, PovezaniKalkulatori, NumberInput, ResultRow, fmt } from "./ui.jsx";
import { REFERENCE_DATA, PAUSAL_RATES, DEFAULT_RATES } from "./rates.js";

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
      {cfg.calc === "pausal" ? <PausalCalculator />
        : cfg.calc === "otpremnina" ? <OtpremninaCalculator />
        : <CalculatorPage focusSection={cfg.focusSection} />}
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
      <div className="pausal-results results-body">
        <ResultRow label={`Porez (${PAUSAL_RATES.porez}%)`} value={porez} />
        <ResultRow label={`PIO (${PAUSAL_RATES.pio}%)`} value={pio} />
        <ResultRow label={`Zdravstveno (${PAUSAL_RATES.zdravstveno}%)`} value={zdravstveno} />
        <ResultRow label="Ukupne mesečne obaveze" value={ukupno} type="negative" />
        <ResultRow label="Neto nakon obaveza" value={neto} type="positive" />
        <ResultRow label="Godišnje obaveze" value={ukupno * 12} />
        <div className="result-row">
          <span className="result-label">Efektivna stopa</span>
          <span className="result-value">{efektivna.toFixed(2).replace(".", ",")}%</span>
        </div>
      </div>
      <p className="pausal-note">Napomena: paušalnu osnovicu i tačan mesečni iznos određuje rešenje Poreske uprave. Izvor stopa: CROSO / Sl. glasnik RS.</p>
    </div>
  );
}

// Otpremnina kalkulator — the shared full calculator does NOT compute severance,
// so this dedicated mini-calc closes that gap (čl. 158 / čl. 119 ZOR).
//   tehnološki višak: min. 1/3 prosečne zarade × godine staža kod poslodavca
//   odlazak u penziju: min. 2 prosečne zarade
export function OtpremninaCalculator() {
  const prosNeto = REFERENCE_DATA.prosecnaZarada2026.neto;
  const [razlog, setRazlog] = useState("visak");
  const [prosek, setProsek] = useState(prosNeto); // prosečna zarada (osnovica) za obračun
  const [godine, setGodine] = useState(10);
  const otpremnina = razlog === "visak"
    ? (prosek / 3) * (godine || 0)
    : prosek * 2;
  return (
    <div className="pausal-calc">
      <div className="mode-toggle" role="tablist" aria-label="Razlog otpremnine" style={{ marginBottom: 12 }}>
        <button className={`mode-btn ${razlog === "visak" ? "active" : ""}`} onClick={() => setRazlog("visak")} role="tab" aria-selected={razlog === "visak"}>
          Tehnološki višak
        </button>
        <button className={`mode-btn ${razlog === "penzija" ? "active" : ""}`} onClick={() => setRazlog("penzija")} role="tab" aria-selected={razlog === "penzija"}>
          Odlazak u penziju
        </button>
      </div>
      <NumberInput label="Prosečna mesečna zarada (osnovica)" sublabel="(prosek zarade zaposlenog; podrazumevano prosečna u RS)" value={prosek} onChange={setProsek} step={1000} />
      {razlog === "visak" && (
        <NumberInput label="Godine staža kod poslodavca" value={godine} onChange={setGodine} unit="god." min={0} step={1} />
      )}
      <div className="pausal-results results-body">
        {razlog === "visak" ? (
          <>
            <ResultRow label="Po godini staža (1/3 proseka)" value={prosek / 3} />
            <ResultRow label={`Otpremnina za ${godine} god. staža`} value={otpremnina} type="positive" />
          </>
        ) : (
          <>
            <ResultRow label="Dve prosečne zarade" value={prosek * 2} />
            <ResultRow label="Otpremnina (odlazak u penziju)" value={otpremnina} type="positive" />
          </>
        )}
      </div>
      <p className="pausal-note">Napomena: prikazani su zakonski minimumi (čl. 158 i čl. 119 Zakona o radu). Poslodavac kolektivnim ugovorom može utvrditi veći iznos. Deo otpremnine iznad neoporezivog praga podleže porezu. Izvor proseka: RZS.</p>
    </div>
  );
}

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
      <p>Paušalac plaća porez i doprinose na <strong>paušalno utvrđenu osnovicu</strong> koju određuje Poreska uprava (ne na stvarni prihod). Osnovica zavisi od šifre delatnosti, opštine i drugih koeficijenata. Na nju se primenjuju: porez 10%, PIO 24% i zdravstveno 10,3%. Detaljan vodič: <a href="/blog/koliko-pausalac-placa-mesecno">koliko paušalac plaća mesečno</a> i <a href="/blog/pausalno-oporezivanje">paušalno oporezivanje</a>.</p>
      <h2>Stope i limit za paušalce 2026</h2>
      <table className="ref-table" aria-label="Stope i limit za paušalce 2026">
        <thead><tr><th>Stavka</th><th>Stopa / iznos</th></tr></thead>
        <tbody>
          <tr><td>Porez na prihod</td><td>{PAUSAL_RATES.porez}%</td></tr>
          <tr><td>PIO (penzijsko)</td><td>{PAUSAL_RATES.pio}%</td></tr>
          <tr><td>Zdravstveno osiguranje</td><td>{PAUSAL_RATES.zdravstveno.toLocaleString("sr-RS")}%</td></tr>
          <tr><td>Godišnji limit prometa</td><td>{PAUSAL_RATES.limitGodisnji.toLocaleString("sr-RS")} RSD</td></tr>
        </tbody>
      </table>
      <h2>Primer obračuna paušala</h2>
      <table className="ref-table" aria-label="Primeri obračuna paušala 2026">
        <thead><tr><th>Osnovica (RSD)</th><th>Mesečne obaveze ≈ (RSD)</th><th>Efektivna stopa</th></tr></thead>
        <tbody>
          {[30000, 50000, 80000].map((o) => {
            const obaveze = o * (PAUSAL_RATES.porez + PAUSAL_RATES.pio + PAUSAL_RATES.zdravstveno) / 100;
            return (
              <tr key={o}>
                <td>{o.toLocaleString("sr-RS")}</td>
                <td>≈ {Math.round(obaveze).toLocaleString("sr-RS")}</td>
                <td>{(PAUSAL_RATES.porez + PAUSAL_RATES.pio + PAUSAL_RATES.zdravstveno).toLocaleString("sr-RS")}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="home-examples-note">Obaveze = osnovica × (porez {PAUSAL_RATES.porez}% + PIO {PAUSAL_RATES.pio}% + zdravstveno {PAUSAL_RATES.zdravstveno.toLocaleString("sr-RS")}%). Tačnu osnovicu utvrđuje rešenje Poreske uprave.</p></>),
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
    description: "Bruto u neto kalkulator za 2026 — pretvorite bruto zaradu u neto uz tačan obračun poreza i doprinosa. Preuzmite PDF platni listić i PPP-PD XML. Besplatno.",
    h1: "Bruto u neto kalkulator za Srbiju (2026)",
    breadcrumbName: "Bruto u neto",
    calc: "full",
    intro: (<p>Ovaj <strong>bruto u neto kalkulator</strong> za 2026. pretvara bruto 1 zaradu u neto iznos na račun, uz tačan obračun poreza (10% iznad neoporezivih 34.221 RSD) i doprinosa zaposlenog (19,90%). Rezultat preuzimate kao PDF platni listić i PPP-PD XML. Za obrnuti smer koristite <a href="/neto-bruto">neto u bruto kalkulator</a>.</p>),
    guide: (<><h2>Kako se računa bruto u neto</h2>
      <p>Neto = Bruto 1 − doprinosi zaposlenog (19,90%) − porez (10% na deo iznad neoporezivog iznosa). Primer: za bruto 100.000 RSD doprinosi iznose 19.900 RSD, poreska osnovica je 65.779 RSD (100.000 − 34.221), porez 6.578 RSD, pa je neto ≈ 73.522 RSD. Detaljan vodič: <a href="/blog/bruto-neto-razlika">razlika između bruto i neto zarade</a> i <a href="/blog/neoporezivi-2025">neoporezivi iznos zarade</a>.</p>
      <h2>Bruto 1 vs Bruto 2 — koja je razlika</h2>
      <p><strong>Bruto 1</strong> je ugovorena zarada — osnovica na koju se obračunavaju porez i doprinosi zaposlenog. <strong>Bruto 2</strong> je Bruto 1 uvećan za doprinose na teret poslodavca (15,15%) i predstavlja stvaran trošak rada za poslodavca. Zaposleni „na ruke" prima neto, dok poslodavac plaća bruto 2.</p>
      <table className="ref-table" aria-label="Bruto 1 vs Bruto 2">
        <thead><tr><th>Pojam</th><th>Šta obuhvata</th></tr></thead>
        <tbody>
          <tr><td>Neto</td><td>Iznos koji zaposleni prima na račun</td></tr>
          <tr><td>Bruto 1</td><td>Neto + doprinosi zaposlenog (19,90%) + porez (10%)</td></tr>
          <tr><td>Bruto 2</td><td>Bruto 1 + doprinosi poslodavca (15,15%)</td></tr>
        </tbody>
      </table>
      <h2>Neoporezivi iznos i stope doprinosa za 2026</h2>
      <p>Doprinosi zaposlenog obračunavaju se na celu bruto 1 zaradu, a porez na zaradu (10%) samo na deo iznad neoporezivog iznosa od {DEFAULT_RATES.nonTaxable.toLocaleString("sr-RS")} RSD.</p>
      <table className="ref-table" aria-label="Stope doprinosa i poreza 2026">
        <thead><tr><th>Stavka</th><th>Stopa / iznos</th></tr></thead>
        <tbody>
          <tr><td>PIO (penzijsko) — zaposleni</td><td>{DEFAULT_RATES.pioPct_emp}%</td></tr>
          <tr><td>Zdravstvo — zaposleni</td><td>{DEFAULT_RATES.health_emp.toLocaleString("sr-RS")}%</td></tr>
          <tr><td>Nezaposlenost — zaposleni</td><td>{DEFAULT_RATES.unemp_emp.toLocaleString("sr-RS")}%</td></tr>
          <tr><td>Neoporezivi iznos</td><td>{DEFAULT_RATES.nonTaxable.toLocaleString("sr-RS")} RSD</td></tr>
          <tr><td>Porez na zaradu</td><td>{DEFAULT_RATES.taxRate}% (na deo iznad neoporezivog)</td></tr>
        </tbody>
      </table>
      <table className="ref-table" aria-label="Primeri obračuna bruto u neto 2026">
        <thead><tr><th>Bruto 1 (RSD)</th><th>Neto ≈ (RSD)</th><th>Ukupan trošak ≈ (RSD)</th></tr></thead>
        <tbody>
          <tr><td>80.000</td><td>≈ 59.500</td><td>≈ 92.120</td></tr>
          <tr><td>100.000</td><td>≈ 73.520</td><td>≈ 115.150</td></tr>
          <tr><td>150.000</td><td>≈ 108.570</td><td>≈ 172.725</td></tr>
          <tr><td>200.000</td><td>≈ 143.620</td><td>≈ 230.300</td></tr>
        </tbody>
      </table></>),
    faq: [
      { q: "Kako izračunati neto iz bruto u Srbiji?", a: "Neto = Bruto 1 − doprinosi zaposlenog (19,90%) − porez 10% na deo iznad neoporezivog iznosa (34.221 RSD za 2026). Kalkulator radi obračun u oba smera." },
      { q: "Koliki su doprinosi zaposlenog?", a: "19,90% — PIO 14%, zdravstvo 5,15%, nezaposlenost 0,75%." },
      { q: "Da li je obračun besplatan?", a: "Da, kalkulator je besplatan i ne zahteva registraciju. Rezultat preuzimate kao PDF i PPP-PD XML." },
    ],
    related: TOOL_RELATED,
  }} />;
}

const NETO_BRUTO_RELATED = [
  { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
  { href: "/pausal", label: "Paušal kalkulator" },
  { href: "/minuli-rad", label: "Kalkulator minulog rada" },
  { href: "/bolovanje", label: "Kalkulator bolovanja" },
];

export function BolovanjePage() {
  return <ToolPage cfg={{
    slug: "bolovanje",
    title: "Kalkulator bolovanja 2026 — naknada zarade | PlatniListić",
    description: "Obračun naknade za bolovanje do 30 dana (min. 65%) i od 31. dana (RFZO). Primeri i PDF platni listić. Besplatno, za Srbiju 2026.",
    h1: "Kalkulator bolovanja i naknade zarade (2026)",
    breadcrumbName: "Bolovanje",
    calc: "full",
    focusSection: "bolovanje",
    intro: (<p>Ovaj <strong>kalkulator bolovanja</strong> računa naknadu zarade za 2026: do 30 dana najmanje 65% osnovice (na teret poslodavca), a od 31. dana na teret RFZO. Unesite broj dana bolovanja u kalkulatoru ispod.</p>),
    guide: (<><h2>Kako se obračunava naknada za bolovanje</h2>
      <p>Za prvih 30 dana naknadu plaća poslodavac, najmanje 65% prosečne osnovice (100% za povredu na radu ili profesionalno oboljenje). Od 31. dana naknadu preuzima RFZO. Osnovica je prosek zarade za prethodnih 12 meseci. Detaljan vodič: <a href="/blog/kako-se-obracunava-bolovanje">kako se obračunava bolovanje</a>.</p>
      <h2>Bolovanje do 30 dana i preko 30 dana</h2>
      <table className="ref-table" aria-label="Naknada za bolovanje — do 30 dana i od 31. dana">
        <thead><tr><th>Period</th><th>Procenat naknade</th><th>Isplatilac</th></tr></thead>
        <tbody>
          <tr><td>Do 30 dana</td><td>min. 65% osnovice (100% za povredu na radu)</td><td>Poslodavac</td></tr>
          <tr><td>Od 31. dana</td><td>min. 65% osnovice</td><td>RFZO</td></tr>
        </tbody>
      </table>
      <h2>Primer obračuna bolovanja</h2>
      <p>Zaposleni sa prosečnom mesečnom bruto osnovicom od 100.000 RSD (≈ 4.762 RSD dnevno za 21 radni dan) provede 10 radnih dana na bolovanju uz naknadu od 65%. Naknada = 4.762 × 10 × 65% ≈ 30.952 RSD bruto za te dane, dok se za preostale odrađene dane isplaćuje puna zarada.</p></>),
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

const OTPREMNINA_RELATED = [
  { href: "/minuli-rad", label: "Kalkulator minulog rada" },
  { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
  { href: "/bolovanje", label: "Kalkulator bolovanja" },
  { href: "/godisnji-porez", label: "Godišnji porez kalkulator" },
];

export function OtpremninaPage() {
  return <ToolPage cfg={{
    slug: "otpremnina",
    title: "Kalkulator otpremnine 2026 — Srbija | PlatniListić",
    description: "Obračun otpremnine za tehnološki višak i odlazak u penziju, sa poreskim tretmanom, po Zakonu o radu. Besplatno, za Srbiju 2026.",
    h1: "Kalkulator otpremnine (2026)",
    breadcrumbName: "Otpremnina",
    calc: "otpremnina",
    intro: (<p>Ovaj <strong>kalkulator otpremnine</strong> računa pravo na otpremninu po Zakonu o radu: za tehnološki višak (min. 1/3 prosečne zarade po godini staža) i za odlazak u penziju (min. dve prosečne zarade). Unesite prosečnu zaradu i godine staža u kalkulatoru ispod.</p>),
    guide: (<><h2>Kako se obračunava otpremnina</h2>
      <p>Zaposlenom kome prestaje radni odnos zbog tehnološkog viška pripada otpremnina najmanje u visini jedne trećine (1/3) prosečne zarade po godini staža kod poslodavca (čl. 158 Zakona o radu). Za odlazak u penziju otpremnina iznosi najmanje dve prosečne zarade u RS. Poreski tretman: iznos otpremnine neoporeziv do propisanog iznosa — deo koji premašuje neoporezivi prag podleže porezu na dohodak. Detaljan vodič: <a href="/blog/otpremnina-obracun">obračun otpremnine</a>. Za odlazak u penziju pogledajte i vodič <a href="/blog/kako-se-obracunava-penzija">kako se obračunava penzija</a>.</p>
      <h2>Primer obračuna otpremnine</h2>
      <p>Primeri su zasnovani na prosečnoj neto zaradi u Srbiji od {REFERENCE_DATA.prosecnaZarada2026.neto.toLocaleString("sr-RS")} RSD ({REFERENCE_DATA.prosecnaZarada2026.mesec}, RZS). Za stvaran obračun koristi se prosek zarade samog zaposlenog.</p>
      <table className="ref-table" aria-label="Primeri obračuna otpremnine 2026">
        <thead><tr><th>Osnov</th><th>Formula</th><th>Otpremnina ≈ (RSD)</th></tr></thead>
        <tbody>
          {[5, 10, 20].map((g) => (
            <tr key={g}>
              <td>Tehnološki višak ({g} god.)</td>
              <td>1/3 proseka × {g}</td>
              <td>≈ {Math.round(REFERENCE_DATA.prosecnaZarada2026.neto / 3 * g).toLocaleString("sr-RS")}</td>
            </tr>
          ))}
          <tr>
            <td>Odlazak u penziju</td>
            <td>2 × prosečna zarada</td>
            <td>≈ {(REFERENCE_DATA.prosecnaZarada2026.neto * 2).toLocaleString("sr-RS")}</td>
          </tr>
        </tbody>
      </table></>),
    faq: [
      { q: "Kolika je minimalna otpremnina za tehnološki višak?", a: "Najmanje 1/3 prosečne zarade zaposlenog po godini staža kod tog poslodavca, u skladu sa čl. 158 Zakona o radu." },
      { q: "Da li je otpremnina oporeziva?", a: "Deo otpremnine do propisanog neoporezivog iznosa je oslobođen poreza. Iznos koji premašuje taj prag oporezuje se kao dohodak." },
      { q: "Koja je razlika između otpremnine za tehnološki višak i za odlazak u penziju?", a: "Za tehnološki višak minimum je 1/3 prosečne zarade po godini staža; za odlazak u penziju minimum iznosi dve prosečne zarade u Republici Srbiji." },
    ],
    related: OTPREMNINA_RELATED,
  }} />;
}

const MINULI_RAD_RELATED = [
  { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
  { href: "/otpremnina", label: "Kalkulator otpremnine" },
  { href: "/bolovanje", label: "Kalkulator bolovanja" },
  { href: "/dodaci-na-zaradu", label: "Dodaci na zaradu" },
];

export function MinuliRadPage() {
  return <ToolPage cfg={{
    slug: "minuli-rad",
    title: "Kalkulator minulog rada 2026 — 0,4% po godini | PlatniListić",
    description: "Izračunajte dodatak za minuli rad: min. 0,4% po godini staža kod istog poslodavca (čl. 108 ZOR). Primeri obračuna. Besplatno.",
    h1: "Kalkulator minulog rada (2026)",
    breadcrumbName: "Minuli rad",
    calc: "full",
    focusSection: "minuli-rad",
    intro: (<p>Ovaj <strong>kalkulator minulog rada</strong> izračunava dodatak na zaradu za 2026: zaposleni ima pravo na uvećanje od najmanje 0,4% po godini staža kod istog poslodavca (čl. 108 Zakona o radu). Unesite bruto zaradu i broj godina u kalkulatoru ispod.</p>),
    guide: (<><h2>Kako se obračunava minuli rad</h2>
      <p>Zakon o radu (čl. 108) propisuje uvećanu zaradu od najmanje 0,4% osnovice po svakoj navršenoj godini staža kod istog poslodavca. Primer: zaposleni sa bruto zaradom 100.000 RSD i 10 godina staža ostvaruje minuli rad od 100.000 × 0,4% × 10 = 4.000 RSD mesečno. Detaljan vodič: <a href="/blog/minuli-rad-obracun">obračun minulog rada</a>.</p>
      <h2>Primer obračuna minulog rada</h2>
      <p>Iznos minulog rada = bruto osnovica × 0,4% × godine staža kod istog poslodavca.</p>
      <table className="ref-table" aria-label="Primeri obračuna minulog rada 2026">
        <thead><tr><th>Bruto osnovica (RSD)</th><th>Godine staža</th><th>Minuli rad ≈ (RSD)</th></tr></thead>
        <tbody>
          {[[100000, 5], [100000, 10], [150000, 20]].map(([b, g]) => (
            <tr key={`${b}-${g}`}>
              <td>{b.toLocaleString("sr-RS")}</td>
              <td>{g}</td>
              <td>≈ {Math.round(b * 0.004 * g).toLocaleString("sr-RS")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Kako se minuli rad prikazuje na platnom listiću</h2>
      <p>Minuli rad nije poseban dodatak van zarade — on je sastavni deo <strong>bruto 1</strong> zarade. Na platnom listiću se iskazuje kao zasebna stavka uvećanja na osnovnu zaradu, u sekciji formiranja bruto 1, pa zajedno sa osnovnom zaradom ulazi u osnovicu za porez i doprinose. U <a href="/bruto-neto">bruto u neto kalkulatoru</a> unosite godine staža, a iznos minulog rada se automatski uračunava u bruto 1.</p></>),
    faq: [
      { q: "Koliki je procenat minulog rada?", a: "Zakonski minimum je 0,4% po svakoj navršenoj godini staža kod istog poslodavca. Poslodavac može kolektivnim ugovorom utvrditi viši procenat." },
      { q: "Da li se minuli rad računa na ukupni radni staž?", a: "Ne — minuli rad se obračunava isključivo na osnovu godina staža kod trenutnog (istog) poslodavca, a ne ukupnog radnog staža." },
      { q: "Kako se minuli rad prikazuje na platnom listiću?", a: "Minuli rad je sastavni deo bruto 1 zarade i posebno se iskazuje kao uvećanje na osnovnu zaradu, vidljivo na platnom listiću u sekciji formiranja bruto 1." },
    ],
    related: MINULI_RAD_RELATED,
  }} />;
}

export function NetoBrutoPage() {
  return <ToolPage cfg={{
    slug: "neto-bruto",
    title: "Neto u bruto kalkulator 2026 — Srbija | PlatniListić",
    description: "Neto u bruto kalkulator za 2026 — iz željene neto zarade izračunajte bruto 1 i ukupan trošak poslodavca. Tačan obračun, PDF i PPP-PD XML. Besplatno.",
    h1: "Neto u bruto kalkulator za Srbiju (2026)",
    breadcrumbName: "Neto u bruto",
    calc: "full",
    intro: (<p>Ovaj <strong>neto u bruto kalkulator</strong> za 2026. iz željene neto zarade rekonstruiše bruto 1 iznos i ukupan trošak poslodavca, uz tačan obračun poreza (10% iznad neoporezivih 34.221 RSD) i doprinosa (19,90%). Unesite željeni neto, a kalkulator automatski pronalazi odgovarajući bruto 1. Rezultat preuzimate kao PDF platni listić i PPP-PD XML.</p>),
    guide: (<><h2>Kako se računa neto u bruto</h2>
      <p>Obrnuti obračun — iz željenog neto iznosa kalkulator iterativno pronalazi bruto 1 tako da posle oduzimanja doprinosa zaposlenog (19,90%) i poreza na zaradu (10% na deo iznad neoporezivog iznosa od 34.221 RSD) dobijete tačno taj neto. Primer: za željeni neto od 73.522 RSD bruto 1 iznosi 100.000 RSD. Ukupan trošak poslodavca (bruto 2) dobija se dodavanjem doprinosa poslodavca (15,15%) na bruto 1. Detaljan vodič: <a href="/blog/bruto-neto-razlika">razlika između bruto i neto zarade</a>.</p>
      <h2>Trošak poslodavca — doprinosi na teret poslodavca (15,15%)</h2>
      <p>Pored doprinosa koje plaća zaposleni (iz bruto 1), poslodavac na <em>svoj</em> teret plaća dodatne doprinose od {(DEFAULT_RATES.pio_er + DEFAULT_RATES.health_er).toLocaleString("sr-RS")}% na istu osnovicu (bruto 1). Zbir bruto 1 i doprinosa poslodavca čini bruto 2 — stvaran trošak rada.</p>
      <table className="ref-table" aria-label="Doprinosi na teret poslodavca 2026">
        <thead><tr><th>Doprinos poslodavca</th><th>Stopa</th></tr></thead>
        <tbody>
          <tr><td>PIO (penzijsko)</td><td>{DEFAULT_RATES.pio_er}%</td></tr>
          <tr><td>Zdravstvo</td><td>{DEFAULT_RATES.health_er.toLocaleString("sr-RS")}%</td></tr>
          <tr><td>Ukupno na teret poslodavca</td><td>{(DEFAULT_RATES.pio_er + DEFAULT_RATES.health_er).toLocaleString("sr-RS")}%</td></tr>
        </tbody>
      </table>
      <table className="ref-table" aria-label="Primeri obračuna neto u bruto 2026">
        <thead><tr><th>Neto (RSD)</th><th>Bruto 1 ≈ (RSD)</th><th>Ukupan trošak ≈ (RSD)</th></tr></thead>
        <tbody>
          <tr><td>59.500</td><td>≈ 80.000</td><td>≈ 92.120</td></tr>
          <tr><td>73.520</td><td>≈ 100.000</td><td>≈ 115.150</td></tr>
          <tr><td>108.570</td><td>≈ 150.000</td><td>≈ 172.725</td></tr>
          <tr><td>143.620</td><td>≈ 200.000</td><td>≈ 230.300</td></tr>
        </tbody>
      </table></>),
    faq: [
      { q: "Kako izračunati bruto iz neto zarade u Srbiji?", a: "Kalkulator iterativno pronalazi bruto 1 tako da posle doprinosa zaposlenog (19,90%) i poreza (10% na deo iznad 34.221 RSD) dobijete željeni neto iznos. Unesite ciljani neto u polje 'Unesite Neto' i kalkulator prikazuje odgovarajući bruto 1." },
      { q: "Koliki je ukupan trošak poslodavca za dati neto?", a: "Ukupan trošak = Bruto 1 + doprinosi poslodavca (15,15% — PIO 10% i zdravstvo 5,15%). Za neto 73.522 RSD, bruto 1 je 100.000 RSD, a ukupan trošak oko 115.150 RSD." },
      { q: "Da li je neto u bruto kalkulator besplatan?", a: "Da, kalkulator je besplatan i ne zahteva registraciju. Obračun radite u oba smera — bruto u neto i neto u bruto. Rezultat preuzimate kao PDF i PPP-PD XML." },
    ],
    related: NETO_BRUTO_RELATED,
  }} />;
}

const DODACI_RELATED = [
  { href: "/minuli-rad", label: "Kalkulator minulog rada" },
  { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
  { href: "/bolovanje", label: "Kalkulator bolovanja" },
  { href: "/otpremnina", label: "Kalkulator otpremnine" },
];

export function DodaciPage() {
  return <ToolPage cfg={{
    slug: "dodaci-na-zaradu",
    title: "Dodaci na zaradu 2026 — prekovremeni, noćni | PlatniListić",
    description: "Obračun dodataka na zaradu za 2026: prekovremeni rad, noćni rad, rad vikendom i praznikom, minuli rad. Uvećanja po Zakonu o radu. Besplatno.",
    h1: "Kalkulator dodataka na zaradu (2026)",
    breadcrumbName: "Dodaci na zaradu",
    calc: "full",
    intro: (<p>Ovaj kalkulator obračunava <strong>dodatke na zaradu</strong> za 2026. godinu — uvećanja za prekovremeni rad, noćni rad, rad vikendom i rad na državni praznik, kao i dodatak za minuli rad. Unesite sate rada i osnovu u kalkulator ispod za tačan obračun.</p>),
    guide: (<><h2>Kako se obračunavaju dodaci na zaradu</h2>
      <p>Zakon o radu (čl. 108) propisuje minimalna uvećanja: prekovremeni rad najmanje +26%, noćni rad (22h–06h) najmanje +26%, rad vikendom najmanje +26%, rad na državni praznik najmanje +110%, a minuli rad najmanje 0,4% po navršenoj godini staža kod istog poslodavca. Dodaci se obračunavaju na osnovu hourly stope i ulaze u bruto 1 zaradu — podležu porezu i doprinosima. Detaljan vodič: <a href="/blog/prekovremeni-rad">prekovremeni rad 2026</a>.</p></>),
    faq: [
      { q: "Koliko iznosi uvećanje za prekovremeni rad?", a: "Zakonski minimum je +26% po satu prekovremenog rada (čl. 108 Zakona o radu). Poslodavac može kolektivnim ugovorom utvrditi veće uvećanje." },
      { q: "Koliko se plaća rad na državni praznik?", a: "Uvećanje za rad na državni praznik iznosi najmanje +110% po satu rada na taj dan, u skladu sa čl. 108 Zakona o radu." },
      { q: "Da li se dodaci na zaradu međusobno sabiraju?", a: "Da — ako zaposleni radi prekovremeno u noćnoj smeni, oba uvećanja se primenjuju kumulativno. Kalkulator ispod sabira sve unete sate i uvećanja u jednom obračunu." },
    ],
    related: DODACI_RELATED,
  }} />;
}

const GODISNJI_POREZ_RELATED = [
  { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
  { href: "/pausal", label: "Paušal kalkulator" },
  { href: "/ugovor-o-delu", label: "Ugovor o delu kalkulator" },
  { href: "/prosecna-zarada", label: "Prosečna zarada u Srbiji" },
];

export function GodisnjiPorezPage() {
  return <ToolPage cfg={{
    slug: "godisnji-porez",
    title: "Godišnji porez na dohodak 2026 — kalkulator | PlatniListić",
    description: "Procena godišnjeg poreza na dohodak građana za 2026: neoporezivi cenzus, stope i ko je obavezan da podnese prijavu. Besplatno, za Srbiju.",
    h1: "Kalkulator godišnjeg poreza na dohodak (2026)",
    breadcrumbName: "Godišnji porez",
    calc: "full",
    intro: (<p>Ovaj kalkulator procenjuje <strong>godišnji porez na dohodak</strong> građana za 2026. godinu. Godišnji porez plaćaju fizička lica čiji godišnji prihod prelazi neoporezivi cenzus, uz primenu progresivnih stopa od 10% i 15%. Unesite podatke o prihodima u kalkulator ispod.</p>),
    guide: (<><h2>Kako se obračunava godišnji porez na dohodak</h2>
      <p>Godišnji porez na dohodak građana plaćaju lica čiji ukupni godišnji dohodak prelazi neoporezivi cenzus, koji iznosi tri prosečne godišnje zarade u Republici Srbiji. Na deo dohotka iznad jednog cenzusa primenjuje se stopa 10%, a na deo iznad dva cenzusa stopa 15%. Poreska prijava podnosi se Poreskoj upravi do 15. maja naredne kalendarske godine. Detaljnije o doprinosima i poreskom sistemu: <a href="/blog/doprinosi-srbija">doprinosi u Srbiji 2026</a>.</p></>),
    faq: [
      { q: "Ko je obavezan da plaća godišnji porez na dohodak?", a: "Fizička lica rezidenti čiji ukupni godišnji dohodak premašuje neoporezivi cenzus (tri prosečne godišnje zarade u RS). Ukoliko je porez po odbitku već plaćen, godišnji porez je razlika do konačne obaveze." },
      { q: "Kolike su stope godišnjeg poreza na dohodak?", a: "Na deo dohotka iznad neoporezivog cenzusa do visine dvostrukog cenzusa primenjuje se stopa 10%; na deo iznad dvostrukog cenzusa stopa je 15%." },
      { q: "Do kada se podnosi poreska prijava za godišnji porez?", a: "Poreska prijava za godišnji porez na dohodak građana podnosi se Poreskoj upravi do 15. maja naredne kalendarske godine (npr. za 2026. godinu — do 15. maja 2027)." },
    ],
    related: GODISNJI_POREZ_RELATED,
  }} />;
}

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

export function NeoporeziviPage() {
  const nonTaxable = DEFAULT_RATES.nonTaxable;
  return <ReferencePage cfg={{
    slug: "neoporezivi-iznos-2026",
    title: "Neoporezivi iznos zarade 2026 — 34.221 RSD | PlatniListić",
    description: "Neoporezivi iznos zarade za 2026. iznosi 34.221 RSD mesečno. Kako utiče na obračun poreza na zaradu i neto iznos. Za Srbiju.",
    h1: "Neoporezivi iznos zarade za 2026.",
    breadcrumbName: "Neoporezivi iznos 2026",
    body: (<>
      <p>Neoporezivi iznos zarade je deo mesečne bruto zarade koji je izuzet od poreza na zarade. Na preostali deo bruto zarade iznad ovog iznosa primenjuje se stopa poreza od 10%.</p>
      <table className="ref-table">
        <tbody>
          <tr><th>Neoporezivi iznos (2026)</th><td>{nonTaxable.toLocaleString("sr-RS")} RSD</td></tr>
        </tbody>
      </table>
      <p>Neoporezivi iznos se primenjuje mesečno, po zaposlenom. Znači da se porez na zaradu plaća samo na onaj deo bruto zarade koji prelazi {nonTaxable.toLocaleString("sr-RS")} RSD. Ovo direktno povećava neto iznos koji zaposleni prima na račun. Vidite kako neoporezivi iznos utiče na vaš obračun: <a href="/bruto-neto">bruto u neto kalkulator</a>. Saznajte više o razlici između bruto i neto zarade: <a href="/blog/bruto-neto-razlika">bruto neto razlika</a>.</p>
    </>),
    faq: [
      { q: "Koliki je neoporezivi iznos zarade u 2026?", a: `Neoporezivi iznos zarade za 2026. iznosi ${nonTaxable.toLocaleString("sr-RS")} RSD mesečno. Na deo zarade iznad ovog iznosa primenjuje se porez od 10%.` },
      { q: "Kako se primenjuje neoporezivi iznos?", a: "Neoporezivi iznos se oduzima od bruto 1 zarade, a porez od 10% plaća se samo na razliku. Na primer, za bruto zaradu od 100.000 RSD, poreska osnovica je 100.000 − " + nonTaxable.toLocaleString("sr-RS") + " = " + (100000 - nonTaxable).toLocaleString("sr-RS") + " RSD, a porez iznosi 10% od toga." },
      { q: "Da li se neoporezivi iznos odnosi na svaki mesec?", a: "Da, neoporezivi iznos se primenjuje mesečno, posebno za svakog zaposlenog. Ne kumulira se — svaki mesec se iznova oduzima od bruto zarade pre obračuna poreza." },
    ],
    related: [
      { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
      { href: "/stope-doprinosa-2026", label: "Stope doprinosa 2026" },
      { href: "/minimalna-zarada-2026", label: "Minimalna zarada 2026" },
    ],
    sourceNote: <>Izvor: Sl. glasnik RS.</>,
  }} />;
}

export function StopeDoprinosaPage() {
  const R = DEFAULT_RATES;
  const zaposleniUkupno = R.pioPct_emp + R.health_emp + R.unemp_emp;
  const poslodavacUkupno = R.pio_er + R.health_er;
  return <ReferencePage cfg={{
    slug: "stope-doprinosa-2026",
    title: "Stope doprinosa 2026 — PIO, zdravstvo | PlatniListić",
    description: "Stope doprinosa za 2026: PIO 14%+10%, zdravstveno 5,15%+5,15%, nezaposlenost 0,75%. Na teret zaposlenog i poslodavca. Za Srbiju.",
    h1: "Stope doprinosa za socijalno osiguranje 2026.",
    breadcrumbName: "Stope doprinosa 2026",
    body: (<>
      <p>Doprinosi za obavezno socijalno osiguranje u Srbiji za 2026. plaćaju se i na teret zaposlenog i na teret poslodavca. Obe strane plaćaju na istu osnovicu (bruto 1 zaradu).</p>
      <table className="ref-table">
        <thead>
          <tr><th>Doprinos</th><th>Na teret zaposlenog</th><th>Na teret poslodavca</th></tr>
        </thead>
        <tbody>
          <tr><td>PIO (penzijsko i invalidsko)</td><td>{R.pioPct_emp.toLocaleString("sr-RS")}%</td><td>{R.pio_er.toLocaleString("sr-RS")}%</td></tr>
          <tr><td>Zdravstveno osiguranje</td><td>{R.health_emp.toLocaleString("sr-RS")}%</td><td>{R.health_er.toLocaleString("sr-RS")}%</td></tr>
          <tr><td>Nezaposlenost</td><td>{R.unemp_emp.toLocaleString("sr-RS")}%</td><td>—</td></tr>
        </tbody>
        <tfoot>
          <tr><th>Ukupno</th><th>{zaposleniUkupno.toFixed(2).replace(".", ",")}%</th><th>{poslodavacUkupno.toFixed(2).replace(".", ",")}%</th></tr>
        </tfoot>
      </table>
      <p>Ukupni doprinosi zaposlenog iznose {zaposleniUkupno.toFixed(2).replace(".", ",")}%, a poslodavca {poslodavacUkupno.toFixed(2).replace(".", ",")}% na bruto zaradu. Detaljnu razradu doprinosa i poreza vidite u <a href="/bruto-neto">bruto u neto kalkulatoru</a>.</p>
    </>),
    faq: [
      { q: "Koliki su ukupni doprinosi na zaradu u 2026?", a: `Zaposleni plaća ${zaposleniUkupno.toFixed(2).replace(".", ",")}% (PIO ${R.pioPct_emp}%, zdravstveno ${R.health_emp}%, nezaposlenost ${R.unemp_emp}%). Poslodavac plaća ${poslodavacUkupno.toFixed(2).replace(".", ",")}% (PIO ${R.pio_er}%, zdravstveno ${R.health_er}%).` },
      { q: "Ko plaća doprinose za socijalno osiguranje?", a: "Doprinose plaćaju i zaposleni i poslodavac, svaki na svoj teret. Zaposlenom se doprinosi odbijaju od zarade (prikazuju se na platnom listiću), dok poslodavac svoju stopu plaća povrh bruto 1 zarade." },
      { q: "Na koju osnovicu se obračunavaju doprinosi?", a: "Doprinosi se obračunavaju na bruto 1 zaradu zaposlenog, uz propisane granice — najniža i najviša mesečna osnovica. Izvan tih granica doprinosi se obračunavaju na graničnu vrednost, ne na stvarnu zaradu." },
    ],
    related: [
      { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
      { href: "/neoporezivi-iznos-2026", label: "Neoporezivi iznos 2026" },
      { href: "/pausal", label: "Paušal kalkulator" },
    ],
    sourceNote: <>Izvor: CROSO / Sl. glasnik RS.</>,
  }} />;
}

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
          {m.cenaRadnogCasaNeto != null && (
            <tr><th>Cena radnog časa (neto)</th><td>{m.cenaRadnogCasaNeto.toLocaleString("sr-RS")} RSD</td></tr>
          )}
        </tbody>
      </table>
      <p>Minimalna zarada se obračunava po ceni radnog časa pomnoženoj fondom sati u mesecu, pa se mesečni iznos razlikuje po mesecima zbog različitog broja radnih dana. Pogledajte <a href="/radni-dani-2026">radne dane u 2026</a>. Za poređenje sa prethodnom godinom pogledajte vodič <a href="/blog/minimalna-zarada-2025">minimalna zarada 2025</a>.</p>
    </>),
    faq: [
      { q: "Kolika je minimalna zarada u Srbiji 2026?", a: `Minimalna neto zarada je ${m.netoMesecno.toLocaleString("sr-RS")} RSD, a bruto ${m.brutoMesecno.toLocaleString("sr-RS")} RSD, sa primenom od ${m.vaziOd}.` },
      { q: "Kako se obračunava minimalna zarada?", a: "Po ceni radnog časa × fond sati u mesecu, pa mesečni iznos varira zbog različitog broja radnih dana." },
      { q: "Ko ima pravo na minimalnu zaradu?", a: "Svi zaposleni u Srbiji imaju pravo na zaradu koja ne može biti niža od propisanog minimuma. Minimalna zarada se primenjuje i na zaposlene sa nepunim radnim vremenom, srazmerno satima rada." },
    ],
    related: [
      { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
      { href: "/radni-dani-2026", label: "Radni dani 2026" },
      { href: "/prosecna-zarada", label: "Prosečna zarada u Srbiji" },
    ],
    sourceNote: (<>Izvor: {m.izvor}.</>),
  }} />;
}

export function RadniDaniPage() {
  const dana = REFERENCE_DATA.radniDani2026;
  const ukupnoDana = dana.reduce((s, r) => s + r.radniDani, 0);
  const ukupnoSati = dana.reduce((s, r) => s + r.radniSati, 0);
  return <ReferencePage cfg={{
    slug: "radni-dani-2026",
    title: "Radni dani 2026 u Srbiji — po mesecima | PlatniListić",
    description: "Broj radnih dana i radnih sati po mesecima za 2026, sa praznicima i fondom sati. Korisno za obračun zarade i bolovanja.",
    h1: "Radni dani u 2026. godini (Srbija)",
    breadcrumbName: "Radni dani 2026",
    body: (<>
      <p>Tabela broja radnih dana i fonda radnih sati (8 sati po danu) po mesecima za 2026. godinu u Srbiji. Fond sati je osnova za obračun minimalne zarade i naknade bolovanja.</p>
      <table className="ref-table">
        <thead>
          <tr><th>Mesec</th><th>Radni dani</th><th>Fond sati</th></tr>
        </thead>
        <tbody>
          {dana.map((r) => (
            <tr key={r.mesec}>
              <td>{r.mesec}</td>
              <td>{r.radniDani}</td>
              <td>{r.radniSati}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr><th>Ukupno 2026.</th><th>{ukupnoDana}</th><th>{ukupnoSati}</th></tr>
        </tfoot>
      </table>
      <p>Napomena: tabela prikazuje standardne radne dane (ponedeljak–petak) umanjene za državne praznike. Proverite <a href="/praznici-2026">spisak praznika za 2026</a> za tačne datume neradnih dana.</p>
    </>),
    faq: [
      { q: "Koliko radnih dana ima u 2026. godini u Srbiji?", a: `Ukupno ${ukupnoDana} radnih dana u 2026, odnosno ${ukupnoSati} radnih sati (po 8 sati dnevno), ne računajući državne praznike.` },
      { q: "Zašto je broj radnih dana važan za obračun zarade?", a: "Fond sati u mesecu određuje iznos minimalne zarade i naknade za bolovanje — minimalna zarada = cena radnog časa × fond sati. Mesečni iznos stoga varira." },
      { q: "Kako se tretiraju državni praznici u obračunu zarade?", a: "Zaposleni koji ne rade na državni praznik imaju pravo na punu naknadu zarade (1 dan = 1 radni dan u obračunu). Ko radi na praznik prima uvećanje od najmanje 110% zarade za taj dan." },
    ],
    related: [
      { href: "/praznici-2026", label: "Praznici 2026" },
      { href: "/minimalna-zarada-2026", label: "Minimalna zarada 2026" },
      { href: "/bolovanje", label: "Kalkulator bolovanja" },
      { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
    ],
    // VERIFY (owner): confirm radniDani2026 counts against the official 2026 calendar before publishing.
    sourceNote: <>Izvor: Zakon o radu (Sl. glasnik RS) i Vlada RS — odluka o neradnim danima za 2026.</>,
  }} />;
}

export function PrazniciPage() {
  const praznici = REFERENCE_DATA.praznici2026;
  return <ReferencePage cfg={{
    slug: "praznici-2026",
    title: "Praznici 2026 u Srbiji — neradni dani | PlatniListić",
    description: "Spisak državnih i verskih praznika u Srbiji za 2026, neradni dani i pravila za rad na praznik (+min. 110% zarade).",
    h1: "Državni praznici i neradni dani 2026.",
    breadcrumbName: "Praznici 2026",
    body: (<>
      <p>Spisak državnih i verskih praznika u Srbiji za 2026. godinu. Svi navedeni datumi su neradni dani za zaposlene.</p>
      <table className="ref-table">
        <thead>
          <tr><th>Datum</th><th>Naziv praznika</th></tr>
        </thead>
        <tbody>
          {praznici.map((p) => (
            <tr key={p.datum}>
              <td>{p.datum}</td>
              <td>{p.naziv}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Zaposleni koji rade na državni praznik imaju pravo na uvećanu zaradu od najmanje 110% za svaki sat rada na taj dan, u skladu sa čl. 108 Zakona o radu. Pogledajte <a href="/radni-dani-2026">fond radnih dana i sati po mesecima za 2026</a>.</p>
    </>),
    faq: [
      { q: "Koliko državnih praznika ima u Srbiji u 2026. godini?", a: `U 2026. godini u Srbiji ima ${praznici.length} državnih i verskih praznika koji su neradni dani.` },
      { q: "Koliko se plaća rad na državni praznik?", a: "Zaposleni koji radi na državni praznik prima uvećanje zarade od najmanje 110% za svaki sat rada, prema čl. 108 Zakona o radu. Poslodavac može kolektivnim ugovorom utvrditi veće uvećanje." },
      { q: "Šta ako praznik pada vikendom?", a: "Ako praznik pada u subotu ili nedeljom, zaposleni koji inače ne radi tim danima ne ostvaruju pravo na slobodan dan umesto praznika, osim ako je to predviđeno kolektivnim ugovorom ili ugovorom o radu." },
    ],
    related: [
      { href: "/radni-dani-2026", label: "Radni dani 2026" },
      { href: "/minimalna-zarada-2026", label: "Minimalna zarada 2026" },
      { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
      { href: "/bolovanje", label: "Kalkulator bolovanja" },
    ],
    // VERIFY (owner): confirm praznici2026 dates against the official Vlada RS decision on neradni dani before publishing.
    sourceNote: <>Izvor: Zakon o državnim i drugim praznicima u Republici Srbiji (Sl. glasnik RS) i Vlada RS.</>,
  }} />;
}
