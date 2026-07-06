// src/rates.js — single source of truth for all tax/contribution/reference figures.
// Cite sources in page footnotes. Do not hardcode these values anywhere else.

export function getNonTaxable() {
  // 34.221 RSD važi za isplate zarada od 1. JANUARA 2026 (izmene ZPDG, Sl. glasnik RS 115/2025;
  // potvrda: KPMG Poreske vesti 9.12.2025, Paragraf). Od 1. februara važe samo OSTALI usklađeni
  // neoporezivi iznosi (dnevnice, pomoći — Sl. glasnik 86/2025), ne neoporezivi deo zarade.
  const yr = new Date().getFullYear();
  if (yr >= 2026) return 34221;
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
// VERIFIKOVANO 6.7.2026 uz ZDOSO (prečišćen tekst, Paragraf): čl. 44 — PIO 24%,
// zdravstveno 10,3%, nezaposlenost 0,75%; čl. 9 tač. 6 — PREDUZETNICI SU OBVEZNICI
// doprinosa za nezaposlenost. (Ranija verzija je uz odbacivanje zastarelog PIO 25,5%
// pogrešno izbacila i nezaposlenost 0,75% — ispravljeno.) Ukupno sa porezom: 45,05%.
export const PAUSAL_RATES = {
  porez: 10,
  pio: 24, // ZDOSO čl. 44 tač. 1 (od 1.1.2023)
  zdravstveno: 10.3, // ZDOSO čl. 44 tač. 2
  nezaposlenost: 0.75, // ZDOSO čl. 44 tač. 3 + čl. 9 tač. 6
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
  // Prosečna zarada — RZS, april 2026 (saopštenje 170/2026, objavljeno 25.6.2026).
  prosecnaZarada2026: {
    neto: 121805,
    bruto: 168008,
    medijalnaNeto: 94585,
    mesec: "april 2026",
    kursEur: 117.40,
    izvor: "RZS",
  },
  // Državni praznici i neradni dani u Srbiji za 2026.
  // VERIFY: Confirm dates against Vlada RS decision on neradni dani before merge.
  praznici2026: [
    { datum: "1–2. januar", naziv: "Nova godina", neradno: true },
    { datum: "7. januar", naziv: "Božić (pravoslavni)", neradno: true },
    { datum: "15–16. februar", naziv: "Dan državnosti (Sretenje) — pošto 15. pada u nedelju, neradan je i utorak 17. februar", neradno: true },
    { datum: "10. april", naziv: "Veliki petak", neradno: true },
    { datum: "12–13. april", naziv: "Vaskrs (Uskrs)", neradno: true },
    { datum: "1–2. maj", naziv: "Praznik rada", neradno: true },
    { datum: "11. novembar", naziv: "Dan primirja", neradno: true },
  ],
  // radniDani2026 — VERIFIKOVANO 6.7.2026: "mogući" dani/sati (pon–pet, bez odbijanja
  // praznika — zvanični fond za obračun minimalca, potvrđen uz Paragraf tabelu minimalne
  // zarade 2026); "bezPraznika" = mogući dani umanjeni za praznike koji padaju na radni dan
  // (Zakon o državnim i drugim praznicima; Sretenje: 15.2. pada u nedelju → neradan i utorak 17.2).
  radniDani2026: [
    { mesec: "Januar", radniDani: 22, radniSati: 176, praznici: "1, 2. i 7. januar", bezPraznika: 19 },
    { mesec: "Februar", radniDani: 20, radniSati: 160, praznici: "16. i 17. februar (Sretenje)", bezPraznika: 18 },
    { mesec: "Mart", radniDani: 22, radniSati: 176, praznici: "—", bezPraznika: 22 },
    { mesec: "April", radniDani: 22, radniSati: 176, praznici: "10. i 13. april (Vaskrs)", bezPraznika: 20 },
    { mesec: "Maj", radniDani: 21, radniSati: 168, praznici: "1. maj (2. pada u subotu)", bezPraznika: 20 },
    { mesec: "Jun", radniDani: 22, radniSati: 176, praznici: "—", bezPraznika: 22 },
    { mesec: "Jul", radniDani: 23, radniSati: 184, praznici: "—", bezPraznika: 23 },
    { mesec: "Avgust", radniDani: 21, radniSati: 168, praznici: "—", bezPraznika: 21 },
    { mesec: "Septembar", radniDani: 22, radniSati: 176, praznici: "—", bezPraznika: 22 },
    { mesec: "Oktobar", radniDani: 22, radniSati: 176, praznici: "—", bezPraznika: 22 },
    { mesec: "Novembar", radniDani: 21, radniSati: 168, praznici: "11. novembar", bezPraznika: 20 },
    { mesec: "Decembar", radniDani: 23, radniSati: 184, praznici: "—", bezPraznika: 23 },
  ],
};
