import { useState, useEffect, useRef } from "react";

const P = {
  taxRate: 0.10, nonTaxable: 28423,
  pioPct_emp: 0.14, health_emp: 0.0515, unemp_emp: 0.0075,
  pio_er: 0.10, health_er: 0.0515,
  overtimeCoef: 1.26, nightCoef: 1.26, weekendCoef: 1.26, holidayCoef: 1.26,
  minBase: 45950, maxBase: 656425,
  mealDaily: 1490, transportMax: 5630, minWage: 73274, standardHours: 168,
};
const MONTHS = ["Januar","Februar","Mart","April","Maj","Jun","Jul","Avgust","Septembar","Oktobar","Novembar","Decembar"];
const fmt = (n) => new Intl.NumberFormat("sr-RS", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);
const pct = (n) => (n * 100).toFixed(2) + "%";

function calculate(inputs) {
  const { basicBruto, standardHours, overtimeH, nightH, weekendH, holidayH, fixedBonus, bonusPct, transport, mealDays } = inputs;
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
  return { hourRate, overtimePay, nightPay, weekendPay, holidayPay, bonusAmount, bruto1, contribBase, pio_emp, health_emp, unemp, totalEmpContrib, taxBase, tax, neto, pio_er, health_er, totalErContrib, bruto2, mealAllowance, transportActual, totalCost, netoBruto1Ratio: bruto1 > 0 ? neto / bruto1 : 0, costPerNeto: neto > 0 ? totalCost / neto : 0 };
}

