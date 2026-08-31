// Body + FAQ for "otpremnina-obracun". Split out of posts.js so a reader
// downloads only the article they open — see loadPostBody() in Blog.jsx.
export const body = `
![Prestanak radnog odnosa i otpremnina](https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=800&q=80)

> **Provereno i ažurirano: 1. septembar 2026.** Iznosi, stope i osnovice u ovom vodiču usklađeni su sa zvaničnim izvorima (Poreska uprava, CROSO, Fond PIO) za 2026. godinu. Poreski parametri se mogu menjati tokom godine.

Otpremnina je jednokratna novčana naknada koju poslodavac isplaćuje zaposlenom prilikom prestanka radnog odnosa pod određenim uslovima. Regulisana je **Zakonom o radu (čl. 158–160)**.

**Kratak odgovor:** minimalna otpremnina po Zakonu o radu za tehnološki višak iznosi **1/3 prosečne mesečne zarade za svaku navršenu godinu rada** kod tog poslodavca. Otpremnina do zakonskog minimuma je oslobođena poreza i doprinosa; porez na otpremninu (10%) plaća se samo na iznos iznad zakonskog minimuma.

> 🧮 Brzo izračunajte: [kalkulator otpremnine](/otpremnina).

## Ko ima pravo na otpremninu?

Pravo na otpremninu ima zaposleni kome prestaje radni odnos:
- **Zbog tehnološkog viška** (proglašavanje za višak zaposlenih)
- **Sporazumnim raskidom** — ako je to predviđeno ugovorom ili kolektivnim ugovorom
- **Odlaskom u penziju** — starosnu ili invalidsku

**Nema pravo** na otpremninu zaposleni kome je radni odnos prestao:
- Zbog otkaza iz razloga na strani zaposlenog (disciplinski, nepoštovanje obaveza)
- Istekom ugovora o radu na određeno vreme
- Na lični zahtev (ostavka)

Kada otpremnina sleduje, a kada ne — zavisi od osnova prestanka radnog odnosa; sve razloge, rokove i postupak objašnjava vodič [otkaz ugovora o radu](/blog/otkaz-ugovora-o-radu).

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

Otpremnina do **zakonom propisanog iznosa** je oslobođena poreza na dohodak i [doprinosa za socijalno osiguranje](/blog/doprinosi-srbija). Iznos koji prelazi zakonski minimum oporezuje se kao zarada — vidi i [porez na bonus](/blog/porez-na-bonus) za sličan princip.

| Deo otpremnine | Porez | Doprinosi |
|---|---|---|
| Do zakonskog minimuma | Ne | Ne |
| Iznos iznad minimuma | 10% (porez) | 35,05% |

## Rok isplate

Otpremnina se isplaćuje **najkasnije 30 dana od dana prestanka radnog odnosa**. Kašnjenje u isplati daje zaposlenom pravo na zakonsku zateznu kamatu.

## Savet

Pre potpisivanja sporazumnog raskida, proverite da li imate pravo na otpremninu i da li je iznos u skladu sa zakonom. Preporuka je konsultovati se sa pravnikom ili sindikatom.

Pogledajte i [jubilarnu nagradu](/blog/jubilarna-nagrada) — koju neki poslodavci isplaćuju uz otpremninu pri odlasku u penziju.

## Izvori i korisni linkovi

- [Zakon o doprinosima za obavezno socijalno osiguranje (čl. 44)](https://www.paragraf.rs/propisi/zakon-o-doprinosima-za-obavezno-socijalno-osiguranje.html)
- [Zakon o radu — čl. 158–160 (otpremnina)](https://www.paragraf.rs/propisi/zakon_o_radu.html)
- [Nacionalna služba za zapošljavanje — prava pri gubitku posla](https://www.nsz.gov.rs/live/digitalAssets/10/10017_pravo_na_novcanu_naknadu.pdf)
- [Poreska uprava — porez na otpremninu](https://www.purs.gov.rs/)
- [Sindikat samostalnih sindikata Srbije](http://www.sindikat.rs/)
    `;

export const faq = [
  { q: "Kolika je minimalna otpremnina po Zakonu o radu?", a: "Za tehnološki višak minimalna otpremnina iznosi najmanje 1/3 prosečne mesečne zarade zaposlenog (prosek poslednjih 12 meseci) za svaku navršenu godinu rada kod tog poslodavca. Poslodavac može isplatiti i više kolektivnim ugovorom." },
  { q: "Da li se plaća porez na otpremninu?", a: "Otpremnina do zakonom propisanog minimuma oslobođena je poreza i doprinosa. Na iznos koji prelazi zakonski minimum plaća se porez na zaradu od 10% i pripadajući doprinosi, kao i na svaki drugi bonus." },
  { q: "Kolika je otpremnina pri odlasku u penziju?", a: "Pri odlasku u penziju zaposleni ima pravo na otpremninu od najmanje dve prosečne mesečne zarade u Republici Srbiji prema poslednjem objavljenom podatku Republičkog zavoda za statistiku." },
];
