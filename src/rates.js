// src/rates.js — single source of truth for all tax/contribution/reference figures.
// Cite sources in page footnotes. Do not hardcode these values anywhere else.

export function getNonTaxable() {
  // 34.221 RSD važi za isplate zarada od 1. JANUARA 2026 — izmene ZPDG, Sl. glasnik RS 109/2025
  // (ISPRAVKA 13.7.2026: ranije pogrešno citirano 115/2025 — to je publikacija usklađenih din.
  // iznosa; lista glasnika ZPDG na Paragrafu potvrđuje: "...19/2025, 109/2025, 115/2025 - usklađeni
  // din. izn. i 6/2026 - usklađeni din. izn."). Od 1. februara 2026. važe samo OSTALI usklađeni
  // neoporezivi iznosi (dnevnice, pomoći, prevoz — Sl. glasnik 6/2026), ne neoporezivi deo zarade.
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
  // Rad na dan praznika (neradni dan): min. +110% od osnovice (čl. 108 Zakona o radu) —
  // premija povrh redovne satnice, pa je ukupno 210% (100% + 110%). VERIFIKOVANO 8.7.2026
  // uz Paragraf (tekst čl. 108) i Propisi.net (primer 100%+110%=210%). Ranije je greškom
  // stajalo 26% (kao za prekovremeni/noćni/vikend), što je ispravljeno.
  holidayCoef: 110,
  minBase: 51297,
  maxBase: 732820,
  mealDaily: 1490,
  transportMax: 5782,
  minWage: 87207,
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
  // Godišnji porez na dohodak građana — dohodak ostvaren u 2025 (prijava do 15.5.2026).
  // VERIFIKOVANO 13.7.2026 uz Poreski informator PU (april 2026) i Objašnjenje MF od
  // 30.3.2026: prosečna godišnja zarada 2025 (RZS) 1.813.032; cenzus = 3× = 5.439.096;
  // prag za stopu 15% = 6× = 10.878.192; odbici 40%/15% prosečne godišnje zarade
  // (cap 50% dohotka za oporezivanje); umanjenje za mlađe od 40 = 3× = 5.439.096;
  // najviša godišnja osnovica doprinosa 2025 = 7.877.100. Cifre za dohodak iz 2026.
  // objavljuje PU početkom 2027 — ažurirati tada.
  godisnjiPorez2025: {
    prosecnaGodisnjaZarada: 1813032, // RZS, za 2025
    cenzus: 5439096,                 // 3× prosečna godišnja zarada
    prag15: 10878192,                // 6× — preko ovoga stopa 15%
    stopaNiza: 10,
    stopaVisa: 15,
    odbitakObveznik: 725213,         // 40% prosečne godišnje zarade
    odbitakClan: 271955,             // 15% po izdržavanom članu
    umanjenjeMladji40: 5439096,      // dodatno, samo zarada+samostalna+autorski
    maxGodisnjaOsnovicaDoprinosa: 7877100,
    rokPrijave: "15. maj 2026",
    obrazac: "PP GPDG",
    izvor: "Poreska uprava — Poreski informator, april 2026",
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
  // Usklađeni neoporezivi iznosi (ZPDG čl. 9, 18, 21a) — VERIFIKOVANO 13.7.2026 uz
  // Paragraf "Pregled usklađenih neoporezivih iznosa": objavljeni u Sl. glasniku RS 6/2026,
  // važe 1.2.2026–31.1.2027. IZUZETAK: neoporezivi iznos ZARADE (34.221, čl. 15a) primenjuje
  // se od 1.1.2026 (izmene ZPDG, Sl. glasnik RS 109/2025) — vidi getNonTaxable().
  neoporeziviOstali2026: {
    prevozDolazakOdlazak: 5782,     // naknada dokumentovanih troškova prevoza (čl. 18 t. 1)
    dnevnicaZemlja: 3471,           // dnevnica za službeni put u zemlji (t. 2)
    dnevnicaInostranstvoEur: 90,    // dnevnica za službeni put u inostranstvo (t. 3), u EUR
    prevozSluzbeniPut: 10121,       // naknada prevoza na službenom putovanju (t. 5)
    solidarnaPomoc: 57827,          // bolest/rehabilitacija/invalidnost (t. 7)
    poklonDeci: 14457,              // deci do 15 god, Nova godina i Božić (t. 8)
    jubilarnaNagrada: 28912,        // jubilarna nagrada (t. 9)
    pomocSmrtClanaPorodice: 101194, // pomoć u slučaju smrti člana porodice (t. 9a)
    dzoIPenzijskiFond: 8677,        // premija DZO / dobrovoljni penzijski doprinos (čl. 21a)
    vaziOd: "1. februar 2026",
    vaziDo: "31. januar 2027",
    izvor: "Sl. glasnik RS 6/2026; Paragraf — Pregled usklađenih neoporezivih iznosa",
  },
};