function generatePayslipHTML(inputs, r, info) {
  const now = new Date();
  const monthName = MONTHS[(info.month || 1) - 1];
  const trow = (label, value, color, sub) => `<tr><td class="rl">${label}${sub ? `<span class="rs">${sub}</span>` : ''}</td><td class="rv" style="color:${color}">${fmt(value)} RSD</td></tr>`;
  return `<!DOCTYPE html><html lang="sr"><head><meta charset="UTF-8"/>
<title>Platni Listić – ${info.employeeName || 'Zaposleni'} – ${monthName} ${info.year}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;background:#fff;color:#1a1a2e;font-size:13px;-webkit-font-smoothing:antialiased}
.page{max-width:780px;margin:0 auto;padding:32px 36px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:18px;border-bottom:3px solid #003d1a}
.hdr h1{font-size:24px;font-weight:800;color:#003d1a}
.hdr .sub{font-family:'JetBrains Mono',monospace;font-size:10px;color:#5ecf80;letter-spacing:2px;text-transform:uppercase;margin-top:4px}
.hdr-r{text-align:right}.hdr-r .per{font-size:18px;font-weight:700;color:#003d1a}
.hdr-r .dn{font-family:'JetBrains Mono',monospace;font-size:10px;color:#999;margin-top:3px}
.parties{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px}
.party{background:#f0fff6;border-radius:8px;padding:14px 16px;border:1px solid #b9ffd4}
.pt{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#5ecf80;margin-bottom:6px}
.pn{font-size:15px;font-weight:700;color:#003d1a;margin-bottom:4px}
.pd{font-size:11px;color:#555;line-height:1.6}
.totals{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px}
.tb{border-radius:8px;padding:14px 16px;text-align:center}
.tb.neto{background:#e8fdf2;border:2px solid #00a040}
.tb.bruto{background:#fffbea;border:2px solid #d4a800}
.tb.cost{background:#fff3ec;border:2px solid #cc5500}
.tbl{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:6px}
.tbv{font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:600}
.tb.neto .tbv{color:#007a32}.tb.bruto .tbv{color:#a07800}.tb.cost .tbv{color:#cc5500}
.tbs{font-size:10px;color:#aaa;margin-top:3px}
.rb{margin-bottom:18px;padding:12px 16px;background:#f0fff6;border:1px solid #b9ffd4;border-radius:8px}
.rbt{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#5ecf80;margin-bottom:8px}
.rbar{height:8px;border-radius:4px;background:#d4f5e0;display:flex;overflow:hidden;margin-bottom:8px}
.rseg{height:100%}
.rleg{display:flex;gap:14px;flex-wrap:wrap}
.ri{display:flex;align-items:center;gap:5px;font-size:10px;color:#555}
.rd{width:8px;height:8px;border-radius:50%}
.sec{margin-bottom:16px}
.sh{background:#003d1a;color:white;padding:7px 14px;border-radius:6px 6px 0 0;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase}
table{width:100%;border-collapse:collapse;border:1px solid #d4f5e0;border-top:none}
tr:nth-child(even) td{background:#f8fffe}
td{padding:8px 14px;border-bottom:1px solid #e8f8f0;vertical-align:top}
tr:last-child td{border-bottom:none}
.rl{color:#444;font-size:12px}
.rs{display:block;font-family:'JetBrains Mono',monospace;font-size:9px;color:#aaa;margin-top:2px}
.rv{text-align:right;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;white-space:nowrap}
.sigs{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:28px;padding-top:18px;border-top:1px solid #d4f5e0}
.sl{font-size:10px;color:#999;margin-bottom:30px}
.sln{border-top:1px solid #003d1a;padding-top:6px;font-size:11px;color:#555}
.footer{margin-top:18px;padding-top:10px;border-top:1px solid #e8f8f0;display:flex;justify-content:space-between;font-size:9px;color:#bbb;font-family:'JetBrains Mono',monospace}
@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.page{padding:16px 20px}}
</style></head><body><div class="page">
<div class="hdr">
  <div><h1>PLATNI LISTIĆ</h1><div class="sub">Obračun zarade · Republika Srbija · ${info.year}</div></div>
  <div class="hdr-r"><div class="per">${monthName} ${info.year}</div><div class="dn">Generisano: ${now.toLocaleDateString('sr-RS')}</div></div>
</div>
<div class="parties">
  <div class="party"><div class="pt">Poslodavac</div><div class="pn">${info.companyName || '—'}</div><div class="pd">${info.companyPib ? `PIB: ${info.companyPib}<br/>` : ''}${info.companyAddress || ''}</div></div>
  <div class="party"><div class="pt">Zaposleni</div><div class="pn">${info.employeeName || '—'}</div><div class="pd">${info.employeeJmbg ? `JMBG: ${info.employeeJmbg}<br/>` : ''}${info.employeePosition ? `Radno mesto: ${info.employeePosition}<br/>` : ''}${info.employeeBank ? `Račun: ${info.employeeBank}` : ''}</div></div>
</div>
<div class="totals">
  <div class="tb neto"><div class="tbl">Neto zarada</div><div class="tbv">${fmt(r.neto)}</div><div class="tbs">RSD · na račun</div></div>
  <div class="tb bruto"><div class="tbl">Bruto 1</div><div class="tbv">${fmt(r.bruto1)}</div><div class="tbs">RSD · osnova</div></div>
  <div class="tb cost"><div class="tbl">Ukupan trošak</div><div class="tbv">${fmt(r.totalCost)}</div><div class="tbs">RSD · Bruto 2 + naknade</div></div>
</div>
<div class="rb">
  <div class="rbt">Raspodela Bruto 1</div>
  <div class="rbar">
    <div class="rseg" style="width:${r.neto/r.bruto1*100}%;background:#00a040"></div>
    <div class="rseg" style="width:${r.totalEmpContrib/r.bruto1*100}%;background:#d4a800"></div>
    <div class="rseg" style="width:${r.tax/r.bruto1*100}%;background:#cc3300"></div>
  </div>
  <div class="rleg">
    <div class="ri"><div class="rd" style="background:#00a040"></div>Neto ${pct(r.neto/r.bruto1)}</div>
    <div class="ri"><div class="rd" style="background:#d4a800"></div>Doprinosi zaposl. ${pct(r.totalEmpContrib/r.bruto1)}</div>
    <div class="ri"><div class="rd" style="background:#cc3300"></div>Porez ${pct(r.tax/r.bruto1)}</div>
  </div>
</div>
<div class="sec"><div class="sh">A. Formiranje Bruto 1</div><table>
${trow('Osnovna bruto zarada', inputs.basicBruto, '#007a32')}
${r.overtimePay > 0 ? trow('Prekovremeni rad (+26%)', r.overtimePay, '#007a32', `${inputs.overtimeH}h × ${fmt(r.hourRate)} × 1.26`) : ''}
${r.nightPay > 0 ? trow('Noćni rad (+26%)', r.nightPay, '#007a32', `${inputs.nightH}h × ${fmt(r.hourRate)} × 1.26`) : ''}
${r.weekendPay > 0 ? trow('Vikend rad (+26%)', r.weekendPay, '#007a32', `${inputs.weekendH}h × ${fmt(r.hourRate)} × 1.26`) : ''}
${r.holidayPay > 0 ? trow('Rad na državni praznik (+26%)', r.holidayPay, '#007a32', `${inputs.holidayH}h × ${fmt(r.hourRate)} × 1.26`) : ''}
${r.bonusAmount > 0 ? trow('Bonusi / nagrade', r.bonusAmount, '#007a32') : ''}
${trow('BRUTO 1 – Ukupna bruto zarada', r.bruto1, '#003d1a')}
</table></div>
<div class="sec"><div class="sh">B. Doprinosi na teret zaposlenog</div><table>
${trow('Osnovica za doprinose', r.contribBase, '#444', 'u granicama 45.950 – 656.425 RSD')}
${trow('PIO – penzijsko i invalidsko (14%)', r.pio_emp, '#b00000')}
${trow('Zdravstveno osiguranje (5,15%)', r.health_emp, '#b00000')}
${trow('Osiguranje za slučaj nezaposlenosti (0,75%)', r.unemp, '#b00000')}
${trow('UKUPNO doprinosi zaposleni (19,90%)', r.totalEmpContrib, '#b00000')}
</table></div>
<div class="sec"><div class="sh">C. Porez na zaradu</div><table>
${trow('Neoporezivi iznos (2025)', P.nonTaxable, '#444')}
${trow('Poreska osnovica (Bruto1 – neoporezivi)', r.taxBase, '#444', `${fmt(r.bruto1)} – ${fmt(P.nonTaxable)}`)}
${trow('Porez na zaradu (10%)', r.tax, '#b00000')}
</table></div>
<div class="sec"><div class="sh">D. Neto zarada i trošak poslodavca</div><table>
${trow('NETO ZARADA (iznos na račun zaposlenog)', r.neto, '#007a32')}
${trow('PIO – doprinos poslodavca (10%)', r.pio_er, '#7a3300')}
${trow('Zdravstvo – doprinos poslodavca (5,15%)', r.health_er, '#7a3300')}
${trow('UKUPNO doprinosi poslodavca (15,15%)', r.totalErContrib, '#7a3300')}
${trow('BRUTO 2 (Bruto1 + doprinosi poslodavca)', r.bruto2, '#003d1a')}
${r.mealAllowance > 0 ? trow('Topli obrok', r.mealAllowance, '#444', `${inputs.mealDays} dana × 1.490 RSD`) : ''}
${r.transportActual > 0 ? trow('Naknada za prevoz', r.transportActual, '#444') : ''}
${trow('UKUPAN TROŠAK POSLODAVCA', r.totalCost, '#6b0000')}
</table></div>
<div class="sigs">
  <div><div class="sl">Potpis ovlašćenog lica / pečat poslodavca</div><div class="sln">${info.companyName || 'Poslodavac'}</div></div>
  <div><div class="sl">Potpis zaposlenog / prijem platnog listića</div><div class="sln">${info.employeeName || 'Zaposleni'}</div></div>
</div>
<div class="footer">
  <span>Zakon o radu čl. 105, 108 · Zakon o porezu na dohodak · Zakon o doprinosima · Srbija 2025</span>
  <span>${now.toLocaleDateString('sr-RS')} ${now.toLocaleTimeString('sr-RS',{hour:'2-digit',minute:'2-digit'})}</span>
</div>
</div></body></html>`;
}

