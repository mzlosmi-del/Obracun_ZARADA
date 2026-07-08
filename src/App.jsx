import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { fmt, pct, NumberInput, TextInput, ResultRow, SectionTitle, AnimatedNum, GaugeBar } from "./ui.jsx";
import { useSeo } from "./seo.jsx";
import { webAppLd } from "./schema.js";
import { getNonTaxable, DEFAULT_RATES } from "./rates.js";
import { JobsWidget } from "./JobsWidget.jsx";
import { activeJobs } from "./jobs.js";

// Lazy-loaded routes — keep main bundle small
const BlogList = lazy(() => import("./Blog.jsx").then(m => ({ default: m.BlogList })));
const BlogPostRoute = lazy(() => import("./Blog.jsx").then(m => ({ default: m.BlogPostRoute })));
const PolitikaPrivatnosti = lazy(() => import("./Legal.jsx").then(m => ({ default: m.PolitikaPrivatnosti })));
const UsloviKoriscenja = lazy(() => import("./Legal.jsx").then(m => ({ default: m.UsloviKoriscenja })));
const ONama = lazy(() => import("./About.jsx").then(m => ({ default: m.ONama })));
const PPPPDTab = lazy(() => import("./PPPPDTab.jsx"));
const BrutoNetoPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.BrutoNetoPage })));
const NetoBrutoPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.NetoBrutoPage })));
const PausalPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.PausalPage })));
const BolovanjePage = lazy(() => import("./pages.jsx").then(m => ({ default: m.BolovanjePage })));
const OtpremninaPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.OtpremninaPage })));
const MinuliRadPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.MinuliRadPage })));
const MinimalnaZaradaPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.MinimalnaZaradaPage })));
const DodaciPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.DodaciPage })));
const GodisnjiPorezPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.GodisnjiPorezPage })));
const GodisnjiOdmorPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.GodisnjiOdmorPage })));
const UgovorODeluPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.UgovorODeluPage })));
const RadniDaniPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.RadniDaniPage })));
const PrazniciPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.PrazniciPage })));
const ProsecnaZaradaPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.ProsecnaZaradaPage })));
const NeoporeziviPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.NeoporeziviPage })));
const StopeDoprinosaPage = lazy(() => import("./pages.jsx").then(m => ({ default: m.StopeDoprinosaPage })));

const MONTHS = ["Januar","Februar","Mart","April","Maj","Jun","Jul","Avgust","Septembar","Oktobar","Novembar","Decembar"];

// ── CALCULATE ─────────────────────────────────────────────────────────────────
function calculate(inputs, rates) {
  const { basicBruto, standardHours, overtimeH, nightH, weekendH, holidayH, fixedBonus, bonusPct, yearsOfService, minuliRadPct, transport, mealDays, mealDailyActual, regres, sickDays, sickPct, publicHolidayDays, vacationHolidayDays, unpaidDays, syndikat, syndikatPct, kredit, adminZabrana, ostaliOdbici } = inputs;
  const R = rates;
  const totalWorkDays = (standardHours || 168) / 8;
  const overtimeCoef = 1 + R.overtimeCoef / 100;
  const nightCoef    = 1 + R.nightCoef / 100;
  const weekendCoef  = 1 + R.weekendCoef / 100;
  const holidayCoef  = 1 + R.holidayCoef / 100;

  const publicHolidayDaysActual = Math.min(publicHolidayDays || 0, totalWorkDays);
  const sickDaysActual = Math.min(sickDays || 0, totalWorkDays - publicHolidayDaysActual);
  const unpaidDaysActual = Math.min(unpaidDays || 0, totalWorkDays - publicHolidayDaysActual - sickDaysActual);

  const workedDays = totalWorkDays - sickDaysActual - publicHolidayDaysActual - unpaidDaysActual;
  const dailyBruto = basicBruto / totalWorkDays;

  const workedBruto = dailyBruto * workedDays;
  const publicHolidayBasePay = dailyBruto * publicHolidayDaysActual;
  const sickPay = sickDaysActual > 0 ? dailyBruto * sickDaysActual * ((sickPct || 65) / 100) : 0;
  const unpaidDeduction = dailyBruto * unpaidDaysActual;

  const vacationHolidayDaysActual = Math.max(vacationHolidayDays || 0, 0);
  const vacationHolidayPay = dailyBruto * vacationHolidayDaysActual;

  const minuliRadRate = (yearsOfService || 0) * ((minuliRadPct || 0.4) / 100);
  const minuliRadAmount = workedBruto * minuliRadRate;

  const hourRate = workedBruto / (workedDays * 8 || 1);
  const overtimePay = overtimeH * hourRate * overtimeCoef;
  const nightPay = nightH * hourRate * nightCoef;
  const weekendPay = weekendH * hourRate * weekendCoef;
  const holidayPay = holidayH * hourRate * holidayCoef;
  const bonusAmount = fixedBonus + basicBruto * (bonusPct / 100);

  const mealDailyRate = mealDailyActual || R.mealDaily;
  const mealAmount = mealDays * mealDailyRate;
  const regresAmount = regres || 0;

  const transportActual = Math.min(transport || 0, R.transportMax);

  const bruto1 = workedBruto + publicHolidayBasePay + vacationHolidayPay + minuliRadAmount + overtimePay + nightPay + weekendPay + holidayPay + bonusAmount + mealAmount + regresAmount;
  const contribBase = Math.max(Math.min(bruto1, R.maxBase), R.minBase);
  const pio_emp = contribBase * R.pioPct_emp / 100;
  const health_emp = contribBase * R.health_emp / 100;
  const unemp = contribBase * R.unemp_emp / 100;
  const totalEmpContrib = pio_emp + health_emp + unemp;
  const taxBase = Math.max(bruto1 - R.nonTaxable, 0);
  const tax = taxBase * R.taxRate / 100;
  const netoFromWork = bruto1 - totalEmpContrib - tax;

  const syndikatAmount = (syndikat || 0) + netoFromWork * ((syndikatPct || 0) / 100);
  const totalOdbici = syndikatAmount + (kredit || 0) + (adminZabrana || 0) + (ostaliOdbici || 0);

  const netoBeforeOdbici = netoFromWork + sickPay;
  const neto = Math.max(netoBeforeOdbici - totalOdbici, 0);

  const pio_er = contribBase * R.pio_er / 100;
  const health_er = contribBase * R.health_er / 100;
  const totalErContrib = pio_er + health_er;
  const bruto2 = bruto1 + totalErContrib;
  const totalCost = bruto2 + transportActual + sickPay;
  return {
    hourRate, dailyBruto, workedDays, sickDaysActual, sickPay, workedBruto,
    publicHolidayDaysActual, publicHolidayBasePay,
    vacationHolidayDaysActual, vacationHolidayPay,
    unpaidDaysActual, unpaidDeduction,
    minuliRadAmount, minuliRadRate,
    overtimePay, nightPay, weekendPay, holidayPay, bonusAmount,
    mealAmount, regresAmount,
    transportActual,
    bruto1, contribBase, pio_emp, health_emp, unemp, totalEmpContrib,
    taxBase, tax, netoFromWork,
    syndikatAmount, totalOdbici, netoBeforeOdbici, neto,
    pio_er, health_er, totalErContrib, bruto2,
    totalCost,
    netoBruto1Ratio: bruto1 > 0 ? neto / bruto1 : 0,
    costPerNeto: neto > 0 ? totalCost / neto : 0,
  };
}

