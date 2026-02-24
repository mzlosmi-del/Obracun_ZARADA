import { useState, useEffect, useRef } from "react";

// ── PARAMETERS (2025) ────────────────────────────────────────────────────
const P = {
  taxRate: 0.10,
  nonTaxable: 28423,
  pioPct_emp: 0.14,
  health_emp: 0.0515,
  unemp_emp: 0.0075,
  pio_er: 0.10,
  health_er: 0.0515,
  overtimeCoef: 1.26,
  nightCoef: 1.26,
  weekendCoef: 1.26,
  holidayCoef: 1.26,
  minBase: 45950,
  maxBase: 656425,
  mealDaily: 1490,
  transportMax: 5630,
  minWage: 73274,
  standardHours: 168,
};

const fmt = (n) =>
  new Intl.NumberFormat("sr-RS", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);

const pct = (n) => (n * 100).toFixed(2) + "%";

function calculate(inputs) {
  const {
    basicBruto, standardHours, overtimeH, nightH, weekendH, holidayH,
    fixedBonus, bonusPct, transport, mealDays,
  } = inputs;

  const hourRate = basicBruto / (standardHours || 168);
  const overtimePay = overtimeH * hourRate * P.overtimeCoef;
  const nightPay = nightH * hourRate * P.nightCoef;
  const weekendPay = weekendH * hourRate * P.weekendCoef;
  const holidayPay = holidayH * hourRate * P.holidayCoef;
  const bonusAmount = fixedBonus + basicBruto * (bonusPct / 100);

  const bruto1 = basicBruto + overtimePay + nightPay + weekendPay + holidayPay + bonusAmount;

  const contribBase = Math.max(Math.min(bruto1, P.maxBase), P.minBase);
  const pio_emp = contribBase * P.pioPct_emp;
  const health_emp = contribBase * P.health_emp;
  const unemp = contribBase * P.unemp_emp;
  const totalEmpContrib = pio_emp + health_emp + unemp;

  const taxBase = Math.max(bruto1 - P.nonTaxable, 0);
  const tax = taxBase * P.taxRate;

  const neto = bruto1 - totalEmpContrib - tax;

  const pio_er = contribBase * P.pio_er;
  const health_er = contribBase * P.health_er;
  const totalErContrib = pio_er + health_er;
  const bruto2 = bruto1 + totalErContrib;

  const mealAllowance = mealDays * P.mealDaily;
  const transportActual = Math.min(transport, P.transportMax);
  const totalCost = bruto2 + mealAllowance + transportActual;

  return {
    hourRate, overtimePay, nightPay, weekendPay, holidayPay, bonusAmount,
    bruto1, contribBase,
    pio_emp, health_emp, unemp, totalEmpContrib,
    taxBase, tax,
    neto,
    pio_er, health_er, totalErContrib,
    bruto2,
    mealAllowance, transportActual, totalCost,
    netoBruto1Ratio: bruto1 > 0 ? neto / bruto1 : 0,
    costPerNeto: neto > 0 ? totalCost / neto : 0,
  };
}

// ── UI COMPONENTS ─────────────────────────────────────────────────────────
const NumberInput = ({ label, value, onChange, unit = "RSD", min = 0, step = 1, sublabel }) => (
  <div className="input-field">
    <label>{label}{sublabel && <span className="sublabel">{sublabel}</span>}</label>
    <div className="input-wrap">
      <input
        type="number"
        value={value}
        min={min}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
      <span className="unit">{unit}</span>
    </div>
  </div>
);

const ResultRow = ({ label, value, type = "neutral", sub }) => (
  <div className={`result-row ${type}`}>
    <span className="result-label">{label}{sub && <span className="result-sub">{sub}</span>}</span>
    <span className="result-value">{fmt(value)} <span className="rsd">RSD</span></span>
  </div>
);

const SectionTitle = ({ children, icon }) => (
  <div className="section-title">
    <span className="section-icon">{icon}</span>
    <span>{children}</span>
  </div>
);