function printPayslip(inputs, r, info) {
  const html = generatePayslipHTML(inputs, r, info);
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.onload = () => { win.focus(); win.print(); };
}

const NumberInput = ({ label, value, onChange, unit = "RSD", min = 0, step = 1, sublabel }) => (
  <div className="input-field">
    <label>{label}{sublabel && <span className="sublabel">{sublabel}</span>}</label>
    <div className="input-wrap">
      <input type="number" value={value} min={min} step={step} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} />
      <span className="unit">{unit}</span>
    </div>
  </div>
);

const TextInput = ({ label, value, onChange, placeholder = "" }) => (
  <div className="input-field">
    <label>{label}</label>
    <div className="input-wrap">
      <input type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={{ fontFamily: "var(--sans)" }} />
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
  <div className="section-title"><span className="section-icon">{icon}</span><span>{children}</span></div>
);

function AnimatedNum({ value }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const start = prev.current, end = value, dur = 400, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      setDisplay(start + (end - start) * ease);
      if (p < 1) requestAnimationFrame(tick); else prev.current = end;
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span>{fmt(display)}</span>;
}

function GaugeBar({ label, value, max, color }) {
  const pctVal = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="gauge">
      <div className="gauge-header"><span>{label}</span><span style={{ color }}>{fmt(value)} RSD</span></div>
      <div className="gauge-track"><div className="gauge-fill" style={{ width: `${Math.min(pctVal, 100)}%`, background: color }} /></div>
    </div>
  );
}

