// Body + FAQ for "kupovna-moc-plate-2016-2026". Split out of posts.js so a reader
// downloads only the article they open — see loadPostBody() in Blog.jsx.
export const body = `
![Kupovna moć plate u Srbiji 2016–2026 — realan rast +53%, indeks kretanja](/media/kupovna-moc-2016-2026.png)

> **Objavljeno: 4. avgust 2026.** Zarade i indeks potrošačkih cena po podacima **Republičkog zavoda za statistiku (RZS)**; kurs NBS. Metodologija i sve pretpostavke objašnjene su u posebnom odeljku ispod — ovo je analiza PlatniListić-a, ne zvanična RZS publikacija.

Prosečna neto zarada u Srbiji je od 2016. do 2025. nominalno **više nego udvostručena** — sa 46.097 na 109.462 dinara. Ali dinar iz 2016. i dinar iz 2025. ne kupuju isto. Kada se taj rast očisti od inflacije, **realna kupovna moć prosečne zarade porasla je 53%** — i to neravnomerno, sa pravom pauzom baš u godini kada je inflacija dostigla 15,1%. U ovom tekstu: realan rast po godinama, zašto je medijalna zarada bolji pokazatelj "tipičnog" radnika od proseka, i šta plata doslovno kupuje danas u odnosu na 2016.

**Ukratko:** realna kupovna moć prosečne zarade porasla je **+53%** od 2016. do 2025. (prosečno **4,8% godišnje**). Rast nije bio linearan — u 2021–2022, kada je inflacija skočila na 15,1%, realna zarada je **stagnirala** uprkos nominalnom rastu. Medijalna zarada — realniji pokazatelj od proseka — takođe je realno porasla (**+55%**, 2018–2025), ali nešto sporije od proseka, što znači da se jaz između "tipičnog" i prosečnog radnika **proširio**. U fizičkim jedinicama: prosečna plata danas kupuje **82% više hleba** i zahteva **44% manje meseci zarade** za kvadrat stana u Beogradu nego 2016.

> **Napomena:** Tekst je informativnog karaktera. Sve cifre i metodologija objašnjeni su transparentno ispod — proverite izvore pre citiranja u medijima.

## Ključni nalazi

- **Realna kupovna moć prosečne zarade: +53%, 2016–2025.** Prosečno 4,8% godišnje, ali neravnomerno raspoređeno.
- **2021–2022 je "izgubljena godina" za kupovnu moć.** Inflacija od 15,1% u 2022. skoro je u potpunosti pojela nominalni rast zarade te godine — realan indeks je čak blago pao (122,1 → 120,7).
- **Medijalna zarada je 26,8% niža od prosečne** (decembar 2025), naspram 24,3% u 2018. — jaz se proširio, najviše u 2021. (28,5%), što ukazuje na rast neujednačenosti (verovatno vezano za nagli rast IT sektora, koji povlači prosek naviše bez da podiže medijanu srazmerno).
- **Medijalna zarada je takođe realno porasla — +55% (2018–2025)** — ali sporije od proseka (+60% u istom periodu).
- **Hleb:** prosečna plata je 2016. kupovala oko 1.002 vekne mesečno; danas kupuje oko 1.822 — **+82%**.
- **Stan u Beogradu:** 2016. je trebalo **4,8 meseci** prosečne zarade za kvadrat; danas **2,7 meseci** — kvadrat je, relativno prema platama, **44% "pristupačniji"**, uprkos tome što je nominalna cena po m² porasla za 48% u evrima.

## Metodologija — kako je ovo računato

Da bi analiza bila proverljiva, evo tačno šta je urađeno i koje pretpostavke su napravljene:

1. **Nominalne zarade** — RZS-ova godišnja prosečna neto zarada (prosek mesečnih vrednosti kroz kalendarsku godinu), 2016–2025.
2. **Inflacija** — RZS-ova godišnja stopa inflacije decembar/decembar, kumulativno spojena (compounding) godinu za godinom, sa 2016. kao baznom godinom (indeks 100).
3. **Realan indeks** = (nominalni indeks / indeks potrošačkih cena) × 100, za svaku godinu u odnosu na 2016.
4. **Maj 2026 (118.398 din)** je namerno **isključen iz indeksa** — to je vrednost za jedan mesec, ne godišnji prosek, i CPI podaci za celu 2026. još ne postoje. Prikazan je odvojeno kao najsvežija dostupna tačka, ne kao deo uporedivog niza.
5. **Medijalna zarada** — RZS je počeo redovno da objavljuje medijalnu zaradu tek od **2018.** (2016. i 2017. nemaju zvaničan podatak); zato medijalna analiza pokriva 2018–2025, na decembarskoj bazi (RZS objavljuje medijanu mesečno, decembar je korišćen za doslednost sa godišnjim poređenjima).
6. **Korpa dobara** — cene za 2016. i 2026. iz javno dostupnih izvora (RZS gde postoji, inače tržišni izvori — NIS/Tanjug za gorivo, RGZ/portali nekretnina za stanove). Cena mleka za 2016. je procena na osnovu retrospektive iz 2017. (nije pronađen zvaničan RZS podatak za tačno 2016.) — označeno u tabeli.
7. **Kurs EUR/RSD** za obračun cene stana u "mesecima zarade": 2016. početni kurs ~121,4 (NBS, januar 2016.); 2026. kurs 117,39 (NBS, već korišćen na sajtu za majsku zaradu).

**Šta ovo NIJE:** ovo nije zvanična RZS publikacija niti prognoza. Sve brojke su izvedene iz javnih RZS/NBS podataka uz jasno navedenu metodologiju — svako ko želi može da ponovi računicu.

## Realna kupovna moć po godinama

| Godina | Nominalna zarada (RSD) | Indeks cena (2016=100) | Realan indeks (2016=100) |
|---|---|---|---|
| 2016 | 46.097 | 100,0 | 100,0 |
| 2017 | 47.893 | 103,0 | 100,9 |
| 2018 | 49.650 | 105,1 | 102,5 |
| 2019 | 54.919 | 107,1 | 111,3 |
| 2020 | 60.073 | 108,4 | 120,2 |
| 2021 | 65.864 | 117,0 | 122,1 |
| 2022 | 74.933 | 134,7 | 120,7 |
| 2023 | 86.007 | 144,9 | 128,7 |
| 2024 | 98.143 | 151,2 | 140,9 |
| 2025 | 109.462 | 155,2 | 153,0 |
| 2026 (maj, nije uporedivo) | 118.398 | — | — |

## Zašto je 2021–2022 "izgubljena godina" za kupovnu moć

Ovo je najvažniji, i najmanje intuitivan nalaz: **nominalna zarada je i u 2022. rasla** (sa 65.864 na 74.933 dinara, +13,8%), ali je inflacija te godine dostigla **15,1%** — energetski šok i globalni talas rasta cena. Rezultat: realan indeks je **pao** sa 122,1 na 120,7. Prosečan zaposleni je te godine, uprkos vidljivom povećanju plate na papiru, mogao da kupi **manje** nego godinu ranije. Ovo objašnjava zašto se 2022–2023. u javnosti pamte kao godine kada "plata ne stiže do kraja meseca" uprkos nominalnom rastu — osećaj je bio tačan, brojke ga potvrđuju.

Oporavak je usledio brzo: realan indeks je već 2023. nastavio rast (128,7), a 2024–2025. beleže najbrži realan rast u čitavom posmatranom periodu, kako je inflacija pala na 4,3%, pa 2,7%.

## Prosek vs. medijana — zašto je razlika bitna

Prosečna zarada je osetljiva na visoke zarade na vrhu raspodele (pre svega IT sektor — pogledajte [prosečnu platu po sektorima](/blog/prosecna-plata-srbija)) — nekoliko hiljada visoko plaćenih pozicija može podići prosek a da ne promeni ono što tipičan zaposleni zarađuje. **Medijalna zarada** — vrednost tačno na sredini raspodele, gde polovina zaposlenih zarađuje više, a polovina manje — bolje odslikava iskustvo "tipičnog" radnika.

| Godina | Medijalna zarada (RSD, dec.) | Prosečna zarada (RSD, dec.) | Medijana kao % proseka |
|---|---|---|---|
| 2018 | 39.623 | 52.372 | 75,7% |
| 2019 | 44.530 | 59.772 | 74,5% |
| 2020 | 48.676 | 66.092 | 73,6% |
| 2021 | 53.349 | 74.629 | 71,5% |
| 2022 | 60.413 | 84.227 | 71,7% |
| 2023 | 69.842 | 95.093 | 73,4% |
| 2024 | 79.624 | 108.312 | 73,5% |
| 2025 | 90.819 | 124.089 | 73,2% |

Jaz između medijane i proseka **rastao je od 2018. (24,3%) do 2021. (28,5%)** — verovatno u vreme najbržeg rasta IT i visokoplaćenih sektora — a potom se delimično stabilizovao oko 26–27%. Poruka za čitaoca: kada vidite naslov "prosečna zarada je X dinara", vaša realna plata je verovatnije bliža **medijani** nego prikazanom proseku — trenutno oko 73% te cifre. I medijalna zarada je realno rasla (+55% od 2018. do 2025.), samo nešto sporije od proseka (+60% u istom periodu) — kupovna moć tipičnog radnika je dakle stvarno porasla, ali malo manje nego što prosek sugeriše.

## Šta plata kupuje danas — poređenje sa 2016.

| Stavka | 2016. | 2026. (trenutno) | Promena cene |
|---|---|---|---|
| Hleb (vekna, 500g) | 46 RSD | 65 RSD | +41% |
| Mleko (1L) | ~115 RSD (procena) | 145 RSD | +26% |
| Benzin (1L) | 123 RSD | 202 RSD | +64% |
| Dizel (1L) | 124 RSD | 226 RSD | +82% |
| Stan, Beograd (€/m²) | 1.814 € | 2.691 € | +48% |

Kada se ove cene stave naspram rasta prosečne zarade (nominalno +157% od 2016. do maja 2026.), dobija se realna slika kupovne moći u fizičkim jedinicama, ne samo dinarima:

- **Hleb:** prosečna plata je 2016. kupovala ~1.002 vekne mesečno; danas ~1.822 — **+82% više hleba**, jer je cena hleba rasla mnogo sporije od plate.
- **Gorivo:** ~375 litara benzina mesečno 2016. → ~586 litara danas (**+56%**); kod dizela ~372 → ~524 litara (**+41%**) — plata "ide dalje" i pored poskupljenja goriva.
- **Stan u Beogradu:** 2016. je za kvadratni metar trebalo **4,8 meseci** prosečne zarade (u evrima); danas **2,7 meseci** — iako je cena kvadrata u evrima porasla 48%, plata je u istom periodu porasla još brže, pa je kvadrat, relativno gledano, **postao pristupačniji**, ne skuplji.

Ovo je namerno kontraintuitivan nalaz — nominalne cene su svuda vidljivo porasle, ali pošto je plata rasla još brže, kupovna moć u fizičkim jedinicama je porasla u sve tri kategorije.

## Ograničenja analize

- **Prosek i medijana su nacionalni** — ne pokazuju regionalne razlike (Beograd vs. jug Srbije) ni sektorske razlike, koje su značajne (pogledajte [prosečnu platu po gradovima i sektorima](/blog/prosecna-plata-srbija)).
- **Cena mleka za 2016.** je procena iz medijske retrospektive, ne zvaničan RZS podatak — tretirajte tu jednu stavku sa dozom opreza.
- **Cena goriva za 2016.** korišćena je kao najniža zabeležena vrednost te godine (februar 2016.), ne godišnji prosek — stvarni prosek 2016. je verovatno bio nešto viši, što bi blago smanjilo izračunati rast kupovne moći za gorivo.
- **Realan indeks za 2026.** nije izračunat jer godina još nije završena i CPI podaci za celu godinu ne postoje — maj 2026. je prikazan samo kao referentna nominalna tačka.

## Izvori

- [RZS — Zarade](https://www.stat.gov.rs/sr-latn/oblasti/trziste-rada/zarade)
- [RZS — Indeksi potrošačkih cena (arhiva, Paragraf)](https://www.paragraf.rs/statistika/arhiva-indeksi_potrosackih_cena_u_republici_srbiji.html)
- [PIO — Prosečne godišnje zarade od 1970. godine (RZS podaci)](https://www.pio.rs/images/dokumenta/statistike/2019/GODISNJE%20ZARADE%20OD%201970.G-2018%20lat.pdf)
- [N1 Info — Međugodišnja inflacija na kraju 2024. godine 4,3 odsto](https://n1info.rs/biznis/medjugodisnja-inflacija-na-kraju-2024-godine-43-odsto/)
- [N1 Info — Inflacija u 2025: međugodišnja 2,7 odsto](https://n1info.rs/biznis/inflacija-u-2025-medjugodisnja-27-odsto-prosecna-godisnja-38-odsto/)
- [CEKOS — Medijalna zarada po godinama](https://www.cekos.rs/medijalna-zarada-u-2025-godini)
- [Gradnja.rs — Istorijska analiza cene kvadrata u Beogradu](https://www.gradnja.rs/prosecna-cena-kvadrata-beograd-istorija/)
- [GlobalPetrolPrices — Serbia gasoline/diesel prices](https://www.globalpetrolprices.com/Serbia/gasoline_prices/)
    `;