// ── ANIMATED NUMBER ────────────────────────────────────────────────────────
function AnimatedNum({ value, className }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const start = prev.current;
    const end = value;
    const dur = 400;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setDisplay(start + (end - start) * ease);
      if (p < 1) requestAnimationFrame(tick);
      else prev.current = end;
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span className={className}>{fmt(display)}</span>;
}

// ── GAUGE BAR ──────────────────────────────────────────────────────────────
function GaugeBar({ label, value, max, color }) {
  const pctVal = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="gauge">
      <div className="gauge-header">
        <span>{label}</span>
        <span style={{ color }}>{fmt(value)} RSD</span>
      </div>
      <div className="gauge-track">
        <div className="gauge-fill" style={{ width: `${Math.min(pctVal, 100)}%`, background: color }} />
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [inputs, setInputs] = useState({
    basicBruto: 100000,
    standardHours: 168,
    overtimeH: 0,
    nightH: 0,
    weekendH: 0,
    holidayH: 0,
    fixedBonus: 0,
    bonusPct: 0,
    transport: 0,
    mealDays: 21,
  });

  const [activeTab, setActiveTab] = useState("inputs");
  const r = calculate(inputs);

  const set = (key) => (val) => setInputs((prev) => ({ ...prev, [key]: val }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Outfit:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0d0f14;
          --surface: #141720;
          --surface2: #1c2030;
          --surface3: #232840;
          --border: #2a3050;
          --accent: #4d9fff;
          --accent2: #7c6fff;
          --green: #00c853;
          --red: #ff6b6b;
          --orange: #ff9f43;
          --text: #e8eaf2;
          --text2: #8892b0;
          --text3: #4a5578;
          --mono: 'JetBrains Mono', monospace;
          --sans: 'Outfit', sans-serif;
        }

        body { background: var(--bg); color: var(--text); font-family: var(--sans); min-height: 100vh; }

        .app {
          max-width: 1100px;
          margin: 0 auto;
          padding: 24px 16px 60px;
        }

        /* HEADER */
        .header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 32px;
          gap: 16px;
        }
        .header-left {}
        .header-badge {
          display: inline-block;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: white;
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 2px;
          padding: 4px 10px;
          border-radius: 4px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        .header h1 {
          font-size: clamp(20px, 4vw, 32px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -1px;
          background: linear-gradient(135deg, #fff 40%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .header-sub {
          font-family: var(--mono);
          font-size: 12px;
          color: var(--text3);
          margin-top: 6px;
          letter-spacing: 1px;
        }

        /* HERO NUMBERS */
        .hero-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 28px;
        }
        @media (max-width: 600px) { .hero-cards { grid-template-columns: 1fr; } }
        .hero-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 18px 20px;
          position: relative;
          overflow: hidden;
        }
        .hero-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
        }
        .hero-card.neto::before { background: linear-gradient(90deg, var(--green), #64ffda); }
        .hero-card.bruto::before { background: linear-gradient(90deg, var(--accent), var(--accent2)); }
        .hero-card.cost::before { background: linear-gradient(90deg, var(--orange), var(--red)); }
        .hero-card-label {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--text3);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .hero-card-value {
          font-family: var(--mono);
          font-size: clamp(18px, 3vw, 26px);
          font-weight: 500;
          letter-spacing: -1px;
        }
        .hero-card.neto .hero-card-value { color: var(--green); }
        .hero-card.bruto .hero-card-value { color: var(--accent); }
        .hero-card.cost .hero-card-value { color: var(--orange); }
        .hero-card-sub {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--text3);
          margin-top: 4px;
        }

        /* RATIO BAR */
        .ratio-bar-wrap {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 28px;
        }
        .ratio-bar-header {
          display: flex;
          justify-content: space-between;
          font-family: var(--mono);
          font-size: 11px;
          color: var(--text3);
          margin-bottom: 10px;
        }
        .ratio-bar {
          height: 10px;
          border-radius: 6px;
          background: var(--surface3);
          overflow: hidden;
          display: flex;
        }
        .ratio-seg {
          height: 100%;
          transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .ratio-legend {
          display: flex;
          gap: 16px;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        .ratio-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--mono);
          font-size: 10px;
          color: var(--text2);
        }
        .ratio-dot { width: 8px; height: 8px; border-radius: 50%; }

        /* TABS */
        .tabs { display: flex; gap: 4px; margin-bottom: 20px; }
        .tab {
          padding: 8px 18px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text3);
          font-family: var(--sans);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.3px;
        }
        .tab:hover { background: var(--surface2); color: var(--text2); }
        .tab.active { background: var(--surface2); color: var(--accent); border-color: var(--accent); }

        /* MAIN GRID */
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 760px) { .main-grid { grid-template-columns: 1fr; } }

        /* CARD */
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }

        /* SECTION TITLE */
        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: var(--surface2);
          border-bottom: 1px solid var(--border);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--text2);
        }
        .section-icon { font-size: 14px; }

        /* INPUTS */
        .inputs-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
        .input-field { display: flex; flex-direction: column; gap: 4px; }
        .input-field label {
          font-size: 11px;
          font-weight: 600;
          color: var(--text3);
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }
        .sublabel {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--text3);
          margin-left: 8px;
          text-transform: none;
          letter-spacing: 0;
        }
        .input-wrap {
          display: flex;
          align-items: center;
          background: var(--surface3);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.15s;
        }
        .input-wrap:focus-within { border-color: var(--accent); }
        .input-wrap input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text);
          font-family: var(--mono);
          font-size: 14px;
          padding: 9px 12px;
          width: 100%;
        }
        .input-wrap input::-webkit-inner-spin-button, 
        .input-wrap input::-webkit-outer-spin-button { opacity: 0.4; }
        .unit {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--text3);
          padding: 0 10px;
          border-left: 1px solid var(--border);
          white-space: nowrap;
          background: var(--surface2);
          align-self: stretch;
          display: flex;
          align-items: center;
        }

        /* RESULTS */
        .results-body { padding: 8px 0; }
        .result-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 9px 16px;
          border-bottom: 1px solid rgba(42,48,80,0.5);
          transition: background 0.1s;
        }
        .result-row:hover { background: rgba(255,255,255,0.02); }
        .result-row:last-child { border-bottom: none; }
        .result-label {
          font-size: 12px;
          color: var(--text2);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .result-sub {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--text3);
        }
        .result-value {
          font-family: var(--mono);
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
        }
        .rsd { font-size: 10px; color: var(--text3); margin-left: 3px; }

        .result-row.positive .result-value { color: var(--green); }
        .result-row.negative .result-value { color: var(--red); }
        .result-row.total .result-value { color: var(--accent); font-size: 14px; }
        .result-row.total .result-label { color: var(--text); font-weight: 700; font-size: 13px; }
        .result-row.total { background: rgba(77,159,255,0.05); }
        .result-row.grand .result-value { color: var(--orange); font-size: 15px; }
        .result-row.grand .result-label { color: var(--text); font-weight: 700; font-size: 13px; }
        .result-row.grand { background: rgba(255,159,67,0.07); }
        .result-row.heading .result-label { color: var(--accent2); font-weight: 700; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
        .result-row.heading { background: rgba(124,111,255,0.08); }

        /* GAUGES */
        .gauges-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 12px; }
        .gauge {}
        .gauge-header {
          display: flex;
          justify-content: space-between;
          font-family: var(--mono);
          font-size: 11px;
          color: var(--text2);
          margin-bottom: 6px;
        }
        .gauge-track {
          height: 6px;
          background: var(--surface3);
          border-radius: 4px;
          overflow: hidden;
        }
        .gauge-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.4s cubic-bezier(0.4,0,0.2,1);
        }

        /* INFO GRID */
        .info-grid { padding: 14px 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .info-item {
          background: var(--surface2);
          border-radius: 8px;
          padding: 10px 12px;
        }
        .info-item-label { font-family: var(--mono); font-size: 10px; color: var(--text3); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
        .info-item-val { font-family: var(--mono); font-size: 13px; color: var(--text); }

        /* FULL WIDTH CARD */
        .full-width { grid-column: 1 / -1; }

        /* RATES TABLE */
        .rates-body { padding: 0; }
        .rate-row {
          display: grid;
          grid-template-columns: 1fr 80px 80px 80px;
          padding: 9px 16px;
          border-bottom: 1px solid rgba(42,48,80,0.5);
          font-family: var(--mono);
          font-size: 12px;
          align-items: center;
          gap: 8px;
        }
        .rate-row:last-child { border-bottom: none; }
        .rate-row.header-row {
          background: var(--surface2);
          color: var(--text3);
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .rate-row:not(.header-row):hover { background: rgba(255,255,255,0.02); }
        .rate-cell-right { text-align: right; }
        .rate-cell-green { color: var(--green); }
        .rate-cell-red { color: var(--red); }
        .rate-cell-orange { color: var(--orange); }
      `}</style>

      <div className="app">
        {/* HEADER */}
        <div className="header">
          <div className="header-left">
            <div className="header-badge">SRBIJA · 2025</div>
            <h1>Obračun Zarada</h1>
            <div className="header-sub">PREKOVREMENI · PRAZNICI · BONUSI · DOPRINOSI · POREZ</div>
          </div>
        </div>

        {/* HERO */}
        <div className="hero-cards">
          <div className="hero-card neto">
            <div className="hero-card-label">Neto zarada</div>
            <div className="hero-card-value"><AnimatedNum value={r.neto} /></div>
            <div className="hero-card-sub">RSD · na račun zaposlenog</div>
          </div>
          <div className="hero-card bruto">
            <div className="hero-card-label">Bruto 1</div>
            <div className="hero-card-value"><AnimatedNum value={r.bruto1} /></div>
            <div className="hero-card-sub">RSD · osnova za poreze</div>
          </div>
          <div className="hero-card cost">
            <div className="hero-card-label">Ukupan trošak</div>
            <div className="hero-card-value"><AnimatedNum value={r.totalCost} /></div>
            <div className="hero-card-sub">RSD · Bruto 2 + naknade</div>
          </div>
        </div>

        {/* RATIO BAR */}
        <div className="ratio-bar-wrap">
          <div className="ratio-bar-header">
            <span>RASPODELA BRUTO 1</span>
            <span style={{ color: "var(--green)" }}>Neto {pct(r.netoBruto1Ratio)}</span>
          </div>
          <div className="ratio-bar">
            <div className="ratio-seg" style={{ width: `${r.neto / r.bruto1 * 100}%`, background: "var(--green)" }} />
            <div className="ratio-seg" style={{ width: `${r.totalEmpContrib / r.bruto1 * 100}%`, background: "var(--orange)" }} />
            <div className="ratio-seg" style={{ width: `${r.tax / r.bruto1 * 100}%`, background: "var(--red)" }} />
          </div>
          <div className="ratio-legend">
            <div className="ratio-legend-item"><div className="ratio-dot" style={{ background: "var(--green)" }} />Neto ({pct(r.neto / r.bruto1)})</div>
            <div className="ratio-legend-item"><div className="ratio-dot" style={{ background: "var(--orange)" }} />Doprinosi zaposl. ({pct(r.totalEmpContrib / r.bruto1)})</div>
            <div className="ratio-legend-item"><div className="ratio-dot" style={{ background: "var(--red)" }} />Porez ({pct(r.tax / r.bruto1)})</div>
          </div>
        </div>

        {/* TABS */}
        <div className="tabs">
          {["inputs", "results", "rates"].map((t) => (
            <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
              {{ inputs: "📝 Unos", results: "📊 Obračun", rates: "📋 Stope" }[t]}
            </button>
          ))}
        </div>

        {/* INPUTS TAB */}
        {activeTab === "inputs" && (
          <div className="main-grid">
            <div className="card">
              <SectionTitle icon="💰">Osnovna zarada</SectionTitle>
              <div className="inputs-body">
                <NumberInput label="Osnovna bruto zarada" value={inputs.basicBruto} onChange={set("basicBruto")} step={1000} />
                <NumberInput label="Standardnih radnih sati" value={inputs.standardHours} onChange={set("standardHours")} unit="h" sublabel="(21 dan × 8h = 168)" />
              </div>
              <SectionTitle icon="⏰">Prekovremeni rad</SectionTitle>
              <div className="inputs-body">
                <NumberInput label="Prekovremenih sati" sublabel="(min +26% – čl. 108 ZOR)" value={inputs.overtimeH} onChange={set("overtimeH")} unit="h" />
              </div>
              <SectionTitle icon="🌙">Noćni rad (22h–06h)</SectionTitle>
              <div className="inputs-body">
                <NumberInput label="Sati noćnog rada" sublabel="(min +26%)" value={inputs.nightH} onChange={set("nightH")} unit="h" />
              </div>
              <SectionTitle icon="📅">Vikend i praznici</SectionTitle>
              <div className="inputs-body">
                <NumberInput label="Sati rada vikendom" sublabel="(min +26%)" value={inputs.weekendH} onChange={set("weekendH")} unit="h" />
                <NumberInput label="Sati rada na državni praznik" sublabel="(min +26%)" value={inputs.holidayH} onChange={set("holidayH")} unit="h" />
              </div>
            </div>

            <div className="card">
              <SectionTitle icon="🎁">Bonusi i nagrade</SectionTitle>
              <div className="inputs-body">
                <NumberInput label="Fiksni bonus (iznos)" value={inputs.fixedBonus} onChange={set("fixedBonus")} step={1000} />
                <NumberInput label="Procentualni bonus (% od osnovne)" value={inputs.bonusPct} onChange={set("bonusPct")} unit="%" step={0.5} />
                <div className="result-row positive" style={{ borderRadius: 8, border: "1px solid var(--border)", margin: 0 }}>
                  <span className="result-label">Ukupno bonusi</span>
                  <span className="result-value">+{fmt(r.bonusAmount)} <span className="rsd">RSD</span></span>
                </div>
              </div>
              <SectionTitle icon="🍽️">Naknade van zarade</SectionTitle>
              <div className="inputs-body">
                <NumberInput label="Prevoz (mesečno)" sublabel={`(neopor. max 5.630 RSD)`} value={inputs.transport} onChange={set("transport")} step={100} />
                <NumberInput label="Radnih dana (topli obrok)" sublabel={`(1.490 RSD/dan)`} value={inputs.mealDays} onChange={set("mealDays")} unit="dana" min={0} />
                <div className="result-row positive" style={{ borderRadius: 8, border: "1px solid var(--border)", margin: 0 }}>
                  <span className="result-label">Ukupno naknade</span>
                  <span className="result-value">+{fmt(r.mealAllowance + r.transportActual)} <span className="rsd">RSD</span></span>
                </div>
              </div>
              <SectionTitle icon="📈">Uvećanja zarade</SectionTitle>
              <div className="gauges-body">
                <GaugeBar label="Prekovremeni rad" value={r.overtimePay} max={r.bruto1} color="var(--accent)" />
                <GaugeBar label="Noćni rad" value={r.nightPay} max={r.bruto1} color="var(--accent2)" />
                <GaugeBar label="Vikend rad" value={r.weekendPay} max={r.bruto1} color="var(--green)" />
                <GaugeBar label="Rad na praznike" value={r.holidayPay} max={r.bruto1} color="var(--orange)" />
                <GaugeBar label="Bonusi" value={r.bonusAmount} max={r.bruto1} color="#ff6b6b" />
              </div>
            </div>
          </div>
        )}

        {/* RESULTS TAB */}
        {activeTab === "results" && (
          <div className="main-grid">
            <div className="card">
              <SectionTitle icon="🧮">Formiranje Bruto 1</SectionTitle>
              <div className="results-body">
                <ResultRow label="Osnovna bruto zarada" value={inputs.basicBruto} type="positive" />
                {r.overtimePay > 0 && <ResultRow label="Prekovremeni rad (+26%)" value={r.overtimePay} type="positive" sub={`${inputs.overtimeH}h × ${fmt(r.hourRate)} × 1.26`} />}
                {r.nightPay > 0 && <ResultRow label="Noćni rad (+26%)" value={r.nightPay} type="positive" sub={`${inputs.nightH}h × ${fmt(r.hourRate)} × 1.26`} />}
                {r.weekendPay > 0 && <ResultRow label="Vikend rad (+26%)" value={r.weekendPay} type="positive" sub={`${inputs.weekendH}h × ${fmt(r.hourRate)} × 1.26`} />}
                {r.holidayPay > 0 && <ResultRow label="Rad na praznike (+26%)" value={r.holidayPay} type="positive" sub={`${inputs.holidayH}h × ${fmt(r.hourRate)} × 1.26`} />}
                {r.bonusAmount > 0 && <ResultRow label="Bonusi / nagrade" value={r.bonusAmount} type="positive" />}
                <ResultRow label="BRUTO 1 (ukupna bruto zarada)" value={r.bruto1} type="total" />
              </div>
              <SectionTitle icon="➖">Doprinosi na teret zaposlenog</SectionTitle>
              <div className="results-body">
                <ResultRow label="Osnovica za doprinose" value={r.contribBase} sub="u granicama 45.950 – 656.425 RSD" />
                <ResultRow label="PIO – penzijsko (14%)" value={-r.pio_emp} type="negative" />
                <ResultRow label="Zdravstvo (5.15%)" value={-r.health_emp} type="negative" />
                <ResultRow label="Nezaposlenost (0.75%)" value={-r.unemp} type="negative" />
                <ResultRow label="UKUPNO doprinosi zaposleni" value={-r.totalEmpContrib} type="negative" />
              </div>
              <SectionTitle icon="💸">Porez na zaradu</SectionTitle>
              <div className="results-body">
                <ResultRow label="Neoporezivi iznos (2025)" value={P.nonTaxable} />
                <ResultRow label="Poreska osnovica" value={r.taxBase} sub="Bruto1 − 28.423 RSD" />
                <ResultRow label="Porez 10%" value={-r.tax} type="negative" />
              </div>
              <SectionTitle icon="✅">Neto zarada</SectionTitle>
              <div className="results-body">
                <ResultRow label="NETO ZARADA (na račun)" value={r.neto} type="total" />
              </div>
            </div>

            <div className="card">
              <SectionTitle icon="🏢">Doprinosi na teret poslodavca</SectionTitle>
              <div className="results-body">
                <ResultRow label="PIO – penzijsko (10%)" value={r.pio_er} type="negative" />
                <ResultRow label="Zdravstvo (5.15%)" value={r.health_er} type="negative" />
                <ResultRow label="UKUPNO doprinosi poslodavac" value={r.totalErContrib} type="negative" />
                <ResultRow label="BRUTO 2 (Bruto1 + Doprinosi posl.)" value={r.bruto2} type="total" />
              </div>
              <SectionTitle icon="🍽️">Naknade van zarade</SectionTitle>
              <div className="results-body">
                <ResultRow label="Topli obrok" value={r.mealAllowance} type="positive" sub={`${inputs.mealDays} dana × 1.490 RSD`} />
                <ResultRow label="Naknada za prevoz" value={r.transportActual} type="positive" sub="neoporezivi iznos" />
                <ResultRow label="UKUPNO naknade" value={r.mealAllowance + r.transportActual} type="total" />
              </div>
              <SectionTitle icon="💼">Ukupan trošak poslodavca</SectionTitle>
              <div className="results-body">
                <ResultRow label="UKUPAN TROŠAK POSLODAVCA" value={r.totalCost} type="grand" />
              </div>
              <SectionTitle icon="📊">Efektivne stope</SectionTitle>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-item-label">Neto / Bruto1</div>
                  <div className="info-item-val" style={{ color: "var(--green)" }}>{pct(r.netoBruto1Ratio)}</div>
                </div>
                <div className="info-item">
                  <div className="info-item-label">Trošak / Neto koef.</div>
                  <div className="info-item-val" style={{ color: "var(--orange)" }}>{r.costPerNeto.toFixed(2)}x</div>
                </div>
                <div className="info-item">
                  <div className="info-item-label">Odbitci iz zarade</div>
                  <div className="info-item-val" style={{ color: "var(--red)" }}>{fmt(r.totalEmpContrib + r.tax)}</div>
                </div>
                <div className="info-item">
                  <div className="info-item-label">Ef. poreska stopa</div>
                  <div className="info-item-val" style={{ color: "var(--red)" }}>{pct((r.totalEmpContrib + r.tax) / r.bruto1)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RATES TAB */}
        {activeTab === "rates" && (
          <div className="main-grid">
            <div className="card full-width">
              <SectionTitle icon="📋">Važeće stope i parametri – Srbija 2025</SectionTitle>
              <div className="rates-body">
                <div className="rate-row header-row">
                  <span>Opis</span>
                  <span className="rate-cell-right">Zaposl.</span>
                  <span className="rate-cell-right">Posl.</span>
                  <span className="rate-cell-right">Ukupno</span>
                </div>
                {[
                  ["PIO – penzijsko i invalidsko", "14.00%", "10.00%", "24.00%", "green", "red", "orange"],
                  ["Zdravstveno osiguranje", "5.15%", "5.15%", "10.30%", "green", "red", "orange"],
                  ["Nezaposlenost", "0.75%", "—", "0.75%", "green", null, "orange"],
                  ["UKUPNO doprinosi", "19.90%", "15.15%", "35.05%", "green", "red", "orange"],
                ].map(([lbl, emp, er, tot, ce, cr, ct], i) => (
                  <div key={i} className="rate-row">
                    <span style={{ color: "var(--text2)" }}>{lbl}</span>
                    <span className={`rate-cell-right ${ce ? "rate-cell-green" : ""}`}>{emp}</span>
                    <span className={`rate-cell-right ${cr ? "rate-cell-red" : ""}`}>{er}</span>
                    <span className={`rate-cell-right ${ct ? "rate-cell-orange" : ""}`}>{tot}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <SectionTitle icon="🔢">Poreske vrednosti</SectionTitle>
              <div className="results-body">
                <ResultRow label="Porez na zaradu" value={null} sub="stopa: 10%" />
                <ResultRow label="Neoporezivi iznos" value={28423} sub="važi 01.02.2025 – 31.01.2026" />
                <ResultRow label="Minimalna bruto zarada" value={73274} sub="2025" />
                <ResultRow label="Najniža osnovica doprinosa" value={45950} sub="2025" />
                <ResultRow label="Najviša osnovica doprinosa" value={656425} sub="2025" />
                <ResultRow label="Neoporezivi iznos od 2026." value={34221} sub="povećanje >20%" />
              </div>
            </div>
            <div className="card">
              <SectionTitle icon="⏫">Uvećana zarada (Čl. 108 ZOR)</SectionTitle>
              <div className="results-body">
                {[
                  ["Prekovremeni rad", "+26%", "min. koeficijent 1.26"],
                  ["Noćni rad (22h–06h)", "+26%", "min. koeficijent 1.26"],
                  ["Rad vikendom", "+26%", "min. koeficijent 1.26"],
                  ["Rad na državni praznik", "+26%", "min. koeficijent 1.26"],
                ].map(([lbl, pct, sub], i) => (
                  <div key={i} className="result-row">
                    <span className="result-label">{lbl}<span className="result-sub">{sub}</span></span>
                    <span className="result-value" style={{ color: "var(--green)" }}>{pct}</span>
                  </div>
                ))}
              </div>
              <SectionTitle icon="🍽️">Neoporezivi dodaci</SectionTitle>
              <div className="results-body">
                <ResultRow label="Topli obrok (dnevno max)" value={1490} />
                <ResultRow label="Prevoz (mesečno max)" value={5630} />
                <ResultRow label="Regres (godišnje max)" value={14560} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