export default function App() {
  const now = new Date();
  const [inputs, setInputs] = useState({
    basicBruto: 100000, standardHours: 168, overtimeH: 0, nightH: 0,
    weekendH: 0, holidayH: 0, fixedBonus: 0, bonusPct: 0, transport: 0, mealDays: 21,
  });
  const [info, setInfo] = useState({
    companyName: "", companyPib: "", companyAddress: "",
    employeeName: "", employeeJmbg: "", employeePosition: "", employeeBank: "",
    month: now.getMonth() + 1, year: now.getFullYear(),
  });
  const [activeTab, setActiveTab] = useState("inputs");
  const r = calculate(inputs);
  const set = (key) => (val) => setInputs((p) => ({ ...p, [key]: val }));
  const setI = (key) => (val) => setInfo((p) => ({ ...p, [key]: val }));

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #f5f7fa;
      --surface: #ffffff;
      --surface2: #f0f2f5;
      --surface3: #e8ebf0;
      --border: #e0e4eb;
      --accent: #0057ff;
      --accent-light: #e8efff;
      --green: #00b341;
      --green-light: #e6f9ed;
      --red: #f02d3a;
      --red-light: #ffeaec;
      --amber: #f59e0b;
      --amber-light: #fff8e6;
      --text: #0f1623;
      --text2: #4b5563;
      --text3: #9ca3af;
      --mono: 'JetBrains Mono', monospace;
      --sans: 'Inter', sans-serif;
      --radius: 14px;
    }
    body { background: var(--bg); color: var(--text); font-family: var(--sans); min-height: 100vh; -webkit-font-smoothing: antialiased; }
    .app { max-width: 1100px; margin: 0 auto; padding: 32px 20px 60px; }

    /* HEADER */
    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 36px; gap: 16px; flex-wrap: wrap; }
    .header-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-light); color: var(--accent); font-family: var(--mono); font-size: 10px; font-weight: 600; letter-spacing: 1.5px; padding: 4px 10px; border-radius: 100px; margin-bottom: 10px; text-transform: uppercase; }
    .header h1 { font-size: clamp(22px,3.5vw,34px); font-weight: 700; line-height: 1.1; letter-spacing: -0.8px; color: var(--text); }
    .header h1 span { color: var(--accent); }
    .header-sub { font-family: var(--mono); font-size: 10px; color: var(--text3); margin-top: 8px; letter-spacing: 1px; text-transform: uppercase; }

    /* PDF BUTTON */
    .btn-pdf { display: flex; align-items: center; gap: 8px; background: var(--accent); border: none; color: #ffffff; border-radius: 10px; padding: 11px 22px; font-family: var(--sans); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; letter-spacing: -0.1px; box-shadow: 0 4px 16px rgba(0,87,255,0.25); }
    .btn-pdf:hover { background: #0047dd; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,87,255,0.35); }
    .btn-pdf:active { transform: translateY(0); box-shadow: 0 2px 8px rgba(0,87,255,0.2); }
    .btn-pdf svg { width: 16px; height: 16px; flex-shrink: 0; }

    /* HERO */
    .hero-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 24px; }
    @media (max-width:600px) { .hero-cards { grid-template-columns: 1fr; } }
    .hero-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 22px; position: relative; overflow: hidden; transition: box-shadow 0.2s; }
    .hero-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); }
    .hero-card.neto { border-top: 3px solid var(--green); }
    .hero-card.bruto { border-top: 3px solid var(--accent); }
    .hero-card.cost { border-top: 3px solid var(--amber); }
    .hero-card-label { font-size: 10px; font-weight: 600; color: var(--text3); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 10px; }
    .hero-card-value { font-family: var(--mono); font-size: clamp(17px,2.2vw,22px); font-weight: 500; letter-spacing: -0.5px; }
    .hero-card.neto .hero-card-value { color: var(--green); }
    .hero-card.bruto .hero-card-value { color: var(--accent); }
    .hero-card.cost .hero-card-value { color: var(--amber); }
    .hero-card-sub { font-family: var(--mono); font-size: 10px; color: var(--text3); margin-top: 5px; }

    /* RATIO BAR */
    .ratio-bar-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 22px; margin-bottom: 24px; }
    .ratio-bar-header { display: flex; justify-content: space-between; font-size: 10px; font-weight: 600; color: var(--text3); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .ratio-bar { height: 8px; border-radius: 100px; background: var(--surface3); overflow: hidden; display: flex; }
    .ratio-seg { height: 100%; transition: width 0.4s cubic-bezier(0.4,0,0.2,1); }
    .ratio-legend { display: flex; gap: 18px; margin-top: 12px; flex-wrap: wrap; }
    .ratio-legend-item { display: flex; align-items: center; gap: 7px; font-size: 11px; color: var(--text2); font-weight: 500; }
    .ratio-dot { width: 7px; height: 7px; border-radius: 50%; }

    /* TABS */
    .tabs { display: flex; gap: 4px; margin-bottom: 20px; flex-wrap: wrap; background: var(--surface2); padding: 4px; border-radius: 10px; width: fit-content; border: 1px solid var(--border); }
    .tab { padding: 7px 18px; border-radius: 7px; border: none; background: transparent; color: var(--text3); font-family: var(--sans); font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; letter-spacing: -0.1px; }
    .tab:hover { color: var(--text2); background: rgba(255,255,255,0.7); }
    .tab.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,0.1); }

    /* GRID & CARD */
    .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width:760px) { .main-grid { grid-template-columns: 1fr; } }
    .full-width { grid-column: 1 / -1; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }

    /* SECTION TITLE */
    .section-title { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: var(--surface2); border-bottom: 1px solid var(--border); font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text3); }
    .section-icon { font-size: 13px; }

    /* INPUTS */
    .inputs-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 11px; }
    .input-field { display: flex; flex-direction: column; gap: 5px; }
    .input-field label { font-size: 11px; font-weight: 600; color: var(--text2); letter-spacing: 0.1px; }
    .sublabel { font-family: var(--mono); font-size: 10px; color: var(--text3); margin-left: 6px; font-weight: 400; }
    .input-wrap { display: flex; align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; transition: border-color 0.15s, box-shadow 0.15s; }
    .input-wrap:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,87,255,0.1); }
    .input-wrap input { flex: 1; background: transparent; border: none; outline: none; color: var(--text); font-family: var(--mono); font-size: 13px; font-weight: 500; padding: 9px 12px; width: 100%; }
    .input-wrap input[type="text"] { font-family: var(--sans); font-size: 13px; font-weight: 400; }
    .input-wrap input::placeholder { color: var(--text3); font-weight: 400; }
    .input-wrap input::-webkit-inner-spin-button, .input-wrap input::-webkit-outer-spin-button { opacity: 0.3; }
    .unit { font-family: var(--mono); font-size: 10px; font-weight: 500; color: var(--text3); padding: 0 10px; border-left: 1px solid var(--border); white-space: nowrap; background: var(--surface2); align-self: stretch; display: flex; align-items: center; letter-spacing: 0.5px; }
    .select-wrap { display: flex; gap: 8px; }
    .select-wrap select { flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-family: var(--sans); font-size: 13px; font-weight: 400; padding: 9px 12px; outline: none; cursor: pointer; transition: border-color 0.15s; }
    .select-wrap select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,87,255,0.1); }

    /* RESULTS */
    .results-body { padding: 4px 0; }
    .result-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 16px; border-bottom: 1px solid var(--border); transition: background 0.1s; gap: 12px; }
    .result-row:hover { background: var(--surface2); }
    .result-row:last-child { border-bottom: none; }
    .result-label { font-size: 12px; color: var(--text2); display: flex; flex-direction: column; gap: 2px; font-weight: 400; }
    .result-sub { font-family: var(--mono); font-size: 9px; color: var(--text3); font-weight: 400; letter-spacing: 0.3px; }
    .result-value { font-family: var(--mono); font-size: 12px; font-weight: 500; white-space: nowrap; color: var(--text); }
    .rsd { font-size: 9px; color: var(--text3); margin-left: 3px; font-weight: 400; letter-spacing: 0.5px; }
    .result-row.positive .result-value { color: var(--green); }
    .result-row.negative .result-value { color: var(--red); }
    .result-row.total { background: var(--accent-light); border-top: 1px solid #c8d8ff; border-bottom: none; margin-top: 2px; }
    .result-row.total .result-value { color: var(--accent); font-size: 13px; font-weight: 600; }
    .result-row.total .result-label { color: var(--text); font-weight: 600; font-size: 12px; }
    .result-row.grand { background: var(--amber-light); border-top: 1px solid #fde68a; border-bottom: none; margin-top: 2px; }
    .result-row.grand .result-value { color: var(--amber); font-size: 14px; font-weight: 700; }
    .result-row.grand .result-label { color: var(--text); font-weight: 600; font-size: 12px; }

    /* GAUGES */
    .gauges-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 13px; }
    .gauge-header { display: flex; justify-content: space-between; font-size: 11px; font-weight: 500; color: var(--text2); margin-bottom: 6px; }
    .gauge-track { height: 5px; background: var(--surface3); border-radius: 100px; overflow: hidden; }
    .gauge-fill { height: 100%; border-radius: 100px; transition: width 0.4s cubic-bezier(0.4,0,0.2,1); }

    /* INFO GRID */
    .info-grid { padding: 14px 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .info-item { background: var(--surface2); border-radius: 8px; padding: 11px 13px; border: 1px solid var(--border); }
    .info-item-label { font-size: 9px; font-weight: 700; color: var(--text3); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px; }
    .info-item-val { font-family: var(--mono); font-size: 15px; font-weight: 500; color: var(--text); }

    /* RATES */
    .rates-body { padding: 0; }
    .rate-row { display: grid; grid-template-columns: 1fr 80px 80px 80px; padding: 9px 16px; border-bottom: 1px solid var(--border); font-family: var(--mono); font-size: 11px; align-items: center; gap: 8px; }
    .rate-row:last-child { border-bottom: none; }
    .rate-row.header-row { background: var(--surface2); color: var(--text3); font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; font-family: var(--sans); }
    .rate-row:not(.header-row):hover { background: var(--surface2); }
    .rate-cell-right { text-align: right; }
    .rate-cell-green { color: var(--green); font-weight: 600; }
    .rate-cell-red { color: var(--red); font-weight: 600; }
    .rate-cell-yellow { color: var(--amber); font-weight: 600; }

    .pdf-note { font-size: 11px; color: var(--text3); padding: 10px 16px; border-top: 1px solid var(--border); }
    .btn-pdf-full { width: calc(100% - 32px); justify-content: center; margin: 14px 16px 16px; }
  `;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {/* HEADER */}
        <div className="header">
          <div>
            <div className="header-badge">Srbija · 2025</div>
            <h1>Platni<span>Listić</span></h1>
            <div className="header-sub">obračun zarada · prekovremeni · praznici · bonusi · porez</div>
          </div>
          <button className="btn-pdf" onClick={() => printPayslip(inputs, r, info)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            Generiši Platni Listić
          </button>
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
            <span style={{ color: "var(--green)", fontWeight: 600 }}>Neto {pct(r.netoBruto1Ratio)}</span>
          </div>
          <div className="ratio-bar">
            <div className="ratio-seg" style={{ width: `${r.neto/r.bruto1*100}%`, background: "#00b341" }} />
            <div className="ratio-seg" style={{ width: `${r.totalEmpContrib/r.bruto1*100}%`, background: "#f59e0b" }} />
            <div className="ratio-seg" style={{ width: `${r.tax/r.bruto1*100}%`, background: "#f02d3a" }} />
          </div>
          <div className="ratio-legend">
            <div className="ratio-legend-item"><div className="ratio-dot" style={{ background: "#00b341" }} />Neto ({pct(r.neto/r.bruto1)})</div>
            <div className="ratio-legend-item"><div className="ratio-dot" style={{ background: "#f59e0b" }} />Doprinosi zaposl. ({pct(r.totalEmpContrib/r.bruto1)})</div>
            <div className="ratio-legend-item"><div className="ratio-dot" style={{ background: "#f02d3a" }} />Porez ({pct(r.tax/r.bruto1)})</div>
          </div>
        </div>

        {/* TABS */}
        <div className="tabs">
          {["inputs","payslip","results","rates"].map((t) => (
            <button key={t} className={`tab ${activeTab===t?"active":""}`} onClick={() => setActiveTab(t)}>
              {{"inputs":"📝 Unos","payslip":"🧾 Platni Listić","results":"📊 Obračun","rates":"📋 Stope"}[t]}
            </button>
          ))}
        </div>

        {/* INPUTS */}
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
                  <span className="result-value" style={{color:"var(--green)"}}>+{fmt(r.bonusAmount)} <span className="rsd">RSD</span></span>
                </div>
              </div>
              <SectionTitle icon="🍽️">Naknade van zarade</SectionTitle>
              <div className="inputs-body">
                <NumberInput label="Prevoz (mesečno)" sublabel="(neopor. max 5.630 RSD)" value={inputs.transport} onChange={set("transport")} step={100} />
                <NumberInput label="Radnih dana (topli obrok)" sublabel="(1.490 RSD/dan)" value={inputs.mealDays} onChange={set("mealDays")} unit="dana" min={0} />
                <div className="result-row positive" style={{ borderRadius: 8, border: "1px solid var(--border)", margin: 0 }}>
                  <span className="result-label">Ukupno naknade</span>
                  <span className="result-value" style={{color:"var(--green)"}}>+{fmt(r.mealAllowance + r.transportActual)} <span className="rsd">RSD</span></span>
                </div>
              </div>
              <SectionTitle icon="📈">Uvećanja zarade</SectionTitle>
              <div className="gauges-body">
                <GaugeBar label="Prekovremeni rad" value={r.overtimePay} max={r.bruto1} color="#0057ff" />
                <GaugeBar label="Noćni rad" value={r.nightPay} max={r.bruto1} color="#7c3aed" />
                <GaugeBar label="Vikend rad" value={r.weekendPay} max={r.bruto1} color="#00b341" />
                <GaugeBar label="Rad na praznike" value={r.holidayPay} max={r.bruto1} color="#f59e0b" />
                <GaugeBar label="Bonusi" value={r.bonusAmount} max={r.bruto1} color="#f02d3a" />
              </div>
            </div>
          </div>
        )}

        {/* PAYSLIP TAB */}
        {activeTab === "payslip" && (
          <div className="main-grid">
            <div className="card">
              <SectionTitle icon="🏢">Podaci o poslodavcu</SectionTitle>
              <div className="inputs-body">
                <TextInput label="Naziv firme" value={info.companyName} onChange={setI("companyName")} placeholder="d.o.o. / a.d. ..." />
                <TextInput label="PIB" value={info.companyPib} onChange={setI("companyPib")} placeholder="123456789" />
                <TextInput label="Adresa" value={info.companyAddress} onChange={setI("companyAddress")} placeholder="Ulica br., Grad" />
              </div>
              <SectionTitle icon="📅">Period obračuna</SectionTitle>
              <div className="inputs-body">
                <div className="input-field">
                  <label>Mesec i godina</label>
                  <div className="select-wrap">
                    <select value={info.month} onChange={(e) => setI("month")(parseInt(e.target.value))}>
                      {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                    </select>
                    <select value={info.year} onChange={(e) => setI("year")(parseInt(e.target.value))}>
                      {[2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <SectionTitle icon="👤">Podaci o zaposlenom</SectionTitle>
              <div className="inputs-body">
                <TextInput label="Ime i prezime" value={info.employeeName} onChange={setI("employeeName")} placeholder="Ime Prezime" />
                <TextInput label="JMBG" value={info.employeeJmbg} onChange={setI("employeeJmbg")} placeholder="0101990000000" />
                <TextInput label="Radno mesto" value={info.employeePosition} onChange={setI("employeePosition")} placeholder="Software Engineer ..." />
                <TextInput label="Broj tekućeg računa" value={info.employeeBank} onChange={setI("employeeBank")} placeholder="160-123456-99" />
              </div>
              <div className="pdf-note">Sva polja su opcionalna. Platni listić se generiše sa unetim podacima.</div>
              <div style={{padding:"14px 16px"}}>
                <button className="btn-pdf btn-pdf-full" onClick={() => printPayslip(inputs, r, info)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                  Generiši PDF Platni Listić
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS */}
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
                <div className="info-item"><div className="info-item-label">Neto / Bruto1</div><div className="info-item-val" style={{color:"#00b341"}}>{pct(r.netoBruto1Ratio)}</div></div>
                <div className="info-item"><div className="info-item-label">Trošak / Neto</div><div className="info-item-val" style={{color:"#f59e0b"}}>{r.costPerNeto.toFixed(2)}x</div></div>
                <div className="info-item"><div className="info-item-label">Odbitci iz zarade</div><div className="info-item-val" style={{color:"#f02d3a"}}>{fmt(r.totalEmpContrib + r.tax)}</div></div>
                <div className="info-item"><div className="info-item-label">Ef. poreska stopa</div><div className="info-item-val" style={{color:"#f02d3a"}}>{pct((r.totalEmpContrib + r.tax) / r.bruto1)}</div></div>
              </div>
            </div>
          </div>
        )}

        {/* RATES */}
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
                  ["PIO – penzijsko i invalidsko","14.00%","10.00%","24.00%"],
                  ["Zdravstveno osiguranje","5.15%","5.15%","10.30%"],
                  ["Nezaposlenost","0.75%","—","0.75%"],
                  ["UKUPNO doprinosi","19.90%","15.15%","35.05%"],
                ].map(([lbl,emp,er,tot],i) => (
                  <div key={i} className="rate-row">
                    <span style={{color:"var(--text2)"}}>{lbl}</span>
                    <span className="rate-cell-right rate-cell-green">{emp}</span>
                    <span className="rate-cell-right rate-cell-red">{er}</span>
                    <span className="rate-cell-right rate-cell-yellow">{tot}</span>
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
                  ["Prekovremeni rad","+26%","min. koeficijent 1.26"],
                  ["Noćni rad (22h–06h)","+26%","min. koeficijent 1.26"],
                  ["Rad vikendom","+26%","min. koeficijent 1.26"],
                  ["Rad na državni praznik","+26%","min. koeficijent 1.26"],
                ].map(([lbl,p,sub],i) => (
                  <div key={i} className="result-row">
                    <span className="result-label">{lbl}<span className="result-sub">{sub}</span></span>
                    <span className="result-value" style={{color:"var(--green)"}}>{p}</span>
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
