export const POSTS = [
  {
    id: "kako-se-obracunava-bolovanje",
    date: "1. maj 2026",
    tag: "Bolovanje",
    title: "Kako se obračunava bolovanje u Srbiji — naknada zarade za vreme privremene sprečenosti za rad",
    summary: "Naknada za bolovanje iznosi minimum 65% prosečne zarade za prvih 30 dana, a zatim ide na teret RFZO. Detaljno objašnjenje obračuna sa primerima.",
    body: `
![Bolovanje i naknada zarade](https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80)

Bolovanje, odnosno **naknada zarade za vreme privremene sprečenosti za rad**, regulisano je **Zakonom o zdravstvenom osiguranju** (čl. 79–95) i **Zakonom o radu** (čl. 115). Evo svega što zaposleni i poslodavci treba da znaju o obračunu.

## Ko snosi trošak bolovanja?

Pravilo je jasno i propisano je zakonom:

| Period bolovanja | Ko isplaćuje | Zakonski minimum |
|---|---|---|
| Prvih 30 dana | **Poslodavac** | 65% prosečne zarade |
| Od 31. dana | **RFZO** (Republički fond za zdravstveno osiguranje) | 65–100%, zavisi od razloga |

Za bolovanja zbog povrede na radu ili profesionalnog oboljenja, naknada iznosi **100%** od prvog dana — i to ne ide na teret poslodavca već na teret RFZO.

## Kako se obračunava naknada za prvih 30 dana?

Osnova za obračun je **prosečna zarada zaposlenog u prethodnih 12 meseci** (čl. 115 Zakona o radu).

**Formula:**

1. Saberite sve zarade zaposlenog u prethodnih 12 meseci
2. Podelite sa 12 (prosečna mesečna bruto zarada)
3. Podelite sa prosečnim brojem radnih sati u mesecu (oko 168)
4. Pomnožite sa procentom naknade (minimum 65%)
5. Pomnožite sa brojem sati bolovanja

### Primer

Zaposleni sa prosečnom bruto zaradom od **120.000 RSD** je na bolovanju 5 radnih dana (40 sati):

- Dnevna bruto osnova: 120.000 ÷ 21 = **5.714 RSD**
- Naknada (65%): 5.714 × 0,65 = **3.714 RSD/dan**
- Ukupna naknada za 5 dana: **18.571 RSD**

Naknada za bolovanje **podleže porezu i doprinosima** kao i regularna zarada.

## Kada naknada može biti veća od 65%?

Kolektivnim ugovorom ili ugovorom o radu može se utvrditi i veći procenat naknade — neki poslodavci isplaćuju **80% ili 100%** za prvih 30 dana, posebno za rukovodeće pozicije.

Naknada je **100%** u sledećim slučajevima:
- Povreda na radu ili profesionalno oboljenje
- Komplikacije u trudnoći
- Davanje krvi (do 2 dana)
- Bolovanje zbog izolacije ili karantina (zarazne bolesti)

## Šta ako bolovanje traje duže od 30 dana?

Od 31. dana bolovanja, naknadu isplaćuje RFZO direktno preko poslodavca, ali:
- Iznos i dalje obračunava poslodavac
- Poslodavac mora podneti zahtev RFZO-u sa medicinskom dokumentacijom
- RFZO refundira iznos poslodavcu nakon obrade zahteva

Visina naknade preko 30 dana određuje se na osnovu **dužine staža osiguranja** zaposlenog:
- Manje od 6 meseci staža: 65%
- 6 meseci do 5 godina: 80%
- 5–10 godina: 90%
- Preko 10 godina: 100%

## Bolovanje i osnovica za doprinose

Za vreme bolovanja, doprinosi za socijalno osiguranje se i dalje obračunavaju i uplaćuju, ali na **smanjenu osnovicu** (osnovicu naknade), ne na ugovorenu zaradu. Više o tome u članku [Doprinosi za socijalno osiguranje u Srbiji](/blog/doprinosi-srbija).

## Koliko bolovanja godišnje može uzeti zaposleni?

Zakon ne propisuje gornji limit, ali:
- Bolovanje mora biti opravdano izveštajom lekara (otvaranje doznake)
- Posle 30 dana, lekarska komisija RFZO-a procenjuje radnu sposobnost
- Posle 12 meseci neprekidnog bolovanja moguće je pokretanje invalidske komisije

## Doznaka i obaveze zaposlenog

Zaposleni je dužan da:
1. Otvori bolovanje kod izabranog lekara prvog dana sprečenosti za rad
2. Obavesti poslodavca u roku od 24 sata
3. Dostavi doznaku poslodavcu najkasnije u roku od 5 dana
4. Bude dostupan na adresi prijavljenoj u doznaki (kontrole RFZO-a)

## Kalkulator obračuna bolovanja

Naš [kalkulator zarade](/) automatski obračunava odbitak za dane bolovanja i naknadu prema unetom procentu (65–100%). Primer kalkulacije možete videti u kartici „Obračun" — bolovanje se prikazuje kao zasebna stavka.

## Korisni linkovi

- [Zakon o zdravstvenom osiguranju (Paragraf.rs)](https://www.paragraf.rs/propisi/zakon-o-zdravstvenom-osiguranju.html)
- [Zakon o radu — čl. 115 (Paragraf.rs)](https://www.paragraf.rs/propisi/zakon_o_radu.html)
- [RFZO — naknada zarade za vreme bolovanja](https://www.rfzo.rs/index.php/osiguranici-s/naknada-zarade)
- [Ministarstvo zdravlja — bolovanje](https://www.zdravlje.gov.rs/)
    `,
  },
  {
    id: "minuli-rad-obracun",
    date: "15. april 2026",
    tag: "Zakon o radu",
    title: "Minuli rad — kako se obračunava i koliko iznosi po godini staža?",
    summary: "Minuli rad je obavezno uvećanje zarade od 0,4% za svaku godinu rada kod istog poslodavca. Detaljan vodič sa primerima obračuna prema članu 108. Zakona o radu.",
    body: `
![Minuli rad i godine staža](https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80)

**Minuli rad** je zakonsko uvećanje zarade koje pripada zaposlenom za svaku godinu rada provedenu kod istog poslodavca. Regulisan je **članom 108. tačka 4. Zakona o radu** Republike Srbije.

## Koliko iznosi minuli rad?

Zakonski minimum je **0,4% od osnovne zarade po godini rada** kod istog poslodavca. Kolektivnim ugovorom ili ugovorom o radu može se utvrditi i veći procenat — neki poslodavci primenjuju 0,5% ili čak 1% po godini.

**Važno:** Minuli rad se računa samo za godine kod **trenutnog poslodavca**, ne za ukupan staž osiguranja.

## Formula za obračun

**Iznos minulog rada = Osnovna bruto zarada × Godine staža × Stopa po godini**

### Primer 1: Zaposleni sa 5 godina staža

- Osnovna bruto zarada: 100.000 RSD
- Godine staža kod poslodavca: 5
- Stopa: 0,4%
- Stopa uvećanja: 5 × 0,4% = **2%**
- Iznos minulog rada: 100.000 × 2% = **2.000 RSD**

### Primer 2: Zaposleni sa 15 godina staža

- Osnovna bruto zarada: 150.000 RSD
- Godine staža kod poslodavca: 15
- Stopa: 0,4%
- Stopa uvećanja: 15 × 0,4% = **6%**
- Iznos minulog rada: 150.000 × 6% = **9.000 RSD**

### Primer 3: 30 godina staža po višoj stopi

- Osnovna bruto zarada: 120.000 RSD
- Godine staža kod poslodavca: 30
- Stopa po kolektivnom ugovoru: 0,5%
- Stopa uvećanja: 30 × 0,5% = **15%**
- Iznos minulog rada: 120.000 × 15% = **18.000 RSD**

## Šta se računa kao staž kod poslodavca?

U staž za obračun minulog rada ulazi:
- Vreme rada na neodređeno radno vreme
- Vreme rada na određeno radno vreme (ako je radni odnos kontinuiran)
- Vreme korišćenja godišnjeg odmora i plaćenih odsustava
- Vreme bolovanja (ako se bolovanje plaća)
- Vreme porodiljskog odsustva i odsustva radi nege deteta

**Ne računa se:**
- Period kada je radni odnos bio prekinut (čak i kratko)
- Vreme neplaćenog odsustva preko 30 dana
- Period rada kod drugog poslodavca pre dolaska kod sadašnjeg

## Šta se dešava pri promeni poslodavca?

Minuli rad se **resetuje na 0** kada se promeni poslodavac, čak i ako je nova firma povezana sa starom (ćerka firma, podružnica i sl.).

**Izuzetak:** Pri **statusnoj promeni poslodavca** (spajanje, pripajanje, podela), prava zaposlenih iz radnog odnosa se prenose — uključujući i minuli rad. Ovo je regulisano članom 147. Zakona o radu.

## Da li se na minuli rad plaćaju doprinosi i porez?

Da. Minuli rad ulazi u **bruto zaradu (Bruto 1)** i podleže:
- Doprinosima za PIO (14% / 10%)
- Doprinosima za zdravstvo (5,15% / 5,15%)
- Doprinosu za nezaposlenost (0,75%)
- Porezu na zaradu (10% iznad neoporezivog iznosa)

Više o strukturi doprinosa u članku [Doprinosi za socijalno osiguranje u Srbiji](/blog/doprinosi-srbija).

## Minuli rad i osnovna zarada — šta tačno čini „osnovicu"?

Pravilo je da se minuli rad računa na **osnovnu bruto zaradu** za odrađeni mesec, ne na ukupnu zaradu. To znači da bonusi, prekovremeni rad i naknade ne ulaze u osnovicu za minuli rad — ali sam minuli rad ulazi u Bruto 1 i čini osnovicu za doprinose.

Sudska praksa je u nekim slučajevima dozvoljavala da se minuli rad računa i na uvećanu zaradu (sa prekovremenim radom), ali pravilo je da se primenjuje na osnovnu zaradu.

## Kalkulator minulog rada

U našem [kalkulatoru zarade](/) možete uneti broj godina staža kod trenutnog poslodavca i stopu po godini — minuli rad se automatski obračunava i prikazuje kao zasebna stavka u Bruto 1. Pogledajte i kako se obračunava [prekovremeni rad](/blog/prekovremeni-rad), koji se često kombinuje sa minulim radom.

## Kazne za poslodavce

Neisplata minulog rada je prekršaj prema članu 273. Zakona o radu, sa kaznama:
- Pravno lice: **800.000 do 2.000.000 RSD**
- Odgovorno lice: **50.000 do 150.000 RSD**
- Preduzetnik: **300.000 do 500.000 RSD**

Zaposleni može pokrenuti tužbu za isplatu zaostatka uz zakonsku zateznu kamatu. Rok zastarelosti je 3 godine.

## Korisni linkovi

- [Zakon o radu — čl. 108 (Paragraf.rs)](https://www.paragraf.rs/propisi/zakon_o_radu.html)
- [Inspekcija rada Srbije](https://www.minrzs.gov.rs/sr/inspekcija-rada)
- [Sindikat samostalnih sindikata Srbije — minuli rad](http://www.sindikat.rs/)
    `,
  },
  {
    id: "porez-na-bonus",
    date: "1. mart 2026",
    tag: "Porez",
    title: "Porez na bonus i nagradu zaposlenima — koliko se zaista oporezuje?",
    summary: "Bonus, godišnja nagrada, 13. plata i jubilarna nagrada — sve što treba znati o porezima i doprinosima na nestandardna primanja zaposlenih u Srbiji.",
    body: `
![Bonus i nagrada zaposlenom](https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&q=80)

Bonus i nagrade zaposlenima su odlične motivacione alatke, ali često iznenade kada zaposleni vidi da na **100.000 RSD bonusa** dobije manje od 65.000 RSD na račun. Evo zašto i kako se to računa.

## Pravni status bonusa

Sa stanovišta poreskog zakonodavstva, **svako primanje zaposlenog koje proizlazi iz radnog odnosa tretira se kao zarada**, osim ako zakon ne propiše izuzetak. To znači da bonusi, godišnje nagrade, 13. plata, premije i slična primanja:

- Ulaze u **Bruto 1** osnovicu
- Podležu doprinosima za socijalno osiguranje (35,05% ukupno)
- Podležu porezu na zaradu (10% iznad neoporezivog iznosa)

## Primer: bonus od 100.000 RSD bruto

Pretpostavimo da zaposleni dobije bonus od **100.000 RSD bruto** (uz redovnu zaradu od 100.000 RSD):

| Stavka | Iznos |
|---|---|
| Bonus (Bruto 1) | 100.000 RSD |
| PIO doprinos zaposlenog (14%) | −14.000 RSD |
| Zdravstvo zaposlenog (5,15%) | −5.150 RSD |
| Nezaposlenost (0,75%) | −750 RSD |
| Porez (10% jer je neoporezivi već iskorišćen na redovnoj plati) | −10.000 RSD |
| **Neto bonus na račun** | **70.100 RSD** |

Dodatno, poslodavac plaća **15.150 RSD** doprinosa na svoj teret, pa je ukupan trošak bonusa **115.150 RSD**.

## Koji bonusi su neoporezivi (ili poreski povoljniji)?

Zakon o porezu na dohodak građana (čl. 18) propisuje **ograničene neoporezive iznose** za određene vrste primanja:

### Jubilarna nagrada (čl. 18, tačka 9)

Neoporezivo do **prosečne mesečne zarade u Republici Srbiji** prema poslednjem objavljenom podatku — uplaćuje se za:
- 10 godina rada kod poslodavca: 1× prosečna zarada
- 20 godina: 2× prosečna zarada
- 30 godina: 3× prosečna zarada

Pogledajte detaljan vodič za [jubilarnu nagradu i obračun](/blog/jubilarna-nagrada).

### Solidarna pomoć (čl. 18, tačka 7)

Neoporeziva u slučaju:
- Smrti zaposlenog ili člana porodice
- Teške bolesti
- Elementarne nepogode

Iznos: do **dvostruke prosečne zarade** (oko 280.000 RSD u 2026).

### Pokloni za decu zaposlenih

Neoporezivo do **11.766 RSD po detetu godišnje** (za decu do 15 godina, povodom Nove godine).

### Otpremnina pri penzionisanju ili tehnološkom višku

Detaljno opisano u članku [Otpremnina u Srbiji — pravo, iznos i obračun](/blog/otpremnina-obracun).

## „Bonus na ruku" — zaobilaženje poreza?

Neki poslodavci pokušavaju da isplate bonus „na ruku" (gotovinski, bez prijave) da bi izbegli porez. **Ovo je krivično delo poreske utaje** prema Krivičnom zakoniku Republike Srbije (čl. 225).

Posledice za poslodavca:
- Naknadno plaćanje poreza i doprinosa sa zateznim kamatama
- Novčana kazna do 2.000.000 RSD
- Krivična odgovornost odgovornog lica (zatvor do 5 godina za iznose preko 1 milion RSD)

Posledice za zaposlenog:
- Nije priznato u staž osiguranja
- Smanjuje se osnovica za buduću penziju
- Nema zaštite ako poslodavac ne isplati

## „Trinaesta plata" — postoji li u Srbiji?

Pojam „trinaeste plate" nije zakonska kategorija u Srbiji. Reč je o **godišnjem bonusu** koji poslodavac može (ali ne mora) isplatiti. Tretira se isto kao bilo koji bonus — kao zarada, sa svim doprinosima i porezom.

Neki kolektivni ugovori obavezuju poslodavca na 13. platu, ali u tom slučaju ona postaje deo redovne zarade i podleže običnom oporezivanju.

## Kako optimizovati bonus zaposlenima?

Ako želite da zaposleni dobije više neto, razmotrite:

1. **Jubilarne nagrade** — neoporezive do propisanog iznosa
2. **Pokloni u prirodi** (npr. roba) — kompleksniji režim, konsultujte računovođu
3. **Privatno penzijsko osiguranje** — neoporezivo do 6.971 RSD mesečno
4. **Zdravstveno osiguranje za zaposlene** — neoporezivo do 6.971 RSD mesečno
5. **Naknade za rekreaciju** — pod određenim uslovima neoporezive do 70.000 RSD godišnje

## Obračun bonusa u kalkulatoru

U našem [kalkulatoru zarade](/) imate dve opcije za bonus:
- **Fiksni bonus** — unos konkretnog iznosa
- **Procentualni bonus** — kao procenat od osnovne zarade

Kalkulator automatski uključuje bonus u Bruto 1 i obračunava poreze i doprinose. Možete videti tačno koliko zaposleni dobija na račun. Pogledajte i [razliku između bruto i neto zarade](/blog/bruto-neto-razlika) za bolje razumevanje strukture.

## Korisni linkovi

- [Zakon o porezu na dohodak građana — čl. 18 (Paragraf.rs)](https://www.paragraf.rs/propisi/zakon_o_porezu_na_dohodak_gradjana.html)
- [Pravilnik o uslovima za neoporezive iznose](https://www.paragraf.rs/propisi/pravilnik-uslovi-neoporezivi-iznosi.html)
- [Poreska uprava — porezi na zaradu](https://www.purs.gov.rs/lat/fizicka-lica/porez-na-dohodak-gradjana/zarade.html)
- [Ministarstvo finansija Srbije](https://www.mfin.gov.rs/)
    `,
  },
  {
    id: "jubilarna-nagrada",
    date: "15. februar 2026",
    tag: "Porez",
    title: "Jubilarna nagrada u Srbiji — koliko iznosi i kako se neoporezivo isplaćuje?",
    summary: "Za 10, 20 i 30 godina rada kod istog poslodavca zaposleni ima pravo na jubilarnu nagradu. Kolika je, kako se obračunava i zašto je deo neoporeziv?",
    body: `
![Jubilarna nagrada za godine staža](https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80)

**Jubilarna nagrada** je jednokratna isplata zaposlenom povodom navršenih „okruglih" godina rada kod istog poslodavca. U Srbiji je ova vrsta nagrade poreski povlašćena — deo iznosa je **u potpunosti neoporeziv**.

## Pravni okvir

Jubilarna nagrada je regulisana na dva nivoa:

1. **Zakon o radu** — kao mogućnost (ne obaveza), regulisana kolektivnim ugovorom ili ugovorom o radu
2. **Zakon o porezu na dohodak građana, čl. 18 tačka 9** — definiše neoporezive iznose

To znači da poslodavac **nije obavezan** da isplati jubilarnu nagradu, ali ako se obaveže kolektivnim ugovorom, mora je isplatiti.

## Standardni jubileji

Najčešća praksa u Srbiji je da se jubilarna nagrada isplaćuje za:

| Jubilej | Iznos (zakonski max neoporezivo) |
|---|---|
| 10 godina rada | 1× prosečna mesečna zarada u RS |
| 20 godina rada | 2× prosečna mesečna zarada u RS |
| 30 godina rada | 2,5× prosečna mesečna zarada u RS |
| 40 godina rada | 3× prosečna mesečna zarada u RS |

**Prosečna mesečna zarada u Republici Srbiji** koja se uzima u obzir je ona koju je poslednju objavio Republički zavod za statistiku — krajem 2025. godine ova prosečna zarada iznosila je oko **140.000 RSD bruto**.

## Šta to znači u dinarima?

Za 2026. godinu, ako je zvanična prosečna zarada 140.000 RSD bruto:

- **10 godina:** do 140.000 RSD neoporezivo
- **20 godina:** do 280.000 RSD neoporezivo
- **30 godina:** do 350.000 RSD neoporezivo
- **40 godina:** do 420.000 RSD neoporezivo

Ako poslodavac isplati **veći iznos** od neoporezivog limita, razlika podleže porezu na zaradu (10%) i punim doprinosima (35,05%) — kao i bilo koji drugi bonus. Detaljan vodič za [porez na bonus](/blog/porez-na-bonus) objašnjava ovaj princip.

## Primer obračuna

**Scenario A:** Zaposleni navršio 20 godina rada, poslodavac isplaćuje 250.000 RSD.

- Limit neoporezivo (2× prosečna): 280.000 RSD
- Iznos isplate: 250.000 RSD
- **Iznos je u potpunosti neoporeziv** → zaposleni prima **250.000 RSD na račun**.

**Scenario B:** Zaposleni navršio 20 godina rada, poslodavac isplaćuje 400.000 RSD.

- Neoporezivi deo: 280.000 RSD
- Oporezivi deo: 120.000 RSD
- Doprinosi zaposlenog (19,90% × 120.000): 23.880 RSD
- Porez (10% × 120.000): 12.000 RSD
- **Neto na račun: 364.120 RSD** (umesto 400.000)

Dodatno, poslodavac plaća svoj deo doprinosa (15,15% × 120.000 = 18.180 RSD).

## Šta se računa kao staž za jubilej?

Slično kao kod minulog rada, **broji se samo staž kod istog poslodavca** — ne ukupan staž osiguranja. Više o sličnom konceptu u članku [Minuli rad — kako se obračunava](/blog/minuli-rad-obracun).

U staž ulazi:
- Vreme provedeno u radnom odnosu (određeno + neodređeno)
- Godišnji odmori, bolovanja, porodiljska odsustva
- Vreme korišćenja prava iz radnog odnosa

**Statusne promene poslodavca** (spajanje, pripajanje) prenose i staž za jubilej — zaposleni ne gubi godine.

## Kada se isplaćuje?

Standardna praksa je isplata u mesecu kada zaposleni navršava godišnjicu rada — ali poslodavac može odrediti i drugačiji termin (npr. uz prvu novogodišnju isplatu zarade, povodom dana firme...).

Rok isplate nije zakonski definisan, već zavisi od ugovora ili kolektivnog ugovora. U slučaju spora, sud uzima u obzir uobičajenu praksu kod tog poslodavca.

## Da li se jubilarna nagrada može odbiti od poreskog osnova poslodavca?

Da. Jubilarna nagrada (i neoporezivi i oporezivi deo) je **trošak poslovanja** koji se priznaje za poreski osnov u smislu zakona o porezu na dobit pravnih lica. To znači da poslodavac smanjuje poreski osnov za pun iznos isplaćene jubilarne nagrade plus pripadajuće doprinose na svoj teret.

## Kako se obračunava jubilarna nagrada u kalkulatoru?

U našem [kalkulatoru zarade](/) jubilarnu nagradu možete uneti kao **fiksni bonus**:

1. Otvorite kalkulator
2. U sekciji „Bonusi i nagrade", unesite iznos jubilarne nagrade kao Fiksni bonus
3. Kalkulator će izračunati bruto i neto sa porezima

**Napomena:** Kalkulator ne razdvaja automatski neoporezivi i oporezivi deo jubilarne nagrade — to morate uraditi ručno tako što ćete uneti samo oporezivi deo kao bonus, a neoporezivi deo evidentirati posebno (jer ne podleže porezu).

Pogledajte i kako se obračunava [otpremnina pri penzionisanju](/blog/otpremnina-obracun), koja takođe ima delove koji su neoporezivi.

## Saveti za zaposlene

1. **Pitajte HR** da li vaš poslodavac ima kolektivni ugovor sa pravom na jubilarnu nagradu
2. **Vodite evidenciju** o datumu zasnivanja radnog odnosa — često se pojavljuju neslaganja
3. Ako poslodavac odbija da isplati uz postojanje kolektivnog ugovora, **konsultujte sindikat ili pravnika**
4. Rok zastarelosti potraživanja jubilarne nagrade je **3 godine** od dana navršenog jubileja

## Korisni linkovi

- [Zakon o porezu na dohodak građana — čl. 18 (Paragraf.rs)](https://www.paragraf.rs/propisi/zakon_o_porezu_na_dohodak_gradjana.html)
- [Pravilnik o ostvarivanju neoporezivih primanja](https://www.paragraf.rs/propisi/pravilnik-uslovi-neoporezivi-iznosi.html)
- [Republički zavod za statistiku — prosečne zarade](https://www.stat.gov.rs/sr-latn/oblasti/trziste-rada/zarade/)
- [Sindikat samostalnih sindikata Srbije](http://www.sindikat.rs/)
    `,
  },
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

Od 1. februara 2026. godine, neoporezivi iznos raste na **34.221 RSD** — povećanje od više od 20%. Ovo je direktna posledica usklađivanja sa rastom minimalnih zarada i inflacijom. Pogledajte i pregled [minimalne zarade za 2026. godinu](/blog/minimalna-zarada-2026).

## Važno napomenuti

Neoporezivi iznos važi samo za zarade iz radnog odnosa. Za preduzetnike paušalce i vlasnike privrednih društava pravila su drugačija.

Za precizan obračun poreza na vašu zaradu, koristite naš [besplatni kalkulator zarade](/) — automatski primenjuje aktuelan neoporezivi iznos prema datumu obračuna.

## Korisni linkovi

- [Zakon o porezu na dohodak građana — Paragraf.rs](https://www.paragraf.rs/propisi/zakon_o_porezu_na_dohodak_gradjana.html)
- [Poreska uprava Srbije — porezi na zaradu](https://www.purs.gov.rs/lat/fizicka-lica/porez-na-dohodak-gradjana/zarade.html)
- [Ministarstvo finansija Srbije](https://www.mfin.gov.rs/)
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

- [Prekovremeni rad](/blog/prekovremeni-rad) (+26% minimum)
- Noćni rad (+26% minimum)
- Rad vikendom i praznicima (+26% minimum)
- [Minuli rad](/blog/minuli-rad-obracun) (0,4% po godini staža)
- Bonuse i nagrade

## Od bruto do neto — odbitci

Iz bruto 1 zarade se oduzimaju dve vrste obaveza:

**1. [Doprinosi na teret zaposlenog](/blog/doprinosi-srbija) (19,90%)**
- PIO — penzijsko i invalidsko osiguranje: 14%
- Zdravstveno osiguranje: 5,15%
- Osiguranje za slučaj nezaposlenosti: 0,75%

**2. Porez na dohodak (10%)**
- Primenjuje se na bruto zaradu umanjenu za [neoporezivi iznos](/blog/neoporezivi-2025) od 28.423 RSD (do 02/2026)

## Neto zarada

Neto zarada = Bruto 1 − Doprinosi zaposlenog − Porez

Za prosečnu zaradu u Srbiji (~100.000 RSD bruto), neto iznosi oko **72.000–74.000 RSD**.

## Bruto 2 — trošak poslodavca

Poslodavac pored isplate zarade plaća i sopstvene doprinose (15,15%):
- PIO na teret poslodavca: 10%
- Zdravstvo na teret poslodavca: 5,15%

**Bruto 2 = Bruto 1 + Doprinosi poslodavca**

Za zaradu od 100.000 RSD bruto 1, ukupan trošak poslodavca iznosi oko **115.150 RSD** — pre dodavanja naknada za prevoz i topli obrok.

## Probajte sami

Za precizan obračun bilo koje zarade, koristite naš [besplatni bruto-neto kalkulator](/) — možete uneti i bruto i neto iznos, kalkulator automatski radi obračun u oba smera.

## Korisni linkovi

- [Zakon o radu Srbije — Paragraf.rs](https://www.paragraf.rs/propisi/zakon_o_radu.html)
- [Zakon o doprinosima — Paragraf.rs](https://www.paragraf.rs/propisi/zakon_o_doprinosima_za_obavezno_socijalno_osiguranje.html)
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

Koristite naš [PlatniListić kalkulator](/) da proverite da li vam je prekovremeni rad ispravno obračunat. Pogledajte i kako se obračunava [minuli rad](/blog/minuli-rad-obracun) — često se kombinuje sa prekovremenim u istom obračunu.

## Korisni linkovi

- [Zakon o radu — čl. 108 (Paragraf.rs)](https://www.paragraf.rs/propisi/zakon_o_radu.html)
- [Inspekcija rada Srbije — prijava nepravilnosti](https://www.minrzs.gov.rs/sr/inspekcija-rada)
- [Sindikat samostalnih sindikata Srbije](http://www.sindikat.rs/)
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

Sledeća revizija stupila je na snagu u februaru 2026. godine — pogledajte [minimalna zarada za 2026.](/blog/minimalna-zarada-2026) za aktuelne iznose.

## Korisni linkovi

- [Uredba o minimalnoj zaradi — Paragraf.rs](https://www.paragraf.rs/propisi/uredba-o-visini-minimalne-zarade.html)
- [Republički zavod za statistiku — zarade i troškovi rada](https://www.stat.gov.rs/sr-latn/oblasti/trziste-rada/zarade/)
- [Socijalno-ekonomski savet Srbije](https://www.socijalnoekonomskisavet.rs/)
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

**Zdravstveni doprinosi** obezbeđuju pravo na zdravstvenu zaštitu, [bolovanje](/blog/kako-se-obracunava-bolovanje), naknadu za porodiljsko odsustvo i refundaciju troškova lečenja.

**Doprinos za nezaposlenost** obezbeđuje pravo na novčanu naknadu u slučaju gubitka posla.

## Plaćanje doprinosa

Poslodavac je odgovoran za obračun i uplatu svih doprinosa (i zaposlenih i svojih) zajedno sa isplatom zarade. Rok za uplatu je isti dan kada se isplaćuje zarada.

Za precizan obračun doprinosa na vašu zaradu, koristite naš [kalkulator zarade](/) — automatski primenjuje aktuelne stope i osnovice. Pogledajte i pregled [razlike između bruto 1 i bruto 2](/blog/bruto-neto-razlika) gde su doprinosi stavljeni u kontekst.

## Korisni linkovi

- [Zakon o doprinosima za obavezno socijalno osiguranje — Paragraf.rs](https://www.paragraf.rs/propisi/zakon_o_doprinosima_za_obavezno_socijalno_osiguranje.html)
- [Fond PIO Srbije — pravo na penziju](https://www.pio.rs/sr/osiguranici/pravo-na-penziju.html)
- [RFZO — prava iz zdravstvenog osiguranja](https://www.rfzo.rs/index.php/osiguranici-s/prava-iz-zo)
- [Nacionalna služba za zapošljavanje](https://www.nsz.gov.rs/)
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

Uz minimalnu zaradu, poslodavac plaća i [doprinose na teret poslodavca](/blog/doprinosi-srbija) od **15,15%**, što ukupan trošak rada podiže na oko **107.381 RSD mesečno**.

## Poređenje sa prethodnim godinama

| Godina | Minimalna bruto zarada |
|---|---|
| 2024 | 69.423 RSD |
| 2025 | 73.274 RSD |
| 2026 | 93.264 RSD |

Rast minimalne zarade u 2026. godini je značajan — oko **27% u odnosu na 2025.** godinu. Pogledajte i [minimalna zarada 2025](/blog/minimalna-zarada-2025) za poređenje.

## Ko prima minimalnu zaradu?

Prema podacima Republičkog zavoda za statistiku, oko 8-10% zaposlenih u Srbiji prima zaradu blizu minimuma. Najzastupljenije su delatnosti: tekstilna industrija, poljoprivreda, ugostiteljstvo i maloprodaja.

## Neoporezivi iznos i minimalna zarada

Od februara 2026. neoporezivi iznos je **34.221 RSD**. Budući da je minimalna bruto zarada 93.264 RSD, poreska osnovica iznosi 59.043 RSD, a porez 5.904 RSD. Više detalja u članku o [neoporezivom iznosu](/blog/neoporezivi-2025).

Koristite naš [besplatni kalkulator](/) za tačan obračun minimalne i svake druge zarade.

## Korisni linkovi

- [Vlada Srbije — uredba o minimalnoj zarade](https://www.srbija.gov.rs/)
- [Republički zavod za statistiku — zarade](https://www.stat.gov.rs/sr-latn/oblasti/trziste-rada/zarade/)
- [Socijalno-ekonomski savet Srbije](https://www.socijalnoekonomskisavet.rs/)
- [Ministarstvo finansija Srbije](https://www.mfin.gov.rs/)
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
- [Doprinosima zaposlenog](/blog/doprinosi-srbija) (19,90%)
- Porezu na dohodak (10% iznad neoporezivog iznosa)
- Doprinosima poslodavca (15,15%)

## Kada se isplaćuje naknada?

Naknada za godišnji odmor isplaćuje se **najkasnije 3 radna dana pre početka korišćenja odmora**, ukoliko zaposleni to zahteva.

## Raspored godišnjeg odmora

Poslodavac je dužan da zaposlenom dostavi rešenje o korišćenju godišnjeg odmora najmanje **15 dana unapred**. Odmor se može koristiti u celini ili u delovima — ali najmanje 10 radnih dana mora biti neprekidno.

## Godišnji odmor i bolovanje

Ako zaposleni za vreme godišnjeg odmora padne na bolovanje, odmor se prekida. Neiskorišćeni dani godišnjeg odmora mogu se koristiti naknadno. Više o [obračunu bolovanja](/blog/kako-se-obracunava-bolovanje).

## Zastarелост prava

Pravo na godišnji odmor ne može se preneti u sledeću kalendarsku godinu ako nije iskorišćeno krivicom zaposlenog. Ako nije iskorišćen krivicom poslodavca, zaposleni ima pravo na naknadu štete.

Za precizan obračun naknade za godišnji odmor, koristite naš [kalkulator zarade](/) i unesite broj dana godišnjeg odmora u sekciji „Vikend i praznici".

## Korisni linkovi

- [Zakon o radu — čl. 68–76 (godišnji odmor)](https://www.paragraf.rs/propisi/zakon_o_radu.html)
- [Inspekcija rada — prava zaposlenih](https://www.minrzs.gov.rs/sr/inspekcija-rada)
- [Ministarstvo za rad](https://www.minrzs.gov.rs/)
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

## Korisni linkovi

- [Zakon o radu — čl. 158–160 (otpremnina)](https://www.paragraf.rs/propisi/zakon_o_radu.html)
- [Nacionalna služba za zapošljavanje — prava pri gubitku posla](https://www.nsz.gov.rs/live/digitalAssets/10/10017_pravo_na_novcanu_naknadu.pdf)
- [Poreska uprava — porez na otpremninu](https://www.purs.gov.rs/)
- [Sindikat samostalnih sindikata Srbije](http://www.sindikat.rs/)
    `,
  },
];