function netoToBruto(targetNeto, rates) {
  let lo = targetNeto, hi = targetNeto * 2.5;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const testInputs = {
      basicBruto: mid, standardHours: 168, overtimeH: 0, nightH: 0,
      weekendH: 0, holidayH: 0, fixedBonus: 0, bonusPct: 0,
      yearsOfService: 0, minuliRadPct: 0.4,
      transport: 0, mealDays: 0, sickDays: 0, sickPct: 65, publicHolidayDays: 0, vacationHolidayDays: 0,
      unpaidDays: 0, syndikat: 0, syndikatPct: 0, kredit: 0, adminZabrana: 0, ostaliOdbici: 0,
    };
    const r = calculate(testInputs, rates);
    if (Math.abs(r.neto - targetNeto) < 0.01) return mid;
    if (r.neto < targetNeto) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

// ── PAYSLIP PDF ───────────────────────────────────────────────────────────────
function generatePayslipHTML(inputs, r, info, rates) {
  const R = rates;
  const now = new Date();
  const monthName = MONTHS[(info.month || 1) - 1];
  const trow = (label, value, color, sub) => `<tr><td class="rl">${label}${sub ? `<span class="rs">${sub}</span>` : ''}</td><td class="rv" style="color:${color}">${fmt(value)} RSD</td></tr>`;
  return `<!DOCTYPE html><html lang="sr"><head><meta charset="UTF-8"/>
<title>Platni Listić – ${info.employeeName || 'Zaposleni'} – ${monthName} ${info.year}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;background:#fff;color:#1a1a2e;font-size:13px;-webkit-font-smoothing:antialiased}
.page{max-width:780px;margin:0 auto;padding:32px 36px}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:18px;border-bottom:3px solid #1452d6}
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
.tb.neto{background:#e6f6ec;border:1.5px solid #0a7a45}
.tb.bruto{background:#eef3ff;border:1.5px solid #1452d6}
.tb.cost{background:#fff8e6;border:1.5px solid #f59e0b}
.tbl{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;margin-bottom:6px}
.tbv{font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:600}
.tb.neto .tbv{color:#0a7a45}.tb.bruto .tbv{color:#1452d6}.tb.cost .tbv{color:#f59e0b}
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
    <div class="rseg" style="width:${r.neto/r.bruto1*100}%;background:#0a7a45"></div>
    <div class="rseg" style="width:${r.totalEmpContrib/r.bruto1*100}%;background:#f59e0b"></div>
    <div class="rseg" style="width:${r.tax/r.bruto1*100}%;background:#f02d3a"></div>
  </div>
  <div class="rleg">
    <div class="ri"><div class="rd" style="background:#0a7a45"></div>Neto ${pct(r.neto/r.bruto1)}</div>
    <div class="ri"><div class="rd" style="background:#f59e0b"></div>Doprinosi zaposl. ${pct(r.totalEmpContrib/r.bruto1)}</div>
    <div class="ri"><div class="rd" style="background:#f02d3a"></div>Porez ${pct(r.tax/r.bruto1)}</div>
  </div>
</div>
<div class="sec"><div class="sh">A. Formiranje Bruto 1</div><table>
${trow('Osnovna bruto zarada', inputs.basicBruto, '#0a7a45')}
${r.sickDaysActual > 0 ? trow('Odbitak za bolovanje', -(inputs.basicBruto - r.workedBruto - r.publicHolidayBasePay), '#f02d3a', `${r.sickDaysActual} dana × ${fmt(r.dailyBruto)} RSD`) : ''}
${r.sickDaysActual > 0 ? trow('Zarada za odrađene dane', r.workedBruto, '#4b5563', `${r.workedDays} radnih dana`) : ''}
${r.publicHolidayDaysActual > 0 ? trow(`Državni praznici (${r.publicHolidayDaysActual} dana)`, r.publicHolidayBasePay, '#4b5563', 'Plaćeni neradni dani — puna naknada') : ''}
${r.vacationHolidayDaysActual > 0 ? trow(`Praznici tokom godišnjeg odmora (${r.vacationHolidayDaysActual} dana)`, r.vacationHolidayPay, '#0a7a45', 'Puna naknada — odmor se produžava') : ''}
${r.unpaidDaysActual > 0 ? trow(`Neplaćeno odsustvo (${r.unpaidDaysActual} dana)`, -r.unpaidDeduction, '#f02d3a', 'Umanjenje bruta') : ''}
${r.minuliRadAmount > 0 ? trow(`Minuli rad (${inputs.yearsOfService} god. × ${inputs.minuliRadPct}% = ${(r.minuliRadRate*100).toFixed(2)}%)`, r.minuliRadAmount, '#0a7a45') : ''}
${inputs.overtimeH > 0 ? trow('Prekovremeni rad (+26%)', r.overtimePay, '#0a7a45', `${inputs.overtimeH}h × ${fmt(r.hourRate)} × 1.26`) : ''}
${inputs.nightH > 0 ? trow('Noćni rad (+26%)', r.nightPay, '#0a7a45', `${inputs.nightH}h × ${fmt(r.hourRate)} × 1.26`) : ''}
${inputs.weekendH > 0 ? trow('Vikend rad (+26%)', r.weekendPay, '#0a7a45', `${inputs.weekendH}h × ${fmt(r.hourRate)} × 1.26`) : ''}
${inputs.holidayH > 0 ? trow('Rad na državni praznik (+26%)', r.holidayPay, '#0a7a45', `${inputs.holidayH}h × ${fmt(r.hourRate)} × 1.26`) : ''}
${r.bonusAmount > 0 ? trow('Bonusi / nagrade', r.bonusAmount, '#0a7a45') : ''}
${trow('BRUTO 1 – Ukupna bruto zarada', r.bruto1, '#1452d6')}
</table></div>
<div class="sec"><div class="sh">B. Doprinosi na teret zaposlenog</div><table>
${trow('Osnovica za doprinose', r.contribBase, '#4b5563', 'u granicama 51.297 – 732.820 RSD')}
${trow('PIO – penzijsko i invalidsko (14%)', r.pio_emp, '#f02d3a')}
${trow('Zdravstveno osiguranje (5,15%)', r.health_emp, '#f02d3a')}
${trow('Osiguranje za slučaj nezaposlenosti (0,75%)', r.unemp, '#f02d3a')}
${trow('UKUPNO doprinosi zaposleni (19,90%)', r.totalEmpContrib, '#f02d3a')}
</table></div>
<div class="sec"><div class="sh">C. Porez na zaradu</div><table>
${trow('Neoporezivi iznos', R.nonTaxable, '#4b5563')}
${trow('Poreska osnovica (Bruto1 – neoporezivi)', r.taxBase, '#4b5563', `${fmt(r.bruto1)} – ${fmt(R.nonTaxable)}`)}
${trow('Porez na zaradu (10%)', r.tax, '#f02d3a')}
</table></div>
<div class="sec"><div class="sh">D. Neto zarada i odbici</div><table>
${r.sickDaysActual > 0 ? trow('Neto od rada', r.netoFromWork, '#4b5563') : ''}
${r.sickDaysActual > 0 ? trow(`Naknada za bolovanje (${inputs.sickPct}%)`, r.sickPay, '#0a7a45', `${r.sickDaysActual} dana × ${fmt(r.dailyBruto)} × ${inputs.sickPct}%`) : ''}
${r.totalOdbici > 0 ? trow('Neto pre odbitaka', r.netoBeforeOdbici, '#4b5563') : ''}
${r.syndikatAmount > 0 ? trow('Sindikalna članarina', -r.syndikatAmount, '#f02d3a') : ''}
${inputs.kredit > 0 ? trow('Kredit / pozajmica od poslodavca', -inputs.kredit, '#f02d3a') : ''}
${inputs.adminZabrana > 0 ? trow('Administrativna zabrana', -inputs.adminZabrana, '#f02d3a') : ''}
${inputs.ostaliOdbici > 0 ? trow('Ostali odbici', -inputs.ostaliOdbici, '#f02d3a') : ''}
${r.totalOdbici > 0 ? trow('UKUPNO odbici od zarade', -r.totalOdbici, '#f02d3a') : ''}
${trow('NETO ZARADA (iznos na račun zaposlenog)', r.neto, '#0a7a45')}
${trow('PIO – doprinos poslodavca (10%)', r.pio_er, '#f59e0b')}
${trow('Zdravstvo – doprinos poslodavca (5,15%)', r.health_er, '#f59e0b')}
${trow('UKUPNO doprinosi poslodavca (15,15%)', r.totalErContrib, '#f59e0b')}
${trow('BRUTO 2 (Bruto1 + doprinosi poslodavca)', r.bruto2, '#1452d6')}
${r.mealAmount > 0 ? trow(`Topli obrok (${inputs.mealDays} × ${fmt(inputs.mealDailyActual || 1490)} RSD)`, r.mealAmount, '#4b5563', 'oporezivo — uključeno u Bruto 1') : ''}
${r.regresAmount > 0 ? trow('Regres za godišnji odmor', r.regresAmount, '#4b5563', 'oporezivo — uključeno u Bruto 1') : ''}
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

function printPayslip(inputs, r, info, rates) {
  const html = generatePayslipHTML(inputs, r, info, rates);
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.onload = () => { win.focus(); win.print(); };
}

// ── JOBS TEASERS (affiliate funnel) ──────────────────────────────────────────
// Both signup forms (newsletter + lead) are commented out below — every CTA
// slot now funnels to the partner job listings (JobsWidget) to maximize
// affiliate conversion. Re-enable the forms by uncommenting their usages.

// GoatCounter + Vercel Analytics event for teaser clicks (production only).
function trackJobsTeaser(placement) {
  if (!/(^|\.)platnilistic\.rs$/.test(window.location.hostname)) return;
  try {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: `jobs-teaser/${placement}`, event: true });
    }
  } catch { /* no-op */ }
}

// Smooth-scrolls to the first JobsWidget on the page; if the current page has
// none, navigates home (which always renders one) and scrolls after mount.
function scrollToJobs(navigate) {
  const el = document.querySelector(".jobs-widget");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  navigate("/");
  let tries = 0;
  const tick = () => {
    const t = document.querySelector(".jobs-widget");
    if (t) t.scrollIntoView({ behavior: "smooth", block: "center" });
    else if (++tries < 10) setTimeout(tick, 200);
  };
  setTimeout(tick, 200);
}

// Compact sidebar card: question hook + live job count.
function SidebarJobsTeaser({ onGo }) {
  const navigate = useNavigate();
  const jobs = activeJobs();
  if (jobs.length === 0) return null;
  return (
    <div className="sidebar-jobs">
      <div className="sidebar-jobs-title">Tražite bolje plaćen posao?</div>
      <div className="sidebar-jobs-sub">
        {jobs.length} {jobs.length % 10 === 1 && jobs.length % 100 !== 11 ? "otvorena pozicija" : [2,3,4].includes(jobs.length % 10) && ![12,13,14].includes(jobs.length % 100) ? "otvorene pozicije" : "otvorenih pozicija"} kod partnerske agencije
      </div>
      <button
        type="button"
        className="sidebar-jobs-btn"
        onClick={() => { trackJobsTeaser("sidebar"); onGo?.(); scrollToJobs(navigate); }}
      >
        Pogledaj poslove →
      </button>
    </div>
  );
}

// Full-width banner replacing the old lead-form section on the homepage.
function JobsCTABanner() {
  const navigate = useNavigate();
  const jobs = activeJobs();
  if (jobs.length === 0) return null;
  return (
    <section className="jobs-cta" aria-label="Otvorene pozicije partnera">
      <div className="jobs-cta-text">
        <div className="jobs-cta-eyebrow">Poslovi · licencirana agencija</div>
        <h2 className="jobs-cta-title">Izračunali ste platu — pogledajte ko nudi više</h2>
        <p className="jobs-cta-body">
          Proverene ponude licencirane agencije za zapošljavanje. Prijava online, besplatno, bez registracije.
        </p>
      </div>
      <button
        type="button"
        className="jobs-cta-btn"
        onClick={() => { trackJobsTeaser("home-banner"); scrollToJobs(navigate); }}
      >
        Pogledaj otvorene pozicije →
      </button>
    </section>
  );
}

// ── BREVO SIGNUP ─────────────────────────────────────────────────────────────
// NOTE: currently unused — commented out in the sidebar in favor of the jobs
// teaser. Kept intact so it can be re-enabled by uncommenting <BrevoSignup />.
// eslint-disable-next-line no-unused-vars
function BrevoSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "newsletter",
          email: email.trim().toLowerCase(),
        }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else if (res.status === 400) {
        setErrorMsg("Proverite email adresu.");
        setStatus("error");
      } else {
        setErrorMsg("Greška. Pokušajte ponovo.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Greška. Proverite konekciju.");
      setStatus("error");
    }
  };

  return (
    <div className="brevo-box">
      <div className="brevo-title">📬 Ostanite u toku</div>
      <div className="brevo-sub">Promene zakona, novi parametri, saveti.</div>
      {status === "success" ? (
        <div className="brevo-success">✓ Prijavljeni ste!</div>
      ) : (
        <form className="brevo-form" onSubmit={submit}>
          <label htmlFor="brevo-email" className="visually-hidden">Email adresa</label>
          <input
            id="brevo-email"
            className="brevo-input"
            type="email"
            placeholder="vas@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={status === "loading"}
            autoComplete="email"
          />
          <button className="brevo-btn" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "..." : "Prijavi se"}
          </button>
          {status === "error" && <div className="brevo-error" role="alert">{errorMsg}</div>}
        </form>
      )}
    </div>
  );
}

// Direct-contact channels for the "custom software" lead funnel.
// To enable the Viber + WhatsApp quick-contact buttons, set CONTACT_PHONE
// in international format WITHOUT the leading "+" (e.g. "381641234567").
// Leave it as "" to hide them — only the email button shows.
const CONTACT_EMAIL = "kontakt@platnilistic.rs";
const CONTACT_PHONE = "";

function LeadQuickContacts() {
  const subject = encodeURIComponent("Upit za softver po meri — PlatniListić");
  return (
    <div className="lead-alt">
      <div className="lead-alt-label">ili odmah pišite direktno</div>
      <div className="lead-alt-row">
        <a className="lead-alt-btn" href={`mailto:${CONTACT_EMAIL}?subject=${subject}`}>✉️ Email</a>
        {CONTACT_PHONE && (
          <>
            <a className="lead-alt-btn" href={`https://wa.me/${CONTACT_PHONE}`} target="_blank" rel="noopener noreferrer">🟢 WhatsApp</a>
            <a className="lead-alt-btn" href={`viber://chat?number=%2B${CONTACT_PHONE}`}>🟣 Viber</a>
          </>
        )}
      </div>
    </div>
  );
}