export const faq = [
  { q: "Koliko je porasla kupovna moć plate u Srbiji od 2016. do 2025?", a: "Realno (očišćeno od inflacije) 53%, odnosno prosečno 4,8% godišnje. Nominalno je prosečna zarada porasla 137,5% (sa 46.097 na 109.462 dinara), ali deo tog rasta je pojela inflacija — realan rast je 53%." },
  { q: "Zašto se kaže da je 2022. bila 'izgubljena godina' za kupovnu moć?", a: "Jer je inflacija te godine dostigla 15,1%, dok je nominalna zarada porasla 13,8% — realna kupovna moć je zato blago pala (indeks 122,1 → 120,7) uprkos vidljivom rastu plate na papiru." },
  { q: "Da li je bolje gledati prosečnu ili medijalnu zaradu?", a: "Medijalna zarada bolje pokazuje šta zarađuje 'tipičan' zaposleni, jer prosek podižu visoke zarade manjine (najviše IT sektor). Medijalna zarada je krajem 2025. iznosila 73,2% prosečne — dakle tipičan zaposleni zarađuje znatno manje od često citiranog proseka." },
  { q: "Da li je jaz između prosečne i medijalne zarade veći nego ranije?", a: "Da — medijana je 2018. bila 75,7% proseka, a krajem 2025. 73,2%. Jaz je najviše porastao do 2021. (medijana 71,5% proseka), pa se delimično stabilizovao." },
  { q: "Da li je stan u Beogradu postao skuplji ili pristupačniji u odnosu na platu?", a: "U odnosu na platu, pristupačniji — iako je cena kvadrata u evrima porasla 48% (2016–2026), prosečna zarada je u istom periodu porasla još brže, pa je za kvadratni metar 2016. trebalo 4,8 meseci prosečne zarade, a danas 2,7 meseci." },
];
