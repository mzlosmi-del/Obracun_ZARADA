import { useSeo } from "./seo.jsx";
import { CalculatorPage } from "./App.jsx";
import { breadcrumbLd, webAppLd } from "./schema.js";
import { useState } from "react";
import { Breadcrumb, FreshnessStamp, PovezaniKalkulatori, NumberInput, ResultRow, fmt } from "./ui.jsx";
import { REFERENCE_DATA, PAUSAL_RATES, DEFAULT_RATES } from "./rates.js";

const FRESHNESS = "avgust 2026.";
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
        : cfg.calc === "godisnji-odmor" ? <GodisnjiOdmorCalculator />
        : cfg.calc === "jubilarna" ? <JubilarnaCalculator />
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
  const nezaposlenost = prihod * PAUSAL_RATES.nezaposlenost / 100;
  const ukupno = porez + pio + zdravstveno + nezaposlenost;
  const neto = prihod - ukupno;
  const efektivna = prihod > 0 ? (ukupno / prihod) * 100 : 0;
  return (
    <div className="pausal-calc">
      <NumberInput label="Mesečna paušalna osnovica (iz rešenja PU)" value={prihod} onChange={setPrihod} step={1000} />
      <div className="pausal-results results-body">
        <ResultRow label={`Porez (${PAUSAL_RATES.porez}%)`} value={porez} />
        <ResultRow label={`PIO (${PAUSAL_RATES.pio}%)`} value={pio} />
        <ResultRow label={`Zdravstveno (${PAUSAL_RATES.zdravstveno}%)`} value={zdravstveno} />
        <ResultRow label={`Nezaposlenost (${PAUSAL_RATES.nezaposlenost.toLocaleString("sr-RS")}%)`} value={nezaposlenost} />
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

// Jubilarna nagrada — poreski tretman (ZPDG čl. 18 st. 1 tač. 9): neoporezivo do FIKSNOG
// usklađenog iznosa GODIŠNJE (28.912 RSD za isplate 1.2.2026–31.1.2027, Sl. glasnik RS 6/2026
// — REFERENCE_DATA.neoporeziviOstali2026.jubilarnaNagrada). Iznad toga plaća se SAMO porez
// na zarade 10%, BEZ doprinosa — jubilarna nagrada nema karakter zarade (čl. 105 st. 3 u vezi
// sa čl. 120 tač. 1 Zakona o radu). VERIFIKOVANO 13.7.2026 (Paragraf — Pregled usklađenih
// neoporezivih iznosa). NAPOMENA: ranija verzija kalkulatora pogrešno je koristila
// koeficijent × prosečna zarada kao PORESKI limit — to je skala visine ISPLATE iz kolektivnih
// ugovora (javni sektor), ne poreska granica.
// Koeficijenti visine isplate (uobičajeno u praksi/PKU): 10 god. 1×, 20 god. 2×, 30 god. 2,5×, 40 god. 3×.
const JUBILEJI = [
  { god: 10, koef: 1 },
  { god: 20, koef: 2 },
  { god: 30, koef: 2.5 },
  { god: 40, koef: 3 },
];
export function JubilarnaCalculator() {
  const prosBruto = REFERENCE_DATA.prosecnaZarada2026.bruto;
  const neoporezivo = REFERENCE_DATA.neoporeziviOstali2026.jubilarnaNagrada;
  const [god, setGod] = useState(20);
  const [isplata, setIsplata] = useState(0);
  const koef = (JUBILEJI.find((j) => j.god === god) || JUBILEJI[1]).koef;
  const uobicajenaIsplata = Math.round(prosBruto * koef);
  const osnovica = isplata || uobicajenaIsplata;
  const oporezivi = Math.max(osnovica - neoporezivo, 0);
  const porez = oporezivi * DEFAULT_RATES.taxRate / 100;
  const neto = osnovica - porez;
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
        <ResultRow label={`Uobičajena visina nagrade (${koef.toLocaleString("sr-RS")}× prosečna bruto zarada)`} value={uobicajenaIsplata} />
        <ResultRow label="Neoporezivo (ZPDG čl. 18 tač. 9, godišnje)" value={neoporezivo} type="positive" />
      </div>
      <NumberInput label="Iznos koji poslodavac isplaćuje (opciono)" sublabel="(ako se ne unese, računa se uobičajena visina za izabrani jubilej)" value={isplata} onChange={setIsplata} step={10000} />
      <div className="pausal-results results-body">
        <ResultRow label="Oporezivi deo (iznad neoporezivog)" value={oporezivi} />
        <ResultRow label={`Porez na zarade (${DEFAULT_RATES.taxRate}%) — bez doprinosa`} value={porez} type="negative" />
        <ResultRow label="Neto na račun" value={neto} type="positive" />
      </div>
      <p className="pausal-note">Neoporezivi iznos jubilarne nagrade je fiksan: {neoporezivo.toLocaleString("sr-RS")} RSD godišnje za isplate od 1.2.2026. do 31.1.2027. („Sl. glasnik RS" 6/2026, ZPDG čl. 18 tač. 9). Na deo iznad plaća se samo porez na zarade 10% — doprinosi se ne plaćaju, jer jubilarna nagrada nema karakter zarade (čl. 105 st. 3 Zakona o radu). Visina nagrade (npr. 1–3 prosečne zarade) stvar je kolektivnog ugovora ili ugovora o radu, a koeficijenti u kalkulatoru odražavaju uobičajenu praksu. Prosek: {prosBruto.toLocaleString("sr-RS")} RSD bruto ({REFERENCE_DATA.prosecnaZarada2026.mesec}, RZS).</p>
    </div>
  );
}

// Godišnji odmor — naknada zarade (čl. 104) i naknada za neiskorišćeni odmor (čl. 76 ZOR).
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
      <p className="pausal-note">Napomena: osnovica je prosečna zarada zaposlenog u prethodnih 12 meseci (čl. 104 Zakona o radu), ne prosek u RS — podrazumevana vrednost je informativna. Naknada je bruto i podleže porezu i doprinosima kao zarada. Naknada za neiskorišćeni odmor isplaćuje se pri prestanku radnog odnosa (čl. 76). Izvor proseka: RZS.</p>
    </div>
  );
}