function LeadFormContent({ onSubmit, form, setForm, status }) {
  if (status === "success") return (
    <div className="lead-success" role="status">
      <div className="lead-success-icon" aria-hidden="true">✓</div>
      <div className="lead-success-title">Upit primljen!</div>
      <div className="lead-success-sub">Javljam se u roku od 24 sata — bez obaveze.</div>
    </div>
  );
  return (
    <form className="lead-form" onSubmit={onSubmit}>
      <label htmlFor="lead-ime" className="visually-hidden">Ime i prezime</label>
      <input id="lead-ime" className="lead-input" type="text" placeholder="Ime i prezime" autoComplete="name" value={form.ime} onChange={e => setForm(f => ({...f, ime: e.target.value}))} disabled={status === "loading"} required />
      <label htmlFor="lead-email" className="visually-hidden">Email adresa</label>
      <input id="lead-email" className="lead-input" type="email" placeholder="Email adresa" autoComplete="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} disabled={status === "loading"} required />
      <label htmlFor="lead-opis" className="visually-hidden">Opis projekta (opciono)</label>
      <textarea id="lead-opis" className="lead-input lead-textarea" placeholder="Ukratko: čime se firma bavi i šta bi vam pomoglo? (opciono)" value={form.opis} onChange={e => setForm(f => ({...f, opis: e.target.value}))} disabled={status === "loading"} rows={3} />
      <button className="lead-btn" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Šaljem..." : "Zakažite besplatne konsultacije →"}
      </button>
      {status === "error" && <div className="brevo-error" role="alert">Greška. Pokušajte ponovo.</div>}
      <LeadQuickContacts />
    </form>
  );
}

// NOTE: currently unused — commented out on the homepage in favor of the jobs
// CTA banner. Kept intact so it can be re-enabled by uncommenting <LeadForm />.
// eslint-disable-next-line no-unused-vars
function LeadForm() {
  const [form, setForm] = useState({ ime: "", email: "", opis: "" });
  const [status, setStatus] = useState("idle");
  const [modalOpen, setModalOpen] = useState(false);
  const sectionRef = useRef(null);

  // Contextual CTAs inside the calculator tabs dispatch "open-lead-modal".
  // On mobile we open the modal; on desktop the inline form is visible, so
  // we smooth-scroll to it and focus the first field.
  useEffect(() => {
    const handler = () => {
      if (window.matchMedia("(max-width: 760px)").matches) {
        setModalOpen(true);
      } else {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => sectionRef.current?.querySelector("input")?.focus(), 500);
      }
    };
    window.addEventListener("open-lead-modal", handler);
    return () => window.removeEventListener("open-lead-modal", handler);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email.includes("@") || !form.ime) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "lead",
          email: form.email.trim().toLowerCase(),
          ime: form.ime,
          opis: form.opis,
        }),
      });
      if (res.ok || res.status === 400) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <section className="lead-section lead-desktop" aria-labelledby="lead-section-title" ref={sectionRef}>
        <div className="lead-inner">
          <div className="lead-text">
            <div className="lead-eyebrow">Za firme i knjigovođe · softver po meri</div>
            <h2 id="lead-section-title" className="lead-title">Vašoj firmi treba softver po meri?</h2>
            <p className="lead-body">
              Vodite firmu ili knjigovodstvenu agenciju? Pravim web aplikacije i interne alate — kalkulatore, sisteme za obračun i evidenciju, kompletna rešenja. Ovaj kalkulator je primer; vaš alat pravim prema vašem procesu i radi posao umesto vas.
            </p>
            <p className="lead-body" style={{marginTop:12, fontWeight:600}}>
              Besplatne konsultacije, bez obaveze — javljam se u roku od 24 sata.
            </p>
          </div>
          <LeadFormContent onSubmit={submit} form={form} setForm={setForm} status={status} />
        </div>
      </section>

      {status !== "success" && (
        <button className="lead-sticky" type="button" onClick={() => setModalOpen(true)} aria-label="Otvori formu za besplatne konsultacije">
          <span className="lead-sticky-text">Vašoj firmi treba softver po meri?</span>
          <span className="lead-sticky-cta" aria-hidden="true">Konsultacije →</span>
        </button>
      )}

      {modalOpen && (
        <div className="lead-modal-overlay" onClick={() => setModalOpen(false)} role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">
          <div className="lead-modal" onClick={e => e.stopPropagation()}>
            <button className="lead-modal-close" onClick={() => setModalOpen(false)} aria-label="Zatvori">✕</button>
            <div className="lead-eyebrow" style={{color:"rgba(255,255,255,0.7)"}}>Za firme i knjigovođe · softver po meri</div>
            <h2 id="lead-modal-title" className="lead-title" style={{marginBottom:16}}>Vašoj firmi treba softver po meri?</h2>
            <LeadFormContent onSubmit={submit} form={form} setForm={setForm} status={status} />
          </div>
        </div>
      )}
    </>
  );
}

// Contextual lead CTA shown inside the "professional" tabs (payslip, results,
// rates, PPP-PD) — these users are accountants / business owners, the slice
// that can actually commission custom software. Clicking opens the lead form.
const PRO_CTA_COPY = {
  payslip: "Pravite platne listiće ručno svakog meseca? Mogu da vam napravim alat koji ih generiše automatski — za vašu firmu ili knjigovodstvenu agenciju.",
  results: "Treba vam ovakav obračun u vašem sistemu ili na sajtu? Pravim kalkulatore i interne alate po meri vašeg procesa.",
  rates: "Pratite stope i parametre za više klijenata? Pravim interne alate za knjigovođe i firme — automatizovano i po vašoj meri.",
  ppppd: "Generišete PPP-PD za više firmi? Mogu da vam automatizujem obračun i izvoz XML-a kroz alat po meri.",
};
function ProCTA({ variant }) {
  return (
    <aside className="pro-cta" aria-label="Ponuda za firme i knjigovođe">
      <div className="pro-cta-text">
        <div className="pro-cta-eyebrow">Za firme i knjigovođe</div>
        <p>{PRO_CTA_COPY[variant] || PRO_CTA_COPY.results}</p>
      </div>
      {/* The lead form/modal is disabled, so the "open-lead-modal" event has no
          listener — link straight to email instead so the pro funnel stays alive
          without a form. Restore the button when <LeadForm /> is re-enabled. */}
      <a
        className="pro-cta-btn"
        href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Upit za softver po meri — PlatniListić")}`}
      >
        Besplatne konsultacije →
      </a>
    </aside>
  );
}

