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
  minBase: 51297,
  maxBase: 732820,
  mealDaily: 1490,
  transportMax: 5782,
  minWage: 88265,
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
  // Minimalna zarada 2026 — Odluka o visini minimalne cene rada, "Sl. glasnik RS" br. 78/2025
  // (od 1. januara 2026). Fiksna je SAMO cena radnog časa (371 RSD neto); mesečni iznos
  // varira sa fondom sati (160–184 h), pa se daju i prosek (174 h) i raspon.
  minimalnaZarada2026: {
    cenaRadnogCasaNeto: 371,   // RSD neto po radnom času (fiksno, Sl. glasnik RS 78/2025)
    netoMesecno: 64554,        // prosek za 174 h (reprezentativni mesečni neto)
    brutoMesecno: 87207,       // ~ bruto 1 za prosečni neto 64.554 (174 h)
    netoMin: 59360,            // 160 radnih sati
    netoMax: 68264,            // 184 radna sata
    brutoMin: 79797,           // ~ bruto za 160 h
    brutoMax: 92499,           // ~ bruto za 184 h
    vaziOd: "1. januar 2026",
    izvor: "Sl. glasnik RS 78/2025",
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
  // Državni praznici i neradni dani u Srbiji za 2026.
  // VERIFY: Confirm dates against Vlada RS decision on neradni dani before merge.
  praznici2026: [
    { datum: "1–2. januar", naziv: "Nova godina", neradno: true },
    { datum: "7. januar", naziv: "Božić (pravoslavni)", neradno: true },
    { datum: "15–16. februar", naziv: "Dan državnosti (Sretenje)", neradno: true },
    { datum: "10. april", naziv: "Veliki petak", neradno: true },
    { datum: "12–13. april", naziv: "Vaskrs (Uskrs)", neradno: true },
    { datum: "1–2. maj", naziv: "Praznik rada", neradno: true },
    { datum: "11. novembar", naziv: "Dan primirja", neradno: true },
  ],
  // radniDani2026 — broj radnih dana i fond sati (radniDani×8) po mesecima.
  // VERIFY: Confirm counts against the official 2026 calendar before merge.
  radniDani2026: [
    { mesec: "Januar", radniDani: 20, radniSati: 160 },
    { mesec: "Februar", radniDani: 18, radniSati: 144 },
    { mesec: "Mart", radniDani: 22, radniSati: 176 },
    { mesec: "April", radniDani: 20, radniSati: 160 },
    { mesec: "Maj", radniDani: 19, radniSati: 152 },
    { mesec: "Jun", radniDani: 22, radniSati: 176 },
    { mesec: "Jul", radniDani: 23, radniSati: 184 },
    { mesec: "Avgust", radniDani: 21, radniSati: 168 },
    { mesec: "Septembar", radniDani: 22, radniSati: 176 },
    { mesec: "Oktobar", radniDani: 22, radniSati: 176 },
    { mesec: "Novembar", radniDani: 21, radniSati: 168 },
    { mesec: "Decembar", radniDani: 23, radniSati: 184 },
  ],
};
