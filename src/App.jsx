import { useState, useEffect, useRef } from "react";

// ── PARAMETERS ───────────────────────────────────────────────────────────────
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

// ── BLOG DATA ─────────────────────────────────────────────────────────────────
const POSTS = [
  {
    id: "neoporezivi-2025",
    date: "1. februar 2025",
    tag: "Porez",
    title: "Neoporezivi iznos zarade u 2025. godini: 28.423 RSD",
    summary: "Od 1. februara 2025. godine, neoporezivi iznos zarade iznosi 28.423 RSD mesečno. Šta to znači za vaš obračun i koliko štedite na porezu?",
    body: `
Od 1. februara 2025. godine, neoporezivi iznos zarade u Srbiji iznosi **28.423 RSD** mesečno. Ovo je iznos koji se oduzima od bruto zarade pre obračuna poreza na dohodak od 10%.

## Kako funkcioniše neoporezivi iznos?

Poreska osnovica se dobija kada se od bruto zarade (Bruto 1) oduzme neoporezivi iznos:

**Poreska osnovica = Bruto 1 − 28.423 RSD**

Na tu razliku se primenjuje stopa poreza od 10%.

## Primer obračuna

Za zaposlenog sa bruto zaradom od **100.000 RSD**:

- Bruto 1: 100.000 RSD
- Neoporezivi iznos: 28.423 RSD
- Poreska osnovica: 71.577 RSD
- Porez (10%): **7.158 RSD**

Da nema neoporezivog iznosa, porez bi bio 10.000 RSD — dakle, **ušteda iznosi 2.842 RSD mesečno**, odnosno 34.108 RSD godišnje.

## Promena u 2026. godini

Od 1. februara 2026. godine, neoporezivi iznos raste na **34.221 RSD** — povećanje od više od 20%. Ovo je direktna posledica usklađivanja sa rastom minimalnih zarada i inflacijom.

## Važno napomenuti

Neoporezivi iznos važi samo za zarade iz radnog odnosa. Za preduzetnike paušalce i vlasnike privrednih društava pravila su drugačija.
    `,
  },
  {
    id: "bruto-neto-razlika",
    date: "15. januar 2025",
    tag: "Osnove",
    title: "Razlika između bruto i neto zarade — jednostavno objašnjenje",
    summary: "Bruto zarada i neto zarada — dva pojma koja svaki zaposleni čuje, ali malo ko zapravo razume šta ih razlikuje. Evo jasnog objašnjenja.",
    body: `
Kada potpisujete ugovor o radu, zarada je obično izražena u bruto iznosu. Ali šta zapravo dobijate na račun? I zašto je razlika toliko velika?

## Bruto 1 — šta je to?

**Bruto 1** je ukupna zarada koja se ugovara između poslodavca i zaposlenog. Uključuje osnovnu zaradu, ali i sve dodatke:

- Prekovremeni rad (+26% minimum)
- Noćni rad (+26% minimum)
- Rad vikendom i praznicima (+26% minimum)
- Bonuse i nagrade

## Od bruto do neto — odbitci

Iz bruto 1 zarade se oduzimaju dve vrste obaveza:

**1. Doprinosi na teret zaposlenog (19,90%)**
- PIO — penzijsko i invalidsko osiguranje: 14%
- Zdravstveno osiguranje: 5,15%
- Osiguranje za slučaj nezaposlenosti: 0,75%

**2. Porez na dohodak (10%)**
- Primenjuje se na bruto zaradu umanjenu za neoporezivi iznos od 28.423 RSD

## Neto zarada

Neto zarada = Bruto 1 − Doprinosi zaposlenog − Porez

Za prosečnu zaradu u Srbiji (~100.000 RSD bruto), neto iznosi oko **72.000–74.000 RSD**.

## Bruto 2 — trošak poslodavca

Poslodavac pored isplate zarade plaća i sopstvene doprinose (15,15%):
- PIO na teret poslodavca: 10%
- Zdravstvo na teret poslodavca: 5,15%

**Bruto 2 = Bruto 1 + Doprinosi poslodavca**

Za zaradu od 100.000 RSD bruto 1, ukupan trošak poslodavca iznosi oko **115.150 RSD** — pre dodavanja naknada za prevoz i topli obrok.
    `,
  },
  {
    id: "prekovremeni-rad",
    date: "10. januar 2025",
    tag: "Zakon o radu",
    title: "Prekovremeni rad u Srbiji: prava i obračun po Zakonu o radu",
    summary: "Zakon o radu propisuje minimum od +26% za prekovremeni rad. Kako se obračunava, koliko može trajati i šta su vaša prava kao zaposlenog?",
    body: `
Prekovremeni rad je regulisan **članom 108. Zakona o radu** Republike Srbije. Evo svega što trebate znati.

## Minimalni koeficijent uvećanja

Za prekovremeni rad, poslodavac je obavezan da plati zaradu uvećanu za **najmanje 26%** u odnosu na redovnu satnicu. Ovo je zakonski minimum — kolektivnim ugovorom ili ugovorom o radu može se utvrditi i veći koeficijent.

Isto uvećanje od minimum 26% važi za:
- Noćni rad (između 22:00 i 06:00 sati)
- Rad vikendom (subota i nedelja)
- Rad na državni praznik

## Kako se računa satnica za prekovremeni?

**Satnica = Osnovna bruto zarada ÷ Broj standardnih radnih sati**

Za mesec sa 168 radnih sati (21 dan × 8 sati) i osnovnom zaradom od 100.000 RSD:

- Regularna satnica: 595,24 RSD
- Satnica za prekovremeni rad (+26%): **750,00 RSD**

## Ograničenja prekovremenog rada

Prema Zakonu o radu:
- Prekovremeni rad ne može trajati duže od **8 sati nedeljno**
- Ukupno radno vreme (redovno + prekovremeno) ne može biti duže od **12 sati dnevno**

## Evidencija i obaveze poslodavca

Poslodavac je dužan da vodi evidenciju o radnom vremenu i da prekovremeni rad evidentira odvojeno. Zaposleni ima pravo da zahteva uvid u evidenciju i da ospori netačne podatke.

Koristite **PlatniListić kalkulator** da proverite da li vam je prekovremeni rad ispravno obračunat.
    `,
  },
  {
    id: "minimalna-zarada-2025",
    date: "2. januar 2025",
    tag: "Novosti",
    title: "Minimalna zarada u Srbiji za 2025. godinu: 73.274 RSD bruto",
    summary: "Vlada Srbije je utvrdila minimalnu zaradu za 2025. godinu. Koliko iznosi, ko ima pravo na nju i kako je obračunati?",
    body: `
Za 2025. godinu, minimalna zarada u Srbiji iznosi **73.274 RSD bruto mesečno** za puno radno vreme (mesec sa 168 radnih sati).

## Minimalna satnica

Minimalna satnica iznosi: 73.274 ÷ 168 = **436,27 RSD po satu**.

Ovo je zakonski minimum. Svaki zaposleni koji radi puno radno vreme mora primiti najmanje ovaj iznos bez obzira na granu delatnosti.

## Neto iznos minimalne zarade

Koliko zaposleni prima na račun pri minimalnoj zarade?

- Bruto 1: 73.274 RSD
- Doprinosi zaposlenog (19,90%): 14.582 RSD
- Poreska osnovica: 73.274 − 28.423 = 44.851 RSD
- Porez (10%): 4.485 RSD
- **Neto: oko 54.207 RSD**

## Trošak poslodavca

Ukupan trošak poslodavca za zaposlenog na minimalnoj zarade:
- Bruto 2 (sa doprinosima poslodavca 15,15%): **84.383 RSD**
- Plus naknade za prevoz i topli obrok

## Ko određuje minimalnu zaradu?

Minimalnu zaradu utvrđuje Vlada Republike Srbije na predlog Socijalno-ekonomskog saveta, a primenjuje se od 1. januara tekuće godine.

Sledeća revizija planirana je za januar 2026. godine, a prema najavljenim tendencijama, rast bi mogao biti u rasponu od 8–12%.
    `,
  },
  {
    id: "doprinosi-srbija",
    date: "20. decembar 2024",
    tag: "Doprinosi",
    title: "Doprinosi za socijalno osiguranje u Srbiji: kompletan vodič za 2025.",
    summary: "Ko plaća doprinose, koliko iznose i na šta imate pravo? Kompletan pregled sistema socijalnog osiguranja za zaposlene u Srbiji.",
    body: `
Sistem socijalnog osiguranja u Srbiji finansira se putem doprinosa koje plaćaju i zaposleni i poslodavci. Evo kompletnog pregleda za 2025. godinu.

## Doprinosi na teret zaposlenog — 19,90% ukupno

| Vrsta doprinosa | Stopa |
|---|---|
| PIO — penzijsko i invalidsko | 14,00% |
| Zdravstveno osiguranje | 5,15% |
| Nezaposlenost | 0,75% |
| **Ukupno** | **19,90%** |

## Doprinosi na teret poslodavca — 15,15% ukupno

| Vrsta doprinosa | Stopa |
|---|---|
| PIO — penzijsko i invalidsko | 10,00% |
| Zdravstveno osiguranje | 5,15% |
| **Ukupno** | **15,15%** |

## Osnovica za obračun doprinosa

Doprinosi se ne računaju na celu zaradu bez ograničenja. Postoje zakonski limiti:

- **Najniža mesečna osnovica**: 45.950 RSD (za 2025)
- **Najviša mesečna osnovica**: 656.425 RSD (za 2025)

Ako zaposleni prima zaradu ispod najniže osnovice, doprinosi se ipak računaju na 45.950 RSD. Ako prima iznad najviše, doprinosi se računaju samo do 656.425 RSD.

## Šta dobijate uplatom doprinosa?

**PIO doprinosi** obezbeđuju pravo na starosnu penziju, invalidsku penziju i porodičnu penziju. Uslov za starosnu penziju je 65 godina starosti i 15 godina staža (ili 45 godina staža bez obzira na godine).

**Zdravstveni doprinosi** obezbeđuju pravo na zdravstvenu zaštitu, bolovanje, naknadu za porodiljsko odsustvo i refundaciju troškova lečenja.

**Doprinos za nezaposlenost** obezbeđuje pravo na novčanu naknadu u slučaju gubitka posla.

## Plaćanje doprinosa

Poslodavac je odgovoran za obračun i uplatu svih doprinosa (i zaposlenih i svojih) zajedno sa isplatom zarade. Rok za uplatu je isti dan kada se isplaćuje zarada.
    `,
  },
];

