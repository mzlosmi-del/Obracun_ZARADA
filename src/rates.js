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
