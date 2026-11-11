// src/Embed.jsx — the embeddable bruto/neto calculator served at /embed/bruto-neto.
//
// ⚠️ Imported ONLY by the lazy() call in App.jsx. Nothing may import it statically,
// or Vite folds it into the main bundle (see lead.jsx / SoftverPoMeri.jsx).
//
// What it is: a stripped calculator other sites put on their pages in an iframe.
// No sidebar, no jobs widgets, no lead CTAs — a widget on someone else's site that
// sells our other products would get removed. The only thing pointing back to us is
// the branded "PlatniListić" link, plus the branded link in the embed snippet itself
// (Google's guidance on widget links: branded anchor, never keyword anchors).
//
// Accuracy: the numbers come from the SAME calculate()/netoToBruto() as the main
// calculator — one source of truth. Inputs are deliberately just the basic salary:
// no topli obrok, minuli rad or uvećanja. The footer says so.
//
// Privacy: like the rest of the calculator, nothing typed here leaves the browser.
// Analytics carry fixed event names only (src/track.js).
//
// SEO: noindex (meta here + X-Robots-Tag in vercel.json), prerendered but kept out
// of the sitemap (EMBED_ROUTES in scripts/prerender.mjs).
import { useState, useEffect } from "react";
import { fmt, NumberInput, ResultRow } from "./ui.jsx";
import { useSeo } from "./seo.jsx";
import { DEFAULT_RATES } from "./rates.js";
import { calculate, netoToBruto } from "./App.jsx";
import { track, trackOnce } from "./track.js";

export const EMBED_PATH = "/embed/bruto-neto";

// Every allowance zeroed: the embed computes the basic salary only.
const BASE_INPUTS = {
  basicBruto: 0, standardHours: 168, overtimeH: 0, nightH: 0,
  weekendH: 0, holidayH: 0, fixedBonus: 0, bonusPct: 0,
  yearsOfService: 0, minuliRadPct: 0.4,
  transport: 0, mealDays: 0, mealDailyActual: 0, regres: 0,
  sickDays: 0, sickPct: 65, publicHolidayDays: 0, vacationHolidayDays: 0,
  unpaidDays: 0, syndikat: 0, syndikatPct: 0,
  kredit: 0, adminZabrana: 0, ostaliOdbici: 0,
};

const pctLabel = (n) => n.toLocaleString("sr-RS", { maximumFractionDigits: 2 }) + "%";

export function EmbedBrutoNeto() {
  useSeo({
    title: "Bruto u neto kalkulator — ugradivi | PlatniListić",
    description: "Ugradivi bruto u neto kalkulator za Srbiju: neto, porez, doprinosi i ukupan trošak poslodavca.",
    path: EMBED_PATH,
  });

  // Not for the index: the full calculator on the homepage is the canonical tool.
  // useSeo has no robots option, so set it here; prerender bakes it into the HTML.
  useEffect(() => {
    const el = document.head.querySelector('meta[name="robots"]');
    const prev = el ? el.getAttribute("content") : null;
    if (el) el.setAttribute("content", "noindex, follow");
    document.body.classList.add("is-embed");
    trackOnce("embed_view");
    return () => {
      if (el && prev) el.setAttribute("content", prev);
      document.body.classList.remove("is-embed");
    };
  }, []);

  const [mode, setMode] = useState("bruto");
  const [bruto, setBruto] = useState(100000);
  const [neto, setNeto] = useState(70000);
  const rates = DEFAULT_RATES;

  const sol = mode === "neto" ? netoToBruto(neto, rates, BASE_INPUTS) : null;
  const unreachable = sol && !sol.reachable;
  const r = calculate({ ...BASE_INPUTS, basicBruto: sol ? sol.bruto : bruto }, rates);
  const year = new Date().getFullYear();
  const empPct = rates.pioPct_emp + rates.health_emp + rates.unemp_emp;
  const erPct = rates.pio_er + rates.health_er;

  return (
    <div className="embed-card">
      <div className="embed-head">
        <h1 className="embed-title">Bruto u neto kalkulator {year}</h1>
        <div className="mode-toggle" role="tablist" aria-label="Smer obračuna">
          <button className={`mode-btn ${mode === "bruto" ? "active" : ""}`} onClick={() => setMode("bruto")} role="tab" aria-selected={mode === "bruto"}>Bruto → neto</button>
          <button className={`mode-btn ${mode === "neto" ? "active" : ""}`} onClick={() => setMode("neto")} role="tab" aria-selected={mode === "neto"}>Neto → bruto</button>
        </div>
      </div>

      {mode === "bruto"
        ? <NumberInput label="Bruto 1 zarada (iz ugovora)" value={bruto} onChange={setBruto} step={1000} />
        : <NumberInput label="Željena neto zarada" value={neto} onChange={setNeto} step={1000} />}

      {unreachable ? (
        <p className="embed-warn" role="status">
          Doprinosi se plaćaju najmanje na osnovicu od {fmt(rates.minBase)} RSD, pa ovaj neto nije dostižan.
          Najniži mogući neto je {fmt(sol.minNeto)} RSD.
        </p>
      ) : (
        <div className="embed-results" aria-live="polite">
          <div className="embed-neto">
            <span>Neto na račun</span>
            <strong>{fmt(r.neto)} <small>RSD</small></strong>
          </div>
          <ResultRow label="Bruto 1" value={r.bruto1} />
          <ResultRow label={`Doprinosi zaposlenog (${pctLabel(empPct)})`} value={r.totalEmpContrib} type="negative" />
          <ResultRow label={`Porez na zaradu (${pctLabel(rates.taxRate)})`} value={r.tax} type="negative" />
          <ResultRow label={`Doprinosi poslodavca (${pctLabel(erPct)})`} value={r.totalErContrib} />
          <ResultRow label="Ukupan trošak poslodavca (bruto 2)" value={r.bruto2} type="positive" />
        </div>
      )}

      <p className="embed-foot">
        Osnovna zarada, bez toplog obroka, minulog rada i uvećanja. Neoporezivi iznos {fmt(rates.nonTaxable).replace(/,00$/, "")} RSD.{" "}
        Detaljan obračun:{" "}
        <a href="https://www.platnilistic.rs/" target="_blank" rel="noopener" onClick={() => track("embed_click")}>PlatniListić</a>
      </p>
    </div>
  );
}