// ── CALCULATE ─────────────────────────────────────────────────────────────────
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

// ── PAYSLIP PDF ───────────────────────────────────────────────────────────────
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
.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:18px;border-bottom:3px solid #0057ff}
.hdr h1{font-size:22px;font-weight:800;color:#0f1623;letter-spacing:-0.5px}
.hdr .sub{font-family:'JetBrains Mono',monospace;font-size:10px;color:#9ca3af;letter-spacing:1px;text-transform:uppercase;margin-top:4px}
.hdr-r{text-align:right}.hdr-r .per{font-size:17px;font-weight:700;color:#0f1623}
.hdr-r .dn{font-family:'JetBrains Mono',monospace;font-size:10px;color:#9ca3af;margin-top:3px}
.parties{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px}
.party{background:#f5f7fa;border-radius:8px;padding:14px 16px;border:1px solid #e0e4eb}
.pt{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#9ca3af;margin-bottom:6px}
.pn{font-size:15px;font-weight:700;color:#0f1623;margin-bottom:4px}
.pd{font-size:11px;color:#4b5563;line-height:1.6}
.totals{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px}
.tb{border-radius:8px;padding:14px 16px;text-align:center}
.tb.neto{background:#e6f9ed;border:1.5px solid #00b341}
.tb.bruto{background:#e8efff;border:1.5px solid #0057ff}
.tb.cost{background:#fff8e6;border:1.5px solid #f59e0b}
.tbl{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;margin-bottom:6px}
.tbv{font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:600}
.tb.neto .tbv{color:#00b341}.tb.bruto .tbv{color:#0057ff}.tb.cost .tbv{color:#f59e0b}
.tbs{font-size:10px;color:#9ca3af;margin-top:3px}
.rb{margin-bottom:18px;padding:12px 16px;background:#f5f7fa;border:1px solid #e0e4eb;border-radius:8px}
.rbt{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;margin-bottom:8px}
.rbar{height:7px;border-radius:100px;background:#e8ebf0;display:flex;overflow:hidden;margin-bottom:8px}
.rseg{height:100%}
.rleg{display:flex;gap:14px;flex-wrap:wrap}
.ri{display:flex;align-items:center;gap:5px;font-size:10px;color:#4b5563}
.rd{width:7px;height:7px;border-radius:50%}
.sec{margin-bottom:16px}
.sh{background:#0f1623;color:white;padding:7px 14px;border-radius:6px 6px 0 0;font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase}
table{width:100%;border-collapse:collapse;border:1px solid #e0e4eb;border-top:none}
tr:nth-child(even) td{background:#f9fafb}
td{padding:8px 14px;border-bottom:1px solid #e0e4eb;vertical-align:top}
tr:last-child td{border-bottom:none}
.rl{color:#4b5563;font-size:12px}
.rs{display:block;font-family:'JetBrains Mono',monospace;font-size:9px;color:#9ca3af;margin-top:2px}
.rv{text-align:right;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;white-space:nowrap}
.sigs{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:28px;padding-top:18px;border-top:1px solid #e0e4eb}
.sl{font-size:10px;color:#9ca3af;margin-bottom:30px}
.sln{border-top:1px solid #0f1623;padding-top:6px;font-size:11px;color:#4b5563}
.footer{margin-top:18px;padding-top:10px;border-top:1px solid #e0e4eb;display:flex;justify-content:space-between;font-size:9px;color:#9ca3af;font-family:'JetBrains Mono',monospace}
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
    <div class="rseg" style="width:${r.neto/r.bruto1*100}%;background:#00b341"></div>
    <div class="rseg" style="width:${r.totalEmpContrib/r.bruto1*100}%;background:#f59e0b"></div>
    <div class="rseg" style="width:${r.tax/r.bruto1*100}%;background:#f02d3a"></div>
  </div>
  <div class="rleg">
    <div class="ri"><div class="rd" style="background:#00b341"></div>Neto ${pct(r.neto/r.bruto1)}</div>
    <div class="ri"><div class="rd" style="background:#f59e0b"></div>Doprinosi zaposl. ${pct(r.totalEmpContrib/r.bruto1)}</div>
    <div class="ri"><div class="rd" style="background:#f02d3a"></div>Porez ${pct(r.tax/r.bruto1)}</div>
  </div>
</div>
<div class="sec"><div class="sh">A. Formiranje Bruto 1</div><table>
${trow('Osnovna bruto zarada', inputs.basicBruto, '#00b341')}
${inputs.overtimeH > 0 ? trow('Prekovremeni rad (+26%)', r.overtimePay, '#00b341', `${inputs.overtimeH}h × ${fmt(r.hourRate)} × 1.26`) : ''}
${inputs.nightH > 0 ? trow('Noćni rad (+26%)', r.nightPay, '#00b341', `${inputs.nightH}h × ${fmt(r.hourRate)} × 1.26`) : ''}
${inputs.weekendH > 0 ? trow('Vikend rad (+26%)', r.weekendPay, '#00b341', `${inputs.weekendH}h × ${fmt(r.hourRate)} × 1.26`) : ''}
${inputs.holidayH > 0 ? trow('Rad na državni praznik (+26%)', r.holidayPay, '#00b341', `${inputs.holidayH}h × ${fmt(r.hourRate)} × 1.26`) : ''}
${r.bonusAmount > 0 ? trow('Bonusi / nagrade', r.bonusAmount, '#00b341') : ''}
${trow('BRUTO 1 – Ukupna bruto zarada', r.bruto1, '#0057ff')}
</table></div>
<div class="sec"><div class="sh">B. Doprinosi na teret zaposlenog</div><table>
${trow('Osnovica za doprinose', r.contribBase, '#4b5563', 'u granicama 45.950 – 656.425 RSD')}
${trow('PIO – penzijsko i invalidsko (14%)', r.pio_emp, '#f02d3a')}
${trow('Zdravstveno osiguranje (5,15%)', r.health_emp, '#f02d3a')}
${trow('Osiguranje za slučaj nezaposlenosti (0,75%)', r.unemp, '#f02d3a')}
${trow('UKUPNO doprinosi zaposleni (19,90%)', r.totalEmpContrib, '#f02d3a')}
</table></div>
<div class="sec"><div class="sh">C. Porez na zaradu</div><table>
${trow('Neoporezivi iznos', P.nonTaxable, '#4b5563')}
${trow('Poreska osnovica (Bruto1 – neoporezivi)', r.taxBase, '#4b5563', `${fmt(r.bruto1)} – ${fmt(P.nonTaxable)}`)}
${trow('Porez na zaradu (10%)', r.tax, '#f02d3a')}
</table></div>
<div class="sec"><div class="sh">D. Neto zarada i trošak poslodavca</div><table>
${trow('NETO ZARADA (iznos na račun zaposlenog)', r.neto, '#00b341')}
${trow('PIO – doprinos poslodavca (10%)', r.pio_er, '#f59e0b')}
${trow('Zdravstvo – doprinos poslodavca (5,15%)', r.health_er, '#f59e0b')}
${trow('UKUPNO doprinosi poslodavca (15,15%)', r.totalErContrib, '#f59e0b')}
${trow('BRUTO 2 (Bruto1 + doprinosi poslodavca)', r.bruto2, '#0057ff')}
${r.mealAllowance > 0 ? trow('Topli obrok', r.mealAllowance, '#4b5563', `${inputs.mealDays} dana × 1.490 RSD`) : ''}
${r.transportActual > 0 ? trow('Naknada za prevoz', r.transportActual, '#4b5563') : ''}
${trow('UKUPAN TROŠAK POSLODAVCA', r.totalCost, '#f59e0b')}
</table></div>
<div class="sigs">
  <div><div class="sl">Potpis ovlašćenog lica / pečat poslodavca</div><div class="sln">${info.companyName || 'Poslodavac'}</div></div>
  <div><div class="sl">Potpis zaposlenog / prijem platnog listića</div><div class="sln">${info.employeeName || 'Zaposleni'}</div></div>
</div>
<div class="footer">
  <span>Zakon o radu čl. 105, 108 · Zakon o porezu na dohodak · Zakon o doprinosima · Republika Srbija</span>
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

// ── MARKDOWN RENDERER (simple) ────────────────────────────────────────────────
function renderMd(text) {
  return text.trim()
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\|(.+)\|$/gm, (m) => {
      if (m.includes('---')) return '';
      const cells = m.split('|').filter(Boolean).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>\n?)+/gs, (m) => `<table>${m}</table>`)
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/gs, (m) => `<ul>${m}</ul>`)
    .split(/\n\n+/)
    .map(b => b.startsWith('<') ? b : `<p>${b.replace(/\n/g,' ')}</p>`)
    .join('\n');
}

// ── UI COMPONENTS ─────────────────────────────────────────────────────────────
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
      const ease = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
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

// ── PAGES ─────────────────────────────────────────────────────────────────────
function BlogList({ onOpen }) {
  return (
    <div className="blog-page">
      <div className="blog-header">
        <div className="page-eyebrow">Blog</div>
        <h2 className="page-title">Novosti i vodiči</h2>
        <p className="page-sub">Aktuelne informacije o zaradama, doprinosima i poreskim promenama u Srbiji.</p>
      </div>
      <div className="post-list">
        {POSTS.map(post => (
          <div key={post.id} className="post-card" onClick={() => onOpen(post.id)}>
            <div className="post-meta">
              <span className="post-tag">{post.tag}</span>
              <span className="post-date">{post.date}</span>
            </div>
            <h3 className="post-title">{post.title}</h3>
            <p className="post-summary">{post.summary}</p>
            <div className="post-read">Pročitaj više →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogPost({ post, onBack }) {
  return (
    <div className="blog-page">
      <button className="back-btn" onClick={onBack}>← Svi članci</button>
      <div className="post-meta" style={{marginBottom: 16}}>
        <span className="post-tag">{post.tag}</span>
        <span className="post-date">{post.date}</span>
      </div>
      <h1 className="post-full-title">{post.title}</h1>
      <div className="post-body" dangerouslySetInnerHTML={{ __html: renderMd(post.body) }} />
      <div className="post-cta">
        <p>Proverite tačan obračun vaše zarade koristeći naš besplatni kalkulator.</p>
        <button className="cta-btn" onClick={onBack}>← Nazad na blog</button>
      </div>
    </div>
  );
}

// ── CALCULATOR PAGE ───────────────────────────────────────────────────────────
function CalculatorPage() {
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

  return (
    <>
      {/* HERO CARDS */}
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
          <span>Raspodela Bruto 1</span>
          <span style={{ color: "var(--green)", fontWeight: 600 }}>Neto {pct(r.netoBruto1Ratio)}</span>
        </div>
        <div className="ratio-bar">
          <div className="ratio-seg" style={{ width: `${r.neto/r.bruto1*100}%`, background: "#00b341" }} />
          <div className="ratio-seg" style={{ width: `${r.totalEmpContrib/r.bruto1*100}%`, background: "#f59e0b" }} />
          <div className="ratio-seg" style={{ width: `${r.tax/r.bruto1*100}%`, background: "#f02d3a" }} />
        </div>
        <div className="ratio-legend">
          <div className="ratio-legend-item"><div className="ratio-dot" style={{ background: "#00b341" }} />Neto ({pct(r.neto/r.bruto1)})</div>
          <div className="ratio-legend-item"><div className="ratio-dot" style={{ background: "#f59e0b" }} />Doprinosi ({pct(r.totalEmpContrib/r.bruto1)})</div>
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
              <ResultRow label="Neoporezivi iznos" value={P.nonTaxable} />
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

      {activeTab === "rates" && (
        <div className="main-grid">
          <div className="card full-width">
            <SectionTitle icon="📋">Važeće stope i parametri</SectionTitle>
            <div className="rates-body">
              <div className="rate-row header-row">
                <span>Opis</span>
                <span className="rate-cell-right">Zaposl.</span>
                <span className="rate-cell-right">Posl.</span>
                <span className="rate-cell-right">Ukupno</span>
              </div>
              {[["PIO – penzijsko i invalidsko","14.00%","10.00%","24.00%"],["Zdravstveno osiguranje","5.15%","5.15%","10.30%"],["Nezaposlenost","0.75%","—","0.75%"],["UKUPNO doprinosi","19.90%","15.15%","35.05%"]].map(([lbl,emp,er,tot],i) => (
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
              <ResultRow label="Minimalna bruto zarada" value={73274} />
              <ResultRow label="Najniža osnovica doprinosa" value={45950} />
              <ResultRow label="Najviša osnovica doprinosa" value={656425} />
              <ResultRow label="Neoporezivi iznos od 2026." value={34221} sub="povećanje >20%" />
            </div>
          </div>
          <div className="card">
            <SectionTitle icon="⏫">Uvećana zarada (Čl. 108 ZOR)</SectionTitle>
            <div className="results-body">
              {[["Prekovremeni rad","+26%","min. koeficijent 1.26"],["Noćni rad (22h–06h)","+26%","min. koeficijent 1.26"],["Rad vikendom","+26%","min. koeficijent 1.26"],["Rad na državni praznik","+26%","min. koeficijent 1.26"]].map(([lbl,p,sub],i) => (
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
    </>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("calculator");   // "calculator" | "blog" | post.id
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPost = POSTS.find(p => p.id === page);

  const navItems = [
    { id: "calculator", icon: "⚡", label: "Kalkulator" },
    { id: "blog",       icon: "📰", label: "Blog" },
  ];

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
      --amber: #f59e0b;
      --amber-light: #fff8e6;
      --text: #0f1623;
      --text2: #4b5563;
      --text3: #9ca3af;
      --sidebar-w: 220px;
      --mono: 'JetBrains Mono', monospace;
      --sans: 'Inter', sans-serif;
      --radius: 12px;
    }
    body { background: var(--bg); color: var(--text); font-family: var(--sans); min-height: 100vh; -webkit-font-smoothing: antialiased; }

    /* ── LAYOUT ── */
    .layout { display: flex; min-height: 100vh; }

    /* ── SIDEBAR ── */
    .sidebar { width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; transition: transform 0.25s; }
    .sidebar-logo { padding: 20px 18px 16px; border-bottom: 1px solid var(--border); }
    .sidebar-logo-name { font-size: 17px; font-weight: 800; letter-spacing: -0.5px; color: var(--text); }
    .sidebar-logo-name span { color: var(--accent); }
    .sidebar-logo-sub { font-family: var(--mono); font-size: 9px; color: var(--text3); letter-spacing: 1px; text-transform: uppercase; margin-top: 3px; }
    .sidebar-nav { padding: 12px 10px; flex: 1; }
    .sidebar-section-label { font-size: 9px; font-weight: 700; color: var(--text3); letter-spacing: 1.5px; text-transform: uppercase; padding: 8px 8px 4px; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px; cursor: pointer; transition: all 0.12s; font-size: 13px; font-weight: 500; color: var(--text2); border: none; background: none; width: 100%; text-align: left; }
    .nav-item:hover { background: var(--surface2); color: var(--text); }
    .nav-item.active { background: var(--accent-light); color: var(--accent); font-weight: 600; }
    .nav-icon { font-size: 15px; width: 20px; text-align: center; }
    .sidebar-footer { padding: 14px 16px; border-top: 1px solid var(--border); font-family: var(--mono); font-size: 9px; color: var(--text3); letter-spacing: 0.5px; }

    /* ── TOPBAR (mobile) ── */
    .topbar { display: none; align-items: center; gap: 12px; padding: 12px 16px; background: var(--surface); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 90; }
    .topbar-title { font-size: 15px; font-weight: 800; letter-spacing: -0.5px; }
    .topbar-title span { color: var(--accent); }
    .menu-btn { background: none; border: 1px solid var(--border); border-radius: 8px; padding: 7px 10px; cursor: pointer; font-size: 16px; color: var(--text2); margin-left: auto; }
    .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 99; }

    @media (max-width: 760px) {
      .sidebar { transform: translateX(-100%); }
      .sidebar.open { transform: translateX(0); }
      .sidebar-overlay.open { display: block; }
      .topbar { display: flex; }
      .main { margin-left: 0 !important; }
    }

    /* ── MAIN CONTENT ── */
    .main { margin-left: var(--sidebar-w); flex: 1; min-width: 0; }
    .main-inner { max-width: 1060px; padding: 28px 24px 60px; }

    /* ── PAGE HEADER ── */
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; gap: 16px; flex-wrap: wrap; }
    .page-eyebrow { display: inline-flex; align-items: center; background: var(--accent-light); color: var(--accent); font-family: var(--mono); font-size: 9px; font-weight: 600; letter-spacing: 1.5px; padding: 3px 9px; border-radius: 100px; margin-bottom: 8px; text-transform: uppercase; }
    .page-title { font-size: clamp(20px, 3vw, 28px); font-weight: 800; letter-spacing: -0.8px; color: var(--text); }
    .page-title span { color: var(--accent); }
    .page-sub { font-family: var(--mono); font-size: 10px; color: var(--text3); margin-top: 6px; letter-spacing: 0.5px; text-transform: uppercase; }

    /* ── PDF BUTTON ── */
    .btn-pdf { display: flex; align-items: center; gap: 7px; background: var(--accent); border: none; color: #fff; border-radius: 9px; padding: 10px 20px; font-family: var(--sans); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; box-shadow: 0 3px 12px rgba(0,87,255,0.22); }
    .btn-pdf:hover { background: #0047dd; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,87,255,0.32); }
    .btn-pdf svg { width: 15px; height: 15px; flex-shrink: 0; }
    .btn-pdf-full { width: calc(100% - 32px); justify-content: center; margin: 14px 16px 16px; }

    /* ── HERO CARDS ── */
    .hero-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 20px; }
    @media (max-width:600px) { .hero-cards { grid-template-columns: 1fr; } }
    .hero-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px; }
    .hero-card.neto { border-top: 3px solid var(--green); }
    .hero-card.bruto { border-top: 3px solid var(--accent); }
    .hero-card.cost { border-top: 3px solid var(--amber); }
    .hero-card-label { font-size: 10px; font-weight: 600; color: var(--text3); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
    .hero-card-value { font-family: var(--mono); font-size: clamp(16px,2vw,21px); font-weight: 500; }
    .hero-card.neto .hero-card-value { color: var(--green); }
    .hero-card.bruto .hero-card-value { color: var(--accent); }
    .hero-card.cost .hero-card-value { color: var(--amber); }
    .hero-card-sub { font-family: var(--mono); font-size: 9px; color: var(--text3); margin-top: 4px; }

    /* ── RATIO BAR ── */
    .ratio-bar-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; margin-bottom: 20px; }
    .ratio-bar-header { display: flex; justify-content: space-between; font-size: 10px; font-weight: 600; color: var(--text3); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
    .ratio-bar { height: 8px; border-radius: 100px; background: var(--surface3); overflow: hidden; display: flex; }
    .ratio-seg { height: 100%; transition: width 0.4s cubic-bezier(0.4,0,0.2,1); }
    .ratio-legend { display: flex; gap: 16px; margin-top: 10px; flex-wrap: wrap; }
    .ratio-legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text2); font-weight: 500; }
    .ratio-dot { width: 7px; height: 7px; border-radius: 50%; }

    /* ── TABS ── */
    .tabs { display: flex; gap: 3px; margin-bottom: 18px; background: var(--surface2); padding: 4px; border-radius: 10px; width: fit-content; border: 1px solid var(--border); flex-wrap: wrap; }
    .tab { padding: 7px 16px; border-radius: 7px; border: none; background: transparent; color: var(--text3); font-family: var(--sans); font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.12s; }
    .tab:hover { color: var(--text2); background: rgba(255,255,255,0.7); }
    .tab.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,0.1); }

    /* ── CARD / GRID ── */
    .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    @media (max-width:760px) { .main-grid { grid-template-columns: 1fr; } }
    .full-width { grid-column: 1 / -1; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }

    /* ── SECTION TITLE ── */
    .section-title { display: flex; align-items: center; gap: 8px; padding: 9px 14px; background: var(--surface2); border-bottom: 1px solid var(--border); font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text3); }
    .section-icon { font-size: 13px; }

    /* ── INPUTS ── */
    .inputs-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; }
    .input-field { display: flex; flex-direction: column; gap: 4px; }
    .input-field label { font-size: 11px; font-weight: 600; color: var(--text2); }
    .sublabel { font-family: var(--mono); font-size: 9px; color: var(--text3); margin-left: 5px; font-weight: 400; }
    .input-wrap { display: flex; align-items: center; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; transition: border-color 0.15s, box-shadow 0.15s; }
    .input-wrap:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,87,255,0.1); }
    .input-wrap input { flex: 1; background: transparent; border: none; outline: none; color: var(--text); font-family: var(--mono); font-size: 13px; font-weight: 500; padding: 9px 11px; width: 100%; }
    .input-wrap input[type="text"] { font-family: var(--sans); font-size: 12px; font-weight: 400; }
    .input-wrap input::placeholder { color: var(--text3); font-weight: 400; }
    .input-wrap input::-webkit-inner-spin-button, .input-wrap input::-webkit-outer-spin-button { opacity: 0.3; }
    .unit { font-family: var(--mono); font-size: 10px; font-weight: 500; color: var(--text3); padding: 0 10px; border-left: 1px solid var(--border); white-space: nowrap; background: var(--surface2); align-self: stretch; display: flex; align-items: center; }
    .select-wrap { display: flex; gap: 7px; }
    .select-wrap select { flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-family: var(--sans); font-size: 12px; padding: 9px 11px; outline: none; cursor: pointer; transition: border-color 0.15s; }
    .select-wrap select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,87,255,0.1); }

    /* ── RESULTS ── */
    .results-body { padding: 4px 0; }
    .result-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 14px; border-bottom: 1px solid var(--border); transition: background 0.1s; gap: 10px; }
    .result-row:hover { background: var(--surface2); }
    .result-row:last-child { border-bottom: none; }
    .result-label { font-size: 12px; color: var(--text2); display: flex; flex-direction: column; gap: 2px; font-weight: 400; }
    .result-sub { font-family: var(--mono); font-size: 9px; color: var(--text3); }
    .result-value { font-family: var(--mono); font-size: 12px; font-weight: 500; white-space: nowrap; color: var(--text); }
    .rsd { font-size: 9px; color: var(--text3); margin-left: 2px; }
    .result-row.positive .result-value { color: var(--green); }
    .result-row.negative .result-value { color: var(--red); }
    .result-row.total { background: var(--accent-light); border-top: 1px solid #c8d8ff; border-bottom: none; margin-top: 1px; }
    .result-row.total .result-value { color: var(--accent); font-size: 13px; font-weight: 600; }
    .result-row.total .result-label { color: var(--text); font-weight: 600; }
    .result-row.grand { background: var(--amber-light); border-top: 1px solid #fde68a; border-bottom: none; margin-top: 1px; }
    .result-row.grand .result-value { color: var(--amber); font-size: 14px; font-weight: 700; }
    .result-row.grand .result-label { color: var(--text); font-weight: 600; }

    /* ── GAUGES ── */
    .gauges-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 12px; }
    .gauge-header { display: flex; justify-content: space-between; font-size: 11px; font-weight: 500; color: var(--text2); margin-bottom: 5px; }
    .gauge-track { height: 5px; background: var(--surface3); border-radius: 100px; overflow: hidden; }
    .gauge-fill { height: 100%; border-radius: 100px; transition: width 0.4s cubic-bezier(0.4,0,0.2,1); }

    /* ── INFO GRID ── */
    .info-grid { padding: 12px 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
    .info-item { background: var(--surface2); border-radius: 8px; padding: 10px 12px; border: 1px solid var(--border); }
    .info-item-label { font-size: 9px; font-weight: 700; color: var(--text3); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
    .info-item-val { font-family: var(--mono); font-size: 14px; font-weight: 500; color: var(--text); }

    /* ── RATES ── */
    .rates-body { padding: 0; }
    .rate-row { display: grid; grid-template-columns: 1fr 80px 80px 80px; padding: 9px 14px; border-bottom: 1px solid var(--border); font-family: var(--mono); font-size: 11px; align-items: center; gap: 8px; }
    .rate-row:last-child { border-bottom: none; }
    .rate-row.header-row { background: var(--surface2); color: var(--text3); font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; font-family: var(--sans); }
    .rate-row:not(.header-row):hover { background: var(--surface2); }
    .rate-cell-right { text-align: right; }
    .rate-cell-green { color: var(--green); font-weight: 600; }
    .rate-cell-red { color: var(--red); font-weight: 600; }
    .rate-cell-yellow { color: var(--amber); font-weight: 600; }
    .pdf-note { font-size: 11px; color: var(--text3); padding: 9px 14px; border-top: 1px solid var(--border); }

    /* ── BLOG ── */
    .blog-page { max-width: 720px; }
    .blog-header { margin-bottom: 28px; }
    .blog-header .page-eyebrow { margin-bottom: 10px; }
    .blog-header h2 { font-size: 26px; font-weight: 800; letter-spacing: -0.8px; margin-bottom: 8px; }
    .blog-header p { font-size: 14px; color: var(--text2); line-height: 1.6; }
    .post-list { display: flex; flex-direction: column; gap: 14px; }
    .post-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 22px; cursor: pointer; transition: all 0.15s; }
    .post-card:hover { border-color: var(--accent); box-shadow: 0 4px 16px rgba(0,87,255,0.08); transform: translateY(-1px); }
    .post-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .post-tag { background: var(--accent-light); color: var(--accent); font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 100px; letter-spacing: 0.5px; }
    .post-date { font-family: var(--mono); font-size: 10px; color: var(--text3); }
    .post-title { font-size: 16px; font-weight: 700; letter-spacing: -0.3px; margin-bottom: 8px; color: var(--text); }
    .post-summary { font-size: 13px; color: var(--text2); line-height: 1.6; margin-bottom: 12px; }
    .post-read { font-size: 12px; font-weight: 600; color: var(--accent); }

    /* ── BLOG POST ── */
    .back-btn { background: none; border: 1px solid var(--border); border-radius: 8px; padding: 7px 14px; font-family: var(--sans); font-size: 12px; font-weight: 600; color: var(--text2); cursor: pointer; margin-bottom: 20px; transition: all 0.12s; }
    .back-btn:hover { border-color: var(--accent); color: var(--accent); }
    .post-full-title { font-size: clamp(20px, 3vw, 28px); font-weight: 800; letter-spacing: -0.8px; margin-bottom: 24px; line-height: 1.2; }
    .post-body { font-size: 14px; line-height: 1.75; color: var(--text2); }
    .post-body h2 { font-size: 18px; font-weight: 700; color: var(--text); margin: 28px 0 12px; letter-spacing: -0.3px; }
    .post-body h3 { font-size: 15px; font-weight: 700; color: var(--text); margin: 20px 0 8px; }
    .post-body p { margin-bottom: 14px; }
    .post-body strong { color: var(--text); font-weight: 600; }
    .post-body ul { padding-left: 20px; margin-bottom: 14px; }
    .post-body li { margin-bottom: 6px; }
    .post-body table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
    .post-body td { padding: 9px 14px; border-bottom: 1px solid var(--border); font-family: var(--mono); }
    .post-body tr:last-child td { border-bottom: none; }
    .post-body tr:nth-child(even) td { background: var(--surface2); }
    .post-cta { margin-top: 36px; padding: 20px 22px; background: var(--accent-light); border-radius: var(--radius); border: 1px solid #c8d8ff; }
    .post-cta p { font-size: 14px; color: var(--text2); margin-bottom: 14px; }
    .cta-btn { background: var(--accent); color: #fff; border: none; border-radius: 8px; padding: 9px 18px; font-family: var(--sans); font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
    .cta-btn:hover { background: #0047dd; }
  `;

  return (
    <>
      <style>{CSS}</style>
      <div className="layout">

        {/* SIDEBAR OVERLAY (mobile) */}
        <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

        {/* SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-logo">
            <div className="sidebar-logo-name">Platni<span>Listić</span></div>
            <div className="sidebar-logo-sub">Srbija</div>
          </div>
          <nav className="sidebar-nav">
            <div className="sidebar-section-label">Alati</div>
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${(page === item.id || (item.id === 'blog' && currentPost)) ? 'active' : ''}`}
                onClick={() => { setPage(item.id); setSidebarOpen(false); }}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">platnilistic.rs</div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* TOPBAR (mobile) */}
          <div className="topbar">
            <div className="topbar-title">Platni<span>Listić</span></div>
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          </div>

          <div className="main-inner">
            {/* CALCULATOR PAGE */}
            {page === "calculator" && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-eyebrow">Srbija</div>
                    <div className="page-title">Platni<span>Listić</span></div>
                    <div className="page-sub">obračun zarada · prekovremeni · praznici · bonusi · porez</div>
                  </div>
                  <button className="btn-pdf" onClick={() => document.querySelector('.tab[data-tab="payslip"]')?.click()}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                    </svg>
                    Platni Listić PDF
                  </button>
                </div>
                <CalculatorPage />
              </>
            )}

            {/* BLOG LIST */}
            {page === "blog" && !currentPost && (
              <BlogList onOpen={(id) => setPage(id)} />
            )}

            {/* BLOG POST */}
            {currentPost && (
              <BlogPost post={currentPost} onBack={() => setPage("blog")} />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
