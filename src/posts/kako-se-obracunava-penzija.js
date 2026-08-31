// Body + FAQ for "kako-se-obracunava-penzija". Split out of posts.js so a reader
// downloads only the article they open — see loadPostBody() in Blog.jsx.

// Tražnja za penzijom ima dva sloja: trajni (kako se obračunava) i mesečni
// (kada stiže novac). Drugi sloj je dokazano najprofitabilniji obrazac koji
// sajt ima — vidi AUDIT-2026-08-24-spike i /blog/porodiljsko-odsustvo, gde su
// upiti sa imenom meseca imali NULA prikaza nedelju pre intervencije, a posle
// nje CTR 13–24%. Zato strana sama imenuje mesec. Peče se u prerenderu pri
// svakom deploy-u, a u browseru se računa uživo → sajt mora da se deployuje
// bar jednom mesečno, u prvih nekoliko dana.
const MESECI = ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"];
// Genitiv — obavezan posle rednog broja: „2. septembra", ne „2. septembar".
const MESECI_GEN = ["januara", "februara", "marta", "aprila", "maja", "juna", "jula", "avgusta", "septembra", "oktobra", "novembra", "decembra"];
// Lokativ — obavezan posle predloga „u": „u avgustu", ne „u avgusta". Genitiv
// iznad važi samo posle rednog broja („2. avgusta") i posle „tokom".
const MESECI_LOK = ["januaru", "februaru", "martu", "aprilu", "maju", "junu", "julu", "avgustu", "septembru", "oktobru", "novembru", "decembru"];
const _danas = new Date();
const _m = _danas.getMonth();
const GODINA = _danas.getFullYear();
// Penzija za mesec M isplaćuje se tokom meseca M+1. U svakom trenutku teku dva
// ciklusa, pa strana imenuje oba: isplata za PROŠLI mesec (traje sada) i
// isplata za TEKUĆI mesec (sledećeg meseca). Bez toga bi strana bila tačna
// samo prvih deset dana u mesecu.
const _prev = (_m + 11) % 12;
const _next = (_m + 1) % 12;
const ZA_MESEC = MESECI[_prev];
const ZA_MESEC_GOD = _m === 0 ? GODINA - 1 : GODINA;
const U_MESECU_GEN = MESECI_GEN[_m];
const U_MESECU_LOK = MESECI_LOK[_m];
const SLED_ZA_MESEC = MESECI[_m];
const SLED_U_MESECU_GEN = MESECI_GEN[_next];
const SLED_U_MESECU_LOK = MESECI_LOK[_next];
const SLED_GODINA = _m === 11 ? GODINA + 1 : GODINA;

