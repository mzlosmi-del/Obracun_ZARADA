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

const NETO_BRUTO_RELATED = [
  { href: "/bruto-neto", label: "Bruto u neto kalkulator" },
  { href: "/pausal", label: "Paušal kalkulator" },
  { href: "/minuli-rad", label: "Kalkulator minulog rada" },
  { href: "/bolovanje", label: "Kalkulator bolovanja" },
];

export function NetoBrutoPage() {
  return <ToolPage cfg={{
    slug: "neto-bruto",
    title: "Neto u bruto kalkulator 2026 — Srbija | PlatniListić",
    description: "Iz željene neto zarade izračunajte bruto 1 i ukupan trošak poslodavca za 2026. Tačan obračun, PDF i PPP-PD XML. Besplatno.",
    h1: "Neto u bruto kalkulator za Srbiju (2026)",
    breadcrumbName: "Neto u bruto",
    calc: "full",
    intro: (<p>Ovaj <strong>neto u bruto kalkulator</strong> za 2026. iz željene neto zarade rekonstruiše bruto 1 iznos i ukupan trošak poslodavca, uz tačan obračun poreza (10% iznad neoporezivih 34.221 RSD) i doprinosa (19,90%). Unesite željeni neto, a kalkulator automatski pronalazi odgovarajući bruto 1. Rezultat preuzimate kao PDF platni listić i PPP-PD XML.</p>),
    guide: (<><h2>Kako se računa neto u bruto</h2>
      <p>Obrnuti obračun — iz željenog neto iznosa kalkulator iterativno pronalazi bruto 1 tako da posle oduzimanja doprinosa zaposlenog (19,90%) i poreza na zaradu (10% na deo iznad neoporezivog iznosa od 34.221 RSD) dobijete tačno taj neto. Primer: za željeni neto od 73.522 RSD bruto 1 iznosi 100.000 RSD. Ukupan trošak poslodavca (bruto 2) dobija se dodavanjem doprinosa poslodavca (15,15%) na bruto 1. Detaljan vodič: <a href="/blog/bruto-neto-razlika">razlika između bruto i neto zarade</a>.</p></>),
    faq: [
      { q: "Kako izračunati bruto iz neto zarade u Srbiji?", a: "Kalkulator iterativno pronalazi bruto 1 tako da posle doprinosa zaposlenog (19,90%) i poreza (10% na deo iznad 34.221 RSD) dobijete željeni neto iznos. Unesite ciljani neto u polje 'Unesite Neto' i kalkulator prikazuje odgovarajući bruto 1." },
      { q: "Koliki je ukupan trošak poslodavca za dati neto?", a: "Ukupan trošak = Bruto 1 + doprinosi poslodavca (15,15% — PIO 10% i zdravstvo 5,15%). Za neto 73.522 RSD, bruto 1 je 100.000 RSD, a ukupan trošak oko 115.150 RSD." },
      { q: "Da li je neto u bruto kalkulator besplatan?", a: "Da, kalkulator je besplatan i ne zahteva registraciju. Obračun radite u oba smera — bruto u neto i neto u bruto. Rezultat preuzimate kao PDF i PPP-PD XML." },
    ],
    related: NETO_BRUTO_RELATED,
  }} />;
}