export function PausalPage() {
  return <ToolPage cfg={{
    slug: "pausal",
    title: "Paušal kalkulator 2026 — porez i doprinosi | PlatniListić",
    description: "Paušalac plaća okvirno 30.000–45.000 RSD mesečno (porez 10% + PIO 24% + zdravstveno 10,3% + nezaposlenost 0,75% na osnovicu). Izračunajte tačan iznos za 2026.",
    h1: "Paušal kalkulator za preduzetnike (2026)",
    breadcrumbName: "Paušal",
    calc: "pausal",
    intro: (<p>Ovaj <strong>paušal kalkulator</strong> računa mesečne obaveze paušalca u 2026: porez na prihod (10%) i doprinose (PIO 24%, zdravstveno 10,3%, nezaposlenost 0,75%) na paušalnu osnovicu iz rešenja Poreske uprave.</p>),
    guide: (<><h2>Kako se obračunava paušal</h2>
      <p>Paušalac plaća porez i doprinose na <strong>paušalno utvrđenu osnovicu</strong> koju određuje Poreska uprava (ne na stvarni prihod). Osnovica zavisi od šifre delatnosti, opštine i drugih koeficijenata. Na nju se primenjuju: porez 10%, PIO 24%, zdravstveno 10,3% i doprinos za nezaposlenost 0,75% (ZDOSO čl. 44 i čl. 9). Pažnja: pojedini kalkulatori i dalje prikazuju zastarelu stopu PIO od 25,5% — važeća stopa je 24% (od 2023). Detaljan vodič: <a href="/blog/koliko-pausalac-placa-mesecno">koliko paušalac plaća mesečno</a> i <a href="/blog/pausalno-oporezivanje">paušalno oporezivanje</a>.</p>
      <h2>Stope i limit za paušalce 2026</h2>
      <table className="ref-table" aria-label="Stope i limit za paušalce 2026">
        <thead><tr><th>Stavka</th><th>Stopa / iznos</th></tr></thead>
        <tbody>
          <tr><td>Porez na prihod</td><td>{PAUSAL_RATES.porez}%</td></tr>
          <tr><td>PIO (penzijsko)</td><td>{PAUSAL_RATES.pio}%</td></tr>
          <tr><td>Zdravstveno osiguranje</td><td>{PAUSAL_RATES.zdravstveno.toLocaleString("sr-RS")}%</td></tr>
          <tr><td>Osiguranje za slučaj nezaposlenosti</td><td>{PAUSAL_RATES.nezaposlenost.toLocaleString("sr-RS")}%</td></tr>
          <tr><td>Godišnji limit prometa</td><td>{PAUSAL_RATES.limitGodisnji.toLocaleString("sr-RS")} RSD</td></tr>
        </tbody>
      </table>
      <h2>Primer obračuna paušala</h2>
      <table className="ref-table" aria-label="Primeri obračuna paušala 2026">
        <thead><tr><th>Osnovica (RSD)</th><th>Mesečne obaveze ≈ (RSD)</th><th>Efektivna stopa</th></tr></thead>
        <tbody>
          {[30000, 50000, 80000].map((o) => {
            const stopaUkupno = PAUSAL_RATES.porez + PAUSAL_RATES.pio + PAUSAL_RATES.zdravstveno + PAUSAL_RATES.nezaposlenost;
            const obaveze = o * stopaUkupno / 100;
            return (
              <tr key={o}>
                <td>{o.toLocaleString("sr-RS")}</td>
                <td>≈ {Math.round(obaveze).toLocaleString("sr-RS")}</td>
                <td>{stopaUkupno.toLocaleString("sr-RS")}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="home-examples-note">Obaveze = osnovica × (porez {PAUSAL_RATES.porez}% + PIO {PAUSAL_RATES.pio}% + zdravstveno {PAUSAL_RATES.zdravstveno.toLocaleString("sr-RS")}% + nezaposlenost {PAUSAL_RATES.nezaposlenost.toLocaleString("sr-RS")}%). Tačnu osnovicu utvrđuje rešenje Poreske uprave.</p>
      <h2>Kako Poreska uprava utvrđuje paušalnu osnovicu</h2>
      <p>Paušalna osnovica nije prosta procena — utvrđuje se rešenjem nadležne organizacione jedinice Poreske uprave, na osnovu šifre pretežne delatnosti, mesta obavljanja delatnosti (opština i zona), poslovnog prostora, broja zaposlenih i drugih elemenata koje propisuje uredba Vlade o bližim uslovima za paušalno oporezivanje. Zato dva preduzetnika sa istim mesečnim prihodom, ali različitom delatnošću ili opštinom, mogu imati različitu osnovicu i različitu mesečnu obavezu. Rešenje se donosi za kalendarsku godinu i preduzetnik ga prima pre početka obavljanja delatnosti (za novoosnovane) ili po zahtevu za ulazak u paušalni sistem.</p>
      <p>Ako se preduzetnik ne slaže sa utvrđenom osnovicom, na rešenje može uložiti <strong>žalbu u roku od 15 dana od dana dostavljanja rešenja</strong> — to je opšti rok za žalbu na poreski upravni akt prema Zakonu o poreskom postupku i poreskoj administraciji. Žalba po pravilu ne odlaže izvršenje rešenja, pa se do okončanja postupka mesečne akontacije plaćaju u iznosu iz rešenja. Rok teče od uručenja; ako uručenje nije bilo moguće, poreski akt se smatra dostavljenim petnaestog dana od dana predaje pošti. Ceo postupak od prijave do prvog rešenja opisan je u vodiču o <a href="/blog/registracija-pausalca">registraciji paušalca</a>.</p>
      <h2>IT paušalci — šifre delatnosti 6201 i 6202</h2>
      <p>Za većinu delatnosti polazna osnovica zavisi od opštine, pa isti posao u Beogradu i u manjoj opštini nosi različitu mesečnu obavezu. Za dve IT šifre to <strong>ne važi</strong>: <strong>6201 — računarsko programiranje</strong> i <strong>6202 — konsultantske delatnosti u oblasti informacione tehnologije</strong> spadaju u delatnosti kod kojih se polazna osnovica utvrđuje <strong>na nivou Republike</strong>, prema prosečnoj zaradi u Republici Srbiji, a ne prema prosečnoj zaradi u opštini registracije.</p>
      <p>Praktična posledica: programer paušalac sa šifrom 6201 ima <strong>istu polaznu osnovicu bez obzira na to da li je registrovan u Beogradu, Novom Sadu, Nišu ili bilo kojoj drugoj opštini</strong>. Preseljenje radnje u „jeftiniju" opštinu kod ovih šifara ne smanjuje paušalni porez — što je čest izvor zabune pri prelasku sa frilensiranja na paušal. Na konačan iznos i dalje utiču ostali elementi iz uredbe, pa se mesečne obaveze dva IT paušalca mogu razlikovati i pri istoj polaznoj osnovici. Kada se prelazak uopšte isplati, poredimo u vodiču <a href="/blog/frilenser-pausalac-firma">frilenser, paušalac ili firma</a>, a koeficijente svih čestih šifri i pun spisak od 15 delatnosti sa republičkom osnovicom u vodiču <a href="/blog/sifre-delatnosti-pausal">šifre delatnosti za paušalce</a>.</p>
      <h2>Ograničenje rasta osnovice od 10% — produženo do kraja 2027</h2>
      <p>Paušalna osnovica se usklađuje svake godine, ali njen rast je ograničen: osnovica utvrđena za narednu godinu <strong>ne može biti veća za više od 10%</strong> u odnosu na osnovicu utvrđenu za prethodnu godinu. Uredbom o izmenama uredbe o bližim uslovima, kriterijumima i elementima za paušalno oporezivanje („Sl. glasnik RS" br. 115/2025) primena tog ograničenja <strong>produžena je do kraja 2027. godine</strong>, čime je obuhvaćeno usklađivanje osnovice i za 2026. i za 2027.</p>
      <p>Ograničenje ima izuzetke. Kapica od 10% <strong>se ne primenjuje</strong> kada preduzetnik promeni šifru delatnosti, opštinu ili mesto registracije — s tim što se promena opštine <em>unutar istog grada</em> ne smatra takvom promenom, pa ograničenje tada ostaje na snazi. Zato promena pretežne delatnosti može povući skok osnovice veći od 10% već naredne godine, što treba uračunati pre nego što se šifra menja.</p>
      <h2>Najčešća greška: zastarele stope u tuđim obračunima</h2>
      <p>Veliki broj kalkulatora i tekstova i dalje računa paušal sa <strong>PIO stopom od 25,5%</strong> i prikazuje ukupno opterećenje od 46,55%. Ta stopa više ne važi — snižena je na <strong>{PAUSAL_RATES.pio}%</strong> (ZDOSO čl. 44), pa obračun sa starom stopom <strong>precenjuje</strong> mesečnu obavezu za 1,5% osnovice. Na osnovicu od 50.000 RSD to je oko 750 RSD mesečno, odnosno oko 9.000 RSD godišnje.</p>
      <p>Suprotna greška je izostavljanje <strong>doprinosa za nezaposlenost od {PAUSAL_RATES.nezaposlenost.toLocaleString("sr-RS")}%</strong>: preduzetnici jesu obveznici tog doprinosa (ZDOSO čl. 9 tač. 6), pa ukupno opterećenje nije 44,3% nego <strong>45,05%</strong>. Tačan zbir za 2026. je porez {PAUSAL_RATES.porez}% + PIO {PAUSAL_RATES.pio}% + zdravstveno {PAUSAL_RATES.zdravstveno.toLocaleString("sr-RS")}% + nezaposlenost {PAUSAL_RATES.nezaposlenost.toLocaleString("sr-RS")}% = <strong>45,05%</strong> paušalne osnovice — stopa po kojoj računa i kalkulator na ovoj strani. Detaljna razrada: <a href="/blog/koliko-pausalac-placa-mesecno">koliko paušalac plaća mesečno</a>.</p>
      <h2>Zvanični državni kalkulator</h2>
      <p>Ministarstvo privrede kroz Mali biznis informator održava zvanični kalkulator paušalnog poreza na adresi <a href="https://informator.preduzetnistvo.gov.rs/kalkulator" target="_blank" rel="noopener noreferrer">informator.preduzetnistvo.gov.rs/kalkulator</a>. Preporučujemo da rezultat uporedite sa državnim obračunom — cifre treba da se poklope, jer se oslanjaju na iste zakonske stope. Merodavan je u svakom slučaju iznos iz rešenja Poreske uprave. Da li vam se paušal uopšte isplati u odnosu na privredno društvo, poredimo u vodiču <a href="/blog/pausal-ili-doo">paušal ili DOO</a>.</p>
      <h2>Kada se paušalcu isplati prelazak na knjige</h2>
      <p>Paušalno oporezivanje najviše odgovara delatnostima sa niskim stvarnim troškovima poslovanja (IT usluge, konsalting, zanatske i intelektualne usluge), jer se porez i doprinosi plaćaju na osnovicu koju utvrđuje Poreska uprava, a ne na stvarno ostvarenu dobit. Ako preduzetnik ima visoke priznate troškove (nabavka opreme, zakup, materijal), vođenje poslovnih knjiga sa oporezivanjem stvarnog prihoda umanjenog za troškove može biti povoljnije. Prelazak na knjige razmatra se i kada prihod preduzetnika trajno prevazilazi iznos na kom je paušalna osnovica realno postavljena, jer u tom slučaju paušalac efektivno plaća manju stopu od stvarno ostvarenog prihoda — što Poreska uprava po pravilu koriguje kroz reviziju osnovice ili prelazak u obavezni sistem knjigovodstva.</p>
      <h2>Ko može biti paušalac</h2>
      <p>Tri uslova moraju biti ispunjena istovremeno: (1) godišnji promet ne prelazi <strong>{PAUSAL_RATES.limitGodisnji.toLocaleString("sr-RS")} RSD</strong>; (2) preduzetnik nije obveznik PDV; i (3) pretežna delatnost nije među onima koje su propisima isključene iz paušalnog režima. Isključene su, ukratko, delatnosti u kojima se po prirodi posla mora voditi šira evidencija ili u kojima je promet teško paušalno proceniti — trgovina na veliko i malo (osim izričito dozvoljenih izuzetaka), ugostiteljstvo sa točenjem pića, delatnosti iz oblasti reklamiranja i istraživanja tržišta, kao i delatnosti u kojima preduzetnik posluje sa ortacima ili ima registrovan ulog drugog lica. Za većinu uslužnih, zanatskih i IT delatnosti paušal je dostupan.</p>
      <p>Pravo na paušalno oporezivanje po pravilu ostvaruju preduzetnici čija delatnost nije izričito isključena propisima (na primer određene regulisane profesije i delatnosti koje zahtevaju vođenje posebne evidencije), čiji godišnji promet ne prelazi zakonski limit i koji nisu obveznici PDV po osnovu obima prometa. Preduzetnik može ući u paušalni sistem prilikom osnivanja radnje (podnošenjem zahteva uz registracionu prijavu Agenciji za privredne registre) ili naknadno, prelaskom sa vođenja poslovnih knjiga, pod uslovima koje propisuje Zakon o porezu na dohodak građana i prateća uredba. Status paušalca preduzetnik gubi ako tokom godine promet pređe {PAUSAL_RATES.limitGodisnji.toLocaleString("sr-RS")} RSD ili ako naknadno postane obveznik PDV — u tom slučaju prelazak na knjige je obavezan od naredne godine, a u pojedinim slučajevima i tokom tekuće godine.</p>
      <h2>Česte greške u obračunu paušala</h2>
      <ul>
        <li>Korišćenje zastarele stope PIO doprinosa od 25,5% — od 1.1.2023. važeća stopa je {PAUSAL_RATES.pio}% (ZDOSO čl. 44), pa obračuni sa starom stopom precenjuju mesečnu obavezu.</li>
        <li>Poistovećivanje paušalne osnovice sa stvarnim mesečnim prihodom — obaveze se računaju na osnovicu iz rešenja Poreske uprave, ne na fakturisani iznos, pa promena prihoda tokom godine sama po sebi ne menja mesečnu uplatu dok se rešenje ne izmeni.</li>
        <li>Zaboravljanje doprinosa za nezaposlenost (0,75%) — preduzetnici su obveznici ovog doprinosa (ZDOSO čl. 9 tač. 6), pa ukupna stopa nije samo porez + PIO + zdravstveno već i taj dodatni deo.</li>
        <li>Ignorisanje godišnjeg limita prometa od {PAUSAL_RATES.limitGodisnji.toLocaleString("sr-RS")} RSD — prekoračenje povlači obavezan prelazak na poslovne knjige: od 1. jula ako je limit probijen u prvoj polovini godine, odnosno od 1. januara naredne godine (ZPDG čl. 42). Detaljno u vodiču <a href="/blog/limit-za-pausalce">limit za paušalce</a>.</li>
      </ul>
      <h2>Pravni okvir za paušalno oporezivanje</h2>
      <p>Doprinose paušalno oporezovanih preduzetnika uređuje Zakon o doprinosima za obavezno socijalno osiguranje (ZDOSO) — čl. 44 propisuje stope za PIO, zdravstveno osiguranje i osiguranje za slučaj nezaposlenosti, dok čl. 9 tač. 6 utvrđuje da su preduzetnici obveznici doprinosa za nezaposlenost. Porez na prihod od samostalne delatnosti uređuje Zakon o porezu na dohodak građana. Visinu paušalne osnovice, uslove za paušalno oporezivanje i godišnji limit prometa bliže propisuje Vlada uredbom, a rešenja o osnovici donosi Poreska uprava.</p>
      <p>Budući da su paušalna osnovica, koeficijenti po delatnosti i granični iznosi predmet povremenih izmena propisa, preduzetnici koji planiraju prelazak u paušalni sistem ili promenu delatnosti treba da proveravaju važeće rešenje i uredbu pre nego što se osloni na okvirne iznose iz ranijih godina. Mesečna obaveza prikazana u kalkulatoru iznad je informativan obračun po važećim stopama za 2026 — konačan iznos i rok uplate uvek određuje rešenje nadležne Poreske uprave.</p></>),
    faq: [
      { q: "Koliko paušalac plaća mesečno u 2026?", a: "Najčešće okvirno 30.000–45.000 RSD, u zavisnosti od šifre delatnosti i opštine. Tačan iznos je u rešenju Poreske uprave." },
      { q: "Šta čini mesečnu obavezu paušalca?", a: "Porez 10% i doprinosi — PIO 24%, zdravstveno 10,3% i nezaposlenost 0,75% — na paušalnu osnovicu. Ukupno 45,05%." },
      { q: "Koji je limit za paušal?", a: "Paušalni status važi dok godišnji promet ne pređe 6.000.000 RSD." },
      { q: "Da li je stopa PIO za paušalce 24% ili 25,5%?", a: "Važeća stopa od 1.1.2023. je 24% (ZDOSO čl. 44). Stopa od 25,5% je zastarela i više se ne primenjuje — ako obračun ili tekst i dalje navodi 25,5%, koristi neažurne podatke." },
      { q: "Ko utvrđuje paušalnu osnovicu i može li se osporiti?", a: "Osnovicu rešenjem utvrđuje nadležna organizaciona jedinica Poreske uprave, prema šifri delatnosti, opštini i drugim elementima. Na rešenje se može uložiti žalba u roku od 15 dana od dostavljanja, prema Zakonu o poreskom postupku i poreskoj administraciji. Žalba po pravilu ne odlaže izvršenje rešenja." },
      { q: "Da li IT paušalci sa šifrom 6201 i 6202 plaćaju isto u svim opštinama?", a: "Da, polazna osnovica za šifre 6201 (računarsko programiranje) i 6202 (IT konsalting) utvrđuje se na nivou Republike, prema prosečnoj zaradi u Srbiji, a ne po opštini. Registracija u „jeftinijoj“ opštini kod ovih šifara ne smanjuje paušalni porez, iako na konačan iznos utiču i drugi elementi iz uredbe." },
      { q: "Koliko najviše može da poraste paušalna osnovica u jednoj godini?", a: "Najviše 10% u odnosu na osnovicu iz prethodne godine. Uredbom objavljenom u „Sl. glasniku RS“ br. 115/2025 to ograničenje je produženo do kraja 2027. Kapica se ne primenjuje ako preduzetnik promeni šifru delatnosti, opštinu ili mesto registracije — osim kod promene opštine unutar istog grada." },
      { q: "Koje delatnosti ne mogu biti paušalno oporezovane?", a: "Paušal nije dostupan obveznicima PDV, preduzetnicima sa prometom preko 6.000.000 RSD godišnje, kao ni u delatnostima koje su propisima isključene — pre svega trgovina na veliko i malo, ugostiteljstvo sa točenjem pića i delatnosti reklamiranja i istraživanja tržišta. Za većinu uslužnih, zanatskih i IT delatnosti paušal je dostupan." },
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
      <p>Neto = Bruto 1 − doprinosi zaposlenog (19,90%) − porez (10% na deo iznad neoporezivog iznosa). Primer: za bruto 100.000 RSD doprinosi iznose 19.900 RSD, poreska osnovica je 65.779 RSD (100.000 − 34.221), porez 6.578 RSD, pa je neto ≈ 73.522 RSD. Više o neoporezivom delu: <a href="/neoporezivi-iznos-2026">neoporezivi iznos zarade</a>, a pun pregled stopa: <a href="/stope-doprinosa-2026">stope doprinosa 2026</a>. Koliko ta neto plata realno vredi kroz vreme pokazuje naša analiza <a href="/blog/kupovna-moc-plate-2016-2026">kupovne moći plate 2016–2026</a>.</p>
      <h2>Šta sve ulazi u bruto 1</h2>
      <p>Bruto 1 nije samo osnovna zarada — u nju ulaze i svi dodaci na koje se plaćaju porez i doprinosi: <a href="/blog/prekovremeni-rad">prekovremeni rad</a> (najmanje +26%), noćni rad i rad praznikom (najmanje +26%), <a href="/blog/minuli-rad-obracun">minuli rad</a> (0,4% po godini staža), bonusi i nagrade. Pregled svih uvećanja i njihovih stopa je na strani <a href="/dodaci-na-zaradu">dodaci na zaradu</a>. Zato dva zaposlena sa istom osnovnom zaradom mogu imati različit bruto 1 — a time i različit neto.</p>
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
      <h2>Tabela: bruto u neto za 2026 (primeri)</h2>
      <p>Brza tabela bruto u neto za najčešće iznose zarada u 2026. (neto i ukupan trošak poslodavca, zaokruženo):</p>
      <table className="ref-table" aria-label="Tabela bruto u neto 2026 — primeri obračuna">
        <thead><tr><th>Bruto 1 (RSD)</th><th>Neto ≈ (RSD)</th><th>Ukupan trošak ≈ (RSD)</th></tr></thead>
        <tbody>
          <tr><td>50.000</td><td>≈ 38.472</td><td>≈ 57.575</td></tr>
          <tr><td>60.000</td><td>≈ 45.482</td><td>≈ 69.090</td></tr>
          <tr><td>70.000</td><td>≈ 52.492</td><td>≈ 80.605</td></tr>
          <tr><td>80.000</td><td>≈ 59.502</td><td>≈ 92.120</td></tr>
          <tr><td>100.000</td><td>≈ 73.522</td><td>≈ 115.150</td></tr>
          <tr><td>120.000</td><td>≈ 87.542</td><td>≈ 138.180</td></tr>
          <tr><td>150.000</td><td>≈ 108.572</td><td>≈ 172.725</td></tr>
          <tr><td>200.000</td><td>≈ 143.622</td><td>≈ 230.300</td></tr>
        </tbody>
      </table>
      <p className="home-examples-note">Iznosi su informativni i zaokruženi; za tačan obračun za vašu zaradu unesite bruto u kalkulator iznad.</p>
      <h2>Česte greške u obračunu bruto u neto</h2>
      <ul>
        <li>Primena poreza na celu bruto zaradu umesto samo na deo iznad neoporezivih {DEFAULT_RATES.nonTaxable.toLocaleString("sr-RS")} RSD — porez se plaća samo na poresku osnovicu (bruto 1 − neoporezivi iznos), nikad na ceo bruto 1.</li>
        <li>Mešanje bruto 1 i bruto 2 — doprinosi zaposlenog i porez obračunavaju se na bruto 1 (ugovorenu zaradu), dok je bruto 2 već uvećan za doprinose poslodavca i ne sme se ponovo koristiti kao osnovica za porez.</li>
        <li>Primena stope doprinosa (19,90%) na ceo bruto bez uvažavanja najniže osnovice — ako je bruto 1 ispod {DEFAULT_RATES.minBase.toLocaleString("sr-RS")} RSD, doprinosi se svejedno obračunavaju na najnižu mesečnu osnovicu, ne na stvarno niži bruto.</li>
        <li>Zanemarivanje najviše mesečne osnovice ({DEFAULT_RATES.maxBase.toLocaleString("sr-RS")} RSD) kod visokih zarada — iznad tog praga doprinosi se dalje ne uvećavaju srazmerno bruto zaradi.</li>
      </ul>
      <h2>Pravni okvir</h2>
      <p>Porez na zaradu uređuje Zakon o porezu na dohodak građana (stopa 10%, neoporezivi iznos utvrđen izmenama zakona, „Sl. glasnik RS" br. 109/2025), a doprinose za obavezno socijalno osiguranje Zakon o doprinosima za obavezno socijalno osiguranje, koji propisuje stope za PIO, zdravstveno osiguranje i osiguranje za slučaj nezaposlenosti, kao i najnižu i najvišu mesečnu osnovicu doprinosa. Iznose osnovica za tekuću godinu objavljuje CROSO, dok neoporezivi iznos zarade usklađuje Ministarstvo finansija godišnjim indeksiranjem.</p></>),
    faq: [
      { q: "Kako izračunati neto iz bruto u Srbiji?", a: "Neto = Bruto 1 − doprinosi zaposlenog (19,90%) − porez 10% na deo iznad neoporezivog iznosa (34.221 RSD za 2026). Kalkulator radi obračun u oba smera." },
      { q: "Ako je bruto plata 50.000 dinara, koliki je neto?", a: "Za bruto 1 od 50.000 RSD neto iznosi ≈ 38.472 RSD: doprinosi zaposlenog su 9.950 RSD (19,90%), a porez 1.578 RSD (10% na deo iznad neoporezivih 34.221 RSD)." },
      { q: "Koliki su doprinosi zaposlenog?", a: "19,90% — PIO 14%, zdravstvo 5,15%, nezaposlenost 0,75%." },
      { q: "Kako se računa bruto 2 u neto?", a: "Bruto 2 je ukupan trošak poslodavca (bruto 1 + 15,15% doprinosa poslodavca). Da biste iz bruto 2 dobili neto, prvo se izdvoji bruto 1 (bruto 2 ÷ 1,1515), pa se iz njega oduzmu doprinosi zaposlenog (19,90%) i porez (10% na deo iznad 34.221 RSD)." },
      { q: "Da li je obračun besplatan?", a: "Da, kalkulator je besplatan i ne zahteva registraciju. Rezultat preuzimate kao PDF i PPP-PD XML." },
      { q: "Da li se porez plaća na ceo bruto iznos zarade?", a: "Ne. Porez od 10% plaća se samo na deo bruto 1 zarade iznad neoporezivog iznosa (34.221 RSD za 2026). Doprinosi zaposlenog (19,90%), za razliku od poreza, obračunavaju se na celu bruto 1 zaradu." },
      { q: "Da li bruto zarada uključuje doprinose poslodavca?", a: "Ne, bruto 1 (ugovorena zarada) ne uključuje doprinose poslodavca. Oni se dodaju posebno (15,15%) i formiraju bruto 2 — stvaran trošak rada za poslodavca, koji je uvek veći od bruto 1." },
      { q: "Kako se računa plata iz bruto u neto?", a: "Od bruto 1 zarade oduzmu se doprinosi zaposlenog (19,90%) i porez (10% na deo iznad neoporezivih 34.221 RSD). Primer: bruto 100.000 RSD → doprinosi 19.900 RSD, porez 6.578 RSD, neto ≈ 73.522 RSD." },
      { q: "Kako izračunati neto zaradu iz bruto u Srbiji?", a: "Neto zarada = Bruto 1 − doprinosi zaposlenog (19,90%) − porez na zaradu (10% na iznos iznad neoporezivog). Za 2026. neoporezivi iznos je 34.221 RSD. Primer: bruto 100.000 RSD daje neto oko 73.522 RSD. Kalkulator radi obračun u oba smera." },
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
    description: "Obračun naknade za bolovanje do 30 dana (min. 65%) i od 31. dana (sredstva RFZO, isplata preko poslodavca). Primeri i PDF platni listić. Za Srbiju 2026.",
    h1: "Kalkulator bolovanja i naknade zarade (2026)",
    breadcrumbName: "Bolovanje",
    calc: "full",
    focusSection: "bolovanje",
    intro: (<p>Ovaj <strong>kalkulator bolovanja</strong> računa naknadu zarade za 2026: do 30 dana najmanje 65% osnovice iz sredstava poslodavca, a od 31. dana sredstva obezbeđuje RFZO — isplatu zaposlenom i dalje vrši poslodavac. Unesite broj dana bolovanja u kalkulatoru ispod.</p>),
    guide: (<><h2>Kako se obračunava naknada za bolovanje</h2>
      <p>Za prvih 30 dana naknadu snosi poslodavac iz svojih sredstava, najmanje 65% prosečne osnovice (100% za povredu na radu ili profesionalno oboljenje). Od 31. dana sredstva obezbeđuje RFZO, ali <strong>isplatu zaposlenom i dalje vrši poslodavac</strong>: filijala obračunava i prenosi sredstva poslodavcu u roku od 21 dan od potpunog zahteva, a poslodavac je dužan da ih isplati zaposlenom u roku od 7 dana od prijema, inače ih vraća sa kamatom (čl. 102 Zakona o zdravstvenom osiguranju). Zahtev se podnosi u roku od 15 dana od dana isplate zarade za mesec na koji se naknada odnosi (rok iz uputstva RFZO-a; sam član 102. ZZO ne propisuje broj dana). Granica od 30 dana je opšte pravilo i ima izuzetke na obe strane — vidi tabelu ispod. Osnovica je prosek zarade za prethodnih 12 meseci. Detaljan vodič: <a href="/blog/kako-se-obracunava-bolovanje">kako se obračunava bolovanje</a>. Procedura, registracija poslodavca i rokovi u sistemu e-Bolovanje: <a href="/blog/e-bolovanje-poslodavac">e-bolovanje za poslodavce</a>.</p>
      <h2>Bolovanje do 30 dana i preko 30 dana</h2>
      <table className="ref-table" aria-label="Naknada za bolovanje — iz čijih se sredstava obezbeđuje po periodima">
        <thead><tr><th>Slučaj</th><th>Procenat naknade</th><th>Iz čijih sredstava</th></tr></thead>
        <tbody>
          <tr><td>Opšte pravilo — do 30 dana</td><td>min. 65% osnovice</td><td>Poslodavac, iz svojih sredstava</td></tr>
          <tr><td>Opšte pravilo — od 31. dana</td><td>min. 65% osnovice</td><td>RFZO obezbeđuje sredstva; naknadu zaposlenom isplaćuje poslodavac</td></tr>
          <tr><td>Povreda na radu ili profesionalna bolest — ceo period</td><td>100% osnovice</td><td>Poslodavac, iz svojih sredstava od prvog dana, bez prelaza na 31. dan (čl. 101 st. 3 ZZO)</td></tr>
          <tr><td>Dobrovoljno davanje organa, ćelija i tkiva; nega obolelog deteta mlađeg od tri godine; izolacija kao kliconoša ili zbog zaraznih bolesti u okolini — od prvog dana</td><td>prema osnovu sprečenosti (100% za davanje organa, ćelija i tkiva — čl. 95 ZZO)</td><td>RFZO obezbeđuje sredstva već od prvog dana; naknadu zaposlenom isplaćuje poslodavac</td></tr>
        </tbody>
      </table>
      <p>U svim slučajevima <strong>poslodavac je taj koji isplaćuje naknadu zaposlenom</strong>. RFZO ne isplaćuje zaposlenog direktno — on obezbeđuje i prenosi sredstva poslodavcu.</p>
      <h2>Primer obračuna bolovanja</h2>
      <p>Zaposleni sa prosečnom mesečnom bruto osnovicom od 100.000 RSD (≈ 4.762 RSD dnevno za 21 radni dan) provede 10 radnih dana na bolovanju uz naknadu od 65%. Naknada = 4.762 × 10 × 65% ≈ 30.952 RSD bruto za te dane, dok se za preostale odrađene dane isplaćuje puna zarada.</p>
      <h2>Tabela parametara za obračun bolovanja 2026</h2>
      <table className="ref-table" aria-label="Parametri za obračun bolovanja 2026">
        <thead><tr><th>Parametar</th><th>Vrednost</th></tr></thead>
        <tbody>
          <tr><td>Minimalni procenat naknade (do 30 dana)</td><td>65% osnovice</td></tr>
          <tr><td>Procenat naknade za povredu na radu / profesionalno oboljenje</td><td>100% osnovice</td></tr>
          <tr><td>Period obračunske osnovice</td><td>prosek zarade prethodnih 12 meseci</td></tr>
          <tr><td>Sredstva do 30. dana (opšte pravilo)</td><td>poslodavac, iz svojih sredstava</td></tr>
          <tr><td>Sredstva od 31. dana (opšte pravilo)</td><td>obezbeđuje RFZO</td></tr>
          <tr><td>Povreda na radu / profesionalna bolest</td><td>poslodavac, iz svojih sredstava za ceo period (čl. 101 st. 3 ZZO)</td></tr>
          <tr><td>Ko isplaćuje naknadu zaposlenom</td><td>uvek poslodavac, i posle 30. dana</td></tr>
          <tr><td>Rok poslodavcu za isplatu zaposlenom</td><td>7 dana od prijema sredstava od RFZO-a, inače povraćaj sa kamatom (čl. 102 ZZO)</td></tr>
          <tr><td>Porez i doprinosi na naknadu</td><td>obračunavaju se kao na redovnu zaradu (10% porez, 19,90% doprinosi zaposlenog)</td></tr>
        </tbody>
      </table>
      <p>Osnovica za bolovanje nije bruto zarada iz meseca u kom je bolovanje nastupilo, već <strong>prosek isplaćenih zarada (i naknada zarada) zaposlenog u prethodnih 12 meseci</strong> pre meseca u kome je bolovanje počelo. Ako je zaposleni u nekom od tih meseci imao niže primanje (npr. neplaćeno odsustvo ili nepun mesec rada), taj mesec i dalje ulazi u prosek prema pravilima koja primenjuje obračunska služba poslodavca, pa je stvarna osnovica za bolovanje po pravilu nešto drugačija od poslednje isplaćene plate.</p>
      <h2>Česte greške u obračunu bolovanja</h2>
      <ul>
        <li>Računanje 65% naknade na poslednju isplaćenu bruto zaradu umesto na osnovicu — pravilna osnovica je prosek zarade za prethodnih 12 meseci, ne zarada iz tekućeg ili prethodnog meseca.</li>
        <li>Shvatanje da posle 30. dana poslodavac više nema nikakvu obavezu prema zaposlenom — od 31. dana menja se samo <em>izvor sredstava</em> (obezbeđuje ih RFZO), dok obračun i isplatu zaposlenom i dalje vrši poslodavac. Ako obračunska služba nastavi da tereti sopstvena sredstva poslodavca umesto da podnese zahtev filijali RFZO-a, greška je u knjiženju troška, a ne u tome ko isplaćuje zaposlenog.</li>
        <li>Primena jedinstvenog procenta od 65% i za povredu na radu ili profesionalno oboljenje — u tim slučajevima naknada iznosi 100% osnovice od prvog dana, ne 65%. Uz to, kod povrede na radu i profesionalne bolesti nema prelaska na teret RFZO-a na 31. dan: poslodavac plaća iz svojih sredstava za ceo period trajanja sprečenosti (čl. 101 st. 3 ZZO).</li>
        <li>Neuključivanje minulog rada i drugih redovnih uvećanja zarade u prosek za osnovicu — osnovica se računa na ukupno isplaćenu zaradu, uključujući minuli rad, ne samo na osnovnu zaradu.</li>
      </ul>
      <h2>Pravni okvir</h2>
      <p>Pravo na naknadu zarade za vreme privremene sprečenosti za rad (bolovanje) uređuje <strong>Zakon o radu</strong>, čiji čl. 115 propisuje minimalni procenat naknade — najmanje 65% osnovice, odnosno 100% za povredu na radu ili profesionalno oboljenje. <strong>Zakon o radu ne sadrži rok od 30 dana</strong>: granicu od 30 dana, izuzetke od nje i pitanje iz čijih se sredstava naknada obezbeđuje propisuje <strong>Zakon o zdravstvenom osiguranju</strong> (čl. 101, uz izuzetke iz st. 3 za povredu na radu i profesionalnu bolest), a postupak obračuna, prenosa sredstava poslodavcu i rok za isplatu zaposlenom uređuje čl. 102 istog zakona. Naknada zarade se, kao i redovna zarada, oporezuje porezom na dohodak građana i podleže doprinosima za obavezno socijalno osiguranje.</p></>),
    faq: [
      { q: "Koliki je procenat naknade za bolovanje?", a: "Najmanje 65% osnovice za prvih 30 dana; 100% za povredu na radu ili profesionalno oboljenje. Od 31. dana naknada je i dalje najmanje 65% osnovice, s tim što sredstva obezbeđuje RFZO, a isplatu zaposlenom vrši poslodavac." },
      { q: "Ko plaća bolovanje preko 30 dana?", a: "Od 31. dana sredstva za naknadu zarade obezbeđuje Republički fond za zdravstveno osiguranje (RFZO), ali isplatu zaposlenom i dalje vrši poslodavac. Filijala obračunava i prenosi sredstva poslodavcu u roku od 21 dan od potpunog zahteva, a poslodavac je dužan da ih isplati zaposlenom u roku od 7 dana od prijema, inače ih vraća sa kamatom (čl. 102 Zakona o zdravstvenom osiguranju). Kod povrede na radu i profesionalne bolesti nema prelaza na 31. dan — poslodavac plaća iz svojih sredstava za ceo period (čl. 101 st. 3)." },
      { q: "Kako se određuje osnovica?", a: "Osnovica je prosečna zarada zaposlenog u prethodnih 12 meseci pre meseca bolovanja." },
      { q: "Kada RFZO obezbeđuje sredstva od prvog dana bolovanja?", a: "Za dobrovoljno davanje organa, ćelija i tkiva, za negu obolelog deteta mlađeg od tri godine i za izolaciju kao kliconoša ili zbog pojave zaraznih bolesti u okolini sredstva se obezbeđuju iz sredstava RFZO-a već od prvog dana sprečenosti, a ne tek od 31. dana. To su izuzeci od opšteg pravila o prvih 30 dana; i u tim slučajevima naknadu zaposlenom isplaćuje poslodavac." },
      { q: "Kako se računa bolovanje od 65 posto?", a: "Prvo se izračuna dnevna osnovica (prosek bruto zarade prethodnih 12 meseci podeljen brojem radnih dana u mesecu), pa se pomnoži brojem dana bolovanja i sa 65%. Za dnevnu osnovicu od 4.762 RSD i 10 dana bolovanja: 4.762 × 10 × 65% ≈ 30.952 RSD bruto." },
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
  const pz = REFERENCE_DATA.prosecnaZarada2026;
  return <ToolPage cfg={{
    slug: "otpremnina",
    title: "Kalkulator otpremnine 2026 — penzija i tehnološki višak | PlatniListić",
    description: `Otpremnina za odlazak u penziju: najmanje ${(pz.neto * 2).toLocaleString("sr-RS")} RSD (2× prosečna zarada RS). Za tehnološki višak: min. 1/3 zarade po godini staža. Obračun sa poreskim tretmanom, 2026.`,
    h1: "Kalkulator otpremnine — tehnološki višak i odlazak u penziju (2026)",
    breadcrumbName: "Otpremnina",
    calc: "otpremnina",
    intro: (<p>Ovaj <strong>kalkulator otpremnine</strong> računa pravo na otpremninu po Zakonu o radu: za tehnološki višak (min. 1/3 prosečne zarade po godini staža) i za odlazak u penziju (min. dve prosečne zarade). Unesite prosečnu zaradu i godine staža u kalkulatoru ispod.</p>),
    guide: (<><h2>Kako se obračunava otpremnina</h2>
      <p>Zaposlenom kome prestaje radni odnos zbog tehnološkog viška pripada otpremnina najmanje u visini jedne trećine (1/3) prosečne zarade po godini staža kod poslodavca (čl. 158 Zakona o radu). Za odlazak u penziju otpremnina iznosi najmanje dve prosečne zarade u RS. Poreski tretman: iznos otpremnine neoporeziv do propisanog iznosa — deo koji premašuje neoporezivi prag podleže porezu na dohodak. Detaljan vodič: <a href="/blog/otpremnina-obracun">obračun otpremnine</a>. Za odlazak u penziju pogledajte i vodič <a href="/blog/kako-se-obracunava-penzija">kako se obračunava penzija</a>.</p>
      <h2>Kada zaposleni ima pravo na otpremninu</h2>
      <p>Pravo na otpremninu po čl. 158 Zakona o radu vezano je za konkretan osnov prestanka radnog odnosa — otkaz od strane poslodavca zbog tehnološkog, ekonomskog ili organizacionog viška. Zaposleni koji sam daje otkaz, ili kome radni odnos prestaje zbog povrede radne obaveze ili nepoštovanja radne discipline, po ovom osnovu nema pravo na otpremninu. Odlazak u penziju je poseban, odvojen osnov (čl. 119 Zakona o radu), nezavisan od toga da li je poslodavac ikada imao višak zaposlenih — otpremnina za penziju pripada svakom zaposlenom kome radni odnos prestaje zbog ostvarivanja prava na starosnu penziju, bez obzira na razlog eventualnog ranijeg viška kod istog poslodavca.</p>
      <p>Poslodavac je dužan da pre otkaza zbog tehnološkog viška donese program rešavanja viška zaposlenih (kada broj zaposlenih kojima prestaje radni odnos prelazi zakonski prag), u kome se, između ostalog, utvrđuje i visina otpremnine za svakog zaposlenog pojedinačno. Otpremnina se isplaćuje pre prestanka radnog odnosa, odnosno najkasnije do dana prestanka radnog odnosa — zaposleni ne treba da potpiše sporazum o prestanku radnog odnosa dok mu otpremnina nije isplaćena ili dok mu isplata nije ugovorom jasno garantovana.</p>
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
      </table>
      <h2>Dve različite osnovice — pažljivo razlikovati</h2>
      <p>Najčešći izvor zabune kod otpremnine jeste to što zakon propisuje <strong>dve različite osnovice</strong> za dve različite situacije. Kod tehnološkog viška osnovica je prosečna zarada <em>samog zaposlenog</em> isplaćena u prethodna tri meseca (ili drugi period utvrđen opštim aktom), pa je otpremnina individualna — dva zaposlena sa istim stažem, ali različitom platom, dobijaju različit iznos. Kod odlaska u penziju osnovica je prosečna zarada <em>u Republici Srbiji</em> prema poslednjem objavljenom podatku RZS, pa je otpremnina za penziju ista za sve zaposlene bez obzira na njihovu ličnu platu, sve dok je opštim aktom poslodavca ili ugovorom o radu ne utvrdi u većem iznosu. Mešanje ove dve osnovice je najčešća greška u praksi.</p>
      <h2>Poreski tretman otpremnine</h2>
      <p>Otpremnina isplaćena zbog prestanka radnog odnosa po osnovu tehnološkog viška oslobođena je poreza na dohodak građana do iznosa koji ne prelazi zakonski minimum — 1/3 prosečne zarade zaposlenog po godini staža kod poslodavca. Ako poslodavac isplati veći iznos od tog minimuma (npr. na osnovu kolektivnog ugovora ili sopstvene odluke o velikodušnijoj otpremnini), razlika iznad neoporezivog dela oporezuje se porezom na dohodak građana kao drugi prihod, u skladu sa Zakonom o porezu na dohodak građana. Primer (tehnološki višak): zaposleni sa 10 godina staža čija <em>sopstvena</em> prosečna bruto zarada u prethodna tri meseca iznosi 120.000 RSD ima zakonski minimum otpremnine od 120.000 ÷ 3 × 10 = {(120000 / 3 * 10).toLocaleString("sr-RS")} RSD (bruto osnovica) — taj deo je neoporeziv. Ovde se koristi plata baš tog zaposlenog, a ne prosek u Republici Srbiji (koji važi samo za otpremninu pri odlasku u penziju). Ako poslodavac isplati dodatnih 200.000 RSD iznad tog minimuma, upravo se ta razlika od 200.000 RSD oporezuje, dok prvobitnih {(120000 / 3 * 10).toLocaleString("sr-RS")} RSD ostaje neoporezivo. Otpremnina za odlazak u penziju prati isti princip — neoporeziva je do zakonskog minimuma (dve prosečne zarade u RS), a eventualni višak se oporezuje.</p>
      <h2>Česte greške u obračunu otpremnine</h2>
      <ul>
        <li>Mešanje osnovice za tehnološki višak (prosečna zarada samog zaposlenog) sa osnovicom za penziju (prosečna zarada u Republici Srbiji) — ove dve osnovice se ne smeju koristiti naizmenično, jer dolaze iz različitih izvora podataka i različitih zakonskih osnova.</li>
        <li>Zaboravljanje da se porez plaća samo na deo iznad neoporezivog (zakonskog minimalnog) iznosa — cela otpremnina se pogrešno tretira kao oporeziva ili, obrnuto, kao potpuno neoporeziva bez obzira na visinu isplate.</li>
        <li>Računanje staža kao ukupnog radnog veka zaposlenog umesto staža ostvarenog kod tog konkretnog poslodavca — za obračun otpremnine relevantan je samo staž kod poslodavca koji vrši otkaz.</li>
        <li>Primena zakonskog minimuma kao da je to i zakonski maksimum — 1/3 prosečne zarade po godini staža (tehnološki višak) i dve prosečne zarade (penzija) su najniži iznosi koje poslodavac mora isplatiti; kolektivnim ugovorom ili odlukom poslodavca otpremnina može biti i veća.</li>
      </ul>
      <h2>Pravni okvir</h2>
      <p>Obavezu isplate otpremnine zaposlenom kome prestaje radni odnos kao tehnološkom, ekonomskom ili organizacionom višku, u minimalnom iznosu od jedne trećine prosečne zarade zaposlenog za svaku navršenu godinu staža kod poslodavca, propisuje čl. 158 Zakona o radu. Otpremninu za odlazak u penziju, u minimalnom iznosu od dve prosečne zarade u Republici Srbiji prema poslednjem objavljenom podatku republičkog organa nadležnog za statistiku, propisuje čl. 119 Zakona o radu. Poreski status isplaćene otpremnine (neoporezivi deo i oporezivanje viška) uređuje Zakon o porezu na dohodak građana.</p></>),
    faq: [
      { q: "Kolika je minimalna otpremnina za tehnološki višak?", a: "Najmanje 1/3 prosečne zarade zaposlenog po godini staža kod tog poslodavca, u skladu sa čl. 158 Zakona o radu." },
      { q: "Da li je otpremnina oporeziva?", a: "Deo otpremnine do propisanog neoporezivog iznosa je oslobođen poreza. Iznos koji premašuje taj prag oporezuje se kao dohodak." },
      { q: "Koja je razlika između otpremnine za tehnološki višak i za odlazak u penziju?", a: "Za tehnološki višak minimum je 1/3 prosečne zarade po godini staža; za odlazak u penziju minimum iznosi dve prosečne zarade u Republici Srbiji." },
      { q: "Kako radi kalkulator otpremnine za penziju?", a: `Kalkulator otpremnine za penziju množi prosečnu zaradu u Republici Srbiji (ne ličnu zaradu zaposlenog) sa dva — to je zakonski minimum po čl. 119 Zakona o radu. Uz prosečnu neto zaradu od ${pz.neto.toLocaleString("sr-RS")} RSD (RZS, ${pz.mesec}), minimalna otpremnina za penziju je ${pz.neto.toLocaleString("sr-RS")} × 2 = ${(pz.neto * 2).toLocaleString("sr-RS")} RSD.` },
      { q: "Da li se u staž za otpremninu računa rad kod prethodnog poslodavca?", a: "Ne. Otpremnina za tehnološki višak obračunava se isključivo na osnovu godina staža koje je zaposleni proveo kod poslodavca koji vrši otkaz, a ne na osnovu ukupnog radnog staža zaposlenog." },
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
      <p>Minuli rad nije poseban dodatak van zarade — on je sastavni deo <strong>bruto 1</strong> zarade. Na platnom listiću se iskazuje kao zasebna stavka uvećanja na osnovnu zaradu, u sekciji formiranja bruto 1, pa zajedno sa osnovnom zaradom ulazi u osnovicu za porez i doprinose. U <a href="/bruto-neto">bruto u neto kalkulatoru</a> unosite godine staža, a iznos minulog rada se automatski uračunava u bruto 1.</p>
      <h2>Tabela parametara za obračun minulog rada 2026</h2>
      <table className="ref-table" aria-label="Parametri za obračun minulog rada 2026">
        <thead><tr><th>Parametar</th><th>Vrednost</th></tr></thead>
        <tbody>
          <tr><td>Zakonski minimum po godini staža</td><td>0,4% osnovice</td></tr>
          <tr><td>Relevantan staž</td><td>samo staž kod istog (trenutnog) poslodavca</td></tr>
          <tr><td>Mesto u strukturi zarade</td><td>sastavni deo bruto 1 (uvećanje osnovne zarade)</td></tr>
          <tr><td>Osnovica za porez i doprinose</td><td>uključuje i minuli rad — porez 10%, doprinosi zaposlenog 19,90%</td></tr>
          <tr><td>Mogućnost višeg procenta</td><td>da, kolektivnim ugovorom ili ugovorom o radu</td></tr>
        </tbody>
      </table>
      <h2>Česte greške u obračunu minulog rada</h2>
      <ul>
        <li>Uzimanje ukupnog radnog staža zaposlenog (kod svih dosadašnjih poslodavaca) umesto staža kod aktuelnog poslodavca — minuli rad po čl. 108 Zakona o radu priznaje isključivo godine provedene kod poslodavca kod kog je zaposleni trenutno zaposlen.</li>
        <li>Zaokruživanje godina staža naviše pre navršene godine — pravo na uvećanje nastaje tek za svaku <em>navršenu</em> godinu, ne za započetu.</li>
        <li>Primena procenta 0,4% na neto zaradu umesto na bruto osnovicu — minuli rad se obračunava na bruto osnovnu zaradu, pre obračuna poreza i doprinosa.</li>
        <li>Tretiranje minulog rada kao jednokratnog bonusa umesto stalnog mesečnog uvećanja koje ulazi u prosek zarade korišćen za bolovanje, godišnji odmor i druge naknade.</li>
      </ul>
      <h2>Pravni okvir</h2>
      <p>Pravo zaposlenog na uvećanu zaradu po osnovu vremena provedenog na radu (minuli rad), u minimalnom iznosu od 0,4% od osnovice za svaku navršenu godinu rada kod poslodavca kod koga je zaposleni trenutno zaposlen, propisuje čl. 108 Zakona o radu. Poslodavac opštim aktom ili ugovorom o radu može utvrditi i viši procenat, ali ne niži od zakonskog minimuma. Kako je minuli rad sastavni deo zarade, na njega se primenjuju ista pravila oporezivanja i doprinosa kao na ostatak bruto 1 zarade.</p></>),
    faq: [
      { q: "Koliki je procenat minulog rada?", a: "Zakonski minimum je 0,4% po svakoj navršenoj godini staža kod istog poslodavca. Poslodavac može kolektivnim ugovorom utvrditi viši procenat." },
      { q: "Da li se minuli rad računa na ukupni radni staž?", a: "Ne — minuli rad se obračunava isključivo na osnovu godina staža kod trenutnog (istog) poslodavca, a ne ukupnog radnog staža." },
      { q: "Kako se minuli rad prikazuje na platnom listiću?", a: "Minuli rad je sastavni deo bruto 1 zarade i posebno se iskazuje kao uvećanje na osnovnu zaradu, vidljivo na platnom listiću u sekciji formiranja bruto 1." },
      { q: "Kako se tačno računa minuli rad?", a: "Minuli rad = bruto osnovica × 0,4% × broj navršenih godina staža kod istog poslodavca. Za osnovicu 100.000 RSD i 10 godina staža: 100.000 × 0,4% × 10 = 4.000 RSD mesečno, dodato na osnovnu zaradu u okviru bruto 1." },
      { q: "Da li se minuli rad računa u naknadu za godišnji odmor?", a: "Da — pošto je minuli rad sastavni deo zarade, ulazi u prosek zarade koji se koristi za obračun naknade za godišnji odmor, kao i za naknadu za bolovanje i druge naknade zasnovane na proseku zarade." },
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
      <p>Obrnuti obračun — iz željenog neto iznosa kalkulator iterativno pronalazi bruto 1 tako da posle oduzimanja doprinosa zaposlenog (19,90%) i poreza na zaradu (10% na deo iznad neoporezivog iznosa od 34.221 RSD) dobijete tačno taj neto. Primer: za željeni neto od 73.522 RSD bruto 1 iznosi 100.000 RSD. Ukupan trošak poslodavca (bruto 2) dobija se dodavanjem doprinosa poslodavca (15,15%) na bruto 1. Detaljan vodič: <a href="/bruto-neto">razlika između bruto i neto zarade</a>.</p>
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
      </table>
      <h2>Česte greške pri obrnutom obračunu</h2>
      <ul>
        <li>Deljenje neto iznosa jednom fiksnom stopom (npr. neto ÷ 0,7) — obračun nije linearan zbog neoporezivog iznosa, pa takva prečica sistematski greši, naročito kod nižih i viših zarada gde je udeo neoporezivog dela u bruto zaradi različit.</li>
        <li>Mešanje bruto 1 i bruto 2 kao ciljanog iznosa — ako poslodavac navede da je "bruto" zapravo bruto 2 (ukupan trošak), a obračun se sprovede kao da je bruto 1, rezultujući neto će biti manji od stvarno dogovorenog.</li>
        <li>Zanemarivanje najniže mesečne osnovice doprinosa ({DEFAULT_RATES.minBase.toLocaleString("sr-RS")} RSD) — kod vrlo niskih ciljanih neto iznosa, izračunati bruto 1 može ispasti ispod praga na koji se doprinosi svejedno moraju obračunati na najnižu osnovicu, što obrnuti obračun mora uzeti u obzir.</li>
        <li>Zaokruživanje u međukoracima — ručno rekonstruisanje bruto 1 iz neto zaokruživanjem posle svakog koraka (doprinosi, pa porez) uvodi grešku od nekoliko desetina dinara; kalkulator radi iterativno na punu preciznost pre zaokruživanja konačnog rezultata.</li>
      </ul>
      <h2>Pravni okvir</h2>
      <p>Obrnut obračun se oslanja na iste propise kao i direktan: Zakon o porezu na dohodak građana određuje stopu poreza (10%) i neoporezivi iznos (utvrđen izmenama zakona, „Sl. glasnik RS" br. 109/2025), dok Zakon o doprinosima za obavezno socijalno osiguranje propisuje stope doprinosa zaposlenog i poslodavca, kao i najnižu i najvišu mesečnu osnovicu. Budući da propisi definišu obračun samo u smeru bruto → neto, rekonstrukcija bruto 1 iz zadatog neto iznosa je matematički (iterativni) postupak, a ne zaseban zakonski definisan obrazac — zato se rezultat u praksi iskazuje kao zaokružena aproksimacija. Osnovice objavljuje CROSO.</p></>),
    faq: [
      { q: "Kako izračunati bruto iz neto zarade u Srbiji?", a: "Kalkulator iterativno pronalazi bruto 1 tako da posle doprinosa zaposlenog (19,90%) i poreza (10% na deo iznad 34.221 RSD) dobijete željeni neto iznos. Unesite ciljani neto u polje 'Unesite Neto' i kalkulator prikazuje odgovarajući bruto 1." },
      { q: "Ako mi treba neto plata od 100.000 dinara, koliki je bruto?", a: "Za neto od 100.000 RSD bruto 1 iznosi ≈ 137.772 RSD, a ukupan trošak poslodavca (bruto 2) ≈ 158.644 RSD." },
      { q: "Koliki je ukupan trošak poslodavca za dati neto?", a: "Ukupan trošak = Bruto 1 + doprinosi poslodavca (15,15% — PIO 10% i zdravstvo 5,15%). Za neto 73.522 RSD, bruto 1 je 100.000 RSD, a ukupan trošak oko 115.150 RSD." },
      { q: "Da li je neto u bruto kalkulator besplatan?", a: "Da, kalkulator je besplatan i ne zahteva registraciju. Obračun radite u oba smera — bruto u neto i neto u bruto. Rezultat preuzimate kao PDF i PPP-PD XML." },
      { q: "Koliki je bruto za neto platu od 80.000 dinara?", a: "Za neto od 80.000 RSD bruto 1 iznosi ≈ 109.241 RSD, a ukupan trošak poslodavca (bruto 2) ≈ 125.791 RSD, uz doprinose zaposlenog 19,90% i porez 10% na deo iznad neoporezivih 34.221 RSD." },
      { q: "Zašto se neto ne može dobiti prostim deljenjem bruto zarade sa fiksnim procentom?", a: "Zato što porez od 10% važi samo na deo bruto zarade iznad neoporezivog iznosa (34.221 RSD), dok se doprinosi od 19,90% obračunavaju na ceo bruto 1. Odnos neto/bruto zato nije konstantan, već raste sa visinom zarade, pa je za tačan obrnuti obračun potreban iterativni postupak, ne fiksni koeficijent." },
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
    guide: (<>
      <h2>Kako se obračunavaju dodaci na zaradu</h2>
      <p>Zakon o radu (čl. 108) propisuje minimalna uvećanja zarade po satu: za prekovremeni rad, noćni rad (22h–06h) i rad vikendom (subota i nedelja) najmanje <strong>26%</strong>, a za rad na dan državnog praznika koji je neradni dan najmanje <strong>110%</strong> od osnovice. Minuli rad je zaseban dodatak i iznosi najmanje <strong>0,4% po navršenoj godini staža</strong> kod istog poslodavca. Ovo su zakonski minimumi — kolektivni ugovor, pravilnik o radu ili ugovor o radu kod konkretnog poslodavca mogu ugovoriti i veće procente uvećanja. Obračun ide u dva koraka: prvo se izračuna redovna <strong>satnica</strong> (mesečna osnovna zarada podeljena brojem radnih sati u mesecu), a zatim se satnica množi brojem sati rada u posebnom režimu i odgovarajućim koeficijentom uvećanja (1 + procenat/100). Svi dodaci ulaze u <strong>bruto 1 zaradu</strong> i podležu istom porezu i doprinosima kao osnovna zarada — nema posebnog poreskog tretmana za uvećanja. Detaljan vodič: <a href="/blog/prekovremeni-rad">prekovremeni rad 2026</a>.</p>
      <h2>Tabela uvećanja 2026 (čl. 108 Zakona o radu)</h2>
      <table className="ref-table" aria-label="Minimalna uvećanja zarade 2026">
        <thead><tr><th>Vrsta rada</th><th>Minimalno uvećanje</th></tr></thead>
        <tbody>
          <tr><td>Prekovremeni rad</td><td>+26%</td></tr>
          <tr><td>Noćni rad (22h–06h)</td><td>+26%</td></tr>
          <tr><td>Rad vikendom (subota, nedelja)</td><td>+26%</td></tr>
          <tr><td>Rad na državni praznik (neradni dan)</td><td>+110%</td></tr>
          <tr><td>Minuli rad</td><td>+0,4% po godini staža kod istog poslodavca</td></tr>
        </tbody>
      </table>
      <h2>Radni primer</h2>
      <p>Zaposleni ima mesečnu osnovicu 100.000 RSD i mesečni fond od 176 radnih sati (22 radna dana × 8h). Satnica = 100.000 ÷ 176 ≈ <strong>568 RSD</strong>. Ako zaposleni odradi 10 sati prekovremenog rada, uvećanje se računa kao satnica × sati × 1,26: 568 × 10 × 1,26 ≈ <strong>7.157 RSD</strong> bruto za tih 10 sati (od čega je osnovna satnica 5.680 RSD, a čisto uvećanje 1.477 RSD). Ako je deo tih sati istovremeno i noćni rad (npr. 5 od 10 sati odrađeno je između 22h i 06h), na te sate se dodaje i noćno uvećanje: 568 × 5 × 0,26 ≈ 738 RSD dodatnog uvećanja za noćni rad, pored uvećanja za prekovremeni rad na istih 5 sati. Uvećanja se tako <strong>sabiraju za svaki sat</strong> po broju režima u kojima je taj sat odrađen — kalkulator ispod obračunava svaku kategoriju sati posebno i sabira ih u ukupan bruto 1.</p>
      <h2>Česte greške</h2>
      <ul>
        <li>Neprimenjivanje oba uvećanja kada se prekovremeni i noćni rad poklapaju — ako je sat istovremeno i prekovremen i noćni, oba uvećanja od po 26% se sabiraju za taj sat, a ne primenjuje se samo jedno (obično veće).</li>
        <li>Primena uvećanja za rad na praznik na dane koji nisu stvarno odrađeni — uvećanje pripada samo za sate <strong>stvarno odrađene</strong> na dan praznika; ako je praznik neradni dan i zaposleni ne radi, pripada mu naknada zarade za taj dan (redovna osnovica), ne uvećanje po čl. 108.</li>
        <li>Zaboravljanje da minuli rad ulazi u osnovicu za obračun uvećanja kod nekih poslodavaca ako je tako ugovoreno kolektivnim ugovorom — bez izričite odredbe, uvećanja se po zakonskom minimumu računaju na osnovnu zaradu.</li>
        <li>Mešanje bruto i neto satnice — satnica za obračun uvećanja računa se iz bruto osnovice, jer se čitav bruto 1 (osnovna zarada + sva uvećanja) potom oporezuje po istim pravilima kao redovna zarada.</li>
      </ul>
      <h2>Pravni okvir</h2>
      <p>Minimalna uvećanja zarade propisuje čl. 108 Zakona o radu Republike Srbije: najmanje 26% za prekovremeni rad, noćni rad i rad vikendom, a najmanje 110% za rad na dan državnog praznika koji je neradni dan (uz redovnu naknadu zarade za taj dan), kao i minimum od 0,4% po godini staža za minuli rad. Ovo su zakonski minimumi zaštite zaposlenog — poslodavac ih ne sme umanjiti, ali kolektivnim ugovorom, pravilnikom o radu ili pojedinačnim ugovorom o radu može ugovoriti povoljnije (veće) procente uvećanja za zaposlene. Kada se za isti sat steknu uslovi po više osnova (npr. prekovremeni i noćni rad), procenti se sabiraju.</p>
    </>),
    faq: [
      { q: "Koliko iznosi uvećanje za prekovremeni rad?", a: "Zakonski minimum je +26% po satu prekovremenog rada (čl. 108 Zakona o radu). Poslodavac može kolektivnim ugovorom utvrditi veće uvećanje." },
      { q: "Koliko se plaća noćni rad?", a: "Za rad između 22h i 06h pripada uvećanje od najmanje +26% u odnosu na redovnu satnicu (čl. 108 Zakona o radu) — isto kao za prekovremeni rad i rad vikendom. Za satnicu od 568 RSD i 8 odrađenih noćnih sati, uvećanje iznosi 568 × 8 × 0,26 ≈ 1.182 RSD, pored redovne zarade za te sate." },
      { q: "Kako se u kalkulatoru obračunava uvećanje za rad na praznik?", a: "Unesite sate odrađene na dan praznika koji je neradni dan — kalkulator na osnovicu po satu primenjuje uvećanje od +110% (čl. 108 Zakona o radu), znatno više nego za prekovremeni ili noćni rad (26%). Uz to uvećanje, zaposleni za taj dan ima i pravo na redovnu naknadu zarade." },
      { q: "Da li se dodaci na zaradu međusobno sabiraju?", a: "Da — ako zaposleni radi prekovremeno u noćnoj smeni, oba uvećanja od po 26% se primenjuju kumulativno na iste sate. Kalkulator ispod sabira sve unete sate i uvećanja u jednom obračunu." },
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
    guide: (<>
      <h2>Kako se obračunava godišnji porez na dohodak</h2>
      <p>Godišnji porez na dohodak građana je poseban, jednom godišnje utvrđen porez — različit od mesečnog poreza na zaradu koji poslodavac obustavlja iz svake plate. Obveznik je fizičko lice rezident Srbije čiji <strong>ukupan godišnji dohodak iz svih izvora</strong> (zarade, prihodi od samostalne delatnosti, autorski honorari, prihodi od izdavanja nepokretnosti i drugi oporezivi prihodi) pređe zakonski cenzus. Neoporezivi cenzus iznosi <strong>tri prosečne godišnje zarade</strong> isplaćene u Republici Srbiji u toj godini (godišnja zarada = 12 × prosečna mesečna bruto zarada). Na deo dohotka koji prelazi jedan cenzus, do visine dvostrukog cenzusa, primenjuje se stopa <strong>10%</strong>; na deo iznad dvostrukog cenzusa primenjuje se stopa <strong>15%</strong>. Pošto je porez po odbitku (mesečni porez na zaradu, porez na honorare i sl.) već plaćen tokom godine, godišnji porez efektivno predstavlja dodatnu obavezu samo za deo dohotka iznad cenzusa — nije reč o ponovnom oporezivanju celog prihoda. Detaljnije o doprinosima i poreskom sistemu: <a href="/blog/doprinosi-srbija">doprinosi u Srbiji 2026</a>.</p>
      <h2>Parametri obračuna 2026</h2>
      <table className="ref-table" aria-label="Parametri godišnjeg poreza na dohodak 2026">
        <thead><tr><th>Stavka</th><th>Vrednost</th></tr></thead>
        <tbody>
          <tr><td>Neoporezivi cenzus</td><td>3× prosečna godišnja zarada u RS</td></tr>
          <tr><td>Prosečna mesečna bruto zarada (osnov za cenzus)</td><td>{REFERENCE_DATA.prosecnaZarada2026.bruto.toLocaleString("sr-RS")} RSD ({REFERENCE_DATA.prosecnaZarada2026.mesec}, RZS)</td></tr>
          <tr><td>Stopa na deo iznad cenzusa do dvostrukog cenzusa</td><td>10%</td></tr>
          <tr><td>Stopa na deo iznad dvostrukog cenzusa</td><td>15%</td></tr>
          <tr><td>Rok za podnošenje prijave</td><td>15. maj naredne godine</td></tr>
        </tbody>
      </table>
      <h2>Radni primer (ilustracija)</h2>
      <p>Cenzus se računa po formuli 3 × (12 × prosečna mesečna bruto zarada). Uzimajući poslednju objavljenu prosečnu bruto zaradu od {REFERENCE_DATA.prosecnaZarada2026.bruto.toLocaleString("sr-RS")} RSD, godišnja prosečna zarada iznosi {REFERENCE_DATA.prosecnaZarada2026.bruto.toLocaleString("sr-RS")} × 12 ≈ {(REFERENCE_DATA.prosecnaZarada2026.bruto * 12).toLocaleString("sr-RS")} RSD, pa bi ilustrativan cenzus (3×) bio oko {(REFERENCE_DATA.prosecnaZarada2026.bruto * 12 * 3).toLocaleString("sr-RS")} RSD, a dvostruki cenzus oko {(REFERENCE_DATA.prosecnaZarada2026.bruto * 12 * 6).toLocaleString("sr-RS")} RSD. <em>Napomena: zvanični cenzus za konkretnu poresku godinu objavljuje Poreska uprava na osnovu podatka RZS o prosečnoj godišnjoj zaradi za tu godinu — iznos iz ovog primera je ilustracija formule, ne zvanično objavljena cifra.</em> Pod ovom pretpostavkom, poreski obveznik sa ukupnim godišnjim dohotkom od 8.000.000 RSD imao bi oporezivi višak od 8.000.000 − {(REFERENCE_DATA.prosecnaZarada2026.bruto * 12 * 3).toLocaleString("sr-RS")} ≈ 1.951.712 RSD, u celosti u prvom razredu (jer ne prelazi dvostruki cenzus), pa bi godišnji porez iznosio 1.951.712 × 10% ≈ <strong>195.171 RSD</strong>. Da je isti obveznik ostvario dohodak iznad dvostrukog cenzusa, deo preko te granice oporezovao bi se dodatnom stopom od 15%.</p>
      <h2>Česte greške</h2>
      <ul>
        <li>Uverenje da godišnji porez plaćaju svi zaposleni — u stvarnosti ga plaća uzak krug lica čiji ukupan godišnji dohodak iz svih izvora prelazi cenzus od tri prosečne godišnje zarade; velika većina zaposlenih sa jednom prosečnom ili čak natprosečnom platom nikada ne dostigne taj prag.</li>
        <li>Mešanje godišnjeg poreza sa mesečnim porezom na zaradu — mesečni porez (10% na deo iznad neoporezivog iznosa) obustavlja poslodavac iz svake plate tokom cele godine; godišnji porez je poseban obračun koji sabira sve izvore prihoda za celu godinu i primenjuje se samo na deo iznad cenzusa.</li>
        <li>Zaboravljanje da se u godišnji dohodak uračunavaju svi oporezivi prihodi (zarade od više poslodavaca, honorari, prihodi od izdavanja nepokretnosti), a ne samo zarada sa glavnog radnog mesta.</li>
        <li>Propuštanje roka za prijavu (15. maj naredne godine), što povlači zatezne kamate i prekršajnu odgovornost, čak i kada je sam iznos obaveze mali.</li>
      </ul>
      <h2>Pravni okvir</h2>
      <p>Godišnji porez na dohodak građana uređen je Zakonom o porezu na dohodak građana, koji propisuje krug obveznika, način utvrđivanja cenzusa (tri prosečne godišnje zarade u Republici Srbiji), progresivne stope (10% i 15%) i rok za podnošenje poreske prijave. Poreska uprava svake godine objavljuje visinu prosečne godišnje zarade na osnovu koje se cenzus za tu godinu izračunava, pa se konkretan dinarski iznos cenzusa menja iz godine u godinu i objavljuje se zvanično — ne izračunava ga poreski obveznik sam iz proizvoljnog podatka.</p>
    </>),
    faq: [
      { q: "Ko je obavezan da plaća godišnji porez na dohodak?", a: "Fizička lica rezidenti čiji ukupni godišnji dohodak premašuje neoporezivi cenzus (tri prosečne godišnje zarade u RS). Ukoliko je porez po odbitku već plaćen tokom godine, godišnji porez je dodatna obaveza samo na deo dohotka iznad cenzusa." },
      { q: "Ko plaća godišnji porez 2026?", a: "Plaćaju ga fizička lica čiji ukupan dohodak iz svih izvora u 2026. godini (zarade, honorari, prihodi od izdavanja i drugo) pređe cenzus od tri prosečne godišnje zarade u Srbiji. Većina zaposlenih sa prosečnom platom ovaj prag ne dostiže." },
      { q: "Kolike su stope godišnjeg poreza na dohodak?", a: "Na deo dohotka iznad neoporezivog cenzusa do visine dvostrukog cenzusa primenjuje se stopa 10%; na deo iznad dvostrukog cenzusa stopa je 15%." },
      { q: "Do kada se podnosi poreska prijava za godišnji porez?", a: "Poreska prijava za godišnji porez na dohodak građana podnosi se Poreskoj upravi do 15. maja naredne kalendarske godine (npr. za 2026. godinu — do 15. maja 2027)." },
    ],
    related: GODISNJI_POREZ_RELATED,
  }} />;
}

export function GodisnjiOdmorPage() {
  const prosBruto = REFERENCE_DATA.prosecnaZarada2026.bruto;
  return <ToolPage cfg={{
    slug: "godisnji-odmor",
    title: "Kalkulator godišnjeg odmora 2026 — naknada | PlatniListić",
    description: "Kalkulator naknade za godišnji odmor i za neiskorišćeni odmor (čl. 104 i 76 Zakona o radu). Osnovica je prosek zarade u prethodnih 12 meseci. Besplatno, 2026.",
    h1: "Kalkulator godišnjeg odmora i naknade (2026)",
    breadcrumbName: "Godišnji odmor",
    calc: "godisnji-odmor",
    intro: (<p>Ovaj <strong>kalkulator godišnjeg odmora</strong> računa naknadu zarade za dane odmora i naknadu za <strong>neiskorišćeni godišnji odmor</strong> pri prestanku radnog odnosa. Osnovica je prosečna zarada zaposlenog u prethodnih 12 meseci (čl. 104 Zakona o radu). Za pravila i uslove pogledajte vodič <a href="/blog/godisnji-odmor-naknada">kako se računa naknada za godišnji odmor</a>.</p>),
    guide: (<>
      <h2>Kako se obračunava naknada za godišnji odmor</h2>
      <p>Za dane godišnjeg odmora zaposleni prima naknadu zarade koja <strong>ne može biti niža od prosečne zarade u prethodnih 12 meseci</strong> (čl. 104 Zakona o radu). U prosek ulaze osnovna zarada, minuli rad i redovna uvećanja (npr. za rad noću, prekovremeni i rad na dan praznika, ukoliko su deo redovnih primanja zaposlenog u posmatranom periodu). Postupak: (1) saberu se bruto zarade za 12 meseci koji prethode mesecu korišćenja odmora, (2) podele sa 12 (prosečna mesečna bruto zarada), (3) podeli sa brojem radnih dana u mesecu u kome se odmor koristi radi dnevne osnove, (4) pomnoži brojem dana odmora koje zaposleni koristi. Ovaj redosled — prosek pa dnevna osnova pa množenje danima — jednak je za obe vrste naknade opisane u nastavku, uz jednu razliku: kod redovnog korišćenja odmora broj radnih dana uzima se iz meseca korišćenja, dok se kod isplate pri prestanku radnog odnosa po pravilu uzima prosečan broj radnih dana.</p>
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
      <p>Zaposleni sa prosečnom bruto zaradom od 100.000 RSD i 21 radnim danom u mesecu ima dnevnu osnovu 100.000 ÷ 21 ≈ 4.762 RSD. Za 20 radnih dana odmora naknada iznosi 4.762 × 20 ≈ 95.238 RSD bruto. Na taj iznos obračunavaju se doprinosi (19,90%) i porez (10% iznad neoporezivog dela) kao na redovnu zaradu. Ako isti zaposleni koristi odmor u mesecu sa manje radnih dana (npr. zbog praznika), dnevna osnova raste jer se isti prosek deli manjim brojem radnih dana — zato je broj radnih dana u mesecu korišćenja odmora bitan parametar, a ne samo prosečna zarada.</p>
      <h2>Broj dana godišnjeg odmora i srazmeran deo</h2>
      <p>Zakonski minimum je 20 radnih dana godišnjeg odmora u kalendarskoj godini, a ugovorom o radu, kolektivnim ugovorom ili pravilnikom o radu poslodavac može utvrditi i duže trajanje, zavisno od doprinosa na radu, uslova rada, radnog iskustva, stručne spreme i drugih kriterijuma (čl. 69 Zakona o radu). Zaposleni koji nije radio celu kalendarsku godinu kod poslodavca (npr. zbog zasnivanja ili prestanka radnog odnosa u toku godine) ima pravo na srazmeran deo godišnjeg odmora — jedna dvanaestina godišnjeg odmora za svaki mesec dana rada u toj kalendarskoj godini (čl. 72). Ovaj kalkulator ne računa srazmeran deo automatski — broj dana koji se unosi u polje treba da odražava već utvrđeno pravo (puni ili srazmerni deo), a naknada se potom obračunava po istoj formuli dnevne osnove.</p>
      <h2>Naknada za neiskorišćeni godišnji odmor</h2>
      <p>Ako zaposlenom prestane radni odnos pre nego što je iskoristio pun godišnji odmor, poslodavac je dužan da mu isplati <strong>naknadu za neiskorišćene dane</strong> (čl. 76 Zakona o radu), u visini prosečne zarade po istoj formuli. Za 8 neiskorišćenih dana i dnevnu osnovu 4.762 RSD naknada je ≈ 38.096 RSD bruto. Ova naknada isplaćuje se umesto korišćenja odmora u naturi i ne može se ugovoriti njeno isključenje ili unapred se od nje odreći — pravo na naknadu nastaje samim prestankom radnog odnosa sa neiskorišćenim dobrima. Poslodavac je dužan da zaposlenom omogući korišćenje odmora do kraja tekuće, odnosno do 30. juna naredne kalendarske godine za neiskorišćeni deo iz prethodne godine (čl. 73); tek ako to nije bilo moguće do prestanka radnog odnosa, sledi novčana naknada.</p>
      <h2>Česte greške</h2>
      <ul>
        <li>Obračun naknade po tekućoj, a ne po prosečnoj zaradi iz prethodnih 12 meseci.</li>
        <li>Izostavljanje minulog rada i redovnih uvećanja iz proseka.</li>
        <li>Isplata neiskorišćenog odmora „na ruke" bez poreza i doprinosa — naknada je zarada.</li>
        <li>Zamena obračuna brojem kalendarskih umesto brojem radnih dana u mesecu korišćenja odmora.</li>
        <li>Nepriznavanje srazmernog dela odmora zaposlenom koji nije proveo celu godinu kod poslodavca.</li>
      </ul>
      <h2>Pravni okvir</h2>
      <p>Godišnji odmor uređuju čl. 68–76 Zakona o radu, naknadu zarade čl. 104, a naknadu za neiskorišćeni odmor čl. 76 (Zakon o radu, „Sl. glasnik RS", prečišćen tekst). Minimum je 20 radnih dana; pravo na pun odmor stiče se posle mesec dana neprekidnog rada kod poslodavca (čl. 68), a do tada zaposleni ima pravo na srazmeran deo odmora, jednu dvanaestinu za svaki mesec rada. Raspored korišćenja odmora utvrđuje poslodavac rešenjem, uz obavezu da zaposlenog obavesti najkasnije 15 dana pre početka korišćenja (čl. 75). Zabranjeno je isplatiti naknadu umesto korišćenja odmora dok traje radni odnos — naknada za neiskorišćeni odmor moguća je isključivo pri prestanku radnog odnosa (čl. 76 stav 2).</p>
    </>),
    faq: [
      { q: "Koje podatke unosim u kalkulator godišnjeg odmora?", a: "Potrebna su dva podatka: prosečna bruto zarada zaposlenog u prethodnih 12 meseci i broj dana odmora koji se obračunava. Kalkulator sam deli prosek brojem radnih dana u mesecu i množi ga brojem dana odmora, po formuli iz čl. 104 Zakona o radu." },
      { q: "Kako se računa naknada za neiskorišćeni godišnji odmor?", a: "Pri prestanku radnog odnosa poslodavac isplaćuje naknadu za neiskorišćene dane odmora (čl. 76 Zakona o radu), po istoj formuli — dnevna osnova (prosek ÷ radni dani) pomnožena brojem neiskorišćenih dana. Naknada je bruto i podleže porezu i doprinosima." },
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

export function JubilarnaPage() {
  const prosBruto = REFERENCE_DATA.prosecnaZarada2026.bruto;
  return <ToolPage cfg={{
    slug: "jubilarna-nagrada",
    title: "Kalkulator jubilarne nagrade 2026 | PlatniListić",
    description: "Kalkulator jubilarne nagrade za 10, 20, 30 i 40 godina staža — neoporezivo 28.912 RSD (čl. 18 ZPDG), porez 10% bez doprinosa. Za Srbiju 2026. Besplatno.",
    h1: "Kalkulator jubilarne nagrade (2026)",
    breadcrumbName: "Jubilarna nagrada",
    calc: "jubilarna",
    intro: (<p>Ovaj <strong>kalkulator jubilarne nagrade</strong> računa porez za 10, 20, 30 i 40 godina rada kod istog poslodavca: neoporezivo je fiksnih <strong>28.912 RSD godišnje</strong> (ZPDG čl. 18 tač. 9), a na deo iznad plaća se samo porez 10% — bez doprinosa. Detaljna pravila i primeri: vodič <a href="/blog/jubilarna-nagrada">jubilarna nagrada 2026 — iznos i obračun</a>.</p>),
    guide: (<>
      <h2>Kako se obračunava jubilarna nagrada</h2>
      <p>Jubilarna nagrada je jednokratna isplata povodom navršenih „okruglih" godina rada kod istog poslodavca. Poreski tretman je jednostavan, ali ga mnogi izvori pogrešno prikazuju: neoporeziv je <strong>fiksan iznos od 28.912 RSD godišnje</strong> (za isplate od 1.2.2026. do 31.1.2027, „Sl. glasnik RS" 6/2026, ZPDG čl. 18 tač. 9). Na deo iznad tog iznosa plaća se <strong>samo porez na zarade od 10%</strong> — doprinosi za socijalno osiguranje se ne plaćaju, jer jubilarna nagrada nema karakter zarade (čl. 105 st. 3 u vezi sa čl. 120 tač. 1 Zakona o radu).</p>
      <h2>Neoporezivi iznos i visina nagrade — dve različite stvari</h2>
      <p><strong>Najčešća greška</strong> u tekstovima o jubilarnoj nagradi je mešanje visine isplate sa poreskim limitom. Skala „1 prosečna zarada za 10 godina, 2 za 20, 2,5 za 30, 3 za 40" jeste uobičajena visina nagrade iz kolektivnih ugovora (posebno u javnom sektoru) — ali to <em>nije</em> neoporezivi iznos. Poreski neoporezivo je uvek samo 28.912 RSD godišnje, bez obzira na jubilej. Uobičajene visine isplate uz prosečnu bruto zaradu od {prosBruto.toLocaleString("sr-RS")} RSD ({REFERENCE_DATA.prosecnaZarada2026.mesec}, RZS):</p>
      <table className="ref-table" aria-label="Uobičajena visina jubilarne nagrade 2026 i poreski tretman">
        <thead><tr><th>Jubilej</th><th>Uobičajena visina (koef. × prosek)</th><th>Neoporezivo (fiksno)</th></tr></thead>
        <tbody>
          {JUBILEJI.map((j) => (
            <tr key={j.god}>
              <td>{j.god} godina</td>
              <td>≈ {Math.round(prosBruto * j.koef).toLocaleString("sr-RS")} RSD</td>
              <td>28.912 RSD</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Radni primer</h2>
      <p>Zaposleni navršava 20 godina rada i poslodavac mu, po kolektivnom ugovoru, isplaćuje dve prosečne zarade — {(prosBruto * 2).toLocaleString("sr-RS")} RSD. Neoporezivo je 28.912 RSD; oporezivi deo je {(prosBruto * 2 - 28912).toLocaleString("sr-RS")} RSD, porez 10% iznosi {Math.round((prosBruto * 2 - 28912) * 0.1).toLocaleString("sr-RS")} RSD, a zaposleni na račun prima {Math.round(prosBruto * 2 - (prosBruto * 2 - 28912) * 0.1).toLocaleString("sr-RS")} RSD. Doprinosi se ne obračunavaju ni na jedan deo isplate.</p>
      <p>Kalkulator na ovoj stranici automatski primenjuje ovaj obrazac: izaberete jubilej (10, 20, 30 ili 40 godina), po potrebi unesete stvarni iznos isplate, a alat prikazuje neoporezivi iznos, oporezivi deo, porez i neto iznos koji zaposleni dobija na račun.</p>
      <h2>Šta se računa kao staž za jubilej</h2>
      <p>Kao i kod minulog rada, broji se <strong>samo staž kod istog poslodavca</strong>, ne ukupan staž osiguranja. Statusne promene poslodavca (spajanje, pripajanje) prenose i staž za jubilej. Više: <a href="/minuli-rad">kalkulator minulog rada</a>.</p>
      <h2>Jubilarna nagrada i minuli rad — u čemu je razlika</h2>
      <p>Jubilarna nagrada i minuli rad su dva odvojena instituta i lako se mešaju. Minuli rad je <strong>redovan mesečni dodatak na zaradu</strong> koji raste sa svakom godinom staža i isplaćuje se svakog meseca uz platu. Jubilarna nagrada je, nasuprot tome, <strong>jednokratna isplata</strong> koja se dešava samo kada zaposleni navrši tačno određen broj „okruglih" godina staža kod istog poslodavca — najčešće 10, 20, 30 ili 40. Za obračun minulog rada koristi se poseban kalkulator, dostupan na stranici <a href="/minuli-rad">kalkulator minulog rada</a>.</p>
      <h2>Zašto poslodavci isplaćuju jubilarnu nagradu</h2>
      <p>Jubilarna nagrada u praksi služi kao priznanje dugogodišnje lojalnosti zaposlenog i alat za zadržavanje kadra. Iznos, jubileji za koje se isplaćuje i eventualni dodatni uslovi (npr. minimalna ocena rada) razlikuju se od poslodavca do poslodavca, zavisno od toga šta je predviđeno kolektivnim ugovorom, opštim aktom ili pojedinačnim ugovorom o radu. Zato dva zaposlena sa istim stažem kod različitih poslodavaca mogu dobiti različit iznos nagrade — ili je uopšte ne dobiti, ako poslodavac nema takvu obavezu ugovorenu.</p>
      <h2>Trošak za poslodavca</h2>
      <p>Za poslodavca je jubilarna nagrada povoljnija od bonusa: pošto nema karakter zarade, na nju se <strong>ne plaćaju doprinosi</strong> — ni na teret zaposlenog ni na teret poslodavca. Trošak poslodavca jednak je isplaćenom iznosu, a iz njega se obustavlja samo porez od 10% na deo iznad 28.912 RSD. Za poređenje: isti iznos isplaćen kao običan bonus tereti se punim doprinosima i porezom kao zarada — vidi <a href="/blog/porez-na-bonus">porez na bonus</a>. Cela nagrada (i neoporezivi i oporezivi deo) priznaje se kao trošak poslovanja.</p>
      <h2>Kako koristiti kalkulator</h2>
      <p>Prvi korak je izbor jubileja — dugme za 10, 20, 30 ili 40 godina staža — čime kalkulator prikazuje uobičajenu visinu nagrade za taj jubilej (koeficijent × prosečna bruto zarada u RS) i odmah računa porez na nju. Ako vaš poslodavac isplaćuje drugačiji iznos, unesite ga u polje za iznos; kalkulator prikazuje neoporezivi deo (28.912 RSD), oporezivi deo, porez od 10% i konačan neto koji zaposleni prima na račun.</p>
      <h2>Pravni okvir</h2>
      <p>Neoporezivi iznos propisuje čl. 18 tač. 9 Zakona o porezu na dohodak građana (usklađuje se svakog februara — 28.912 RSD važi za isplate od 1.2.2026. do 31.1.2027, „Sl. glasnik RS" 6/2026). Obavezu isplate i visinu utvrđuje kolektivni ugovor ili ugovor o radu (Zakon o radu, čl. 120 tač. 1) — jubilarna nagrada nije zakonska obaveza, ali ako je poslodavac ugovorio, mora je isplatiti.</p>
    </>),
    faq: [
      { q: "Koliki je neoporezivi iznos jubilarne nagrade u 2026?", a: "28.912 RSD godišnje, za isplate od 1. februara 2026. do 31. januara 2027. (ZPDG čl. 18 tač. 9, „Sl. glasnik RS” 6/2026). Neoporezivi iznos je fiksan i isti za sve jubileje — ne zavisi od broja godina staža ni od prosečne zarade." },
      { q: "Da li se plaća porez na jubilarnu nagradu?", a: "Na deo do 28.912 RSD godišnje ne plaća se ništa. Na deo iznad plaća se samo porez na zarade od 10% — doprinosi se ne plaćaju, jer jubilarna nagrada nema karakter zarade (čl. 105 st. 3 Zakona o radu)." },
      { q: "Koliko iznosi jubilarna nagrada za 10, 20, 30 ili 40 godina?", a: `Visinu određuje kolektivni ugovor ili ugovor o radu. Uobičajena praksa (naročito u javnom sektoru) je 1 prosečna zarada za 10 godina, 2 za 20, 2,5 za 30 i 3 za 40 godina — uz prosek od ${prosBruto.toLocaleString("sr-RS")} RSD bruto to je približno ${Math.round(prosBruto).toLocaleString("sr-RS")} do ${(prosBruto * 3).toLocaleString("sr-RS")} RSD. To je visina isplate, a ne poreski limit.` },
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

export function UgovorODeluPage() {
  return <ToolPage cfg={{
    slug: "ugovor-o-delu",
    title: "Kalkulator ugovora o delu 2026 — bruto u neto | PlatniListić",
    description: "Za bruto 100.000 RSD po ugovoru o delu neto je 64.800 RSD (56.560 ako se plaća i zdravstveno). Porez 20%, PIO 24%, normirani troškovi 20%. Obračun za 2026.",
    h1: "Kalkulator ugovora o delu (2026)",
    breadcrumbName: "Ugovor o delu",
    calc: "full",
    intro: (<p>Ovaj <strong>kalkulator ugovora o delu</strong> računa porez i doprinose za honorarni angažman u 2026. Za detaljan obračun po vrsti angažmana koristite kalkulator ispod.</p>),
    guide: (<>
      <h2>Kako se obračunava ugovor o delu</h2>
      <p>Ugovor o delu je oblik angažovanja van radnog odnosa — naknada se ne oporezuje kao zarada, već kao „drugi prihod" po posebnim pravilima. Obračun uvek kreće od <strong>bruto</strong> iznosa, u tri koraka: (1) od bruto naknade oduzme se <strong>20% normiranih troškova</strong>, čime se dobija osnovica za porez i doprinose (oporezivo je, dakle, 80% bruto naknade); (2) na tu osnovicu obračunava se <strong>porez na dohodak građana 20%</strong> i <strong>doprinos za PIO 24%</strong>; (3) <strong>doprinos za zdravstveno osiguranje 10,3%</strong> obračunava se na istu osnovicu, ali <strong>samo ako izvršilac nije već zdravstveno osiguran po drugom osnovu</strong> — npr. ako je zaposlen kod drugog poslodavca, penzioner ili osiguran kao član porodice. Formula osnovice: osnovica = bruto − (bruto × 0,20) = bruto × 0,8. Ako je naručilac posla firma ili preduzetnik, on obračunava, obustavlja i uplaćuje sve dažbine i podnosi PPP-PD prijavu, pa izvršilac dobija već „očišćen" neto iznos. Ako je naručilac fizičko lice bez zaposlenih, obavezu obračuna i prijave (obrazac PP OPO, u roku od 30 dana od isplate) ima sam izvršilac. Detaljan vodič sa dodatnim primerima: <a href="/blog/ugovor-o-delu">ugovor o delu 2026</a>.</p>
      <h2>Parametri obračuna 2026</h2>
      <table className="ref-table" aria-label="Parametri obračuna ugovora o delu 2026">
        <thead><tr><th>Stavka</th><th>Vrednost</th></tr></thead>
        <tbody>
          <tr><td>Normirani troškovi</td><td>20% bruto naknade</td></tr>
          <tr><td>Osnovica za porez i doprinose</td><td>bruto − 20% = bruto × 0,8</td></tr>
          <tr><td>Porez na dohodak građana</td><td>20% na osnovicu</td></tr>
          <tr><td>Doprinos za PIO</td><td>24% na osnovicu</td></tr>
          <tr><td>Doprinos za zdravstveno osiguranje</td><td>10,3% na osnovicu — samo ako lice nije osigurano po drugom osnovu</td></tr>
        </tbody>
      </table>
      <h2>Radni primer (bruto 100.000 RSD)</h2>
      <p>Za ugovorenu bruto naknadu od 100.000 RSD: normirani troškovi su 100.000 × 20% = 20.000 RSD, pa je osnovica 100.000 − 20.000 = <strong>80.000 RSD</strong>. Na tu osnovicu: porez 80.000 × 20% = <strong>16.000 RSD</strong>, PIO 80.000 × 24% = <strong>19.200 RSD</strong>, zdravstveno (ako se plaća) 80.000 × 10,3% = <strong>8.240 RSD</strong>. Ako je izvršilac već osiguran po drugom osnovu (npr. zaposlen kod drugog poslodavca ili penzioner), zdravstveno se ne obustavlja, pa je neto = 100.000 − 16.000 − 19.200 = <strong>64.800 RSD</strong>. Ako izvršilac nije osiguran ni po jednom drugom osnovu, obustavlja se i zdravstveno, pa je neto = 100.000 − 16.000 − 19.200 − 8.240 = <strong>56.560 RSD</strong>. Razlika između ova dva scenarija — 7.680 RSD — pokazuje zašto je status zdravstvenog osiguranja izvršioca ključan podatak pre isplate, ne samo administrativna formalnost.</p>
      <h2>Česte greške</h2>
      <ul>
        <li>Zaborav da se 20% normiranih troškova prvo oduzme od bruto iznosa — porez i doprinosi se pogrešno obračunavaju na ceo bruto umesto na osnovicu (bruto × 0,8), što daje precenjen iznos dažbina.</li>
        <li>Pretpostavka da se zdravstveni doprinos od 10,3% uvek plaća — on se obračunava samo kada izvršilac nije već zdravstveno osiguran po drugom osnovu (zaposlenje, penzija, status člana porodice osiguranika).</li>
        <li>Mešanje ugovora o delu sa ugovorom o radu ili privremenim i povremenim poslovima — svaki ima drugačiju osnovicu i drugačija prava (ugovor o delu ne donosi pravo na godišnji odmor, bolovanje ni otpremninu).</li>
        <li>Izostavljanje PPP-PD, odnosno PP OPO prijave kada naručilac posla nije pravno lice — obaveza prijave i uplate tada prelazi na samog izvršioca, u roku od 30 dana od isplate.</li>
      </ul>
      <h2>Pravni okvir</h2>
      <p>Poresku osnovicu, stopu poreza (20%) i normirane troškove (20%) propisuje Zakon o porezu na dohodak građana, koji naknadu po ugovoru o delu tretira kao „prihod od pružanja usluga" odnosno drugi prihod fizičkog lica. Stope doprinosa za PIO (24%) i zdravstveno osiguranje (10,3%) propisuje Zakon o doprinosima za obavezno socijalno osiguranje; zdravstveni doprinos se obustavlja samo ako lice nije osigurano po drugom osnovu, jer se time izbegava dvostruko plaćanje doprinosa za istu vrstu osiguranja. Sâm ugovor o delu kao pravni institut (predmet, prava i obaveze strana) uređen je Zakonom o obligacionim odnosima — reč je o angažovanju van radnog odnosa, pa se ne primenjuje Zakon o radu — dok poreski tretman naknade uređuju isključivo pomenuta dva poreska zakona.</p>
    </>),
    faq: [
      { q: "Koliki je porez na ugovor o delu?", a: "Porez je 20% na osnovicu, koju čini bruto naknada umanjena za 20% normiranih troškova (oporezivo je 80% prihoda). Za bruto 100.000 RSD osnovica je 80.000 RSD, a porez 16.000 RSD." },
      { q: "Zašto mi kalkulator daje dva različita neto iznosa?", a: "Zato što zdravstveni doprinos od 10,3% zavisi od statusa izvršioca: plaća se samo ako lice nije osigurano po drugom osnovu (zaposlenje, penzija). Za bruto 100.000 RSD neto je 64.800 RSD kada je lice već osigurano, odnosno 56.560 RSD kada nije — zato u kalkulatoru označite ispravan status." },
      { q: "Kalkulator ugovora o delu 2026 — šta unosim?", a: "Unesite ugovorenu bruto naknadu i označite da li je izvršilac zdravstveno osiguran po drugom osnovu (zaposlenje, penzija). Kalkulator prikazuje osnovicu, porez, doprinose za PIO i zdravstvo (ako se plaća) i konačan neto iznos." },
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
  const min = REFERENCE_DATA.minimalnaZarada2026;
  return <ReferencePage cfg={{
    slug: "prosecna-zarada",
    title: `Prosečna zarada ${p.mesec} — neto ${p.neto.toLocaleString("sr-RS")} RSD (RZS) | PlatniListić`,
    description: `Neto ${p.neto.toLocaleString("sr-RS")} RSD, bruto ${p.bruto.toLocaleString("sr-RS")}, medijalna ${p.medijalnaNeto.toLocaleString("sr-RS")} RSD (${p.mesec}, RZS). Tabela prosečnih zarada po mesecima i godinama.`,
    h1: "Prosečna zarada u Srbiji — zvanična tabela RZS",
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

      <h2>Kako i kada RZS objavljuje podatak o prosečnoj zaradi</h2>
      <p>Republički zavod za statistiku (RZS) objavljuje podatak o prosečnoj mesečnoj zaradi u redovnom mesečnom statističkom saopštenju, sa uobičajenim zaostatkom od oko 55 dana po isteku meseca — podatak za {p.mesec} objavljen je {p.objavljeno}. Zaostatak postoji zato što je za obračun proseka potrebno prikupiti i obraditi izveštaje o isplaćenim zaradama od velikog broja poslodavaca u zemlji, pa je reč o konačnom, a ne procenjenom broju. Zbog ovog zaostatka, iznos koji važi „danas" u praksi je uvek podatak za jedan od prethodnih meseci — to je i razlog zašto se u zakonskim obračunima (otpremnina, jubilarna nagrada, cenzus) izričito koristi formulacija „poslednji objavljeni podatak", a ne podatak za tekući mesec, koji u trenutku obračuna još nije objavljen.</p>

      <h2>Prosečna zarada i minimalac</h2>
      <p>Poređenje sa minimalnom zaradom pokazuje raspon zarada u Srbiji. Prosečna neto zarada od {p.neto.toLocaleString("sr-RS")} RSD je oko {(p.neto / min.netoMesecno).toLocaleString("sr-RS", { maximumFractionDigits: 1 })} puta veća od reprezentativnog neto iznosa minimalne zarade od {min.netoMesecno.toLocaleString("sr-RS")} RSD (za prosečan fond od 174 radna časa). Ipak, budući da je medijalna zarada ({p.medijalnaNeto.toLocaleString("sr-RS")} RSD) znatno bliža minimalcu nego prosečnoj zaradi, veliki broj zaposlenih u Srbiji prima platu koja je bliža minimalnoj nego prosečnoj zaradi — što je dodatna potvrda da prosek precenjuje tipičnu platu. Detalji o minimalnoj zaradi: <a href="/minimalna-zarada">minimalna zarada 2026</a>.</p>

      <h2>Prosečna vs medijalna zarada</h2>
      <p>Prosečna (aritmetička sredina) i medijalna zarada mere dve različite stvari, pa razlika između njih od {(p.neto - p.medijalnaNeto).toLocaleString("sr-RS")} RSD ({p.neto.toLocaleString("sr-RS")} − {p.medijalnaNeto.toLocaleString("sr-RS")} RSD) nije greška u podacima, nego posledica same statistike. Prosečna zarada se dobija tako što se saberu sve isplaćene zarade u zemlji i podele brojem zaposlenih — svaka zarada, koliko god bila visoka, ulazi u zbir punom težinom. Medijalna zarada je, nasuprot tome, ona vrednost koja deli sve zaposlene na dve jednake polovine: tačno polovina zarađuje manje od {p.medijalnaNeto.toLocaleString("sr-RS")} RSD, a polovina više. Zato mali broj vrlo visokih zarada (npr. u IT sektoru, menadžmentu ili pojedinim visokoplaćenim strukama) povlači prosek naviše, dok medijalna zarada na to gotovo uopšte ne reaguje. Kada je prosek osetno viši od medijale — kao što je slučaj u Srbiji — to je znak da raspodela zarada nije simetrična, odnosno da manjina zaposlenih sa visokim primanjima diže aritmetičku sredinu iznad onoga što tipičan zaposleni stvarno prima na račun. Za procenu „tipične" plate medijalna zarada je zato pouzdaniji orijentir; prosečna zarada ostaje standardna referentna veličina u zakonskim obračunima (otpremnina, jubilarna nagrada, cenzus za godišnji porez), jer je to podatak koji RZS zvanično objavljuje i na koji se propisi pozivaju.</p>

      <h2>Prosečna zarada u evrima</h2>
      <p>Po srednjem kursu NBS od {p.kursEur.toLocaleString("sr-RS")} RSD za 1 €, prosečna neto zarada od {p.neto.toLocaleString("sr-RS")} RSD iznosi približno {(p.neto / p.kursEur).toLocaleString("sr-RS", { maximumFractionDigits: 0 })} € mesečno. Prosečna bruto zarada od {p.bruto.toLocaleString("sr-RS")} RSD u evrima je oko {(p.bruto / p.kursEur).toLocaleString("sr-RS", { maximumFractionDigits: 0 })} €. Ovo poređenje je korisno za orijentaciju (npr. pri poređenju sa regionom), ali treba imati u vidu da je reč o preračunu po tekućem kursu, a ne o zvaničnom pokazatelju kupovne moći — kurs dinara prema evru je u Srbiji dugo relativno stabilan, pa se iznos u evrima ne menja mnogo iz meseca u mesec, za razliku od dinarskog iznosa koji prati rast nominalnih zarada.</p>

      <h2>Gde se koristi prosečna zarada u obračunima</h2>
      <p>Prosečna zarada u Republici Srbiji nije samo statistički pokazatelj — ona je i zakonska osnovica u nekoliko konkretnih obračuna na zaradi:</p>
      <ul>
        <li><strong>Otpremnina za odlazak u penziju</strong> — zakonski minimum iznosi dve prosečne (neto) zarade u Republici Srbiji, bez obzira na visinu lične plate zaposlenog. Detaljno: <a href="/otpremnina">kalkulator otpremnine</a>.</li>
        <li><strong>Jubilarna nagrada</strong> — visina isplate se u kolektivnim ugovorima najčešće određuje kao koeficijent (1×, 2×, 2,5× ili 3×, zavisno od jubileja) pomnožen prosečnom bruto zaradom u RS; poreski neoporezivo je fiksnih 28.912 RSD godišnje. Detaljno: <a href="/jubilarna-nagrada">kalkulator jubilarne nagrade</a>.</li>
        <li><strong>Cenzus za godišnji porez na dohodak</strong> — neoporezivi prag za obavezu podnošenja godišnje poreske prijave iznosi tri prosečne godišnje zarade u RS (godišnja zarada = 12 × prosečna mesečna bruto zarada). Detaljno: <a href="/godisnji-porez">kalkulator godišnjeg poreza</a>.</li>
      </ul>
      <p>U sva tri slučaja koristi se poslednji objavljeni podatak RZS o prosečnoj zaradi u Republici Srbiji — ne prosek unutar konkretne firme ili sektora. Za poređenje sa minimalnom zaradom pogledajte <a href="/minimalna-zarada">minimalnu zaradu 2026</a>.</p>

      <h2>Bruto vs neto prosečna zarada</h2>
      <p>Razlika između prosečne bruto zarade ({p.bruto.toLocaleString("sr-RS")} RSD) i prosečne neto zarade ({p.neto.toLocaleString("sr-RS")} RSD) — {(p.bruto - p.neto).toLocaleString("sr-RS")} RSD — čine porez na zaradu i doprinosi za obavezno socijalno osiguranje na teret zaposlenog, koji se obustavljaju iz bruto iznosa pre isplate na račun. Pregled svih stopa doprinosa (PIO, zdravstveno, nezaposlenost) dat je na stranici <a href="/stope-doprinosa-2026">stope doprinosa 2026</a>. Ako želite da izračunate koliko bi neto iznosila neka druga bruto (ili obrnuto, neto u bruto) zarada, koristite <a href="/bruto-neto">bruto u neto kalkulator</a>.</p>
      <p>Ova razlika između bruto i neto proseka je i razlog zašto je bitno obratiti pažnju na to koja se od dve osnovice koristi u konkretnom obračunu. Otpremnina za odlazak u penziju, na primer, računa se od <em>neto</em> proseka, dok se uobičajena visina jubilarne nagrade (po kolektivnim ugovorima) i cenzus za godišnji porez računaju od <em>bruto</em> proseka — zamena jedne osnovice drugom u obračunu dovodi do pogrešnog rezultata, jer je bruto iznos uvek veći od neto za otprilike jednu trećinu.</p>
    </>),
    faq: [
      { q: "Za koji mesec važi poslednji zvanični podatak RZS?", a: `Tabela prikazuje poslednji objavljeni podatak Republičkog zavoda za statistiku — za ${p.mesec}: neto ${p.neto.toLocaleString("sr-RS")} RSD, bruto ${p.bruto.toLocaleString("sr-RS")} RSD. RZS objavljuje zaradu za prethodni mesec sa oko dva meseca zadrške, pa se tabela ažurira po svakom saopštenju.` },
      { q: "Gde da vidim prosečnu zaradu po mesecima i godinama?", a: `Tabela na ovoj stranici daje zvanične iznose RZS po mesecima (neto, bruto i medijalna zarada), sa uporednim pregledom po godinama. Za analizu proseka po sektorima, gradovima i u evrima pogledajte vodič „prosečna plata u Srbiji 2026" na blogu.` },
      { q: "Kolika je prosečna plata u Beogradu?", a: `Podatak od ${p.neto.toLocaleString("sr-RS")} RSD neto (${p.mesec}) je republički prosek koji RZS objavljuje za celu Srbiju, ne posebno za Beograd. Pregled proseka po gradovima i sektorima potražite u vodiču "prosečna plata u Srbiji" na blogu.` },
      { q: "Šta je medijalna zarada i zašto se razlikuje od prosečne?", a: `Medijalna zarada je vrednost koja deli sve zaposlene na dve jednake polovine — polovina zarađuje manje, polovina više. Za razliku od proseka, na nju ne utiče mali broj vrlo visokih primanja, pa je bliža onome što tipičan zaposleni stvarno prima. U ${p.mesec} medijalna neto zarada (${p.medijalnaNeto.toLocaleString("sr-RS")} RSD) je za ${(p.neto - p.medijalnaNeto).toLocaleString("sr-RS")} RSD niža od prosečne (${p.neto.toLocaleString("sr-RS")} RSD).` },
    ],
    related: [
      { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
      { href: "/minimalna-zarada", label: "Minimalna zarada — minimalac 2026. i 2027." },
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
    description: "Neoporezivi iznos zarade za 2026. je 34.221 RSD mesečno — ušteda na porezu 3.422 RSD mesečno (41.064 RSD godišnje). Primer obračuna i zvanični izvor.",
    h1: "Neoporezivi iznos zarade za 2026.",
    breadcrumbName: "Neoporezivi iznos 2026",
    body: (<>
      <p>Neoporezivi iznos zarade je deo mesečne bruto zarade koji je izuzet od poreza na zarade. Na preostali deo bruto zarade iznad ovog iznosa primenjuje se stopa poreza od 10%.</p>
      <table className="ref-table">
        <tbody>
          <tr><th>Neoporezivi iznos (2026)</th><td>{nonTaxable.toLocaleString("sr-RS")} RSD</td></tr>
          <tr><th>Neoporezivi iznos (2025)</th><td>28.423 RSD</td></tr>
          <tr><th>Stopa poreza na zaradu</th><td>10%</td></tr>
        </tbody>
      </table>
      <p>Neoporezivi iznos se primenjuje mesečno, po zaposlenom. Znači da se porez na zaradu plaća samo na onaj deo bruto zarade koji prelazi {nonTaxable.toLocaleString("sr-RS")} RSD. Ovo direktno povećava neto iznos koji zaposleni prima na račun. Vidite kako neoporezivi iznos utiče na vaš obračun: <a href="/bruto-neto">bruto u neto kalkulator</a>. Saznajte više o razlici između bruto i neto zarade: <a href="/bruto-neto">bruto neto razlika</a>.</p>

      <h2>Neoporezivi iznos zarade 2026 — zvanični izvor</h2>
      <p>Neoporezivi deo zarade za 2026. iznosi <strong>{nonTaxable.toLocaleString("sr-RS")} RSD</strong> i primenjuje se na isplate zarada <strong>od 1. januara 2026</strong>. Iznos je utvrđen izmenama Zakona o porezu na dohodak građana („Sl. glasnik RS" br. 109/2025), a ne februarskim usklađivanjem ostalih neoporezivih primanja. Zvanične podatke objavljuju <a href="https://www.mfin.gov.rs/" target="_blank" rel="noopener noreferrer">Ministarstvo finansija</a> i <a href="https://www.purs.gov.rs/lat/fizicka-lica/porez-na-dohodak-gradjana/zarade.html" target="_blank" rel="noopener noreferrer">Poreska uprava Srbije</a>. Prvo naredno usklađivanje je 1. januara 2027.</p>

      <h2>Primer obračuna sa neoporezivim iznosom</h2>
      <p>Za zaposlenog sa bruto zaradom od 100.000 RSD, poreska osnovica je 100.000 − {nonTaxable.toLocaleString("sr-RS")} = {(100000 - nonTaxable).toLocaleString("sr-RS")} RSD, a porez (10%) iznosi {Math.round((100000 - nonTaxable) * 0.1).toLocaleString("sr-RS")} RSD. Bez neoporezivog iznosa porez bi bio 10.000 RSD, pa je mesečna ušteda {(10000 - Math.round((100000 - nonTaxable) * 0.1)).toLocaleString("sr-RS")} RSD. Detaljan vodič: <a href="/bruto-neto">razlika između bruto i neto zarade</a>.</p>

      <h2>Ostali neoporezivi iznosi 2026 — prevoz, dnevnica, solidarna pomoć</h2>
      <p>Pored neoporezivog dela zarade, Zakon o porezu na dohodak građana (čl. 9, 18 i 21a) propisuje neoporezive iznose i za naknade troškova i druga primanja zaposlenih. Ovi iznosi su usklađeni indeksom potrošačkih cena i važe <strong>od 1. februara 2026. do 31. januara 2027.</strong> („Sl. glasnik RS" br. 6/2026):</p>
      <table className="ref-table" aria-label="Neoporezivi iznosi 2026 — naknade troškova i druga primanja">
        <thead><tr><th>Primanje</th><th>Neoporezivo do (RSD)</th></tr></thead>
        <tbody>
          <tr><td>Naknada troškova prevoza za dolazak i odlazak sa rada (čl. 18 t. 1)</td><td>5.782 mesečno</td></tr>
          <tr><td>Dnevnica za službeno putovanje u zemlji (t. 2)</td><td>3.471</td></tr>
          <tr><td>Dnevnica za službeno putovanje u inostranstvo (t. 3)</td><td>90 € dnevno</td></tr>
          <tr><td>Naknada prevoza na službenom putovanju (t. 5)</td><td>10.121</td></tr>
          <tr><td>Solidarna pomoć — bolest, rehabilitacija, invalidnost (t. 7)</td><td>57.827</td></tr>
          <tr><td>Poklon deci zaposlenih do 15 godina (Nova godina i Božić) (t. 8)</td><td>14.457 godišnje</td></tr>
          <tr><td>Jubilarna nagrada (t. 9)</td><td>28.912 godišnje</td></tr>
          <tr><td>Pomoć u slučaju smrti člana porodice zaposlenog (t. 9a)</td><td>101.194</td></tr>
          <tr><td>Pomoć porodici u slučaju smrti zaposlenog/penzionera (čl. 9 t. 9)</td><td>101.194</td></tr>
          <tr><td>Stipendije i krediti učenika i studenata (čl. 9 t. 12)</td><td>44.325 mesečno</td></tr>
          <tr><td>Premija dobrovoljnog zdravstvenog osiguranja / penzijski fond (čl. 21a)</td><td>8.677 mesečno</td></tr>
        </tbody>
      </table>
      <p>Za razliku od neoporezivog dela zarade (koji važi od 1. januara), ovi iznosi se menjaju svakog <strong>1. februara</strong>. Obračun jubilarne nagrade sa neoporezivim delom radi <a href="/jubilarna-nagrada">kalkulator jubilarne nagrade</a>, a poreski tretman bonusa i nagrada objašnjava vodič <a href="/blog/porez-na-bonus">porez na bonus</a>. Pravila za topli obrok i regres (koji se oporezuju kao zarada, bez posebnog neoporezivog iznosa) su u vodiču <a href="/blog/topli-obrok-i-regres">topli obrok i regres</a>.</p>
    </>),
    faq: [
      { q: "Koliki je neoporezivi iznos zarade u 2026?", a: `Neoporezivi iznos zarade za 2026. iznosi ${nonTaxable.toLocaleString("sr-RS")} RSD mesečno i primenjuje se od 1. januara 2026. Na deo zarade iznad ovog iznosa primenjuje se porez od 10%.` },
      { q: "Kako se primenjuje neoporezivi iznos?", a: "Neoporezivi iznos se oduzima od bruto 1 zarade, a porez od 10% plaća se samo na razliku. Na primer, za bruto zaradu od 100.000 RSD, poreska osnovica je 100.000 − " + nonTaxable.toLocaleString("sr-RS") + " = " + (100000 - nonTaxable).toLocaleString("sr-RS") + " RSD, a porez iznosi 10% od toga." },
      { q: "Da li se neoporezivi iznos odnosi na svaki mesec?", a: "Da, neoporezivi iznos se primenjuje mesečno, posebno za svakog zaposlenog. Ne kumulira se — svaki mesec se iznova oduzima od bruto zarade pre obračuna poreza." },
      { q: "Koliki je neoporezivi iznos za prevoz u 2026?", a: "Naknada dokumentovanih troškova prevoza za dolazak i odlazak sa rada neoporeziva je do 5.782 RSD mesečno, za isplate od 1. februara 2026. do 31. januara 2027. („Sl. glasnik RS” 6/2026)." },
      { q: "Kolika je neoporeziva dnevnica za službeni put u 2026?", a: "Za službeno putovanje u zemlji neoporezivo je do 3.471 RSD po dnevnici, a za put u inostranstvo do 90 evra dnevno (od 1.2.2026)." },
      { q: "Kada se usklađuju neoporezivi iznosi?", a: "Neoporezivi iznos zarade usklađuje se od 1. januara (34.221 RSD za 2026, izmene ZPDG „Sl. glasnik RS” 109/2025), a ostali neoporezivi iznosi — prevoz, dnevnice, solidarna pomoć, jubilarna nagrada — od 1. februara svake godine („Sl. glasnik RS” 6/2026)." },
    ],
    related: [
      { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
      { href: "/stope-doprinosa-2026", label: "Stope doprinosa 2026" },
      { href: "/minimalna-zarada", label: "Minimalna zarada — minimalac 2026. i 2027." },
      { href: "/jubilarna-nagrada", label: "Kalkulator jubilarne nagrade" },
    ],
    sourceNote: <>Izvor: Zakon o porezu na dohodak građana — izmene „Sl. glasnik RS" br. 109/2025 (neoporezivi deo zarade od 1.1.2026) i usklađeni iznosi „Sl. glasnik RS" br. 6/2026 (od 1.2.2026); Ministarstvo finansija i Poreska uprava.</>,
  }} />;
}

export function StopeDoprinosaPage() {
  const R = DEFAULT_RATES;
  const zaposleniUkupno = R.pioPct_emp + R.health_emp + R.unemp_emp;
  const poslodavacUkupno = R.pio_er + R.health_er;
  return <ReferencePage cfg={{
    slug: "stope-doprinosa-2026",
    title: "Stope doprinosa 2026 — ukupno 35,05% na zaradu | PlatniListić",
    description: "Doprinosi 2026: zaposleni 19,90% + poslodavac 15,15% = ukupno 35,05% na bruto zaradu. Tabela svih stopa i osnovica — izračunajte koliko ide sa vaše plate.",
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
  const R = DEFAULT_RATES;
  const pz = REFERENCE_DATA.prosecnaZarada2026;
  // Neto → bruto 1 po zvaničnoj formuli za zarade iznad neoporezivog iznosa:
  // bruto = (neto − neoporezivi × 10%) / (1 − 19,90% − 10%). PROVERENO 5.8.2026
  // uz zvaničnu Paragraf tabelu minimalne zarade 2026 (160 h → 79.797,29;
  // 168 h → 84.031,24; 176 h → 88.265,19; 184 h → 92.499,14) — poklapa se u paru.
  const dopZap = (R.pioPct_emp + R.health_emp + R.unemp_emp) / 100; // 19,90%
  const dopPosl = (R.pio_er + R.health_er) / 100; // 15,15%
  const tax = R.taxRate / 100; // 10%
  const netoUBruto = (neto) => (neto - R.nonTaxable * tax) / (1 - dopZap - tax);
  const fmt2 = (n) => n.toLocaleString("sr-RS", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmt0 = (n) => Math.round(n).toLocaleString("sr-RS");
  const perMonth = REFERENCE_DATA.radniDani2026.map((r) => {
    const neto = m.cenaRadnogCasaNeto * r.radniSati;
    return { mesec: r.mesec, dani: r.radniDani, sati: r.radniSati, praznici: r.praznici, neto, bruto: netoUBruto(neto) };
  });
  const ukupnoSati = REFERENCE_DATA.radniDani2026.reduce((s, r) => s + r.radniSati, 0); // 2.088 h
  const godisnjeNeto = m.cenaRadnogCasaNeto * ukupnoSati; // 774.648 RSD
  const godisnjeBruto = perMonth.reduce((s, r) => s + r.bruto, 0);
  // --- Minimalac 2027 (Odluka Vlade RS od 20.8.2026) ---------------------------------
  // Neto satnica je konačna; bruto se izvodi istom formulom, ali uz VAŽEĆI neoporezivi
  // iznos (34.221), jer predlog od 37.369 za 2027. još nije izglasan.
  const m27 = REFERENCE_DATA.minimalnaZarada2027;
  const perMonth2027 = REFERENCE_DATA.radniDani2027.map((r) => {
    const neto = m27.cenaRadnogCasaNeto * r.radniSati;
    return { mesec: r.mesec, dani: r.radniDani, sati: r.radniSati, neto, bruto: netoUBruto(neto) };
  });
  const ukupnoSati27 = REFERENCE_DATA.radniDani2027.reduce((s, r) => s + r.radniSati, 0); // 2.088 h
  const godisnjeNeto27 = m27.cenaRadnogCasaNeto * ukupnoSati27;
  // Ako se usvoji neoporezivi 37.369, svaki bruto pada za KONSTANTNIH 449,07 RSD:
  // (37.369 − 34.221) × 10% / 70,1%. Ne zavisi od fonda sati.
  const brutoDelta27 = ((m27.neoporeziviPredlog2027 - R.nonTaxable) * tax) / (1 - dopZap - tax);
  // Primer obračuna prati TEKUĆI mesec — bake-uje se pri svakom deploy-u (isti
  // obrazac kao title na /radni-dani-2026); van 2026. se drži januar/decembar.
  const now = new Date();
  const mIdx = now.getFullYear() > 2026 ? 11 : now.getFullYear() < 2026 ? 0 : now.getMonth();
  const ex = perMonth[mIdx];
  const exMesecLc = ex.mesec.toLowerCase();
  // "21 radni dan" / "22 radna dana" / "20 radnih dana" — slaganje broja i imenice.
  const dLabel = (n) => { const j = n % 10, k = n % 100; if (j === 1 && k !== 11) return "radni dan"; if (j >= 2 && j <= 4 && (k < 12 || k > 14)) return "radna dana"; return "radnih dana"; };
  // Lokativ se NE dobija dodavanjem "u" na nominativ: septembar → septembru, ne
  // "septembaru" (isto oktobar/novembar/decembar). Zato tabela, a ne konkatenacija.
  const MESECI_LOK = ["januaru", "februaru", "martu", "aprilu", "maju", "junu", "julu", "avgustu", "septembru", "oktobru", "novembru", "decembru"];
  const exMesecLok = MESECI_LOK[mIdx];
  const exDoprinosi = ex.bruto * dopZap;
  const exPorez = (ex.bruto - R.nonTaxable) * tax;
  const exPoslodavac = ex.bruto * dopPosl;
  // Rok isplate po čl. 110 ZoR: „najkasnije do kraja tekućeg meseca za prethodni
  // mesec" — „tekući" je mesec ISPLATE, ne mesec rada, pa zarada za avgust dospeva
  // do kraja septembra. Zato se ovde računa mesec posle primera; decembar → januar.
  // VERIFIKOVANO 19.8.2026 uz Paragraf i prečišćen tekst ZoR (čl. 110, dva stava).
  // Genitiv posle "do kraja": "do kraja septembra", ne "do kraja septembar".
  const MESECI_GEN = ["januara", "februara", "marta", "aprila", "maja", "juna", "jula", "avgusta", "septembra", "oktobra", "novembra", "decembra"];
  const exSledeciMesecGen = (mIdx === 11 ? "januara 2027" : `${MESECI_GEN[mIdx + 1]} 2026`);
  // Minimalna cena rada po godinama — Paragraf, arhiva minimalne zarade
  // + odluke u Sl. glasniku (2025: 66/2024 i vanredna korekcija od 1.10.2025).
  // PROVERENO 5.8.2026.
  const istorija = [
    { god: "2019", cena: "155,30" },
    { god: "2020", cena: "172,54" },
    { god: "2021", cena: "183,93" },
    { god: "2022", cena: "201,22" },
    { god: "2023", cena: "230,00" },
    { god: "2024", cena: "271,00" },
    { god: "2025 (januar–septembar)", cena: "308,00" },
    { god: "2025 (od 1. oktobra)", cena: "337,00" },
    { god: "2026 (od 1. januara)", cena: "371,00" },
    { god: "2027 (od 1. januara)", cena: "405,00" },
  ];
  return <ReferencePage cfg={{
    // Evergreen slug (bez godine) — glavna poluga za head term "minimalna zarada":
    // URL se NE menja sa godinom, sadržaj se osvežava u mestu (audit 13.8.2026).
    slug: "minimalna-zarada",
    title: `Minimalna zarada 2026. i minimalac 2027 — ${m27.cenaRadnogCasaNeto} RSD/h | PlatniListić`,
    description: `Minimalac 2027 iznosi ${m27.cenaRadnogCasaNeto} RSD neto po satu (+9,2%, odluka Vlade od 20.8.2026). Minimalac 2026: ${m.cenaRadnogCasaNeto} RSD/h. Tabele po mesecima za obe godine, neto i bruto.`,
    h1: `Minimalna zarada u Srbiji — minimalac ${m.cenaRadnogCasaNeto} RSD po satu u 2026, ${m27.cenaRadnogCasaNeto} RSD u 2027.`,
    breadcrumbName: "Minimalna zarada",
    body: (<>
      {/* Ukratko — subjekat rečenice je KOLOKVIJALNI termin „minimalac", jer se AI
          odgovori izvlače iz rečenica u kojima je traženi pojam subjekat, a ne iz
          zagrade. Do 19.8.2026. je „minimalac" stajao samo u zagradi i sajt je bio
          citiran na „minimalna zarada", a izostavljan na „minimalac". */}
      <p className="ukratko"><strong>Minimalac za 2026. godinu iznosi {m.cenaRadnogCasaNeto} RSD neto po radnom času.</strong> Minimalac za {exMesecLc} 2026. iznosi <strong>{ex.neto.toLocaleString("sr-RS")},00 RSD neto</strong> ({ex.sati} radnih sati × {m.cenaRadnogCasaNeto} RSD), odnosno <strong>{fmt2(ex.bruto)} RSD bruto 1</strong>. Iznos važi od {m.vaziOd} („Sl. glasnik RS“ br. 78/2025) i predstavlja zakonski minimum za puno radno vreme kod svakog poslodavca, u svakoj delatnosti. Minuli rad, topli obrok i regres obračunavaju se <strong>povrh</strong> minimalca (čl. 111 Zakona o radu). <strong>Minimalac za 2027. godinu iznosi {m27.cenaRadnogCasaNeto} RSD neto po radnom času</strong> — Vlada je odluku donela 20. avgusta 2026, a primenjuje se od 1. januara 2027.</p>
      <p><strong>Minimalna zarada</strong> (minimalac) u Srbiji za 2026. godinu iznosi <strong>{m.cenaRadnogCasaNeto} RSD neto po radnom času</strong> (važi od {m.vaziOd}, „Sl. glasnik RS“ br. 78/2025). To je jedini fiksan iznos — mesečni minimalac nije fiksan, već se dobija množenjem satnice fondom radnih sati u mesecu (160–184 sata), pa varira iz meseca u mesec: neto od {m.netoMin.toLocaleString("sr-RS")} do {m.netoMax.toLocaleString("sr-RS")} RSD. Satnica je za <strong>10,1%</strong> viša od one koja je važila od oktobra 2025. (337 RSD), a za <strong>20,5%</strong> viša nego početkom 2025. (308 RSD).</p>
      <table className="ref-table">
        <tbody>
          <tr><th>Cena radnog časa (neto)</th><td>{m.cenaRadnogCasaNeto.toLocaleString("sr-RS")} RSD</td></tr>
          <tr><th>Mesečni neto — prosek (174 h)</th><td>{m.netoMesecno.toLocaleString("sr-RS")} RSD (≈ 550 €)</td></tr>
          <tr><th>Mesečni neto — raspon</th><td>{m.netoMin.toLocaleString("sr-RS")} – {m.netoMax.toLocaleString("sr-RS")} RSD</td></tr>
          <tr><th>Mesečni bruto — raspon</th><td>{m.brutoMin.toLocaleString("sr-RS")} – {m.brutoMax.toLocaleString("sr-RS")} RSD</td></tr>
          <tr><th>Godišnji fond sati 2026.</th><td>{ukupnoSati.toLocaleString("sr-RS")} h (261 radni dan)</td></tr>
          <tr><th>Ukupan neto minimalac za 2026.</th><td>{godisnjeNeto.toLocaleString("sr-RS")} RSD (≈ {fmt0(godisnjeBruto)} RSD bruto)</td></tr>
        </tbody>
      </table>
      <p>Mesečni iznos se razlikuje po mesecima zbog različitog broja radnih dana — najniži je u mesecima sa 160 sati, a najviši u mesecima sa 184 sata. Pogledajte <a href="/radni-dani-2026">radne dane u 2026</a> i izračunajte neto preko <a href="/bruto-neto">bruto u neto kalkulatora</a>. Za poređenje sa prethodnim godinama pogledajte <a href="#istorija">istoriju minimalne cene rada</a> niže na strani.</p>

      {/* Interogativni H2 sa kolokvijalnim terminom i tekućim mesecom — isti obrazac
          kojim ozon.rs osvaja citat u AI pregledu na upit „minimalac za <mesec> 2026". */}
      <h2>Koliki je minimalac za {exMesecLc} 2026?</h2>
      <p>Minimalac za {exMesecLc} 2026. iznosi <strong>{ex.neto.toLocaleString("sr-RS")},00 RSD neto</strong>. Taj iznos se dobija množenjem zakonske cene radnog časa ({m.cenaRadnogCasaNeto} RSD neto) fondom od <strong>{ex.sati} radnih sati</strong> ({ex.dani} {dLabel(ex.dani)}) u {exMesecLok} 2026. U bruto iznosu to je <strong>{fmt2(ex.bruto)} RSD (bruto 1)</strong>, a ukupan trošak poslodavca je {fmt2(ex.bruto + exPoslodavac)} RSD.</p>
      <p><strong>Kada se isplaćuje.</strong> Zarada se isplaćuje najmanje jedanput mesečno, a najkasnije do kraja tekućeg meseca za prethodni mesec (čl. 110 Zakona o radu). Minimalac za {exMesecLc} 2026. mora, dakle, biti isplaćen <strong>najkasnije do kraja {exSledeciMesecGen}</strong>. Konkretan datum isplate utvrđuje poslodavac opštim aktom ili ugovorom o radu — zakon propisuje samo krajnji rok, ne i tačan dan.</p>
      <p>Ako ste radili nepuno radno vreme, minimalac vam pripada srazmerno satima rada — donja granica od {m.cenaRadnogCasaNeto} RSD neto po satu važi za svakoga. Ako ste kod poslodavca proveli više godina, na minimalac se dodaje i <a href="/blog/minuli-rad-obracun">minuli rad</a> od najmanje 0,4% po godini staža.</p>

      <h2 id="minimalac-2027">Minimalac 2027 — {m27.cenaRadnogCasaNeto} RSD po satu od 1. januara</h2>
      <p className="ukratko"><strong>Minimalac za 2027. godinu iznosi {m27.cenaRadnogCasaNeto} RSD neto po radnom času.</strong> Vlada Srbije donela je Odluku o visini minimalne cene rada za period januar–decembar 2027. na sednici <strong>20. avgusta 2026</strong>, pošto Socijalno-ekonomski savet dva dana ranije nije postigao saglasnost. Satnica raste sa {m.cenaRadnogCasaNeto} na {m27.cenaRadnogCasaNeto} RSD neto, odnosno za <strong>{m27.rastProcenat.toLocaleString("sr-RS")}%</strong>, i primenjuje se na zarade isplaćene od 1. januara 2027.</p>
      <p><strong>Iznos od {m27.netoMesecno.toLocaleString("sr-RS")} RSD, koji se u vestima navodi kao „oko 600 evra“, nije mesečni minimalac.</strong> To je {m27.cenaRadnogCasaNeto} RSD × 174 sata, a 174 h je samo <em>prosečan</em> mesečni fond — nijedan mesec 2027. godine nema tačno 174 radna sata. Stvarni mesečni neto minimalac kretaće se od <strong>{m27.netoMin.toLocaleString("sr-RS")} RSD</strong> (februar, 160 h) do <strong>{m27.netoMax.toLocaleString("sr-RS")} RSD</strong> (mart i decembar, 184 h) — razlika između najslabijeg i najjačeg meseca je {(m27.netoMax - m27.netoMin).toLocaleString("sr-RS")} RSD.</p>
      <table className="ref-table" aria-label="Minimalac po mesecima 2027 — neto i bruto">
        <thead>
          <tr><th>Mesec 2027.</th><th>Radni dani</th><th>Fond sati</th><th>Minimalac (neto)</th><th>Minimalac (bruto 1)</th></tr>
        </thead>
        <tbody>
          {perMonth2027.map((r) => (
            <tr key={r.mesec}>
              <td>{r.mesec}</td>
              <td>{r.dani}</td>
              <td>{r.sati}</td>
              <td>{r.neto.toLocaleString("sr-RS")} RSD</td>
              <td>{fmt2(r.bruto)} RSD</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p><strong>Zašto su bruto iznosi za 2027. još privremeni.</strong> Neto satnica od {m27.cenaRadnogCasaNeto} RSD je konačna — utvrđena je odlukom Vlade. Bruto iznos, međutim, zavisi i od <a href="/neoporezivi-iznos-2026">neoporezivog iznosa zarade</a>, a on za 2027. <strong>još nije izglasan</strong>: predlog je {m27.neoporeziviPredlog2027.toLocaleString("sr-RS")} RSD umesto sadašnjih {R.nonTaxable.toLocaleString("sr-RS")} RSD i tek ulazi u skupštinsku proceduru. Tabela iznad zato računa bruto uz <em>važeći</em> neoporezivi iznos. Ako predlog bude usvojen, svaki bruto iznos iz tabele biće manji za <strong>tačno {fmt2(brutoDelta27)} RSD</strong> — razlika je identična u svakom mesecu, jer se neoporezivi iznos odbija od poreske osnovice, a ne srazmerno fondu sati. Stranicu ažuriramo čim izmene budu objavljene u „Službenom glasniku RS“.</p>
      <p>Godišnji fond sati u 2027. je isti kao u 2026. ({ukupnoSati27.toLocaleString("sr-RS")} h, 261 radni dan), pa je ukupan neto minimalac za celu godinu {godisnjeNeto27.toLocaleString("sr-RS")} RSD — {(godisnjeNeto27 - godisnjeNeto).toLocaleString("sr-RS")} RSD više nego u 2026. Konkretan iznos za bilo koju platu izračunajte kroz <a href="/bruto-neto">bruto u neto kalkulator</a>.</p>

      <h2>Minimalac po mesecima 2026 — neto i bruto tabela</h2>
      <p>Pošto je fiksna samo cena radnog časa ({m.cenaRadnogCasaNeto} RSD neto), mesečni minimalac se dobija množenjem satnice fondom radnih sati u mesecu. Tabela daje minimalni neto i pripadajući bruto (bruto 1) za svaki mesec 2026:</p>
      <table className="ref-table" aria-label="Minimalna neto i bruto zarada po mesecima 2026">
        <thead>
          <tr><th>Mesec 2026.</th><th>Radni dani</th><th>Fond sati</th><th>Minimalac (neto)</th><th>Minimalac (bruto)</th><th>Praznici</th></tr>
        </thead>
        <tbody>
          {perMonth.map((r) => (
            <tr key={r.mesec}>
              <td>{r.mesec}</td>
              <td>{r.dani}</td>
              <td>{r.sati}</td>
              <td>{r.neto.toLocaleString("sr-RS")} RSD</td>
              <td>{fmt2(r.bruto)} RSD</td>
              <td>{r.praznici}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Bruto iznosi su preračunati uz <a href="/neoporezivi-iznos-2026">neoporezivi iznos zarade od {R.nonTaxable.toLocaleString("sr-RS")} RSD</a>, koji važi za isplate od 1. januara 2026, i poklapaju se sa zvaničnim tabelama za obračun. Ako se zarada za neki mesec isplaćuje u različitim godinama, primenjuje se minimalna cena rada koja važi na dan isplate.</p>

      <h2>Fond sati i praznici — zašto minimalac ne pada zbog praznika</h2>
      <p>Fond sati u tabeli obuhvata sve dane ponedeljak–petak, <strong>uključujući i državne praznike</strong> koji padnu na radni dan — tako se fond zvanično utvrđuje za obračun minimalne zarade. Za praznik zaposleni ne radi, ali prima naknadu zarade u visini proseka svoje zarade za prethodnih 12 meseci (čl. 114 Zakona o radu), pa praznik ne umanjuje mesečno primanje. Spisak neradnih dana je u pregledu <a href="/praznici-2026">državnih praznika za 2026</a>, a raspored fonda po mesecima u pregledu <a href="/radni-dani-2026">radnih dana 2026</a>.</p>

      <h2>Obračun: od 371 RSD po satu do plate i troška poslodavca</h2>
      <p>Satnica od {m.cenaRadnogCasaNeto} RSD je <strong>neto</strong> iznos — bez poreza i doprinosa. Kompletan obračun za <strong>{exMesecLc} 2026.</strong> ({ex.dani} {dLabel(ex.dani)}, {ex.sati} h) izgleda ovako:</p>
      <table className="ref-table" aria-label={`Primer obračuna minimalne zarade za ${exMesecLc} 2026`}>
        <tbody>
          <tr><th>Neto minimalac ({m.cenaRadnogCasaNeto} × {ex.sati} h)</th><td>{ex.neto.toLocaleString("sr-RS")},00 RSD</td></tr>
          <tr><th>Bruto 1 zarada</th><td>{fmt2(ex.bruto)} RSD</td></tr>
          <tr><th>Doprinosi na teret zaposlenog (19,90%)</th><td>−{fmt2(exDoprinosi)} RSD</td></tr>
          <tr><th>Porez 10% (na bruto iznad {R.nonTaxable.toLocaleString("sr-RS")})</th><td>−{fmt2(exPorez)} RSD</td></tr>
          <tr><th>Doprinosi na teret poslodavca (15,15%)</th><td>+{fmt2(exPoslodavac)} RSD</td></tr>
          <tr><th>Ukupan trošak poslodavca (bruto 2)</th><td>{fmt2(ex.bruto + exPoslodavac)} RSD</td></tr>
        </tbody>
      </table>
      <p>Ukupan trošak poslodavca za zaposlenog na minimalcu kreće se u 2026. od ≈{fmt0(perMonth[1].bruto * (1 + dopPosl))} RSD (mesec sa 160 h) do ≈{fmt0(perMonth[6].bruto * (1 + dopPosl))} RSD (184 h). Detaljne <a href="/stope-doprinosa-2026">stope doprinosa za 2026.</a> i tačan obračun za bilo koji iznos daje <a href="/bruto-neto">bruto u neto kalkulator</a>.</p>

      <h2>Šta ulazi u minimalac — a šta se plaća povrh njega</h2>
      <p>Po članu 111 Zakona o radu, zaposleni ima pravo na minimalnu zaradu za <strong>standardni učinak i vreme provedeno na radu</strong>. To znači da minimalac pokriva samo osnovnu zaradu za puno radno vreme, a sledeća primanja se obračunavaju <strong>povrh</strong> njega:</p>
      <ul>
        <li><a href="/blog/minuli-rad-obracun">Minuli rad</a> — uvećanje od najmanje 0,4% po godini staža kod poslodavca (čl. 108);</li>
        <li><a href="/blog/prekovremeni-rad">Prekovremeni rad</a> (najmanje +26%), noćni rad (+26%) i rad na praznik (+110%);</li>
        <li><a href="/blog/topli-obrok-i-regres">Topli obrok i regres</a> — obavezne naknade koje ne smeju biti „utopljene“ u minimalac;</li>
        <li>Naknada troškova prevoza za dolazak i odlazak sa rada.</li>
      </ul>
      <p>Zaposleni sa nepunim radnim vremenom ima pravo na minimalac srazmerno satima rada — satnica od {m.cenaRadnogCasaNeto} RSD neto je donja granica po satu za svakoga.</p>

      <h2>Kada poslodavac sme da isplaćuje minimalac</h2>
      <p>Minimalac nije iznos koji poslodavac može da bira trajno i bez uslova. Po čl. 111 Zakona o radu, razlozi za donošenje <strong>odluke o uvođenju minimalne zarade</strong> utvrđuju se opštim aktom (kolektivni ugovor ili pravilnik o radu), a po isteku <strong>6 meseci</strong> od donošenja odluke poslodavac je dužan da obavesti reprezentativni sindikat o razlozima nastavka isplate. Isplata ispod važećeg minimalca je prekršaj za koji je zaprećena novčana kazna od <strong>800.000 do 2.000.000 RSD</strong> za poslodavca sa svojstvom pravnog lica.</p>

      <h2>Kako se utvrđuje minimalna cena rada</h2>
      <p>Minimalnu cenu rada utvrđuje <strong>Socijalno-ekonomski savet</strong> (vlada, sindikati i poslodavci) za kalendarsku godinu, najkasnije do <strong>15. septembra</strong> tekuće godine, a primenjuje se od 1. januara naredne (čl. 112). Ako se Savet ne dogovori u roku od 15 dana od početka pregovora, odluku donosi Vlada u narednih 15 dana. Pri odlučivanju se uzimaju u obzir egzistencijalne i socijalne potrebe zaposlenog i porodice, kretanje cena, zaposlenosti, BDP-a, produktivnosti i prosečnih zarada. Odluka se objavljuje u „Službenom glasniku RS“ (čl. 113).</p>
      <p><strong>Za 2027. je odluka već doneta.</strong> Socijalno-ekonomski savet 18. avgusta 2026. nije postigao saglasnost — sindikati su tražili 650 evra, a deo poslodavaca se protivio povećanju — pa je odluku, u skladu sa čl. 112, donela Vlada 20. avgusta 2026: <a href="#minimalac-2027">{m27.cenaRadnogCasaNeto} RSD neto po radnom času</a> od 1. januara 2027.</p>

      <h2 id="istorija">Minimalna cena rada kroz godine</h2>
      <table className="ref-table" aria-label="Minimalna cena rada po godinama">
        <thead>
          <tr><th>Godina</th><th>Cena radnog časa (neto)</th></tr>
        </thead>
        <tbody>
          {istorija.map((r) => (
            <tr key={r.god}><td>{r.god}</td><td>{r.cena} RSD</td></tr>
          ))}
        </tbody>
      </table>
      <p>Od 2019. do 2027. minimalna satnica raste sa 155,30 na {m27.cenaRadnogCasaNeto} RSD — <strong>+{Math.round((m27.cenaRadnogCasaNeto / 155.3 - 1) * 100)}%</strong> za osam godina. Jedina vanredna korekcija usred godine desila se 1. oktobra 2025, kada je satnica sa 308 podignuta na 337 RSD.</p>

      <h2>Minimalac u odnosu na prosečnu zaradu</h2>
      <p>Prosečan mesečni neto minimalac ({m.netoMesecno.toLocaleString("sr-RS")} RSD) čini oko <strong>{Math.round(m.netoMesecno / pz.neto * 100)}% prosečne</strong> neto zarade u Srbiji ({pz.neto.toLocaleString("sr-RS")} RSD za {pz.mesec}, RZS) i oko <strong>{Math.round(m.netoMesecno / pz.medijalnaNeto * 100)}% medijalne</strong> ({pz.medijalnaNeto.toLocaleString("sr-RS")} RSD). U evrima, mesečni minimalac se kreće od ≈506 do ≈582 €, u proseku oko 550 €. Kretanje prosečnih zarada pratimo na strani <a href="/prosecna-zarada">prosečna zarada u Srbiji</a> i u analizi <a href="/blog/prosecna-plata-srbija">prosečne plate po sektorima i gradovima</a>, a koliko su plate realno porasle od 2016. — u studiji <a href="/blog/kupovna-moc-plate-2016-2026">kupovna moć plate 2016–2026</a>.</p>

      <h2>Najčešće greške pri obračunu minimalca</h2>
      <ul>
        <li><strong>„Mesečni minimalac je fiksan iznos.“</strong> Nije — fiksna je samo satnica. Februar (160 h) i jul (184 h) se razlikuju za čak {(m.netoMax - m.netoMin).toLocaleString("sr-RS")} RSD neto.</li>
        <li><strong>„371 RSD je bruto satnica.“</strong> Ne — minimalna cena rada se po zakonu utvrđuje bez poreza i doprinosa, dakle neto. Bruto satnica je oko 500 RSD, zavisno od fonda sati.</li>
        <li><strong>Topli obrok i regres „uračunati“ u minimalac.</strong> Nezakonito — to su obavezna primanja povrh minimalne zarade.</li>
        <li><strong>Zaboravljen minuli rad.</strong> I zaposleni na minimalcu ima pravo na +0,4% po godini staža kod poslodavca.</li>
        <li><strong>„Minimalac 2027. je {m27.netoMesecno.toLocaleString("sr-RS")} RSD mesečno.“</strong> Nije — to je satnica od {m27.cenaRadnogCasaNeto} RSD × 174 h (prosek). Nijedan mesec 2027. nema 174 sata; stvarni raspon je {m27.netoMin.toLocaleString("sr-RS")}–{m27.netoMax.toLocaleString("sr-RS")} RSD neto.</li>
        <li><strong>Pogrešna satnica na prelazu godina.</strong> Primenjuje se satnica koja važi na <em>dan isplate</em>, ne na mesec rada: za zaradu za decembar 2026. isplaćenu u januaru 2027. važi {m27.cenaRadnogCasaNeto} RSD, ne {m.cenaRadnogCasaNeto}.</li>
      </ul>
    </>),
    faq: [
      { q: "Koliko je minimalac u Srbiji 2026?", a: `Minimalac (minimalna cena rada) je ${m.cenaRadnogCasaNeto} RSD neto po radnom času (od ${m.vaziOd}, „Sl. glasnik RS“ 78/2025). Mesečni neto iznos zavisi od fonda sati: od ${m.netoMin.toLocaleString("sr-RS")} RSD (160 h) do ${m.netoMax.toLocaleString("sr-RS")} RSD (184 h), prosečno oko ${m.netoMesecno.toLocaleString("sr-RS")} RSD.` },
      { q: "Koliki je minimalac 2027?", a: `Minimalac za 2027. godinu iznosi ${m27.cenaRadnogCasaNeto} RSD neto po radnom času. Vlada Srbije donela je odluku 20. avgusta 2026, a primenjuje se na zarade od 1. januara 2027. To je ${m27.rastProcenat.toLocaleString("sr-RS")}% više nego u 2026. (${m.cenaRadnogCasaNeto} RSD). Mesečni neto iznos zavisi od fonda sati: od ${m27.netoMin.toLocaleString("sr-RS")} RSD (160 h) do ${m27.netoMax.toLocaleString("sr-RS")} RSD (184 h).` },
      { q: "Da li je minimalac 2027. zaista 70.470 dinara mesečno?", a: `Ne kao fiksan mesečni iznos. ${m27.netoMesecno.toLocaleString("sr-RS")} RSD je cena radnog časa (${m27.cenaRadnogCasaNeto} RSD) pomnožena sa 174 sata, a 174 h je samo prosečan mesečni fond — nijedan mesec 2027. nema tačno toliko sati. Stvarni mesečni neto minimalac kreće se od ${m27.netoMin.toLocaleString("sr-RS")} do ${m27.netoMax.toLocaleString("sr-RS")} RSD.` },
      { q: "Koji minimalac važi za decembar 2026. ako se isplaćuje u januaru 2027?", a: `Važi satnica na dan isplate — dakle ${m27.cenaRadnogCasaNeto} RSD neto po radnom času, iako se zarada odnosi na decembar 2026. Isto pravilo je važilo i na prelazu 2025/2026.` },
      { q: "Kako se obračunava minimalac po mesecima?", a: `Cena radnog časa (${m.cenaRadnogCasaNeto} RSD neto) množi se brojem radnih sati u tom mesecu. Zato mesečni minimalac varira — meseci sa više radnih dana donose veći iznos. Tabela minimalca za svaki mesec 2026. je iznad.` },
      { q: `Koliki je minimalac za ${exMesecLc} 2026?`, a: `Minimalac za ${exMesecLc} 2026. iznosi ${ex.neto.toLocaleString("sr-RS")} RSD neto (fond od ${ex.sati} h × ${m.cenaRadnogCasaNeto} RSD po satu), odnosno ${fmt2(ex.bruto)} RSD bruto 1.` },
      { q: `Kada se isplaćuje minimalac za ${exMesecLc} 2026?`, a: `Zarada se isplaćuje najmanje jedanput mesečno, a najkasnije do kraja tekućeg meseca za prethodni mesec (čl. 110 Zakona o radu). Minimalac za ${exMesecLc} 2026. mora biti isplaćen najkasnije do kraja ${exSledeciMesecGen}. Tačan dan isplate poslodavac utvrđuje opštim aktom ili ugovorom o radu — zakon propisuje samo krajnji rok.` },
      { q: "Koliki je bruto minimalac 2026?", a: `Bruto 1 minimalna zarada u 2026. kreće se od 79.797,29 RSD (mesec sa 160 h) do 92.499,14 RSD (184 h). Preračun sa neto na bruto vrši se uz neoporezivi iznos od ${R.nonTaxable.toLocaleString("sr-RS")} RSD, doprinose 19,90% i porez 10%.` },
      { q: "Da li topli obrok, regres i minuli rad ulaze u minimalac?", a: "Ne. Minimalna zarada pokriva samo osnovnu zaradu za standardni učinak i puno radno vreme (čl. 111 Zakona o radu). Minuli rad, uvećanja za prekovremeni, noćni i rad na praznik, topli obrok, regres i naknada prevoza obračunavaju se povrh minimalca." },
      { q: "Ko ima pravo na minimalac?", a: `Svi zaposleni — zarada ne može biti niža od minimalne. Zaposleni sa nepunim radnim vremenom ima pravo na minimalac srazmerno satima rada, jer je satnica od ${m.cenaRadnogCasaNeto} RSD neto zakonska donja granica po radnom času.` },
      { q: "Koliko iznosi minimalac 2026. u evrima?", a: "Mesečni neto minimalac iznosi od oko 506 € (mesec sa 160 sati) do oko 582 € (184 sata), u proseku oko 550 € po srednjem kursu NBS (≈117,4 RSD za evro)." },
      { q: "Šta ako poslodavac isplaćuje manje od minimalca?", a: "Isplata ispod minimalne zarade je prekršaj — kazna za pravno lice je 800.000 do 2.000.000 RSD. Zaposleni može da se obrati inspekciji rada, a razliku zarade može da potražuje sudski; novčana potraživanja iz radnog odnosa zastarevaju u roku od 3 godine (čl. 196 Zakona o radu)." },
    ],
    related: [
      { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
      { href: "/radni-dani-2026", label: "Radni dani 2026" },
      { href: "/stope-doprinosa-2026", label: "Stope doprinosa 2026" },
      { href: "/prosecna-zarada", label: "Prosečna zarada u Srbiji" },
    ],
    sourceNote: (<>Izvori: Odluka o visini minimalne cene rada za 2026. („Sl. glasnik RS“ br. 78/2025); Odluka Vlade RS o minimalnoj ceni rada za januar–decembar 2027. (doneta 20. avgusta 2026); Zakon o radu, čl. 108, 111–113 (Paragraf, prečišćen tekst); RZS — prosečna zarada, {pz.mesec}. Provereno i ažurirano: 27. avgusta 2026.</>),
  }} />;
}

export function RadniDaniPage() {
  const dana = REFERENCE_DATA.radniDani2026;
  const ukupnoDana = dana.reduce((s, r) => s + r.radniDani, 0);
  const ukupnoSati = dana.reduce((s, r) => s + r.radniSati, 0);
  const ukupnoBezPraznika = dana.reduce((s, r) => s + r.bezPraznika, 0);
  // Tekući mesec u title/meta se izvodi iz datuma — ranije je bio hardkodovan
  // ("jul 184 h") pa je SERP snippet zastarevao svakog 1. u mesecu.
  const now = new Date();
  const mIdx = now.getFullYear() > 2026 ? 11 : now.getFullYear() < 2026 ? 0 : now.getMonth();
  const tekuci = dana[mIdx];
  const sledeci = dana[Math.min(mIdx + 1, 11)];
  const mesecLc = tekuci.mesec.toLowerCase();
  return <ReferencePage cfg={{
    slug: "radni-dani-2026",
    title: `Radni dani i broj radnih sati po mesecima 2026 — ${mesecLc} ${tekuci.radniSati} h | PlatniListić`,
    description: `Fond radnih sati po mesecima 2026: ${mesecLc} ${tekuci.radniSati} h (${tekuci.radniDani} dana)${sledeci !== tekuci ? `, ${sledeci.mesec.toLowerCase()} ${sledeci.radniSati} h` : ""}. Ukupno ${ukupnoDana} dana / ${ukupnoSati.toLocaleString("sr-RS")} sati. Tabela sa praznicima, za obračun zarade.`,
    h1: "Radni dani i broj radnih sati po mesecima 2026 (Srbija)",
    breadcrumbName: "Radni dani 2026",
    body: (<>
      <p>U 2026. godini ima ukupno <strong>{ukupnoDana} mogućih radnih dana</strong>, odnosno <strong>{ukupnoSati.toLocaleString("sr-RS")} radnih sati</strong> (fond od 8 sati dnevno, ponedeljak–petak). Kada se odbiju državni praznici koji padaju na radni dan, ostaje <strong>{ukupnoBezPraznika} efektivnih radnih dana</strong>. Fond sati je osnova za obračun minimalne zarade, bolovanja i satnice.</p>
      <h2>Radni dani i fond sati po mesecima 2026</h2>
      <table className="ref-table" aria-label="Radni dani i radni sati po mesecima za 2026">
        <thead>
          <tr><th>Mesec 2026.</th><th>Radni dani (fond)</th><th>Radni sati (fond)</th><th>Praznici na radni dan</th><th>Dani bez praznika</th></tr>
        </thead>
        <tbody>
          {dana.map((r) => (
            <tr key={r.mesec}>
              <td>{r.mesec}</td>
              <td>{r.radniDani}</td>
              <td>{r.radniSati}</td>
              <td>{r.praznici}</td>
              <td>{r.bezPraznika}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr><th>Ukupno 2026.</th><th>{ukupnoDana}</th><th>{ukupnoSati.toLocaleString("sr-RS")}</th><th></th><th>{ukupnoBezPraznika}</th></tr>
        </tfoot>
      </table>
      <p><strong>„Radni dani (fond)"</strong> su svi dani ponedeljak–petak — to je zvanični mogući fond koji se koristi za obračun <a href="/minimalna-zarada">minimalne zarade</a> (cena radnog časa × fond sati) i satnice. <strong>„Dani bez praznika"</strong> su fond umanjen za državne praznike koji padaju na radni dan — toliko se dana stvarno radi. Napomena za februar: pošto Sretenje (15. februar) pada u nedelju, neradan je i utorak 17. februar. Tačne datume proverite u <a href="/praznici-2026">spisku praznika za 2026</a>.</p>

      <p><strong>Minimalac po mesecima zavisi od fonda sati</strong> — mesečna minimalna zarada = cena radnog časa × broj radnih sati u tom mesecu, pa se razlikuje od meseca do meseca (vidi <a href="/minimalna-zarada">minimalnu zaradu 2026</a>). Od 1. januara 2027. cena radnog časa je 405 RSD neto — tabela je u pregledu <a href="/minimalna-zarada#minimalac-2027">minimalca za 2027.</a></p>

      <h2>Fond sati po mesecima 2026 (detaljno)</h2>
      {dana.map((r) => (
        <div key={r.mesec} className="month-block">
          <h3>Radni sati u mesecu {r.mesec.toLowerCase()} 2026: {r.radniSati} ({r.radniDani} radnih dana)</h3>
          <p>
            {r.mesec} 2026. ima <strong>{r.radniDani} radnih dana</strong> (fond od <strong>{r.radniSati} radnih sati</strong>, 8 h dnevno).{" "}
            {r.praznici === "—"
              ? "U ovom mesecu nema državnih praznika na radni dan, pa je efektivan broj radnih dana isti kao mogući fond."
              : <>Praznici na radni dan: {r.praznici} — efektivno se radi <strong>{r.bezPraznika} dana</strong>.</>}
          </p>
        </div>
      ))}
    </>),
    faq: [
      { q: "Koliko radnih dana ima u 2026. godini u Srbiji?", a: `Mogući fond je ${ukupnoDana} radnih dana (${ukupnoSati.toLocaleString("sr-RS")} sati). Kada se odbiju praznici koji padaju na radni dan, efektivno se radi ${ukupnoBezPraznika} dana.` },
      { q: "Koliko radnih sati ima jul 2026?", a: "Jul 2026. ima 23 radna dana, odnosno fond od 184 radna sata — najviše u godini (uz decembar). Nema praznika." },
      { q: "Koliko radnih sati ima jun 2026?", a: "Jun 2026. ima 22 radna dana, odnosno fond od 176 radnih sati, bez praznika." },
      { q: "Zašto je broj radnih dana važan za obračun zarade?", a: "Fond sati u mesecu određuje iznos minimalne zarade i naknade za bolovanje — minimalna zarada = cena radnog časa (371 RSD u 2026) × fond sati. Mesečni iznos stoga varira od 59.360 (160 h) do 68.264 RSD (184 h)." },
      { q: "Kako se tretiraju državni praznici u obračunu zarade?", a: "Zaposleni koji ne rade na državni praznik imaju pravo na punu naknadu zarade (1 dan = 1 radni dan u obračunu). Ko radi na praznik prima uvećanje od najmanje 110% zarade za taj dan." },
    ],
    related: [
      { href: "/praznici-2026", label: "Praznici 2026" },
      { href: "/minimalna-zarada", label: "Minimalna zarada — minimalac 2026. i 2027." },
      { href: "/bolovanje", label: "Kalkulator bolovanja" },
      { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
    ],
    // Verifikovano 6.7.2026: fond potvrđen uz Paragraf tabelu minimalne zarade 2026 (261 dan / 2.088 h).
    sourceNote: <>Izvor: Zakon o državnim i drugim praznicima u RS (Sl. glasnik RS); fond sati usklađen sa zvaničnom tabelom minimalne zarade za 2026.</>,
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
      { href: "/minimalna-zarada", label: "Minimalna zarada — minimalac 2026. i 2027." },
      { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
      { href: "/bolovanje", label: "Kalkulator bolovanja" },
    ],
    // VERIFY (owner): confirm praznici2026 dates against the official Vlada RS decision on neradni dani before publishing.
    sourceNote: <>Izvor: Zakon o državnim i drugim praznicima u Republici Srbiji (Sl. glasnik RS) i Vlada RS.</>,
  }} />;
}