// ── CALCULATOR PAGE ───────────────────────────────────────────────────────────
// CalcSection wraps a SectionTitle + its body so the pair moves together when a
// page surfaces one section first via the `focusSection` prop. The focused
// section gets `order:-1` (floats to the top of its column) plus a highlight.
function CalcSection({ name, icon, title, focusSection, children }) {
  const focused = focusSection && name === focusSection;
  return (
    <div className={`calc-section${focused ? " is-focused" : ""}`} data-section={name}>
      <SectionTitle icon={icon}>{title}</SectionTitle>
      {children}
    </div>
  );
}

// CalculatorPage — shared embedded calculator. `focusSection` (optional) names a
// section to surface first and highlight on tool pages (e.g. "bolovanje" on the
// /bolovanje page); when unset, sections render in their natural order.
export function CalculatorPage({ focusSection } = {}) {
  const now = new Date();
  const [calcMode, setCalcMode] = useState("bruto");
  const [targetNeto, setTargetNeto] = useState(70000);
  const [inputs, setInputs] = useState({
    basicBruto: 100000, standardHours: 168, overtimeH: 0, nightH: 0,
    weekendH: 0, holidayH: 0, fixedBonus: 0, bonusPct: 0,
    yearsOfService: 0, minuliRadPct: 0.4,
    transport: 0, mealDays: 21, mealDailyActual: 1490, regres: 0,
    sickDays: 0, sickPct: 65, publicHolidayDays: 0, vacationHolidayDays: 0,
    unpaidDays: 0,
    syndikat: 0, syndikatPct: 0,
    kredit: 0, adminZabrana: 0, ostaliOdbici: 0,
  });
  const [info, setInfo] = useState({
    companyName: "", companyPib: "", companyAddress: "", companyMbr: "",
    companyOpstina: "000", companyEmail: "", companyTelefon: "",
    employeeName: "", employeeJmbg: "", employeePosition: "", employeeBank: "",
    employeeOpstina: "000", svp: "111001001",
    month: now.getMonth() + 1, year: now.getFullYear(),
  });
  const [rates, setRates] = useState({ ...DEFAULT_RATES });
  const [activeTab, setActiveTab] = useState("inputs");

  const effectiveInputs = calcMode === "neto"
    ? { ...inputs, basicBruto: netoToBruto(targetNeto, rates) }
    : inputs;

  const r = calculate(effectiveInputs, rates);
  const set = (key) => (val) => setInputs((p) => ({ ...p, [key]: val }));
  const setI = (key) => (val) => setInfo((p) => ({ ...p, [key]: val }));
  const setR = (key) => (val) => setRates((p) => ({ ...p, [key]: val }));
  const resetRates = () => setRates({ ...DEFAULT_RATES, nonTaxable: getNonTaxable() });

  return (
    <>
      <div className="mode-toggle-wrap">
        <div className="mode-toggle" role="tablist" aria-label="Način unosa zarade">
          <button className={`mode-btn ${calcMode === "bruto" ? "active" : ""}`} onClick={() => setCalcMode("bruto")} role="tab" aria-selected={calcMode === "bruto"}>
            Unesite Bruto
          </button>
          <button className={`mode-btn ${calcMode === "neto" ? "active" : ""}`} onClick={() => setCalcMode("neto")} role="tab" aria-selected={calcMode === "neto"}>
            Unesite Neto
          </button>
        </div>
        {calcMode === "neto" && (
          <div className="neto-input-wrap">
            <NumberInput
              label="Željena neto zarada"
              value={targetNeto}
              onChange={setTargetNeto}
              step={1000}
            />
            <div className="neto-derived">
              Odgovara bruto zaradi od: <strong style={{color:"var(--accent)", fontFamily:"var(--mono)"}}>{fmt(effectiveInputs.basicBruto)} RSD</strong>
            </div>
          </div>
        )}
      </div>

      <div className="hero-cards">
        <div className="hero-card neto">
          <div className="hero-card-label">Neto zarada</div>
          <div className="hero-card-value"><AnimatedNum value={r.neto} /></div>
          <div className="hero-card-sub">{r.totalOdbici > 0 ? `RSD · posle odbitaka (${fmt(r.totalOdbici)} RSD)` : "RSD · na račun zaposlenog"}</div>
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

      <div className="ratio-bar-wrap">
        <div className="ratio-bar-header">
          <span>Raspodela Bruto 1</span>
          <span style={{ color: "var(--green)", fontWeight: 600 }}>Neto {pct(r.netoBruto1Ratio)}</span>
        </div>
        <div className="ratio-bar" role="img" aria-label={`Raspodela bruto 1: neto ${pct(r.neto/r.bruto1)}, doprinosi ${pct(r.totalEmpContrib/r.bruto1)}, porez ${pct(r.tax/r.bruto1)}`}>
          <div className="ratio-seg" style={{ width: `${r.neto/r.bruto1*100}%`, background: "#0a7a45" }} />
          <div className="ratio-seg" style={{ width: `${r.totalEmpContrib/r.bruto1*100}%`, background: "#f59e0b" }} />
          <div className="ratio-seg" style={{ width: `${r.tax/r.bruto1*100}%`, background: "#f02d3a" }} />
        </div>
        <div className="ratio-legend">
          <div className="ratio-legend-item"><div className="ratio-dot" style={{ background: "#0a7a45" }} aria-hidden="true" />Neto ({pct(r.neto/r.bruto1)})</div>
          <div className="ratio-legend-item"><div className="ratio-dot" style={{ background: "#f59e0b" }} aria-hidden="true" />Doprinosi ({pct(r.totalEmpContrib/r.bruto1)})</div>
          <div className="ratio-legend-item"><div className="ratio-dot" style={{ background: "#f02d3a" }} aria-hidden="true" />Porez ({pct(r.tax/r.bruto1)})</div>
        </div>
      </div>

      <JobsWidget neto={r.neto} placement="kalkulator" />

      <div className="tabs" role="tablist" aria-label="Sekcije kalkulatora">
        {["inputs","payslip","results","rates","ppppd"].map((t) => (
          <button key={t} className={`tab ${activeTab===t?"active":""}`} onClick={() => setActiveTab(t)} role="tab" aria-selected={activeTab===t}>
            {{"inputs":"📝 Unos","payslip":"🧾 Platni Listić","results":"📊 Obračun","rates":"📋 Stope","ppppd":"🏛️ PPP-PD"}[t]}
          </button>
        ))}
      </div>

      {activeTab === "inputs" && (
        <div className="main-grid">
          <div className="card">
            <CalcSection name="osnovna" icon="💰" title="Osnovna zarada" focusSection={focusSection}>
            <div className="inputs-body">
              {calcMode === "bruto" ? (
                <NumberInput label="Osnovna bruto zarada" value={inputs.basicBruto} onChange={set("basicBruto")} step={1000} />
              ) : (
                <div className="result-row total" style={{borderRadius:8, border:"1px solid var(--border)", margin:0}}>
                  <span className="result-label">Izračunata bruto zarada<span className="result-sub">na osnovu unetog neta</span></span>
                  <span className="result-value" style={{color:"var(--accent)"}}>{fmt(effectiveInputs.basicBruto)} <span className="rsd">RSD</span></span>
                </div>
              )}
              <NumberInput label="Standardnih radnih sati" value={inputs.standardHours} onChange={set("standardHours")} unit="h" sublabel="(21 dan × 8h = 168)" />
            </div>
            </CalcSection>
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
              <NumberInput label="Državni praznici u mesecu (neradni dani)" sublabel="(plaćeni slobodni dani — puna naknada)" value={inputs.publicHolidayDays} onChange={set("publicHolidayDays")} unit="dana" min={0} />
              {inputs.publicHolidayDays > 0 && (
                <div className="sick-info">
                  <div className="sick-info-row">
                    <span>Naknada za {r.publicHolidayDaysActual} {r.publicHolidayDaysActual === 1 ? "praznik" : "praznika"}</span>
                    <span style={{fontFamily:"var(--mono)", color:"var(--green)", fontWeight:600}}>{fmt(r.publicHolidayBasePay)} RSD</span>
                  </div>
                  <div className="sick-info-row">
                    <span>Odrađenih dana</span>
                    <span style={{fontFamily:"var(--mono)", color:"var(--text)"}}>{r.workedDays}</span>
                  </div>
                  <div className="sick-info-row" style={{fontSize:11, color:"var(--text3)"}}>
                    <span>Puna zarada se isplaćuje — praznik ne smanjuje bruto</span>
                  </div>
                </div>
              )}
              <NumberInput label="Praznici tokom godišnjeg odmora" sublabel="(odmor se produžava — zaposleni prima punu naknadu)" value={inputs.vacationHolidayDays} onChange={set("vacationHolidayDays")} unit="dana" min={0} />
              {inputs.vacationHolidayDays > 0 && (
                <div className="sick-info">
                  <div className="sick-info-row">
                    <span>Naknada za {r.vacationHolidayDaysActual} {r.vacationHolidayDaysActual === 1 ? "dan" : "dana"}</span>
                    <span style={{fontFamily:"var(--mono)", color:"var(--green)", fontWeight:600}}>{fmt(r.vacationHolidayPay)} RSD</span>
                  </div>
                  <div className="sick-info-row" style={{fontSize:11, color:"var(--text3)"}}>
                    Praznik se ne računa kao dan godišnjeg odmora — odmor se produžava.
                  </div>
                </div>
              )}
            </div>
            <CalcSection name="bolovanje" icon="🏥" title="Bolovanje" focusSection={focusSection}>
            <div className="inputs-body">
              <NumberInput label="Dani bolovanja" sublabel="(do 30 dana — na teret poslodavca)" value={inputs.sickDays} onChange={set("sickDays")} unit="dana" min={0} />
              <NumberInput label="Naknada za bolovanje" sublabel="(zakonski min. 65%)" value={inputs.sickPct} onChange={set("sickPct")} unit="%" step={1} min={0} max={100} />
              {inputs.sickDays > 0 && (
                <div className="sick-info">
                  <div className="sick-info-row">
                    <span>Dnevna bruto osnova</span>
                    <span style={{fontFamily:"var(--mono)", color:"var(--text)"}}>{fmt(r.dailyBruto)} RSD</span>
                  </div>
                  <div className="sick-info-row">
                    <span>Naknada za {r.sickDaysActual} {r.sickDaysActual === 1 ? "dan" : "dana"}</span>
                    <span style={{fontFamily:"var(--mono)", color:"var(--accent)", fontWeight:600}}>{fmt(r.sickPay)} RSD</span>
                  </div>
                  <div className="sick-info-row">
                    <span>Odradnih dana</span>
                    <span style={{fontFamily:"var(--mono)", color:"var(--text)"}}>{r.workedDays}</span>
                  </div>
                </div>
              )}
            </div>
            </CalcSection>
            <SectionTitle icon="🚫">Neplaćeno odsustvo</SectionTitle>
            <div className="inputs-body">
              <NumberInput label="Dani neplaćenog odsustva" sublabel="(umanjuje bruto — utiče na porez i doprinose)" value={inputs.unpaidDays} onChange={set("unpaidDays")} unit="dana" min={0} />
              {inputs.unpaidDays > 0 && (
                <div className="sick-info" style={{background:"#fff0f0", borderColor:"#fca5a5"}}>
                  <div className="sick-info-row">
                    <span>Umanjenje bruta</span>
                    <span style={{fontFamily:"var(--mono)", color:"#dc2626", fontWeight:600}}>−{fmt(r.unpaidDeduction)} RSD</span>
                  </div>
                  <div className="sick-info-row">
                    <span>Nema naknade — zaposleni ne prima ništa za te dane</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="card">
            <CalcSection name="minuli-rad" icon="📅" title="Minuli rad" focusSection={focusSection}>
            <div className="inputs-body">
              <NumberInput label="Godine staža kod trenutnog poslodavca" sublabel="(min. 0,4% po godini — čl. 108 ZOR)" value={inputs.yearsOfService} onChange={set("yearsOfService")} unit="god." min={0} step={1} />
              <NumberInput label="Stopa po godini" sublabel="(zakonski min. 0,4%)" value={inputs.minuliRadPct} onChange={set("minuliRadPct")} unit="%" step={0.1} min={0.4} />
              {inputs.yearsOfService > 0 && (
                <div className="sick-info">
                  <div className="sick-info-row">
                    <span>Stopa uvećanja ({inputs.yearsOfService} god. × {inputs.minuliRadPct}%)</span>
                    <span style={{fontFamily:"var(--mono)", color:"var(--text)"}}>{(r.minuliRadRate * 100).toFixed(2)}%</span>
                  </div>
                  <div className="sick-info-row">
                    <span>Iznos minulog rada</span>
                    <span style={{fontFamily:"var(--mono)", color:"var(--green)", fontWeight:600}}>+{fmt(r.minuliRadAmount)} RSD</span>
                  </div>
                </div>
              )}
            </div>
            </CalcSection>
            <SectionTitle icon="🎁">Bonusi i nagrade</SectionTitle>
            <div className="inputs-body">
              <NumberInput label="Fiksni bonus (iznos)" value={inputs.fixedBonus} onChange={set("fixedBonus")} step={1000} />
              <NumberInput label="Procentualni bonus (% od osnovne)" value={inputs.bonusPct} onChange={set("bonusPct")} unit="%" step={0.5} />
              <div className="result-row positive" style={{ borderRadius: 8, border: "1px solid var(--border)", margin: 0 }}>
                <span className="result-label">Ukupno bonusi</span>
                <span className="result-value" style={{color:"var(--green)"}}>+{fmt(r.bonusAmount)} <span className="rsd">RSD</span></span>
              </div>
            </div>
            <SectionTitle icon="🍽️">Naknade i primanja</SectionTitle>
            <div className="inputs-body">
              <NumberInput label="Prevoz (mesečno)" sublabel="(neopor. do 5.630 RSD — čl. 18 ZPDG)" value={inputs.transport} onChange={set("transport")} step={100} />
              <NumberInput label="Radnih dana (topli obrok)" sublabel="(u novcu — u celosti oporezivo)" value={inputs.mealDays} onChange={set("mealDays")} unit="dana" min={0} />
              <NumberInput label="Dnevni iznos toplog obroka" value={inputs.mealDailyActual || 1490} onChange={set("mealDailyActual")} step={10} min={0} unit="RSD" />
              <NumberInput label="Regres za godišnji odmor" sublabel="(u celosti oporezivo)" value={inputs.regres} onChange={set("regres")} step={1000} />
              {(r.mealAmount > 0 || r.regresAmount > 0) && (
                <div className="sick-info" style={{background:"#fff8e6", borderColor:"#f59e0b"}}>
                  {r.mealAmount > 0 && <div className="sick-info-row">
                    <span>Topli obrok → Bruto 1</span>
                    <span style={{fontFamily:"var(--mono)", color:"#b45309", fontWeight:600}}>{fmt(r.mealAmount)} RSD</span>
                  </div>}
                  {r.regresAmount > 0 && <div className="sick-info-row">
                    <span>Regres → Bruto 1</span>
                    <span style={{fontFamily:"var(--mono)", color:"#b45309", fontWeight:600}}>{fmt(r.regresAmount)} RSD</span>
                  </div>}
                  <div className="sick-info-row" style={{fontSize:11, color:"var(--text3)"}}>
                    Podležu porezu i svim doprinosima kao zarada.
                  </div>
                </div>
              )}
              <div className="result-row positive" style={{ borderRadius: 8, border: "1px solid var(--border)", margin: 0 }}>
                <span className="result-label">Prevoz (neopor.)</span>
                <span className="result-value" style={{color:"var(--green)"}}>+{fmt(r.transportActual)} <span className="rsd">RSD</span></span>
              </div>
            </div>
            <SectionTitle icon="📈">Uvećanja zarade</SectionTitle>
            <div className="gauges-body">
              <GaugeBar label="Minuli rad" value={r.minuliRadAmount} max={r.bruto1} color="#0891b2" />
              <GaugeBar label="Prekovremeni rad" value={r.overtimePay} max={r.bruto1} color="#1452d6" />
              <GaugeBar label="Noćni rad" value={r.nightPay} max={r.bruto1} color="#7c3aed" />
              <GaugeBar label="Vikend rad" value={r.weekendPay} max={r.bruto1} color="#0a7a45" />
              <GaugeBar label="Rad na praznike" value={r.holidayPay} max={r.bruto1} color="#f59e0b" />
              <GaugeBar label="Bonusi" value={r.bonusAmount} max={r.bruto1} color="#f02d3a" />
            </div>
            <SectionTitle icon="✂️">Odbici od zarade</SectionTitle>
            <div className="inputs-body">
              <NumberInput label="Sindikalna članarina (iznos)" sublabel="(fiksni mesečni odbitak)" value={inputs.syndikat} onChange={set("syndikat")} step={100} />
              <NumberInput label="Sindikalna članarina (%)" sublabel="(% od neto zarade)" value={inputs.syndikatPct} onChange={set("syndikatPct")} unit="%" step={0.1} />
              <NumberInput label="Kredit / pozajmica od poslodavca" sublabel="(mesečna rata)" value={inputs.kredit} onChange={set("kredit")} step={100} />
              <NumberInput label="Administrativna zabrana" sublabel="(sudski nalog za obustavu)" value={inputs.adminZabrana} onChange={set("adminZabrana")} step={100} />
              <NumberInput label="Ostali odbici" sublabel="(solidarni fond, alimentacija...)" value={inputs.ostaliOdbici} onChange={set("ostaliOdbici")} step={100} />
              {r.totalOdbici > 0 && (
                <div className="sick-info" style={{background:"#fff0f0", borderColor:"#fca5a5"}}>
                  <div className="sick-info-row">
                    <span>Ukupno odbici od neta</span>
                    <span style={{fontFamily:"var(--mono)", color:"#dc2626", fontWeight:600}}>−{fmt(r.totalOdbici)} RSD</span>
                  </div>
                  <div className="sick-info-row">
                    <span>Neto pre odbitaka</span>
                    <span style={{fontFamily:"var(--mono)", color:"var(--text)"}}>{fmt(r.netoBeforeOdbici)} RSD</span>
                  </div>
                  <div className="sick-info-row">
                    <span style={{fontWeight:600}}>Neto na račun (posle odbitaka)</span>
                    <span style={{fontFamily:"var(--mono)", color:"var(--green)", fontWeight:700}}>{fmt(r.neto)} RSD</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "payslip" && (
        <>
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
                <label htmlFor="payslip-month">Mesec i godina</label>
                <div className="select-wrap">
                  <select id="payslip-month" value={info.month} onChange={(e) => setI("month")(parseInt(e.target.value))} aria-label="Mesec">
                    {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                  </select>
                  <select value={info.year} onChange={(e) => setI("year")(parseInt(e.target.value))} aria-label="Godina">
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
              <button className="btn-pdf btn-pdf-full" onClick={() => printPayslip(effectiveInputs, r, info, rates)} style={{margin: 0, width: "100%"}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                Generiši PDF Platni Listić
              </button>
            </div>
          </div>
        </div>
        <ProCTA variant="payslip" />
        </>
      )}

      {activeTab === "results" && (
        <>
        <div className="main-grid">
          <div className="card">
            <SectionTitle icon="🧮">Formiranje Bruto 1</SectionTitle>
            <div className="results-body">
              <ResultRow label="Osnovna bruto zarada" value={effectiveInputs.basicBruto} type="positive" />
              {r.sickDaysActual > 0 && <ResultRow label={`Odbitak za bolovanje (${r.sickDaysActual} dana)`} value={-(effectiveInputs.basicBruto - r.workedBruto - r.publicHolidayBasePay)} type="negative" sub={`${r.sickDaysActual} dana × ${fmt(r.dailyBruto)} RSD`} />}
              {r.publicHolidayDaysActual > 0 && <ResultRow label={`Državni praznici (${r.publicHolidayDaysActual} dana)`} value={r.publicHolidayBasePay} sub="Plaćeni neradni dani — puna naknada" />}
              {r.unpaidDaysActual > 0 && <ResultRow label={`Neplaćeno odsustvo (${r.unpaidDaysActual} dana)`} value={-r.unpaidDeduction} type="negative" sub="Umanjenje bruta — utiče na porez i doprinose" />}
              {r.vacationHolidayDaysActual > 0 && <ResultRow label={`Praznici tokom godišnjeg odmora (${r.vacationHolidayDaysActual} dana)`} value={r.vacationHolidayPay} type="positive" sub="Puna naknada — odmor se produžava" />}
              {(r.workedBruto !== effectiveInputs.basicBruto || r.publicHolidayDaysActual > 0) && <ResultRow label="Zarada za odrađene dane" value={r.workedBruto} sub={`${r.workedDays} radnih dana`} />}
              {r.overtimePay > 0 && <ResultRow label="Prekovremeni rad (+26%)" value={r.overtimePay} type="positive" sub={`${inputs.overtimeH}h × ${fmt(r.hourRate)} × 1.26`} />}
              {r.nightPay > 0 && <ResultRow label="Noćni rad (+26%)" value={r.nightPay} type="positive" sub={`${inputs.nightH}h × ${fmt(r.hourRate)} × 1.26`} />}
              {r.weekendPay > 0 && <ResultRow label="Vikend rad (+26%)" value={r.weekendPay} type="positive" sub={`${inputs.weekendH}h × ${fmt(r.hourRate)} × 1.26`} />}
              {r.holidayPay > 0 && <ResultRow label="Rad na praznike (+26%)" value={r.holidayPay} type="positive" sub={`${inputs.holidayH}h × ${fmt(r.hourRate)} × 1.26`} />}
              {r.minuliRadAmount > 0 && <ResultRow label={`Minuli rad (${inputs.yearsOfService} god. × ${inputs.minuliRadPct}%)`} value={r.minuliRadAmount} type="positive" sub={`${(r.minuliRadRate*100).toFixed(2)}% od zarade za odrađene dane`} />}
              {r.bonusAmount > 0 && <ResultRow label="Bonusi / nagrade" value={r.bonusAmount} type="positive" />}
              {r.mealAmount > 0 && <ResultRow label={`Topli obrok (${inputs.mealDays} dana × ${fmt(inputs.mealDailyActual || 1490)} RSD)`} value={r.mealAmount} type="positive" sub="u celosti oporezivo" />}
              {r.regresAmount > 0 && <ResultRow label="Regres za godišnji odmor" value={r.regresAmount} type="positive" sub="u celosti oporezivo" />}
              <ResultRow label="BRUTO 1 (ukupna bruto zarada)" value={r.bruto1} type="total" />
            </div>
            <SectionTitle icon="➖">Doprinosi na teret zaposlenog</SectionTitle>
            <div className="results-body">
              <ResultRow label="Osnovica za doprinose" value={r.contribBase} sub="u granicama 51.297 – 732.820 RSD" />
              <ResultRow label="PIO – penzijsko (14%)" value={-r.pio_emp} type="negative" />
              <ResultRow label="Zdravstvo (5.15%)" value={-r.health_emp} type="negative" />
              <ResultRow label="Nezaposlenost (0.75%)" value={-r.unemp} type="negative" />
              <ResultRow label="UKUPNO doprinosi zaposleni" value={-r.totalEmpContrib} type="negative" />
            </div>
            <SectionTitle icon="💸">Porez na zaradu</SectionTitle>
            <div className="results-body">
              <ResultRow label="Neoporezivi iznos" value={rates.nonTaxable} />
              <ResultRow label="Poreska osnovica" value={r.taxBase} sub={`Bruto1 − ${fmt(rates.nonTaxable)} RSD`} />
              <ResultRow label="Porez 10%" value={-r.tax} type="negative" />
            </div>
            <SectionTitle icon="✅">Neto zarada</SectionTitle>
            <div className="results-body">
              {r.sickDaysActual > 0 && <ResultRow label="Neto od rada" value={r.netoFromWork} />}
              {r.sickDaysActual > 0 && <ResultRow label={`Naknada za bolovanje (${inputs.sickPct}%)`} value={r.sickPay} type="positive" sub={`${r.sickDaysActual} dana × ${fmt(r.dailyBruto)} × ${inputs.sickPct}%`} />}
              {r.totalOdbici > 0 && <ResultRow label="Neto pre odbitaka" value={r.netoBeforeOdbici} />}
              {r.syndikatAmount > 0 && <ResultRow label="Sindikalna članarina" value={-r.syndikatAmount} type="negative" />}
              {inputs.kredit > 0 && <ResultRow label="Kredit / pozajmica" value={-inputs.kredit} type="negative" />}
              {inputs.adminZabrana > 0 && <ResultRow label="Administrativna zabrana" value={-inputs.adminZabrana} type="negative" />}
              {inputs.ostaliOdbici > 0 && <ResultRow label="Ostali odbici" value={-inputs.ostaliOdbici} type="negative" />}
              {r.totalOdbici > 0 && <ResultRow label="Ukupno odbici" value={-r.totalOdbici} type="negative" />}
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
              <ResultRow label="Naknada za prevoz" value={r.transportActual} type="positive" sub="neoporezivo do 5.630 RSD" />
              <ResultRow label="UKUPNO naknade (van zarade)" value={r.transportActual} type="total" />
            </div>
            <SectionTitle icon="💼">Ukupan trošak poslodavca</SectionTitle>
            <div className="results-body">
              <ResultRow label="UKUPAN TROŠAK POSLODAVCA" value={r.totalCost} type="grand" />
            </div>
            <SectionTitle icon="📊">Efektivne stope</SectionTitle>
            <div className="info-grid">
              <div className="info-item"><div className="info-item-label">Neto / Bruto1</div><div className="info-item-val" style={{color:"#0a7a45"}}>{pct(r.netoBruto1Ratio)}</div></div>
              <div className="info-item"><div className="info-item-label">Trošak / Neto</div><div className="info-item-val" style={{color:"#f59e0b"}}>{r.costPerNeto.toFixed(2)}x</div></div>
              <div className="info-item"><div className="info-item-label">Odbitci iz zarade</div><div className="info-item-val" style={{color:"#f02d3a"}}>{fmt(r.totalEmpContrib + r.tax)}</div></div>
              <div className="info-item"><div className="info-item-label">Ef. poreska stopa</div><div className="info-item-val" style={{color:"#f02d3a"}}>{pct((r.totalEmpContrib + r.tax) / r.bruto1)}</div></div>
            </div>
          </div>
        </div>
        <ProCTA variant="results" />
        </>
      )}

      {activeTab === "rates" && (
        <>
        <div className="main-grid">
          <div className="full-width" style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4, gap:10, flexWrap:"wrap"}}>
            <span style={{fontSize:12, color:"var(--text3)", fontFamily:"var(--mono)"}}>
              Neoporezivi iznos je automatski podešen prema trenutnom datumu ({now.toLocaleDateString('sr-RS')})
            </span>
            <button className="reset-btn" onClick={resetRates}>↺ Vrati na podrazumevane vrednosti</button>
          </div>

          <div className="card">
            <SectionTitle icon="💰">Porez na zaradu</SectionTitle>
            <div className="inputs-body">
              <NumberInput label="Stopa poreza na zaradu" value={rates.taxRate} onChange={setR("taxRate")} unit="%" step={0.1} min={0} />
              <NumberInput label="Neoporezivi iznos" value={rates.nonTaxable} onChange={setR("nonTaxable")} step={1} min={0} />
            </div>
            <SectionTitle icon="👤">Doprinosi — zaposleni</SectionTitle>
            <div className="inputs-body">
              <NumberInput label="PIO — penzijsko i invalidsko" value={rates.pioPct_emp} onChange={setR("pioPct_emp")} unit="%" step={0.01} min={0} />
              <NumberInput label="Zdravstveno osiguranje" value={rates.health_emp} onChange={setR("health_emp")} unit="%" step={0.01} min={0} />
              <NumberInput label="Osiguranje za nezaposlenost" value={rates.unemp_emp} onChange={setR("unemp_emp")} unit="%" step={0.01} min={0} />
              <div className="rate-summary-row">
                <span>Ukupno doprinosi zaposleni</span>
                <span style={{color:"var(--red)", fontFamily:"var(--mono)", fontWeight:600}}>{(rates.pioPct_emp + rates.health_emp + rates.unemp_emp).toFixed(2)}%</span>
              </div>
            </div>
            <SectionTitle icon="🏢">Doprinosi — poslodavac</SectionTitle>
            <div className="inputs-body">
              <NumberInput label="PIO — penzijsko i invalidsko" value={rates.pio_er} onChange={setR("pio_er")} unit="%" step={0.01} min={0} />
              <NumberInput label="Zdravstveno osiguranje" value={rates.health_er} onChange={setR("health_er")} unit="%" step={0.01} min={0} />
              <div className="rate-summary-row">
                <span>Ukupno doprinosi poslodavac</span>
                <span style={{color:"var(--amber)", fontFamily:"var(--mono)", fontWeight:600}}>{(rates.pio_er + rates.health_er).toFixed(2)}%</span>
              </div>
            </div>
          </div>

          <div className="card">
            <SectionTitle icon="⏫">Uvećana zarada (koeficijenti)</SectionTitle>
            <div className="inputs-body">
              <NumberInput label="Prekovremeni rad (min +26%)" value={rates.overtimeCoef} onChange={setR("overtimeCoef")} unit="%" step={1} min={0} sublabel="čl. 108 ZOR" />
              <NumberInput label="Noćni rad (22h–06h)" value={rates.nightCoef} onChange={setR("nightCoef")} unit="%" step={1} min={0} />
              <NumberInput label="Rad vikendom" value={rates.weekendCoef} onChange={setR("weekendCoef")} unit="%" step={1} min={0} />
              <NumberInput label="Rad na državni praznik" value={rates.holidayCoef} onChange={setR("holidayCoef")} unit="%" step={1} min={0} />
            </div>
            <SectionTitle icon="📏">Granice osnovice i minimumi</SectionTitle>
            <div className="inputs-body">
              <NumberInput label="Najniža mesečna osnovica" value={rates.minBase} onChange={setR("minBase")} step={100} min={0} />
              <NumberInput label="Najviša mesečna osnovica" value={rates.maxBase} onChange={setR("maxBase")} step={1000} min={0} />
              <NumberInput label="Minimalna bruto zarada" value={rates.minWage} onChange={setR("minWage")} step={100} min={0} />
            </div>
            <SectionTitle icon="🍽️">Neoporezivi dodaci</SectionTitle>
            <div className="inputs-body">
              <NumberInput label="Topli obrok — podrazumevani iznos" sublabel="(u novcu — u celosti oporezivo)" value={rates.mealDaily} onChange={setR("mealDaily")} step={10} min={0} />
              <NumberInput label="Prevoz (mesečno max neopor.)" sublabel="(čl. 18 ZPDG)" value={rates.transportMax} onChange={setR("transportMax")} step={10} min={0} />
            </div>
          </div>
        </div>
        <ProCTA variant="rates" />
        </>
      )}

      {activeTab === "ppppd" && (
        <Suspense fallback={<div className="route-loader">Učitavam PPP-PD modul…</div>}>
          <PPPPDTab inputs={effectiveInputs} r={r} info={info} setI={setI} />
          <ProCTA variant="ppppd" />
        </Suspense>
      )}
    </>
  );
}

const RouteLoader = () => <div className="route-loader" role="status">Učitavam…</div>;

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
// FAQPage JSON-LD source — answers must match the visible .home-faq text below.
const HOME_FAQ = [
  {
    q: "Kako izračunati neto zaradu iz bruto u Srbiji?",
    a: "Neto zarada = Bruto 1 − doprinosi zaposlenog (19,90%) − porez na zaradu (10% na iznos iznad neoporezivog). Za 2026. godinu neoporezivi iznos je 34.221 RSD. Primer: bruto 100.000 RSD daje neto oko 73.522 RSD. Naš kalkulator radi obračun u oba smera.",
  },
  {
    q: "Ako je bruto plata 50.000 dinara, koliki je neto?",
    a: "Za bruto 1 od 50.000 RSD neto je oko 38.472 RSD: doprinosi zaposlenog iznose 9.950 RSD (19,90%), a porez 1.578 RSD (10% na deo iznad neoporezivih 34.221 RSD).",
  },
  {
    q: "Kolika je minimalna zarada u Srbiji u 2026. godini?",
    a: "Minimalna cena rada je 371 RSD neto po radnom času (od 1. januara 2026). Mesečni neto iznos varira sa fondom sati — od 59.360 do 68.264 RSD, prosečno oko 64.554 RSD. Više u vodiču o minimalnoj zaradi 2026.",
  },
  {
    q: "Koliki su doprinosi za socijalno osiguranje?",
    a: "Zaposleni plaća 19,90% (PIO 14%, zdravstvo 5,15%, nezaposlenost 0,75%), a poslodavac 15,15% (PIO 10%, zdravstvo 5,15%) — ukupno 35,05%. Detaljnije u članku o doprinosima u Srbiji.",
  },
  {
    q: "Koja je razlika između bruto 1, bruto 2 i neto zarade?",
    a: "Bruto 1 je ugovorena zarada, neto je iznos na račun, a bruto 2 je ukupan trošak poslodavca (Bruto 1 + doprinosi poslodavca). Pogledajte vodič o razlici između bruto i neto zarade.",
  },
  {
    q: "Kako se računa neto u bruto zaradu?",
    a: "Obračun neto u bruto je obrnuti postupak: iz željenog neto iznosa kalkulator rekonstruiše Bruto 1 tako da posle doprinosa (19,90%) i poreza dobijete tačno taj neto. PlatniListić radi obračun u oba smera — bruto u neto i neto u bruto.",
  },
  {
    q: "Kako se obračunava minuli rad?",
    a: "Minuli rad iznosi najmanje 0,4% osnovice za svaku navršenu godinu staža kod poslodavca. Pri bruto zaradi od 100.000 RSD i 10 godina staža minuli rad je oko 4.000 RSD. Detaljnije u vodiču o obračunu minulog rada.",
  },
  {
    q: "Koliko se plaća porez na bonus?",
    a: "Bonus, stimulacija i 13. plata oporezuju se kao deo zarade — porez 10% i doprinosi 19,90%. Bonus se dodaje na bruto osnovicu meseca isplate. Više u članku o porezu na bonus.",
  },
];

function HomePage() {
  useSeo({
    title: "Kalkulator zarade 2026 — bruto u neto Srbija | PlatniListić",
    description: "Besplatan kalkulator zarade za Srbiju 2026 — bruto u neto, porez, doprinosi, minuli rad, bolovanje. PDF platni listić i PPP-PD XML. Izračunajte za 10 sekundi.",
    path: "/",
    jsonLd: webAppLd({
      name: "PlatniListić — Kalkulator zarade Srbija 2026",
      description: "Besplatan online kalkulator za obračun zarade u Srbiji: bruto u neto, porez, doprinosi, prekovremeni i minuli rad, bolovanje, otpremnina i PDF platni listić.",
      path: "/",
    }),
    faq: HOME_FAQ,
  });
  return (
    <>
      <header className="page-header">
        <div style={{display:"flex", alignItems:"center", gap:14}}>
          <img src="/logo.svg" alt="PlatniListić" width="64" height="64" fetchpriority="high" decoding="async" />
          <div>
            <div className="page-title" role="text" aria-label="PlatniListić">Platni<span>Listić</span></div>
            <div className="page-sub">obračun zarada · prekovremeni · praznici · bonusi · porez</div>
          </div>
        </div>
      </header>
      <section className="home-intro">
        <h1 className="home-intro-title">Kalkulator zarade 2026 — bruto u neto za Srbiju</h1>
        <p>
          Besplatan <strong>kalkulator zarade</strong> za obračun zarade u Srbiji u 2026. godini.
          Pretvorite <strong>bruto u neto</strong> (i neto u bruto) i izračunajte porez na zaradu,
          doprinose, prekovremeni i minuli rad, bolovanje, otpremninu i regres. Rezultat preuzimate
          kao PDF platni listić i PPP-PD XML datoteku.
        </p>
        <p>
          Obračun zarade u Srbiji polazi od <strong>bruto 1</strong> iznosa iz ugovora o radu. Od njega
          se oduzimaju doprinosi zaposlenog (19,90%) i porez na zaradu (10% na deo iznad neoporezivog
          iznosa od 34.221 RSD za 2026), čime se dobija <strong>neto zarada</strong> — iznos koji
          zaposleni prima na račun. Ispod su okvirni primeri obračuna; za tačan iznos sa svim
          uvećanjima i odbicima koristite kalkulator.
        </p>
        <h2 className="home-examples-title">Tabela: bruto u neto za 2026</h2>
        <table className="home-examples" aria-label="Tabela bruto u neto za 2026 — primeri obračuna">
          <thead>
            <tr><th>Bruto 1 (RSD)</th><th>Neto ≈ (RSD)</th><th>Ukupan trošak ≈ (RSD)</th></tr>
          </thead>
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
        <p className="home-examples-note">
          Vrednosti su približne (zaokružene) i ne uključuju dodatna uvećanja ili naknade —
          za precizan obračun unesite svoje podatke u kalkulator iznad.
        </p>
      </section>
      <CalculatorPage />
      <div className="disclaimer">
        ⚠️ PlatniListić pruža informativne obračune. Rezultati ne predstavljaju pravni ni poreski savet. Za zvanični obračun konsultujte računovođu ili nadležni organ.
      </div>
      <section className="home-faq" aria-label="Česta pitanja o obračunu zarade">
        <h2 className="home-faq-title">Česta pitanja — obračun zarade i bruto u neto</h2>
        <div className="home-faq-item">
          <h3>Kako izračunati neto zaradu iz bruto u Srbiji?</h3>
          <p>
            Neto zarada = Bruto 1 − doprinosi zaposlenog (19,90%) − porez na zaradu (10% na iznos
            iznad neoporezivog). Za 2026. godinu neoporezivi iznos je 34.221 RSD. Primer: bruto
            100.000 RSD daje neto oko 73.522 RSD. Naš kalkulator radi obračun u oba smera.
          </p>
        </div>
        <div className="home-faq-item">
          <h3>Ako je bruto plata 50.000 dinara, koliki je neto?</h3>
          <p>
            Za bruto 1 od 50.000 RSD neto je oko 38.472 RSD: doprinosi zaposlenog iznose 9.950 RSD
            (19,90%), a porez 1.578 RSD (10% na deo iznad neoporezivih 34.221 RSD).
          </p>
        </div>
        <div className="home-faq-item">
          <h3>Kolika je minimalna zarada u Srbiji u 2026. godini?</h3>
          <p>
            Minimalna cena rada je 371 RSD neto po radnom času (od 1. januara 2026). Mesečni neto
            iznos varira sa fondom sati — od 59.360 do 68.264 RSD, prosečno oko 64.554 RSD. Više u
            vodiču o <a href="/minimalna-zarada-2026">minimalnoj zaradi 2026</a>.
          </p>
        </div>
        <div className="home-faq-item">
          <h3>Koliki su doprinosi za socijalno osiguranje?</h3>
          <p>
            Zaposleni plaća 19,90% (PIO 14%, zdravstvo 5,15%, nezaposlenost 0,75%), a poslodavac
            15,15% (PIO 10%, zdravstvo 5,15%) — ukupno 35,05%. Detaljnije u članku o
            <a href="/blog/doprinosi-srbija"> doprinosima u Srbiji</a>.
          </p>
        </div>
        <div className="home-faq-item">
          <h3>Koja je razlika između bruto 1, bruto 2 i neto zarade?</h3>
          <p>
            Bruto 1 je ugovorena zarada, neto je iznos na račun, a bruto 2 je ukupan trošak poslodavca
            (Bruto 1 + doprinosi poslodavca). Pogledajte vodič o
            <a href="/blog/bruto-neto-razlika"> razlici između bruto i neto zarade</a>.
          </p>
        </div>
        <div className="home-faq-item">
          <h3>Kako se računa neto u bruto zaradu?</h3>
          <p>
            Obračun <strong>neto u bruto</strong> je obrnuti postupak: iz željenog neto iznosa
            kalkulator rekonstruiše Bruto 1 tako da posle doprinosa (19,90%) i poreza dobijete tačno
            taj neto. PlatniListić radi obračun u oba smera — bruto u neto i neto u bruto.
          </p>
        </div>
        <div className="home-faq-item">
          <h3>Kako se obračunava minuli rad?</h3>
          <p>
            Minuli rad iznosi najmanje 0,4% osnovice za svaku navršenu godinu staža kod poslodavca.
            Pri bruto zaradi od 100.000 RSD i 10 godina staža minuli rad je oko 4.000 RSD. Detaljnije u
            vodiču o <a href="/blog/minuli-rad-obracun">obračunu minulog rada</a>.
          </p>
        </div>
        <div className="home-faq-item">
          <h3>Koliko se plaća porez na bonus?</h3>
          <p>
            Bonus, stimulacija i 13. plata oporezuju se kao deo zarade — porez 10% i doprinosi 19,90%.
            Bonus se dodaje na bruto osnovicu meseca isplate. Više u članku o
            <a href="/blog/porez-na-bonus"> porezu na bonus</a>.
          </p>
        </div>
      </section>
      <nav className="home-guides" aria-label="Popularni vodiči o zaradi">
        <h2 className="home-guides-title">Popularni vodiči</h2>
        <ul>
          <li><a href="/blog/prekovremeni-rad">Prekovremeni rad — uvećanje 26% (član 108. Zakona o radu)</a></li>
          <li><a href="/blog/otpremnina-obracun">Otpremnina — obračun i poreski tretman</a></li>
          <li><a href="/blog/minuli-rad-obracun">Minuli rad — kako se računa 0,4% po godini staža</a></li>
          <li><a href="/blog/godisnji-odmor-naknada">Naknada za godišnji odmor</a></li>
          <li><a href="/blog/jubilarna-nagrada">Jubilarna nagrada — iznosi i obračun</a></li>
          <li><a href="/minimalna-zarada-2026">Minimalna zarada 2026</a></li>
          <li><a href="/blog/pausalno-oporezivanje">Paušalno oporezivanje 2026</a></li>
          <li><a href="/blog/porez-za-frilensere">Porez za frilensere 2026</a></li>
          <li><a href="/blog/ugovor-o-delu">Ugovor o delu — porez i doprinosi</a></li>
          <li><a href="/blog/kako-se-obracunava-bolovanje">Kako se obračunava bolovanje</a></li>
          <li><a href="/blog/kako-se-obracunava-penzija">Kako se obračunava penzija</a></li>
          <li><a href="/neoporezivi-iznos-2026">Neoporezivi iznos zarade 2026</a></li>
          <li><a href="/blog/minimalna-zarada-2025">Minimalna zarada 2025 — poređenje sa 2026</a></li>
        </ul>
      </nav>
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
      {/* Lead form ("softver po meri") disabled in favor of the jobs CTA
          (affiliate funnel). Re-enable by uncommenting: <LeadForm /> */}
      <JobsCTABanner />
    </>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div className="layout">
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} aria-hidden={!sidebarOpen} />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Glavna navigacija">
        <div className="sidebar-logo">
          <img src="/logo.svg" alt="PlatniListić" width="44" height="44" decoding="async" />
          <div className="sidebar-logo-text">
            <div className="sidebar-logo-name">Platni<span>Listić</span></div>
            <div className="sidebar-logo-sub">Srbija</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Alati</div>
          {navItems.map(item => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path || (item.path === '/blog' && location.pathname.startsWith('/blog')) ? 'active' : ''}`}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              aria-current={location.pathname === item.path ? "page" : undefined}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        {/* Newsletter form disabled in favor of the jobs teaser (affiliate
            funnel). Re-enable by uncommenting: <BrevoSignup /> */}
        <SidebarJobsTeaser onGo={() => setSidebarOpen(false)} />
        <div className="sidebar-footer">
          <div className="sidebar-footer-site">platnilistic.rs</div>
          <div className="sidebar-footer-links">
            <button className="sidebar-footer-link" onClick={() => { navigate("/o-nama"); setSidebarOpen(false); }}>O nama</button>
            <button className="sidebar-footer-link" onClick={() => { navigate("/privatnost"); setSidebarOpen(false); }}>Privatnost</button>
            <button className="sidebar-footer-link" onClick={() => { navigate("/uslovi"); setSidebarOpen(false); }}>Uslovi</button>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <img src="/logo.svg" alt="PlatniListić" width="32" height="32" decoding="async" />
          <div className="topbar-title">Platni<span>Listić</span></div>
          <button className="menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Otvori meni" aria-expanded={sidebarOpen}>☰</button>
        </div>

        <div className="main-inner">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/bruto-neto" element={<Suspense fallback={<RouteLoader />}><BrutoNetoPage /></Suspense>} />
            <Route path="/neto-bruto" element={<Suspense fallback={<RouteLoader />}><NetoBrutoPage /></Suspense>} />
            <Route path="/pausal" element={<Suspense fallback={<RouteLoader />}><PausalPage /></Suspense>} />
            <Route path="/bolovanje" element={<Suspense fallback={<RouteLoader />}><BolovanjePage /></Suspense>} />
            <Route path="/otpremnina" element={<Suspense fallback={<RouteLoader />}><OtpremninaPage /></Suspense>} />
            <Route path="/minuli-rad" element={<Suspense fallback={<RouteLoader />}><MinuliRadPage /></Suspense>} />
            <Route path="/dodaci-na-zaradu" element={<Suspense fallback={<RouteLoader />}><DodaciPage /></Suspense>} />
            <Route path="/godisnji-porez" element={<Suspense fallback={<RouteLoader />}><GodisnjiPorezPage /></Suspense>} />
            <Route path="/godisnji-odmor" element={<Suspense fallback={<RouteLoader />}><GodisnjiOdmorPage /></Suspense>} />
            <Route path="/ugovor-o-delu" element={<Suspense fallback={<RouteLoader />}><UgovorODeluPage /></Suspense>} />
            <Route path="/minimalna-zarada-2026" element={<Suspense fallback={<RouteLoader />}><MinimalnaZaradaPage /></Suspense>} />
            <Route path="/radni-dani-2026" element={<Suspense fallback={<RouteLoader />}><RadniDaniPage /></Suspense>} />
            <Route path="/praznici-2026" element={<Suspense fallback={<RouteLoader />}><PrazniciPage /></Suspense>} />
            <Route path="/prosecna-zarada" element={<Suspense fallback={<RouteLoader />}><ProsecnaZaradaPage /></Suspense>} />
            <Route path="/neoporezivi-iznos-2026" element={<Suspense fallback={<RouteLoader />}><NeoporeziviPage /></Suspense>} />
            <Route path="/stope-doprinosa-2026" element={<Suspense fallback={<RouteLoader />}><StopeDoprinosaPage /></Suspense>} />
            <Route path="/blog" element={<Suspense fallback={<RouteLoader />}><BlogList /></Suspense>} />
            <Route path="/blog/:slug" element={<Suspense fallback={<RouteLoader />}><BlogPostRoute /></Suspense>} />
            <Route path="/o-nama" element={<Suspense fallback={<RouteLoader />}><ONama onBack={() => navigate("/")} /></Suspense>} />
            <Route path="/privatnost" element={<Suspense fallback={<RouteLoader />}><PolitikaPrivatnosti onBack={() => navigate("/")} /></Suspense>} />
            <Route path="/uslovi" element={<Suspense fallback={<RouteLoader />}><UsloviKoriscenja onBack={() => navigate("/")} /></Suspense>} />
          </Routes>
        </div>
      </main>
      <Analytics />
    </div>
  );
}