export const body = `
![Kako se obračunava penzija u Srbiji](https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800&q=80)

> **Provereno i ažurirano: 28. avgust 2026.** Vrednost opšteg boda (1.674,67 RSD) i zakonski najniži iznosi penzija provereni su prema podacima Republičkog fonda za PIO nakon usklađivanja od 12,2% u decembru 2025. Ranija verzija ovog vodiča navodila je procenjenu vrednost opšteg boda od ~1.620 RSD — svi primeri obračuna su preračunati. Iznosi se menjaju svakim usklađivanjem, pa ih pre obračuna proverite na sajtu Fonda PIO.

Pitanje **„kako se obračunava penzija u Srbiji"** najčešće je pitanje koje Fond PIO dobija od budućih penzionera. Sistem deluje komplikovano jer se sastoji iz više elemenata — **ličnog koeficijenta**, **penzijskog staža**, **ličnih bodova** i **vrednosti opšteg boda**. U ovom vodiču objašnjavamo formulu korak po korak, sa konkretnim primerima obračuna prema **Zakonu o penzijskom i invalidskom osiguranju** (ZPIO).

**Isplata penzija za ${ZA_MESEC} ${ZA_MESEC_GOD}** počinje **2. ${U_MESECU_GEN}** za korisnike iz samostalnih delatnosti, a bivši zaposleni — najbrojnija kategorija — novac dobijaju **oko 9–10. ${U_MESECU_GEN}**. Zakon ne propisuje kalendarski datum isplate; raspored objavljuje Fond PIO svakog meseca. Ceo kalendar po kategorijama je odmah ispod, a formula za obračun iznosa u nastavku teksta.

## Isplata penzija za ${ZA_MESEC} ${ZA_MESEC_GOD} — datumi po kategorijama

Penzija se u Srbiji isplaćuje **unazad**: penzija za jedan mesec stiže tokom **narednog** meseca. Zato se u ${U_MESECU_LOK} ${GODINA}. isplaćuje penzija **za ${ZA_MESEC} ${ZA_MESEC_GOD}**, a penzija za ${SLED_ZA_MESEC} stiže tek u ${SLED_U_MESECU_LOK} ${SLED_GODINA}.

**Ono što se retko negde kaže: zakon ne propisuje datum isplate.** U Zakonu o penzijskom i invalidskom osiguranju ne postoji odredba tipa „penzija se isplaćuje 10. u mesecu" — čl. 84 uređuje od kada se pravo ostvaruje, čl. 80 usklađivanje, ali kalendarski dan isplate nigde nije određen. Raspored utvrđuje i objavljuje **Fond PIO za svaki mesec posebno**, pa se dan može pomeriti za dan-dva, najčešće zbog vikenda i praznika.

### Uobičajeni raspored po kategorijama

| Kategorija | Na tekuće račune | Na kućne adrese i šalterima pošta |
|---|---|---|
| Samostalne delatnosti | oko **2.** u narednom mesecu | isti dan |
| Poljoprivrednici | oko **4–5.** | oko **6–7.** |
| Vojni penzioneri | oko **4–5.** | oko **6–7.** |
| **Zaposleni (najbrojnija kategorija)** | oko **9–10.** | isti dan |
| Korisnici iz bivših republika SFRJ | oko **10.** | — |

Raspored je isti iz meseca u mesec, što se vidi na dva proverena ciklusa: penzija za **jun 2026** isplaćena je 2. jula (samostalne delatnosti), 4. i 6. jula (poljoprivrednici i vojni) i 10. jula (zaposleni); penzija za **avgust 2026** po objavi Fonda PIO ide 2. septembra, 5. i 7. septembra i 9. septembra, uz korisnike iz bivših republika SFRJ 10. septembra.

### Zašto su datumi različiti po kategorijama

Kategorije se ne isplaćuju istog dana zato što su to **odvojeni isplatni tokovi** sa različitim izvorima sredstava i različitim brojem korisnika. Samostalne delatnosti su najmanja grupa i idu prve; bivši zaposleni su daleko najbrojniji i idu poslednji. Datum nije rangiranje po važnosti nego posledica obrade.

### Šta ako penzija ne stigne na vreme

Isplata „počinje" navedenog dana — kod dostave na kućnu adresu preko pošte novac može stići i dan-dva kasnije, što nije kašnjenje nego rok isporuke. Ako novac ne stigne ni nekoliko dana posle objavljenog datuma, proverava se u **filijali Fonda PIO** prema mestu prebivališta, a kod isplate na račun i u banci — najčešći razlog je promena računa koja nije prijavljena Fondu.

## Pravni okvir

Penzijski sistem u Srbiji regulisan je **Zakonom o penzijskom i invalidskom osiguranju** (Sl. glasnik RS, br. 34/2003 sa izmenama do 2025). Sprovođenje je u nadležnosti **Republičkog fonda za penzijsko i invalidsko osiguranje** (Fond PIO).

Srbija primenjuje **bodovni sistem (point system)** uveden 2003. godine — penzija više nije direktno procenat prosečne zarade, već se računa preko ličnih bodova akumuliranih tokom staža.

## Vrste penzija u Srbiji

| Vrsta penzije | Osnovni uslov | Napomena |
|---|---|---|
| **Starosna penzija** | 65 g. starosti + 15 g. staža | Žene: 64 g. (do 2032. raste na 65) |
| **Starosna — pun staž** | 45 g. staža osiguranja | Bez obzira na godine starosti |
| **Prevremena starosna** | 60 g. + 40 g. staža (M) / 59 g. 8 m. + 39 g. 8 m. staža (Ž) | Trajno umanjenje 0,34% po mesecu ranijeg odlaska |
| **Invalidska penzija** | Potpuni gubitak radne sposobnosti | Procena Komisije Fonda PIO |
| **Porodična penzija** | Smrt osiguranika/penzionera | Bračnom drugu, deci, roditeljima |

## Formula za obračun starosne penzije

Osnovna formula glasi:

**Penzija = Lični bodovi × Vrednost opšteg boda**

Da bismo došli do mesečnog iznosa, potrebno je izračunati dve veličine:

### 1. Lični bodovi (LB)

**Lični bodovi = Lični koeficijent × Penzijski staž (u godinama)**

### 2. Lični koeficijent (LK)

Lični koeficijent je **prosek odnosa** vaše godišnje zarade prema prosečnoj godišnjoj zaradi u Republici Srbiji, za sve godine staža.

**Formula:** za svaku godinu staža izračunajte:

**Godišnji koeficijent = Vaša godišnja bruto zarada ÷ Prosečna godišnja bruto zarada u RS**

Lični koeficijent je **aritmetička sredina** svih godišnjih koeficijenata tokom staža osiguranja.

> **Primer:** Ako ste tokom karijere uvek primali tačno prosečnu zaradu u Srbiji, vaš lični koeficijent je 1,0. Ako ste primali duplu prosečnu zaradu, LK je 2,0. Ako ste primali pola prosečne, LK je 0,5.

### 3. Vrednost opšteg boda (VOB)

Vrednost opšteg boda utvrđuje Vlada Srbije i usklađuje se dva puta godišnje (švajcarska formula — kombinacija inflacije i rasta zarada).

| Usklađivanje | Vrednost opšteg boda |
|---|---|
| +14,8% | 1.345,88 RSD |
| +10,9% | 1.492,58 RSD |
| **+12,2% — od decembra 2025.** | **1.674,67 RSD** |

**Aktuelna vrednost opšteg boda je 1.674,67 RSD** i primenjuje se od usklađivanja u decembru 2025. Tokom 2026. nije bilo novog usklađivanja, pa ista vrednost važi i za obračune u 2026. godini.

**Izvor:** Republički fond za PIO — „Проценти усклађивања пензија и вредност општег бода од 1. 4. 2003. године". Vrednost opšteg boda utvrđuje se usklađivanjem (švajcarska formula — kombinacija inflacije i rasta zarada); pre obračuna je uvek proverite na sajtu Fonda PIO jer se menja bez najave u tekstu ovog vodiča.

## Primer obračuna: prosečan zaposleni

**Scenario:** Marko ide u penziju u 2026. godini sa **40 godina staža** i prosečnim ličnim koeficijentom **1,0** (tokom karijere primao je prosečnu zaradu u RS).

1. Lični bodovi: 1,0 × 40 = **40 LB**
2. Vrednost opšteg boda: 1.674,67 RSD
3. **Penzija = 40 × 1.674,67 = 66.986,80 RSD mesečno (bruto)**

## Primer obračuna: zaposleni sa višom zaradom

**Scenario:** Jelena ide u penziju sa **35 godina staža** i ličnim koeficijentom **1,8** (tokom karijere primala je 80% više od prosečne zarade).

1. Lični bodovi: 1,8 × 35 = **63 LB**
2. Vrednost opšteg boda: 1.674,67 RSD
3. **Penzija = 63 × 1.674,67 = 105.504,21 RSD mesečno (bruto)**

## Primer obračuna: zaposleni sa nižom zaradom

**Scenario:** Dušan ide u penziju sa **30 godina staža** i ličnim koeficijentom **0,7** (tokom karijere primao je 70% prosečne zarade).

1. Lični bodovi: 0,7 × 30 = **21 LB**
2. Vrednost opšteg boda: 1.674,67 RSD
3. Računska penzija: 21 × 1.674,67 = **35.168,07 RSD**

Iznos je iznad **najniže starosne penzije** (31.092 RSD od decembra 2025), pa Dušan prima svoju računsku penziju — zaštitni minimum se ne primenjuje. Da je imao kraći staž ili niži lični koeficijent, penzija bi bila podignuta na propisani minimum; više o tome niže.

## Najniža i najviša penzija u Srbiji

**Najniža starosna penzija** ne može biti niža od **27% prosečne zarade bez poreza i doprinosa u prethodnoj kalendarskoj godini**. Posle usklađivanja od 12,2% u decembru 2025. zakonski najniži iznosi su:

- Zaposleni i lica iz samostalnih delatnosti: **31.092 RSD**
- Poljoprivrednici: **24.443 RSD**

Isti zaštitni minimum primenjuje se i na starosnu i na potpunu invalidsku penziju. Porodična penzija se ne određuje po zasebnom minimumu, već kao procenat penzije preminulog osiguranika — zavisno od broja članova porodice (detaljnije niže). Iznosi po kategorijama objavljeni su u dokumentu Fonda PIO „Законски износи пензија и накнада за све категорије".

**Najviša osnovica** za obračun doprinosa je 5 prosečnih zarada — što ograničava i maksimalnu penziju (oko 5 ličnih koeficijenata po godini). U praksi, najviše penzije u Srbiji su oko **150.000–180.000 RSD** mesečno.

## Prevremena starosna penzija — koliko košta raniji odlazak?

Ako ispunjavate uslove za **prevremenu starosnu penziju** (60 godina + 40 godina staža za muškarce, 59 g. 8 m. + 39 g. 8 m. za žene u 2026), penzija se **trajno umanjuje za 0,34% za svaki mesec ranijeg odlaska** u odnosu na uslove za punu starosnu penziju, sa maksimalnim umanjenjem od **20,4%** (60 meseci).

**Primer:** Petar (60 godina, 40 godina staža) ide u prevremenu penziju 5 godina pre uslova za starosnu (65 g.). Njegovi lični bodovi mu daju računsku penziju od **80.000 RSD**.

- Umanjenje: 60 meseci × 0,34% = **20,4%**
- Konačna penzija: 80.000 × 0,796 = **63.680 RSD**
- Razlika: 16.320 RSD mesečno — **doživotno**

Umanjenje se **ne ukida** kad osiguranik napuni 65 godina — ostaje trajno.

## Postupni rast starosne granice za žene

Zakon je propisao postupno izjednačavanje starosne granice za žene sa muškarcima — sa 60 godina (uslov pre 2014) na 65 godina (do 2032. godine):

| Godina | Min. starosna granica za žene |
|---|---|
| 2024 | 63 g. 6 m. |
| 2025 | 63 g. 8 m. |
| 2026 | 64 g. |
| 2030 | 64 g. 8 m. |
| 2032 | 65 g. |

## Penzijski staž — šta se računa?

**Staž osiguranja** je vreme za koje su uplaćivani [doprinosi za PIO](/blog/doprinosi-srbija). U staž ulazi:

- Vreme u radnom odnosu (određeno + neodređeno)
- Vreme rada kao preduzetnik (paušalac ili lično plaćanje doprinosa)
- Vreme primanja [bolovanja](/blog/kako-se-obracunava-bolovanje), porodiljskog odsustva, nege deteta
- Vreme primanja novčane naknade za nezaposlenost
- Vojni rok (do 2011. — obavezno; nakon toga samo ako su uplaćivani doprinosi)
- Specijalni staž: rad na težim poslovima sa beneficijama (12 meseci se može računati kao 14, 15 ili 16 meseci)

**Ne ulazi** u staž:
- Neplaćeno odsustvo bez uplaćivanja doprinosa
- Rad „na crno" bez uplate doprinosa
- Studije (osim do 2003. po starom zakonu)

## Beneficirani staž — staž sa uvećanim trajanjem

Određene profesije imaju **uvećani staž** zbog otežanih uslova rada. Faktori uvećanja:

| Stepen otežanja | Stvarnih 12 meseci računa se kao |
|---|---|
| I stepen | 14 meseci |
| II stepen | 15 meseci |
| III stepen | 16 meseci |
| IV stepen | 18 meseci |

Primeri: rudari (III–IV), policajci, vatrogasci (I–II), zaposleni u rendgen kabinetima (III–IV), piloti, baletani.

Uz beneficirani staž, snižava se i starosna granica za odlazak u penziju.

## Invalidska penzija — uslovi i obračun

Pravo na invalidsku penziju ima osiguranik kod kojeg je nastao **potpuni gubitak radne sposobnosti** zbog povrede na radu, profesionalne bolesti ili bolesti i povrede van rada.

**Uslov staža:**
- Mlađi od 30 godina: pune **1/3** radnog veka u stažu
- Stariji: srazmerno

**Formula** je ista kao za starosnu — lični bodovi × VOB. Razlika je što se kod invalidnosti dodaje i **računski (paušalni) staž** do navršenja 65. godine života:

**Računski staž = (65 − trenutne godine) × 2/3**

Ovo je naročito povoljno za mlađe osiguranike koji bi inače imali vrlo malo bodova.

## Porodična penzija — pravo članova porodice

Posle smrti osiguranika ili penzionera, pravo na porodičnu penziju imaju:

- **Bračni drug** (uslovi: 53 g. za udovicu, 58 g. za udovca u 2026, ili nesposoban za rad)
- **Deca** do 15 g. (do 26 g. ako studiraju, doživotno ako su nesposobna za rad)
- **Roditelji** koje je osiguranik izdržavao

Iznos porodične penzije zavisi od broja članova:

| Broj članova porodice | Procenat od penzije osiguranika |
|---|---|
| 1 | 70% |
| 2 | 80% |
| 3 | 90% |
| 4 i više | 100% |

## Lični koeficijent kroz vreme — kako se računa?

Za svaku godinu staža Fond PIO uzima vašu **godišnju bruto zaradu** i deli je sa **prosečnom godišnjom bruto zaradom** u Srbiji za tu godinu.

**Primer izračuna ličnog koeficijenta:**

| Godina | Vaša bruto zarada (RSD) | Prosečna bruto u RS (RSD) | Godišnji koeficijent |
|---|---|---|---|
| 2022 | 1.440.000 | 1.200.000 | 1,20 |
| 2023 | 1.680.000 | 1.320.000 | 1,27 |
| 2024 | 1.860.000 | 1.440.000 | 1,29 |
| 2025 | 2.040.000 | 1.560.000 | 1,31 |

Prosek koeficijenata: (1,20 + 1,27 + 1,29 + 1,31) / 4 = **1,27**

Ovo je **lični koeficijent** za primer od 4 godine. U stvarnosti se uzimaju sve godine staža.

## Zašto je važno prijavljivanje na punu bruto zaradu?

Mnogi poslodavci nude „zaradu na ruku" — deo na bruto, deo neoporezivo. Ovo direktno **smanjuje vašu budućnost penziju**, jer se penzija računa **isključivo na osnovu zarada na koje su uplaćivani doprinosi**.

Razlika u praksi:

- Prijavljena zarada 70.000 RSD bruto + 50.000 „na ruku" → LK ~0,5 → manje penzije
- Prijavljena zarada 120.000 RSD bruto → LK ~1,0 → značajno veće penzije

Više o problemu „zarade na ruku" pročitajte u članku [Porez na bonus i nagradu zaposlenima](/blog/porez-na-bonus).

## Otpremnina pri odlasku u penziju

Ako odlazite u penziju iz radnog odnosa, imate pravo na **otpremninu od najmanje 2 prosečne zarade u Republici Srbiji**. Otpremnina do tog iznosa je **neoporeziva**. Detaljnije: [Otpremnina u Srbiji — pravo, iznos i obračun](/blog/otpremnina-obracun).

Neki poslodavci uz penziju isplaćuju i [jubilarnu nagradu](/blog/jubilarna-nagrada) za navršenih 30 ili 40 godina rada — takođe pod povoljnim poreskim režimom.

## Poreski tretman penzije

Penzija **nije zarada** i ne podleže porezu na zaradu (10%). Međutim:

- **Penzioneri sa penzijom iznad zakonskog praga** plaćaju **dodatni porez** od 10% na deo preko praga (godišnji porez na ukupan prihod građana)
- Doprinosi za zdravstveno osiguranje (5,15%) se zadržavaju iz penzije

## Kako proveriti svoj očekivani iznos penzije?

Fond PIO omogućava da svaki osiguranik dobije **uvid u svoj staž i očekivanu penziju**:

1. **eUprava** — sa elektronskim sertifikatom prijavite se na portal Fonda PIO
2. **Šalter filijale** — predajete zahtev za uvid u radne podatke (M4)
3. **Telefonski centar Fonda PIO**: 0700/017-017

Preporučljivo je proveriti svoj staž **svakih 5 godina** — greške u prijavi (poslodavac ne uplati doprinose, nedostaju radne godine) lakše se ispravljaju ranije.

## Penzijski stub II i III — dobrovoljno osiguranje

Pored obaveznog (I stub), u Srbiji postoji i **dobrovoljno penzijsko osiguranje** kroz penzijske fondove (III stub). Doprinosi do **6.971 RSD mesečno** su neoporezivi. Ovo je dobra dopuna za one koji žele veću penziju od državne.

II stub (obavezno privatno) — još uvek **nije uveden** u Srbiji, za razliku od Hrvatske ili Mađarske.

## Praktičan kalkulator — od bruto zarade do penzije

Iako naš [kalkulator zarade](/) ne računa direktno penziju (jer to zavisi od staža kroz decenije), možete ga koristiti da:

1. Vidite tačno **koliko doprinosa za PIO** se uplaćuje iz vaše zarade (14% na teret zaposlenog + 10% na teret poslodavca)
2. Razumete [razliku između bruto i neto](/) — penzija se računa iz **bruto** zarade
3. Optimizujete strukturu zarade za što veće lične bodove

## Izvori i korisni linkovi

- [Zakon o penzijskom i invalidskom osiguranju (Paragraf.rs)](https://www.paragraf.rs/propisi/zakon_o_penzijskom_i_invalidskom_osiguranju.html)
- [Fond PIO Srbije — pravo na penziju i izračun](https://www.pio.rs/sr/osiguranici/pravo-na-penziju.html)
- [Fond PIO — vrednost opšteg boda i usklađivanje](https://www.pio.rs/)
- [Republički zavod za statistiku — prosečne zarade](https://www.stat.gov.rs/sr-latn/oblasti/trziste-rada/zarade/)
- [eUprava — usluge Fonda PIO](https://euprava.gov.rs/)
- [Ministarstvo za rad, zapošljavanje, boračka i socijalna pitanja](https://www.minrzs.gov.rs/)
    `;

