import { useState, useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";

// ── PARAMETERS ───────────────────────────────────────────────────────────────
// Neoporezivi iznos — date-aware
function getNonTaxable() {
  const now = new Date();
  const yr = now.getFullYear();
  const mo = now.getMonth() + 1; // 1-based
  // Feb 2026 onwards: 34,221 RSD
  if (yr > 2026 || (yr === 2026 && mo >= 2)) return 34221;
  // Feb 2025 – Jan 2026: 28,423 RSD
  return 28423;
}

const DEFAULT_RATES = {
  taxRate: 10,           // %
  nonTaxable: getNonTaxable(), // RSD — auto from date
  pioPct_emp: 14,        // %
  health_emp: 5.15,      // %
  unemp_emp: 0.75,       // %
  pio_er: 10,            // %
  health_er: 5.15,       // %
  overtimeCoef: 26,      // % above base
  nightCoef: 26,
  weekendCoef: 26,
  holidayCoef: 26,
  minBase: 45950,        // RSD
  maxBase: 656425,       // RSD
  mealDaily: 1490,       // RSD/dan — podrazumevana vrednost u kalkulatoru
  transportMax: 5782,    // RSD/mesec — neoporezivi max od 1.2.2026. (ZPDG usklađeni iznosi)
  minWage: 93264,        // RSD bruto — minimalna zarada 2026
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
![Obračun poreza na zaradu](https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80)

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

## Korisni linkovi

- [Zakon o porezu na dohodak građana — Paragraf.rs](https://www.paragraf.rs/propisi/zakon_o_porezu_na_dohodak_gradjana.html)
- [Poreska uprava Srbije — porezi na zaradu](https://www.purs.gov.rs/lat/fizicka-lica/porez-na-dohodak-gradjana/zarade.html)
    `,
  },
  {
    id: "bruto-neto-razlika",
    date: "15. januar 2025",
    tag: "Osnove",
    title: "Razlika između bruto i neto zarade — jednostavno objašnjenje",
    summary: "Bruto zarada i neto zarada — dva pojma koja svaki zaposleni čuje, ali malo ko zapravo razume šta ih razlikuje. Evo jasnog objašnjenja.",
    body: `
![Računanje zarade na laptopu](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80)

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

## Korisni linkovi

- [Zakon o radu Srbije — Paragraf.rs](https://www.paragraf.rs/propisi/zakon_o_radu.html)
- [Republički zavod za statistiku — prosečne zarade](https://www.stat.gov.rs/sr-latn/oblasti/trziste-rada/zarade/)
    `,
  },
  {
    id: "prekovremeni-rad",
    date: "10. januar 2025",
    tag: "Zakon o radu",
    title: "Prekovremeni rad u Srbiji: prava i obračun po Zakonu o radu",
    summary: "Zakon o radu propisuje minimum od +26% za prekovremeni rad. Kako se obračunava, koliko može trajati i šta su vaša prava kao zaposlenog?",
    body: `
![Prekovremeni rad u kancelariji](https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80)

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

## Korisni linkovi

- [Zakon o radu — čl. 108 (Paragraf.rs)](https://www.paragraf.rs/propisi/zakon_o_radu.html)
- [Inspekcija rada Srbije — prijava nepravilnosti](https://www.minrzs.gov.rs/sr/inspekcija-rada)
    `,
  },
  {
    id: "minimalna-zarada-2025",
    date: "2. januar 2025",
    tag: "Novosti",
    title: "Minimalna zarada u Srbiji za 2025. godinu: 73.274 RSD bruto",
    summary: "Vlada Srbije je utvrdila minimalnu zaradu za 2025. godinu. Koliko iznosi, ko ima pravo na nju i kako je obračunati?",
    body: `
![Minimalna zarada i novac](https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80)

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

## Korisni linkovi

- [Uredba o minimalnoj zaradi — Paragraf.rs](https://www.paragraf.rs/propisi/uredba-o-visini-minimalne-zarade.html)
- [Republički zavod za statistiku — zarade i troškovi rada](https://www.stat.gov.rs/sr-latn/oblasti/trziste-rada/zarade/)
    `,
  },
  {
    id: "doprinosi-srbija",
    date: "20. decembar 2024",
    tag: "Doprinosi",
    title: "Doprinosi za socijalno osiguranje u Srbiji: kompletan vodič za 2025.",
    summary: "Ko plaća doprinose, koliko iznose i na šta imate pravo? Kompletan pregled sistema socijalnog osiguranja za zaposlene u Srbiji.",
    body: `
![Socijalno osiguranje i penzijski sistem](https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=800&q=80)

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

## Korisni linkovi

- [Zakon o doprinosima za obavezno socijalno osiguranje — Paragraf.rs](https://www.paragraf.rs/propisi/zakon_o_doprinosima_za_obavezno_socijalno_osiguranje.html)
- [Fond PIO Srbije — pravo na penziju](https://www.pio.rs/sr/osiguranici/pravo-na-penziju.html)
- [RFZO — prava iz zdravstvenog osiguranja](https://www.rfzo.rs/index.php/osiguranici-s/prava-iz-zo)
    `,
  },
  {
    id: "minimalna-zarada-2026",
    date: "1. februar 2026",
    tag: "Novosti",
    title: "Minimalna zarada u Srbiji za 2026. godinu",
    summary: "Od februara 2026. minimalna neto zarada iznosi 69.000 RSD, a bruto 93.264 RSD. Šta se promenilo i kako to utiče na poslodavce?",
    body: `
![Minimalna zarada rast 2026](https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80)

Od **1. februara 2026. godine** u Srbiji važe novi iznosi minimalne zarade, usklađeni sa rastom troškova života i preporukama Socijalno-ekonomskog saveta.

## Iznosi minimalne zarade u 2026. godini

| Pokazatelj | Iznos |
|---|---|
| Minimalna neto zarada (mesečno) | 69.000 RSD |
| Minimalna bruto zarada (mesečno) | 93.264 RSD |
| Minimalna satnica (neto) | 410,71 RSD |
| Minimalna satnica (bruto) | 554,90 RSD |

## Kako se izračunava minimalna zarada?

Minimalna zarada se određuje po satu rada. Za pun radni mesec od 168 sati (21 radni dan × 8 sati), množi se minimalna satnica sa brojem sati.

**Primer za februar 2026:**
- Minimalna satnica bruto: 554,90 RSD
- Radnih sati: 168
- Minimalna bruto zarada: 93.264 RSD

## Šta se menja za poslodavce?

Svaki poslodavac u Srbiji dužan je da zaposlenima isplati **najmanje minimalnu zaradu**. Isplata ispod minimalca je prekršaj koji se kažnjava novčanom kaznom od 800.000 do 2.000.000 RSD za pravno lice.

Uz minimalnu zaradu, poslodavac plaća i doprinose na teret poslodavca od **15,15%**, što ukupan trošak rada podiže na oko **107.381 RSD mesečno**.

## Poređenje sa prethodnim godinama

| Godina | Minimalna bruto zarada |
|---|---|
| 2024 | 69.423 RSD |
| 2025 | 73.274 RSD |
| 2026 | 93.264 RSD |

Rast minimalne zarade u 2026. godini je značajan — oko **27% u odnosu na 2025.** godinu.

## Ko prima minimalnu zaradu?

Prema podacima Republičkog zavoda za statistiku, oko 8-10% zaposlenih u Srbiji prima zaradu blizu minimuma. Najzastupljenije su delatnosti: tekstilna industrija, poljoprivreda, ugostiteljstvo i maloprodaja.

## Neoporezivi iznos i minimalna zarada

Od februara 2026. neoporezivi iznos je **34.221 RSD**. Budući da je minimalna bruto zarada 93.264 RSD, poreska osnovica iznosi 59.043 RSD, a porez 5.904 RSD.

Koristite naš **besplatni kalkulator** za tačan obračun minimalne i svake druge zarade.

## Korisni linkovi

- [Vlada Srbije — uredba o minimalnoj zarade](https://www.srbija.gov.rs)
- [Republički zavod za statistiku — zarade](https://www.stat.gov.rs/sr-latn/oblasti/trziste-rada/zarade/)
- [Socijalno-ekonomski savet Srbije](https://www.socijalnoekonomskisavet.rs)
    `,
  },
  {
    id: "godisnji-odmor-naknada",
    date: "15. januar 2026",
    tag: "Zakon o radu",
    title: "Naknada zarade za godišnji odmor — kako se obračunava?",
    summary: "Za vreme godišnjeg odmora zaposleni ima pravo na naknadu u visini prosečne zarade. Objašnjavamo kako se tačno obračunava i šta kaže Zakon o radu.",
    body: `
![Godišnji odmor i odmor od posla](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80)

Godišnji odmor je jedno od osnovnih prava zaposlenih u Srbiji, garantovano **Zakonom o radu (čl. 68–76)**. Za vreme korišćenja godišnjeg odmora, zaposleni ima pravo na naknadu zarade — ali kako se ona tačno obračunava?

## Pravo na godišnji odmor

Svaki zaposleni koji je zasnovao radni odnos stiče pravo na godišnji odmor. Minimalni godišnji odmor iznosi **20 radnih dana** godišnje. Kolektivnim ugovorom ili ugovorom o radu može se utvrditi duži odmor.

Pravo na puni godišnji odmor stiče se **nakon 6 meseci** neprekidnog rada kod istog poslodavca.

## Kako se obračunava naknada za godišnji odmor?

Prema članu 104. Zakona o radu, naknada zarade za godišnji odmor ne može biti niža od **prosečne zarade zaposlenog u prethodnih 12 meseci**.

**Formula:**
1. Sabrajte sve bruto zarade u prethodnih 12 meseci
2. Podelite sa 12 (prosečna mesečna bruto zarada)
3. Podelite sa prosečnim brojem radnih dana u mesecu (21-22)
4. Pomnožite sa brojem dana godišnjeg odmora

**Primer:**
- Prosečna bruto zarada (12 meseci): 100.000 RSD
- Dnevna osnova: 100.000 / 21 = 4.762 RSD
- Godišnji odmor: 20 radnih dana
- Naknada bruto: 4.762 × 20 = **95.238 RSD**

## Da li se plaćaju doprinosi i porez na naknadu?

Da. Naknada za godišnji odmor tretira se kao zarada i podleže:
- Doprinosima zaposlenog (19,90%)
- Porezu na dohodak (10% iznad neoporezivog iznosa)
- Doprinosima poslodavca (15,15%)

## Kada se isplaćuje naknada?

Naknada za godišnji odmor isplaćuje se **najkasnije 3 radna dana pre početka korišćenja odmora**, ukoliko zaposleni to zahteva.

## Raspored godišnjeg odmora

Poslodavac je dužan da zaposlenom dostavi rešenje o korišćenju godišnjeg odmora najmanje **15 dana unapred**. Odmor se može koristiti u celini ili u delovima — ali najmanje 10 radnih dana mora biti neprekidno.

## Godišnji odmor i bolovanje

Ako zaposleni za vreme godišnjeg odmora padne na bolovanje, odmor se prekida. Neiskorišćeni dani godišnjeg odmora mogu se koristiti naknadno.

## Zastarелост prava

Pravo na godišnji odmor ne može se preneti u sledeću kalendarsku godinu ako nije iskorišćeno krivicom zaposlenog. Ako nije iskorišćen krivicom poslodavca, zaposleni ima pravo na naknadu štete.

## Korisni linkovi

- [Zakon o radu — čl. 68–76 (godišnji odmor)](https://www.paragraf.rs/propisi/zakon_o_radu.html)
- [Inspekcija rada — prava zaposlenih](https://www.minrzs.gov.rs/sr/inspekcija-rada)
    `,
  },
  {
    id: "otpremnina-obracun",
    date: "5. januar 2026",
    tag: "Zakon o radu",
    title: "Otpremnina u Srbiji — pravo, iznos i obračun",
    summary: "Ko ima pravo na otpremninu, koliko iznosi i kako se obračunava? Sve što trebate znati po Zakonu o radu Srbije.",
    body: `
![Prestanak radnog odnosa i otpremnina](https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=800&q=80)

Otpremnina je jednokratna novčana naknada koju poslodavac isplaćuje zaposlenom prilikom prestanka radnog odnosa pod određenim uslovima. Regulisana je **Zakonom o radu (čl. 158–160)**.

## Ko ima pravo na otpremninu?

Pravo na otpremninu ima zaposleni kome prestaje radni odnos:
- **Zbog tehnološkog viška** (proglašavanje za višak zaposlenih)
- **Sporazumnim raskidom** — ako je to predviđeno ugovorom ili kolektivnim ugovorom
- **Odlaskom u penziju** — starosnu ili invalidsku

**Nema pravo** na otpremninu zaposleni kome je radni odnos prestao:
- Zbog otkaza iz razloga na strani zaposlenog (disciplinski, nepoštovanje obaveza)
- Istekom ugovora o radu na određeno vreme
- Na lični zahtev (ostavka)

## Koliko iznosi otpremnina?

Zakon o radu propisuje **minimalni iznos otpremnine**. Poslodavac može isplatiti i više kolektivnim ugovorom ili ugovorom o radu.

### Za tehnološki višak (čl. 158):

Minimalni iznos: **1/3 prosečne mesečne zarade** za svaku navršenu godinu rada kod tog poslodavca.

**Primer:**
- Prosečna bruto zarada: 100.000 RSD
- Godine rada kod poslodavca: 10
- Minimalna otpremnina: 100.000 / 3 × 10 = **333.333 RSD**

### Za odlazak u penziju (čl. 119):

Minimalni iznos: **2 prosečne mesečne zarade** u Republici Srbiji prema poslednjem objavljenom podatku Republičkog zavoda za statistiku.

## Koja zarada se uzima kao osnova?

Osnova za obračun otpremnine je **prosečna mesečna zarada zaposlenog isplaćena u prethodnih 12 meseci** — ne minimalna zarada, ne zarada na dan prestanka radnog odnosa, već prosek.

## Poreski tretman otpremnine

Otpremnina do **zakonom propisanog iznosa** je oslobođena poreza na dohodak i doprinosa za socijalno osiguranje. Iznos koji prelazi zakonski minimum oporezuje se kao zarada.

| Deo otpremnine | Porez | Doprinosi |
|---|---|---|
| Do zakonskog minimuma | Ne | Ne |
| Iznos iznad minimuma | 10% (porez) | 35,05% |

## Rok isplate

Otpremnina se isplaćuje **najkasnije 30 dana od dana prestanka radnog odnosa**. Kašnjenje u isplati daje zaposlenom pravo na zakonsku zateznu kamatu.

## Savet

Pre potpisivanja sporazumnog raskida, proverite da li imate pravo na otpremninu i da li je iznos u skladu sa zakonom. Preporuka je konsultovati se sa pravnikom ili sindikatom.

## Korisni linkovi

- [Zakon o radu — čl. 158–160 (otpremnina)](https://www.paragraf.rs/propisi/zakon_o_radu.html)
- [Nacionalna služba za zapošljavanje — prava pri gubitku posla](https://www.nsz.gov.rs/live/digitalAssets/10/10017_pravo_na_novcanu_naknadu.pdf)
- [Poreska uprava — porez na otpremninu](https://www.purs.gov.rs)
    `,
  },
];

// ── CALCULATE ─────────────────────────────────────────────────────────────────
function calculate(inputs, rates) {
  const { basicBruto, standardHours, overtimeH, nightH, weekendH, holidayH, fixedBonus, bonusPct, yearsOfService, minuliRadPct, transport, mealDays, mealDailyActual, regres, sickDays, sickPct, publicHolidayDays, vacationHolidayDays, unpaidDays, syndikat, syndikatPct, kredit, adminZabrana, ostaliOdbici } = inputs;
  const R = rates;
  const totalWorkDays = (standardHours || 168) / 8;
  const overtimeCoef = 1 + R.overtimeCoef / 100;
  const nightCoef    = 1 + R.nightCoef / 100;
  const weekendCoef  = 1 + R.weekendCoef / 100;
  const holidayCoef  = 1 + R.holidayCoef / 100;

  // Public holidays falling on workdays — full pay, no reduction
  const publicHolidayDaysActual = Math.min(publicHolidayDays || 0, totalWorkDays);

  // Sick leave — employer pays sickPct% of daily rate
  const sickDaysActual = Math.min(sickDays || 0, totalWorkDays - publicHolidayDaysActual);

  // Unpaid absence — UMANJENJE: reduces bruto, affects tax/contributions
  const unpaidDaysActual = Math.min(unpaidDays || 0, totalWorkDays - publicHolidayDaysActual - sickDaysActual);

  const workedDays = totalWorkDays - sickDaysActual - publicHolidayDaysActual - unpaidDaysActual;
  const dailyBruto = basicBruto / totalWorkDays;

  const workedBruto = dailyBruto * workedDays;
  const publicHolidayBasePay = dailyBruto * publicHolidayDaysActual;
  const sickPay = sickDaysActual > 0 ? dailyBruto * sickDaysActual * ((sickPct || 65) / 100) : 0;
  const unpaidDeduction = dailyBruto * unpaidDaysActual;

  // Praznik tokom godišnjeg odmora — zaposleni prima punu dnevnu zaradu, odmor se produžava
  const vacationHolidayDaysActual = Math.max(vacationHolidayDays || 0, 0);
  const vacationHolidayPay = dailyBruto * vacationHolidayDaysActual;

  // Minuli rad — uvećanje po godinama staža (zakonski min 0,4% po godini)
  const minuliRadRate = (yearsOfService || 0) * ((minuliRadPct || 0.4) / 100);
  const minuliRadAmount = workedBruto * minuliRadRate;

  const hourRate = workedBruto / (workedDays * 8 || 1);
  const overtimePay = overtimeH * hourRate * overtimeCoef;
  const nightPay = nightH * hourRate * nightCoef;
  const weekendPay = weekendH * hourRate * weekendCoef;
  const holidayPay = holidayH * hourRate * holidayCoef;
  const bonusAmount = fixedBonus + basicBruto * (bonusPct / 100);

  // Topli obrok u novcu i regres — u potpunosti oporezivi (ulaze u bruto1)
  const mealDailyRate = mealDailyActual || R.mealDaily;
  const mealAmount = mealDays * mealDailyRate;
  const regresAmount = regres || 0;

  // Prevoz — neoporeziv do zakonskog max, ne ulazi u bruto1
  const transportActual = Math.min(transport || 0, R.transportMax);

  // Bruto1 = zarada + minuli rad + uvećanja + bonusi + topli obrok + regres + praznici tokom odmora
  const bruto1 = workedBruto + publicHolidayBasePay + vacationHolidayPay + minuliRadAmount + overtimePay + nightPay + weekendPay + holidayPay + bonusAmount + mealAmount + regresAmount;
  const contribBase = Math.max(Math.min(bruto1, R.maxBase), R.minBase);
  const pio_emp = contribBase * R.pioPct_emp / 100;
  const health_emp = contribBase * R.health_emp / 100;
  const unemp = contribBase * R.unemp_emp / 100;
  const totalEmpContrib = pio_emp + health_emp + unemp;
  const taxBase = Math.max(bruto1 - R.nonTaxable, 0);
  const tax = taxBase * R.taxRate / 100;
  const netoFromWork = bruto1 - totalEmpContrib - tax;

  // ODBICI — deducted from neto after tax/contributions
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

// ── REVERSE: neto → bruto ────────────────────────────────────────────────────
// Solves for basicBruto given a desired neto using binary search.
// The tax/contrib system is piecewise so closed-form is messy; bisection is clean.
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
${r.sickDaysActual > 0 ? trow('Odbitak za bolovanje', -(inputs.basicBruto - r.workedBruto - r.publicHolidayBasePay), '#f02d3a', `${r.sickDaysActual} dana × ${fmt(r.dailyBruto)} RSD`) : ''}
${r.sickDaysActual > 0 ? trow('Zarada za odrađene dane', r.workedBruto, '#4b5563', `${r.workedDays} radnih dana`) : ''}
${r.publicHolidayDaysActual > 0 ? trow(`Državni praznici (${r.publicHolidayDaysActual} dana)`, r.publicHolidayBasePay, '#4b5563', 'Plaćeni neradni dani — puna naknada') : ''}
${r.vacationHolidayDaysActual > 0 ? trow(`Praznici tokom godišnjeg odmora (${r.vacationHolidayDaysActual} dana)`, r.vacationHolidayPay, '#00b341', 'Puna naknada — odmor se produžava') : ''}
${r.unpaidDaysActual > 0 ? trow(`Neplaćeno odsustvo (${r.unpaidDaysActual} dana)`, -r.unpaidDeduction, '#f02d3a', 'Umanjenje bruta') : ''}
${r.minuliRadAmount > 0 ? trow(`Minuli rad (${inputs.yearsOfService} god. × ${inputs.minuliRadPct}% = ${(r.minuliRadRate*100).toFixed(2)}%)`, r.minuliRadAmount, '#00b341') : ''}
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
${trow('Neoporezivi iznos', R.nonTaxable, '#4b5563')}
${trow('Poreska osnovica (Bruto1 – neoporezivi)', r.taxBase, '#4b5563', `${fmt(r.bruto1)} – ${fmt(R.nonTaxable)}`)}
${trow('Porez na zaradu (10%)', r.tax, '#f02d3a')}
</table></div>
<div class="sec"><div class="sh">D. Neto zarada i odbici</div><table>
${r.sickDaysActual > 0 ? trow('Neto od rada', r.netoFromWork, '#4b5563') : ''}
${r.sickDaysActual > 0 ? trow(`Naknada za bolovanje (${inputs.sickPct}%)`, r.sickPay, '#00b341', `${r.sickDaysActual} dana × ${fmt(r.dailyBruto)} × ${inputs.sickPct}%`) : ''}
${r.totalOdbici > 0 ? trow('Neto pre odbitaka', r.netoBeforeOdbici, '#4b5563') : ''}
${r.syndikatAmount > 0 ? trow('Sindikalna članarina', -r.syndikatAmount, '#f02d3a') : ''}
${inputs.kredit > 0 ? trow('Kredit / pozajmica od poslodavca', -inputs.kredit, '#f02d3a') : ''}
${inputs.adminZabrana > 0 ? trow('Administrativna zabrana', -inputs.adminZabrana, '#f02d3a') : ''}
${inputs.ostaliOdbici > 0 ? trow('Ostali odbici', -inputs.ostaliOdbici, '#f02d3a') : ''}
${r.totalOdbici > 0 ? trow('UKUPNO odbici od zarade', -r.totalOdbici, '#f02d3a') : ''}
${trow('NETO ZARADA (iznos na račun zaposlenog)', r.neto, '#00b341')}
${trow('PIO – doprinos poslodavca (10%)', r.pio_er, '#f59e0b')}
${trow('Zdravstvo – doprinos poslodavca (5,15%)', r.health_er, '#f59e0b')}
${trow('UKUPNO doprinosi poslodavca (15,15%)', r.totalErContrib, '#f59e0b')}
${trow('BRUTO 2 (Bruto1 + doprinosi poslodavca)', r.bruto2, '#0057ff')}
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

// ── MARKDOWN RENDERER (simple) ────────────────────────────────────────────────
function renderMd(text) {
  return text.trim()
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="post-img" loading="lazy" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="post-link">$1</a>')
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
const NumberInput = ({ label, value, onChange, unit = "RSD", min = 0, step = 1, sublabel }) => {
  const [raw, setRaw] = useState(String(value));

  // Sync external value changes (e.g. reset) back into raw
  useEffect(() => {
    // Only overwrite if the parsed value differs — don't stomp mid-edit
    if (parseFloat(raw) !== value && raw !== "" && raw !== "-") {
      setRaw(String(value));
    }
  }, [value]);

  const handleChange = (e) => {
    const str = e.target.value;
    setRaw(str);
    const parsed = parseFloat(str);
    if (!isNaN(parsed)) onChange(parsed);
    else if (str === "" || str === "-") onChange(0);
  };

  const handleBlur = () => {
    const parsed = parseFloat(raw);
    const clamped = isNaN(parsed) ? 0 : Math.max(min, parsed);
    setRaw(String(clamped));
    onChange(clamped);
  };

  return (
    <div className="input-field">
      <label>{label}{sublabel && <span className="sublabel">{sublabel}</span>}</label>
      <div className="input-wrap">
        <input
          type="text"
          inputMode="decimal"
          value={raw}
          step={step}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{ fontFamily: "var(--mono)" }}
        />
        <span className="unit">{unit}</span>
      </div>
    </div>
  );
};

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

// ── BREVO SIGNUP ─────────────────────────────────────────────────────────────
function BrevoSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": import.meta.env.VITE_BREVO_API_KEY,
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          listIds: [3],
          updateEnabled: true,
        }),
      });
      if (res.ok || res.status === 204) {
        setStatus("success");
        setEmail("");
      } else if (res.status === 400) {
        // Already exists is fine
        const data = await res.json();
        if (data.code === "duplicate_parameter") {
          setStatus("success");
          setEmail("");
        } else {
          setErrorMsg("Proverite email adresu.");
          setStatus("error");
        }
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
          <input
            className="brevo-input"
            type="email"
            placeholder="vas@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={status === "loading"}
          />
          <button className="brevo-btn" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "..." : "Prijavi se"}
          </button>
          {status === "error" && <div className="brevo-error">{errorMsg}</div>}
        </form>
      )}
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

// ── PPP-PD XML GENERATOR ─────────────────────────────────────────────────────
function generatePPPPD(inputs, r, info, rates) {
  const pad2 = (n) => String(n).padStart(2, "0");
  const fmtXml = (n) => (Math.round((n || 0) * 100) / 100).toFixed(2);
  const period = `${info.year}-${pad2(info.month)}`;
  const datumPlacanja = `${info.year}-${pad2(info.month)}-${pad2(new Date(info.year, info.month, 0).getDate())}`;
  const totalWorkDays = (inputs.standardHours || 168) / 8;
  // Efektivni sati = only actually worked days × 8 + overtime (unpaid days excluded)
  const efektivniSati = r.workedDays * 8 + (inputs.overtimeH || 0);
  // Kalendarski dani = worked + sick + public holidays (NOT unpaid — those don't count)
  const kalendarskiDani = Math.round(r.workedDays + r.sickDaysActual + r.publicHolidayDaysActual);

  // Split name into ime/prezime
  const nameParts = (info.employeeName || "Zaposleni").trim().split(" ");
  const prezime = nameParts[0] || "";
  const ime = nameParts.slice(1).join(" ") || "-";

  return `<?xml version="1.0" encoding="UTF-8"?>
<PodaciPoreskeDeklaracije xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <PodaciOPrijavi>
    <VrstaPrijave>1</VrstaPrijave>
    <ObracunskiPeriod>${period}</ObracunskiPeriod>
    <DatumPlacanja>${datumPlacanja}</DatumPlacanja>
  </PodaciOPrijavi>
  <PodaciOIsplatiocu>
    <TipIsplatioca>1</TipIsplatioca>
    <PoreskiIdentifikacioniBroj>${info.companyPib || "000000000"}</PoreskiIdentifikacioniBroj>${info.companyMbr ? `\n    <MaticniBrojisplatioca>${info.companyMbr}</MaticniBrojisplatioca>` : ""}${info.companyName ? `\n    <NazivPrezimeIme>${info.companyName}</NazivPrezimeIme>` : ""}
    <SedistePrebivaliste>${info.companyOpstina || "000"}</SedistePrebivaliste>${info.companyTelefon ? `\n    <Telefon>${info.companyTelefon}</Telefon>` : ""}${info.companyAddress ? `\n    <UlicaIBroj>${info.companyAddress}</UlicaIBroj>` : ""}
    <eMail>${info.companyEmail || "kontakt@firma.rs"}</eMail>
  </PodaciOIsplatiocu>
  <DeklarisaniPrihodi>
    <PodaciOPrihodima>
      <RedniBroj>1</RedniBroj>
      <VrstaIdentifikatoraPrimaoca>1</VrstaIdentifikatoraPrimaoca>
      <IdentifikatorPrimaoca>${info.employeeJmbg || "0000000000000"}</IdentifikatorPrimaoca>
      <Prezime>${prezime}</Prezime>
      <Ime>${ime}</Ime>
      <OznakaPrebivalista>${info.employeeOpstina || "000"}</OznakaPrebivalista>
      <SVP>${info.svp || "111001001"}</SVP>
      <BrojKalendarskihDana>${kalendarskiDani}</BrojKalendarskihDana>
      <BrojEfektivnihSati>${efektivniSati.toFixed(2)}</BrojEfektivnihSati>
      <MesecniFondSati>${(inputs.standardHours || 168).toFixed(2)}</MesecniFondSati>
      <Bruto>${fmtXml(r.bruto1)}</Bruto>
      <OsnovicaPorez>${fmtXml(r.taxBase)}</OsnovicaPorez>
      <Porez>${fmtXml(r.tax)}</Porez>
      <OsnovicaDoprinosi>${fmtXml(r.contribBase)}</OsnovicaDoprinosi>
      <PIO>${fmtXml(r.pio_emp)}</PIO>
      <ZDR>${fmtXml(r.health_emp)}</ZDR>
      <NEZ>${fmtXml(r.unemp)}</NEZ>
      <PIOBen>0.00</PIOBen>
    </PodaciOPrihodima>
  </DeklarisaniPrihodi>
</PodaciPoreskeDeklaracije>`;
}

// ── OPSTINE (sample most common ones) ─────────────────────────────────────────
const OPSTINE = [
  ["000","— nije odabrano —"],["701","Beograd - Stari Grad"],["703","Beograd - Savski Venac"],
  ["705","Beograd - Vračar"],["707","Beograd - Rakovica"],["709","Beograd - Čukarica"],
  ["711","Beograd - Palilula"],["713","Beograd - Zvezdara"],["715","Beograd - Voždovac"],
  ["717","Beograd - Novi Beograd"],["719","Beograd - Zemun"],["721","Beograd - Surčin"],
  ["723","Beograd - Grocka"],["725","Beograd - Lazarevac"],["727","Beograd - Obrenovac"],
  ["729","Beograd - Sopot"],["731","Beograd - Barajevo"],["733","Beograd - Mladenovac"],
  ["101","Novi Sad"],["105","Subotica"],["107","Zrenjanin"],["109","Pančevo"],
  ["111","Sombor"],["113","Kikinda"],["115","Vršac"],["201","Niš"],["203","Leskovac"],
  ["205","Vranje"],["207","Pirot"],["209","Zaječar"],["301","Kragujevac"],["303","Čačak"],
  ["305","Kraljevo"],["307","Kruševac"],["309","Jagodina"],["401","Novi Pazar"],
  ["403","Subotica - ostalo"],["501","Šabac"],["503","Valjevo"],["505","Smederevo"],
];

// ── SVP COMMON VALUES ──────────────────────────────────────────────────────────
const SVP_LIST = [
  ["111001001","111001001 — Zarada (redovni rad)"],
  ["111001002","111001002 — Zarada (prekovremeni rad)"],
  ["111002001","111002001 — Naknada zarade (bolovanje do 30 dana)"],
  ["111002002","111002002 — Naknada zarade (godišnji odmor)"],
  ["111002003","111002003 — Naknada zarade (praznik)"],
  ["111005001","111005001 — Regres za godišnji odmor"],
  ["111006001","111006001 — Jubilarna nagrada"],
  ["101001001","101001001 — Zarada preduzetnika"],
];

function PPPPDTab({ inputs, r, info, setI, rates }) {
  const [xml, setXml] = useState("");
  const [copied, setCopied] = useState(false);
  const [showXml, setShowXml] = useState(false);

  const generate = () => {
    const generated = generatePPPPD(inputs, r, info, rates);
    setXml(generated);
    setShowXml(true);
    setCopied(false);
  };

  const download = () => {
    const pad2 = (n) => String(n).padStart(2, "0");
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PPPPD_${info.companyPib || "PIB"}_${info.year}${pad2(info.month)}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = () => {
    navigator.clipboard.writeText(xml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="main-grid">
      <div className="card">
        <SectionTitle icon="🏢">Podaci o isplatiocu</SectionTitle>
        <div className="inputs-body">
          <TextInput label="PIB isplatioca" value={info.companyPib} onChange={setI("companyPib")} placeholder="123456789" />
          <TextInput label="Matični broj (MBR)" value={info.companyMbr || ""} onChange={setI("companyMbr")} placeholder="12345678" />
          <TextInput label="Naziv firme" value={info.companyName} onChange={setI("companyName")} placeholder="Firma d.o.o." />
          <TextInput label="Email za kontakt" value={info.companyEmail || ""} onChange={setI("companyEmail")} placeholder="kontakt@firma.rs" />
          <TextInput label="Telefon" value={info.companyTelefon || ""} onChange={setI("companyTelefon")} placeholder="+381 11 123 4567" />
          <TextInput label="Adresa (ulica i broj)" value={info.companyAddress} onChange={setI("companyAddress")} placeholder="Ulica br. 1, Beograd" />
          <div className="input-field">
            <label>Opština sedišta isplatioca</label>
            <div className="input-wrap">
              <select value={info.companyOpstina || "000"} onChange={e => setI("companyOpstina")(e.target.value)} style={{fontFamily:"var(--sans)", fontSize:13, width:"100%", background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:8, padding:"8px 12px", color:"var(--text)"}}>
                {OPSTINE.map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <SectionTitle icon="👤">Podaci o primaocu prihoda</SectionTitle>
        <div className="inputs-body">
          <TextInput label="Ime i prezime" value={info.employeeName} onChange={setI("employeeName")} placeholder="Prezime Ime" />
          <TextInput label="JMBG primaoca" value={info.employeeJmbg} onChange={setI("employeeJmbg")} placeholder="0101990000000" />
          <div className="input-field">
            <label>Opština prebivališta primaoca</label>
            <div className="input-wrap">
              <select value={info.employeeOpstina || "000"} onChange={e => setI("employeeOpstina")(e.target.value)} style={{fontFamily:"var(--sans)", fontSize:13, width:"100%", background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:8, padding:"8px 12px", color:"var(--text)"}}>
                {OPSTINE.map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="input-field">
            <label>Šifra vrste prihoda (ŠVP)</label>
            <div className="input-wrap">
              <select value={info.svp || "111001001"} onChange={e => setI("svp")(e.target.value)} style={{fontFamily:"var(--mono)", fontSize:12, width:"100%", background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:8, padding:"8px 12px", color:"var(--text)"}}>
                {SVP_LIST.map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        <SectionTitle icon="📋">Pregled vrednosti za prijavu</SectionTitle>
        <div className="results-body" style={{margin:"0 16px 16px"}}>
          {r.mealAmount > 0 && <ResultRow label="Topli obrok (u Bruto 1)" value={r.mealAmount} sub="oporezivo" />}
          {r.regresAmount > 0 && <ResultRow label="Regres (u Bruto 1)" value={r.regresAmount} sub="oporezivo" />}
          <ResultRow label="Bruto 1 (pos. 3.9)" value={r.bruto1} />
          <ResultRow label="Osnovica za porez (pos. 3.10)" value={r.taxBase} />
          <ResultRow label="Porez (pos. 3.11)" value={r.tax} />
          <ResultRow label="Osnovica za doprinose (pos. 3.12)" value={r.contribBase} />
          <ResultRow label="PIO — zaposleni (pos. 3.13)" value={r.pio_emp} />
          <ResultRow label="Zdravstvo — zaposleni (pos. 3.14)" value={r.health_emp} />
          <ResultRow label="Nezaposlenost — zaposleni (pos. 3.15)" value={r.unemp} />
        </div>

        <div style={{padding:"0 16px 16px", display:"flex", flexDirection:"column", gap:10}}>
          <button className="btn-pdf btn-pdf-full" onClick={generate} style={{background:"var(--accent)"}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            Generiši PPP-PD XML
          </button>
          {xml && (
            <div style={{display:"flex", gap:8}}>
              <button className="btn-pdf btn-pdf-full" onClick={download} style={{flex:1, background:"#00a33b"}}>
                ⬇ Preuzmi .xml fajl
              </button>
              <button className="btn-pdf btn-pdf-full" onClick={copy} style={{flex:1, background: copied ? "#00a33b" : "var(--surface2)", color: copied ? "white" : "var(--text)"}}>
                {copied ? "✓ Kopirano!" : "📋 Kopiraj XML"}
              </button>
            </div>
          )}
        </div>
      </div>

      {showXml && xml && (
        <div className="card full-width">
          <SectionTitle icon="📄">Generisani XML</SectionTitle>
          <div className="ppppd-note">
            ⚠️ Pre upload-a na portal ePorezi, proverite sve podatke. Prijava je vaša odgovornost.
          </div>
          <pre className="xml-preview">{xml}</pre>
        </div>
      )}
    </div>
  );
}

// ── CALCULATOR PAGE ───────────────────────────────────────────────────────────
function CalculatorPage() {
  const now = new Date();
  const [calcMode, setCalcMode] = useState("bruto"); // "bruto" | "neto"
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

  // In neto mode, derive basicBruto from targetNeto
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
      {/* MODE TOGGLE */}
      <div className="mode-toggle-wrap">
        <div className="mode-toggle">
          <button className={`mode-btn ${calcMode === "bruto" ? "active" : ""}`} onClick={() => setCalcMode("bruto")}>
            Unesite Bruto
          </button>
          <button className={`mode-btn ${calcMode === "neto" ? "active" : ""}`} onClick={() => setCalcMode("neto")}>
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

      {/* HERO CARDS */}
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
        {["inputs","payslip","results","rates","ppppd"].map((t) => (
          <button key={t} className={`tab ${activeTab===t?"active":""}`} onClick={() => setActiveTab(t)}>
            {{"inputs":"📝 Unos","payslip":"🧾 Platni Listić","results":"📊 Obračun","rates":"📋 Stope","ppppd":"🏛️ PPP-PD"}[t]}
          </button>
        ))}
      </div>

      {activeTab === "inputs" && (
        <div className="main-grid">
          <div className="card">
            <SectionTitle icon="💰">Osnovna zarada</SectionTitle>
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
            <SectionTitle icon="🏥">Bolovanje</SectionTitle>
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
            <SectionTitle icon="📅">Minuli rad</SectionTitle>
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
              <GaugeBar label="Prekovremeni rad" value={r.overtimePay} max={r.bruto1} color="#0057ff" />
              <GaugeBar label="Noćni rad" value={r.nightPay} max={r.bruto1} color="#7c3aed" />
              <GaugeBar label="Vikend rad" value={r.weekendPay} max={r.bruto1} color="#00b341" />
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
              <button className="btn-pdf btn-pdf-full" onClick={() => printPayslip(effectiveInputs, r, info, rates)}>
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
              <ResultRow label="Osnovica za doprinose" value={r.contribBase} sub="u granicama 45.950 – 656.425 RSD" />
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
          {/* Reset button */}
          <div className="full-width" style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4}}>
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
      )}

      {activeTab === "ppppd" && (
        <PPPPDTab inputs={effectiveInputs} r={r} info={info} setI={setI} rates={rates} />
      )}
    </>
  );
}

// ── LEGAL PAGES ───────────────────────────────────────────────────────────────
function PolitikaPrivatnosti({ onBack }) {
  return (
    <div className="legal-page">
      <button className="back-btn" onClick={onBack}>← Nazad</button>
      <h1 className="legal-title">Politika privatnosti</h1>
      <p className="legal-date">Poslednje ažuriranje: februar 2025.</p>

      <div className="legal-body">
        <h2>Ko smo mi</h2>
        <p>PlatniListić (<strong>platnilistic.rs</strong>) je besplatni online kalkulator za obračun zarada u Republici Srbiji. Usluga je namenjena zaposlenima, poslodavcima i računovođama koji žele brz i transparentan uvid u strukturu zarade.</p>

        <h2>Koje podatke prikupljamo</h2>
        <p>Prikupljamo isključivo podatke koje nam vi dobrovoljno date:</p>
        <ul>
          <li><strong>Email adresa</strong> — samo ako se prijavite na newsletter putem forme u bočnom meniju. Ova adresa se čuva u sistemu Brevo (brevo.com) i koristi se samo za slanje informacija o promenama poreskih parametara i novostima vezanim za obračun zarada.</li>
        </ul>
        <p>Podaci koje unosite u kalkulator (iznosi zarada, sati rada, bonusi) <strong>se ne čuvaju</strong> ni na kakvom serveru — obračun se vrši isključivo u vašem pregledaču i nigde se ne prenosi.</p>

        <h2>Analitika i praćenje</h2>
        <p>Koristimo <strong>Vercel Web Analytics</strong> — sistem analitike koji je dizajniran sa privatnošću kao prioritetom. Vercel Analytics:</p>
        <ul>
          <li>Ne koristi kolačiće (cookies)</li>
          <li>Ne prikuplja lične podatke</li>
          <li>Ne prati korisnike između sajtova</li>
          <li>Usklađen je sa GDPR regulativom bez potrebe za pristankom</li>
        </ul>
        <p>Prikupljamo isključivo anonimne agregatne podatke: broj poseta, posećene stranice i geografsku regiju (na nivou države).</p>

        <h2>Newsletter</h2>
        <p>Ako se prijavite na newsletter, vaša email adresa se šalje servisu Brevo (SAS, Francuska), koji je usklađen sa GDPR regulativom. Možete se odjaviti u bilo kom trenutku klikom na link u svakom emailu koji primite.</p>

        <h2>Vaša prava</h2>
        <p>Imate pravo da zatražite uvid u podatke koje smo prikupili, ispravku ili brisanje iste. Pišite nam na: <strong>kontakt@platnilistic.rs</strong></p>

        <h2>Izmene politike</h2>
        <p>Zadržavamo pravo izmene ove politike. Svaka izmena biće objavljena na ovoj stranici sa datumom poslednjeg ažuriranja.</p>
      </div>
    </div>
  );
}

function UsloviKoriscenja({ onBack }) {
  return (
    <div className="legal-page">
      <button className="back-btn" onClick={onBack}>← Nazad</button>
      <h1 className="legal-title">Uslovi korišćenja</h1>
      <p className="legal-date">Poslednje ažuriranje: februar 2025.</p>

      <div className="legal-body">
        <h2>Prihvatanje uslova</h2>
        <p>Korišćenjem sajta platnilistic.rs prihvatate ove uslove korišćenja. Ako se ne slažete sa uslovima, molimo vas da ne koristite sajt.</p>

        <h2>Svrha alata</h2>
        <p>PlatniListić je informativni alat za okvirni obračun zarada u Republici Srbiji. Alat je namenjen za brzo i pregledono razumevanje strukture zarade — nije zamena za profesionalni računovodstveni ili pravni savet.</p>

        <h2>Odricanje od odgovornosti</h2>
        <p>PlatniListić pruža <strong>isključivo informativne obračune</strong> zasnovane na važećim poreskim propisima i parametrima koji su bili dostupni u trenutku razvoja alata.</p>
        <ul>
          <li>Rezultati obračuna <strong>ne predstavljaju pravni ni poreski savet</strong>.</li>
          <li>Za zvanični i pravno obavezujući obračun zarade konsultujte ovlašćenog računovođu ili nadležni organ.</li>
          <li>Poreske stope i parametri mogu se promeniti zakonodavnim izmenama. PlatniListić ne garantuje ažurnost parametara u svakom trenutku.</li>
          <li>Korisnik snosi punu odgovornost za eventualne odluke donete na osnovu rezultata ovog kalkulatora.</li>
        </ul>

        <h2>Intelektualna svojina</h2>
        <p>Sav sadržaj na sajtu platnilistic.rs, uključujući dizajn, tekstove i kod, zaštićen je autorskim pravom. Nije dozvoljeno kopiranje, reprodukcija ni komercijalno korišćenje bez pisane saglasnosti.</p>

        <h2>Dostupnost usluge</h2>
        <p>Zadržavamo pravo da u bilo kom trenutku, bez prethodnog obaveštenja, izmenimo, privremeno ili trajno obustavimo pristup sajtu. Nismo odgovorni za eventualne štete nastale usled nedostupnosti usluge.</p>

        <h2>Merodavno pravo</h2>
        <p>Na ove uslove primenjuje se pravo Republike Srbije. Svi eventualni sporovi rešavaju se pred nadležnim sudom u Republici Srbiji.</p>

        <h2>Kontakt</h2>
        <p>Za sva pitanja vezana za uslove korišćenja: <strong>kontakt@platnilistic.rs</strong></p>
      </div>
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("calculator");
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
    .sidebar-logo { padding: 16px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
    .sidebar-logo img { width: 44px; height: 44px; flex-shrink: 0; }
    .sidebar-logo-text {}
    .sidebar-logo-name { font-size: 15px; font-weight: 800; letter-spacing: -0.5px; color: var(--text); line-height: 1.2; }
    .sidebar-logo-name span { color: var(--accent); }
    .sidebar-logo-sub { font-family: var(--mono); font-size: 9px; color: var(--text3); letter-spacing: 1px; text-transform: uppercase; margin-top: 2px; }
    .sidebar-nav { padding: 12px 10px; flex: 1; }
    .sidebar-section-label { font-size: 9px; font-weight: 700; color: var(--text3); letter-spacing: 1.5px; text-transform: uppercase; padding: 8px 8px 4px; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px; cursor: pointer; transition: all 0.12s; font-size: 13px; font-weight: 500; color: var(--text2); border: none; background: none; width: 100%; text-align: left; }
    .nav-item:hover { background: var(--surface2); color: var(--text); }
    .nav-item.active { background: var(--accent-light); color: var(--accent); font-weight: 600; }
    .nav-icon { font-size: 15px; width: 20px; text-align: center; }

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

    /* ── PPP-PD ── */
    .ppppd-note { margin: 0 16px 12px; padding: 10px 14px; background: #fff8e6; border: 1px solid #f59e0b; border-radius: 8px; font-size: 12px; color: #92400e; }
    .xml-preview { margin: 0 16px 16px; padding: 14px; background: #0f1623; color: #a8d8a8; font-family: var(--mono); font-size: 11px; border-radius: 8px; overflow-x: auto; white-space: pre; line-height: 1.6; max-height: 400px; overflow-y: auto; }
    .full-width { grid-column: 1 / -1; }

    /* ── MODE TOGGLE ── */
    .mode-toggle-wrap { margin-bottom: 20px; display: flex; flex-direction: column; gap: 12px; }
    .mode-toggle { display: flex; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 4px; width: fit-content; gap: 3px; }
    .mode-btn { padding: 8px 20px; border-radius: 7px; border: none; background: transparent; font-family: var(--sans); font-size: 13px; font-weight: 600; color: var(--text3); cursor: pointer; transition: all 0.15s; }
    .mode-btn:hover { color: var(--text2); }
    .mode-btn.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    .neto-input-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; max-width: 360px; border-top: 3px solid var(--green); }
    .neto-derived { font-size: 12px; color: var(--text2); line-height: 1.5; }

    /* ── SICK LEAVE INFO ── */
    .sick-info { background: #f0f7ff; border: 1px solid #c8dff2; border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
    .sick-info-row { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text2); }

    /* ── RESET BUTTON & RATE SUMMARY ── */
    .reset-btn { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 7px 14px; font-family: var(--sans); font-size: 12px; font-weight: 600; color: var(--text2); cursor: pointer; transition: all 0.12s; white-space: nowrap; }
    .reset-btn:hover { border-color: var(--accent); color: var(--accent); }
    .rate-summary-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0 2px; font-size: 12px; font-weight: 600; color: var(--text2); border-top: 1px dashed var(--border); margin-top: 4px; }

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
    .post-body .post-img { width: 100%; max-height: 300px; object-fit: cover; border-radius: 10px; margin: 16px 0; display: block; }
    .post-body .post-link { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; font-weight: 500; }
    .post-body .post-link:hover { color: #0047dd; }
    .post-cta { margin-top: 36px; padding: 20px 22px; background: var(--accent-light); border-radius: var(--radius); border: 1px solid #c8d8ff; }
    .post-cta p { font-size: 14px; color: var(--text2); margin-bottom: 14px; }
    .cta-btn { background: var(--accent); color: #fff; border: none; border-radius: 8px; padding: 9px 18px; font-family: var(--sans); font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
    /* ── DISCLAIMER ── */
    .disclaimer { margin-top: 24px; padding: 12px 16px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); font-size: 11px; color: var(--text3); line-height: 1.6; }

    /* ── LEGAL PAGES ── */
    .legal-page { max-width: 680px; }
    .legal-title { font-size: clamp(22px, 3vw, 28px); font-weight: 800; letter-spacing: -0.8px; margin-bottom: 6px; }
    .legal-date { font-family: var(--mono); font-size: 10px; color: var(--text3); margin-bottom: 28px; }
    .legal-body { font-size: 14px; line-height: 1.75; color: var(--text2); }
    .legal-body h2 { font-size: 16px; font-weight: 700; color: var(--text); margin: 28px 0 10px; letter-spacing: -0.3px; }
    .legal-body p { margin-bottom: 12px; }
    .legal-body ul { padding-left: 20px; margin-bottom: 14px; }
    .legal-body li { margin-bottom: 6px; }
    .legal-body strong { color: var(--text); font-weight: 600; }

    /* ── SIDEBAR FOOTER ── */
    .sidebar-footer { padding: 12px 14px; border-top: 1px solid var(--border); }
    .sidebar-footer-site { font-family: var(--mono); font-size: 9px; color: var(--text3); letter-spacing: 0.5px; margin-bottom: 8px; }
    .sidebar-footer-links { display: flex; gap: 10px; flex-wrap: wrap; }
    .sidebar-footer-link { font-size: 11px; color: var(--text3); background: none; border: none; cursor: pointer; padding: 0; font-family: var(--sans); transition: color 0.12s; text-decoration: underline; text-underline-offset: 2px; }
    .sidebar-footer-link:hover { color: var(--accent); }
    .brevo-box { padding: 14px 14px 16px; border-top: 1px solid var(--border); }
    .brevo-title { font-size: 12px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
    .brevo-sub { font-size: 11px; color: var(--text3); margin-bottom: 10px; line-height: 1.4; }
    .brevo-form { display: flex; flex-direction: column; gap: 7px; }
    .brevo-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 7px; padding: 8px 10px; font-family: var(--sans); font-size: 12px; color: var(--text); outline: none; transition: border-color 0.15s; }
    .brevo-input:focus { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(0,87,255,0.1); }
    .brevo-input::placeholder { color: var(--text3); }
    .brevo-btn { width: 100%; background: var(--accent); color: #fff; border: none; border-radius: 7px; padding: 8px; font-family: var(--sans); font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
    .brevo-btn:hover:not(:disabled) { background: #0047dd; }
    .brevo-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .brevo-success { background: var(--green-light); color: var(--green); border-radius: 7px; padding: 9px 12px; font-size: 12px; font-weight: 600; text-align: center; }
    .brevo-error { font-size: 11px; color: var(--red); text-align: center; }
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
            <img src="/logo.svg" alt="PlatniListić logo" />
            <div className="sidebar-logo-text">
              <div className="sidebar-logo-name">Platni<span>Listić</span></div>
              <div className="sidebar-logo-sub">Srbija</div>
            </div>
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
          <BrevoSignup />
          <div className="sidebar-footer">
            <div className="sidebar-footer-site">platnilistic.rs</div>
            <div className="sidebar-footer-links">
              <button className="sidebar-footer-link" onClick={() => { setPage("privatnost"); setSidebarOpen(false); }}>Privatnost</button>
              <button className="sidebar-footer-link" onClick={() => { setPage("uslovi"); setSidebarOpen(false); }}>Uslovi</button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* TOPBAR (mobile) */}
          <div className="topbar">
            <img src="/logo.svg" alt="PlatniListić" style={{width: 32, height: 32}} />
            <div className="topbar-title">Platni<span>Listić</span></div>
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          </div>

          <div className="main-inner">
            {/* CALCULATOR PAGE */}
            {page === "calculator" && (
              <>
                <div className="page-header">
                  <div style={{display:"flex", alignItems:"center", gap:14}}>
                    <img src="/logo.svg" alt="PlatniListić" style={{width: 64, height: 64}} />
                    <div>
                      <div className="page-title">Platni<span>Listić</span></div>
                      <div className="page-sub">obračun zarada · prekovremeni · praznici · bonusi · porez</div>
                    </div>
                  </div>
                </div>
                <CalculatorPage />
                <div className="disclaimer">
                  ⚠️ PlatniListić pruža informativne obračune. Rezultati ne predstavljaju pravni ni poreski savet. Za zvanični obračun konsultujte računovođu ili nadležni organ.
                </div>
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

            {/* LEGAL PAGES */}
            {page === "privatnost" && <PolitikaPrivatnosti onBack={() => setPage("calculator")} />}
            {page === "uslovi" && <UsloviKoriscenja onBack={() => setPage("calculator")} />}
          </div>
        </main>
      </div>
      <Analytics />
    </>
  );
}