// FAQ živi SAMO ovde, nikad i u telu teksta — Blog.jsx renderuje sopstvenu
// „Često postavljana pitanja" sekciju iz ovog niza, a seo.jsx od njega pravi
// FAQPage JSON-LD. Do 31.8.2026. ova strana nije imala `faq` export, pa je
// treća strana sajta po saobraćaju bila bez FAQPage šeme.
export const faq = [
  { q: `Kada je isplata penzija za ${ZA_MESEC} ${ZA_MESEC_GOD}?`, a: `Penzija za ${ZA_MESEC} isplaćuje se tokom ${U_MESECU_GEN} ${GODINA}. Korisnici iz samostalnih delatnosti dobijaju novac oko 2. ${U_MESECU_GEN}, poljoprivrednici i vojni penzioneri oko 4–5. na račune i 6–7. na kućne adrese, a bivši zaposleni — najbrojnija kategorija — oko 9–10. ${U_MESECU_GEN}. Tačan raspored Fond PIO objavljuje svakog meseca posebno.` },
  { q: "Da li zakon propisuje datum isplate penzije?", a: "Ne. Zakon o penzijskom i invalidskom osiguranju ne sadrži odredbu o kalendarskom danu isplate — čl. 84 uređuje od kada se pravo ostvaruje, čl. 80 usklađivanje. Raspored isplate utvrđuje i objavljuje Fond PIO za svaki mesec posebno, pa se dan može pomeriti zbog vikenda i praznika." },
  { q: "Za koji mesec je penzija koja stiže ovog meseca?", a: `Penzija se isplaćuje unazad — novac koji stiže u ${U_MESECU_LOK} je penzija za ${ZA_MESEC}. Penzija za ${SLED_ZA_MESEC} stiže tokom ${SLED_U_MESECU_GEN} ${SLED_GODINA}.` },
  { q: "Zašto penzioneri ne dobijaju penziju istog dana?", a: "Zato što su kategorije odvojeni isplatni tokovi sa različitim izvorima sredstava i različitim brojem korisnika. Samostalne delatnosti su najmanja grupa i idu prve, bivši zaposleni su najbrojniji i idu poslednji. Redosled nije rangiranje nego posledica obrade." },
  { q: "Šta da radim ako penzija ne stigne na objavljeni datum?", a: "Isplata tog dana počinje, a kod dostave na kućnu adresu preko pošte novac može stići dan-dva kasnije — to je rok isporuke, ne kašnjenje. Ako ni posle nekoliko dana nema uplate, proverite u filijali Fonda PIO prema mestu prebivališta, a kod isplate na račun i u banci. Najčešći razlog je promena tekućeg računa koja nije prijavljena Fondu." },
  { q: "Da li se penzija isplaćuje doživotno?", a: "Da. Starosna i invalidska penzija isplaćuju se doživotno. Porodična penzija isplaćuje se dok traju zakonski uslovi (godine deteta, status roditelja)." },
  { q: "Mogu li raditi posle penzionisanja?", a: "Da. Penzioner može da radi po ugovoru o radu, ugovoru o delu ili kao preduzetnik, i penzija se ne obustavlja zbog rada — zarada i penzija se primaju paralelno. Ako se ponovo zasnuje staž preko 12 meseci, može se zahtevati ponovni obračun penzije." },
  { q: "Kako se podnosi zahtev za penziju?", a: "Zahtev se podnosi u filijali Fonda PIO prema mestu prebivališta, uz ličnu kartu i izvod iz matične knjige rođenih, radne knjižice odnosno M4 obrasce ili potvrde o uplaćenim doprinosima, izvod iz matične knjige venčanih za bračnog druga i potvrdu o prestanku radnog odnosa. Postupak traje 30–60 dana, a penzija se isplaćuje retroaktivno od dana stečenih uslova." },
  { q: "Šta ako sam radio i u inostranstvu?", a: "Srbija ima bilateralne sporazume o socijalnom osiguranju sa preko 30 zemalja (Nemačka, Austrija, Švajcarska, BiH, Hrvatska, Severna Makedonija, Italija i druge). Staž iz tih zemalja sabira se sa srpskim za ispunjavanje uslova, a svaka zemlja isplaćuje srazmeran deo penzije." },
  { q: "Mogu li da kupim nedostajući staž?", a: "Da. Postoji dobrovoljna uplata doprinosa za staž osiguranja — doprinosi se mogu uplatiti unazad za period kada niste bili osigurani, do 5 godina unazad i uz propisane uslove." },
];
