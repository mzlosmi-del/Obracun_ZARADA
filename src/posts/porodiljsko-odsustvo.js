// Body + FAQ for "porodiljsko-odsustvo". Split out of posts.js so a reader
// downloads only the article they open — see loadPostBody() in Blog.jsx.

// Tražnja za ovom stranom je vezana za isplatni ciklus (spajk oko 18–21. svakog
// meseca, vidi rank audite) i upiti nose ime meseca ("isplata porodiljskog za
// avgust 2026"). Zato strana sama imenuje tekući mesec — isti obrazac kao
// /radni-dani-2026 i /minimalna-zarada. Peče se u prerenderu pri svakom deploy-u,
// a u browseru se računa uživo.
const MESECI = ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"];
const MESECI_LOK = ["januaru", "februaru", "martu", "aprilu", "maju", "junu", "julu", "avgustu", "septembru", "oktobru", "novembru", "decembru"];
// Genitiv — obavezan posle rednog broja: „do 8. avgusta", ne „do 8. avgust".
const MESECI_GEN = ["januara", "februara", "marta", "aprila", "maja", "juna", "jula", "avgusta", "septembra", "oktobra", "novembra", "decembra"];
const _danas = new Date();
const MESEC = MESECI[_danas.getMonth()];
const MESEC_LOK = MESECI_LOK[_danas.getMonth()];
const MESEC_GEN = MESECI_GEN[_danas.getMonth()];
const GODINA = _danas.getFullYear();

export const body = `
![Porodiljsko odsustvo 2026 — naknada zarade, obračun i isplata](https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&fm=webp&q=70)

> **Provereno i ažurirano: 27. avgust 2026.** Pravila su usklađena sa važećim **Zakonom o finansijskoj podršci porodici sa decom** (čl. 12–20, sa izmenama iz novembra 2024) i **Zakonom o radu** (čl. 94–100). Iznosi vezani za prosečnu zaradu računati su prema poslednjem podatku RZS-a (jun 2026: 166.123 RSD bruto / 120.401 RSD neto), a minimalna zarada prema ceni radnog časa od 371 RSD za 2026.

Porodiljsko odsustvo je pravo zaposlene žene (a u posebnim slučajevima i oca) na plaćeno odsustvo povodom rođenja deteta. Naknadu ne isplaćuje poslodavac, već država — direktno na račun porodilje, **po pravilu oko 20. u mesecu**. U ovom vodiču je tačan obračun naknade po pravilima koja važe u 2026, sa primerima u dinarima, minimumom i maksimumom, i posebnim delom za preduzetnice i paušalke.

**Isplata u ${MESEC_LOK} ${GODINA}:** zakon ne propisuje kalendarski datum isplate. Ciklus je vezan za rokove iz čl. 16 Zakona o finansijskoj podršci porodici sa decom — korisnica promene prijavljuje **do 8.**, nadležni organ ih evidentira **do 15.** — a centralizovana isplata sledi kada Poreska uprava prihvati poresku prijavu koju podnosi ministarstvo (čl. 14 st. 5 i 7). Zato novac po pravilu stiže **oko 20.**, ali tačan dan varira iz meseca u mesec i ne objavljuje se unapred. Ceo ciklus je razložen u nastavku.

**Ukratko:** naknada zarade = zbir osnovica na koje su plaćeni doprinosi u **18 meseci** pre odsustva ÷ 18. Mesečna osnovica ne može biti veća od **5 prosečnih zarada** (≈ 830.615 RSD bruto za prava koja počinju sredinom 2026). Tokom **prva 3 meseca** (porodiljsko odsustvo) pun mesečni iznos ne može biti manji od **minimalne zarade**; tokom nege deteta (od 4. do 12. meseca) taj minimum ne važi.

> **Napomena:** Tekst je informativnog karaktera i ne zamenjuje pravni savet. Pri izmeni propisa tekst se hitno usklađuje.

## Kada je isplata porodiljskog — datum i mesečni ciklus

Ovo je pitanje koje se najčešće pretražuje svakog meseca, a odgovor je precizniji nego što se obično navodi: **zakon ne propisuje kalendarski datum isplate.** Ne postoji odredba tipa „isplata se vrši 20. u mesecu" — postoji ciklus rokova iz kojeg taj datum praktično proizlazi.

### Kako ciklus teče

| Rok | Šta se dešava | Osnov |
|---|---|---|
| do 8. u mesecu | korisnica prijavljuje nadležnom organu sve promene koje utiču na pravo | čl. 16 st. 2 |
| do 15. u mesecu | nadležni organ evidentira sve nastale promene | čl. 16 st. 3 |
| posle evidentiranja | ministarstvo podnosi poresku prijavu za naknadu | čl. 14 st. 5 |
| po prihvatanju prijave | centralizovana isplata na tekući račun korisnice | čl. 14 st. 5 i 7 |

Zato novac **po pravilu stiže oko 20. u mesecu** — ali tačan dan zavisi od toga kada Poreska uprava prihvati prijavu, pomera se za nekoliko dana iz meseca u mesec i **ne objavljuje se unapred**. Ministarstvo ne vodi javni kalendar isplata, pa svaka strana koja tvrdi da zna tačan datum unapred to pretpostavlja.

### Isplata za ${MESEC} ${GODINA}

U ${MESEC_LOK} ${GODINA} važi isti ciklus: promene prijavljene do 8. ${MESEC_GEN} i evidentirane do 15. ${MESEC_GEN} ulaze u obračun tekuće isplate, koja se očekuje **oko 20. ${MESEC_GEN}**. Ako do 25. ${MESEC_GEN} nema uplate, prvo proverite kod nadležnog organa lokalne samouprave da li je zahtev ili neka prijavljena promena zaostala u obradi — kašnjenje je najčešće tamo, ne u ministarstvu.

### Ko isplaćuje i šta ne sme da se odbije

Naknadu obračunava nadležni organ lokalne samouprave na osnovu podataka iz CROSO evidencije, a isplatu vrši ministarstvo nadležno za finansijsku podršku porodici sa decom — **direktno na tekući račun korisnice**, iz budžeta RS. Poslodavac ne isplaćuje ništa i nema pravo da od naknade odbija rate kredita ili administrativne zabrane — te obaveze korisnica izmiruje sama.

Mesečni iznos se obračunava **srazmerno broju radnih dana** u kojima se pravo koristi u datom mesecu, pa prvi i poslednji mesec odsustva po pravilu nisu puni iznosi.

## Ključne činjenice (2026)

- **Trajanje:** ukupno **365 dana** za prvo i drugo dete (porodiljsko odsustvo + nega deteta); **2 godine** za treće i svako naredno dete.
- **Početak:** najranije 45, a najkasnije 28 dana pre termina porođaja.
- **Obračun:** prosek osnovica doprinosa za poslednjih **18 meseci** pre prvog meseca odsustva.
- **Maksimum:** mesečna osnovica najviše **5 prosečnih zarada u RS** (RZS podatak na dan početka prava).
- **Minimum:** tokom porodiljskog odsustva (prva 3 meseca) najmanje **minimalna zarada** obračunata na 184 sata.
- **Isplata:** ministarstvo nadležno za brigu o porodici, direktno na tekući račun korisnice, po pravilu oko 20. u mesecu (bez zakonom fiksiranog datuma).

## Porodiljsko odsustvo, nega deteta i trudničko bolovanje — tri različite stvari

Ova tri prava se u praksi zovu jednim imenom „porodiljsko", ali imaju različita pravila i različit obračun:

| Pravo | Kada traje | Ko isplaćuje | Obračun |
|---|---|---|---|
| Trudničko bolovanje | tokom trudnoće, do porođaja | poslodavac (od 31. dana refundira RFZO) | 100% proseka zarade za 12 meseci |
| Porodiljsko odsustvo | od 28–45 dana pre termina do 3 meseca posle porođaja | država (budžet RS) | prosek osnovica za 18 meseci |
| Nega deteta | od isteka porodiljskog do 365. dana | država (budžet RS) | ista osnovica kao porodiljsko |

Trudničko bolovanje otvara izabrani ginekolog i ono je klasična privremena sprečenost za rad — obračunava se po pravilima [bolovanja](/blog/kako-se-obracunava-bolovanje), ali sa naknadom od 100%. Porodiljsko odsustvo i nega deteta koriste se u kontinuitetu i za njih važi obračun iz ovog teksta.

## Kako se računa naknada za porodiljsko odsustvo

Osnovica naknade utvrđuje se ovako (čl. 13 Zakona o finansijskoj podršci porodici sa decom):

1. Saberu se **mesečne osnovice na koje su plaćeni doprinosi** na primanja koja imaju karakter zarade (osnovna zarada, topli obrok, regres, bonusi, prekovremeni...) za poslednjih **18 meseci** pre prvog meseca porodiljskog odsustva.
2. Zbir se **podeli sa 18** — bez obzira na to koliko je meseci stvarno rađeno.
3. Dobijena mesečna osnovica je **bruto** vrednost — na nju se obračunavaju porez i doprinosi kao na zaradu, a na račun se isplaćuje neto iznos.

Posle odluke Ustavnog suda (IUz-60/2021) i izmena zakona, u zbir ulaze i osnovice iz meseci provedenih na trudničkom bolovanju — računa se svih 18 meseci pre početka porodiljskog odsustva, a ne pre trudničkog.

### Primer 1: radila svih 18 meseci

Zaposlena sa bruto 1 zaradom od 100.000 RSD u svih 18 meseci: zbir osnovica = 1.800.000 RSD, mesečna osnovica = **100.000 RSD bruto**. Neto koji stiže na račun ≈ **73.522 RSD** — isto kao neto zarada, što možete proveriti u [bruto u neto kalkulatoru](/bruto-neto).

### Primer 2: radila 9 od 18 meseci

Zaposlena je radila 9 meseci sa bruto zaradom 100.000 RSD, a 9 meseci nije imala prihode: zbir = 900.000 RSD, mesečna osnovica = 900.000 ÷ 18 = **50.000 RSD bruto** (neto ≈ 38.472 RSD). **Ali:** tokom prva 3 meseca (porodiljsko odsustvo) primeniće se zakonski minimum — pun mesečni iznos ne može biti manji od minimalne zarade, pa naknada u tom periodu iznosi ≈ **68.264 RSD neto**. Od 4. meseca (nega deteta) minimum ne važi i naknada pada na obračunatih ≈ 38.472 RSD neto.

Ovo je detalj koji mnogi vodiči preskaču: **zakonski minimalac važi samo za vreme porodiljskog odsustva** (čl. 14 st. 8 — „za vreme porodiljskog odsustva"), a ne i za vreme odsustva radi nege deteta.

## Minimalna i maksimalna naknada u 2026

- **Minimum (prva 3 meseca):** minimalna cena rada na dan početka prava × 184 sata, uvećano za poreze i doprinose. Za 2026: 371 RSD × 184 = **68.264 RSD neto** (≈ 92.499 RSD bruto). Više o minimalcu: [minimalna zarada 2026](/minimalna-zarada).
- **Maksimum:** mesečna osnovica ne može biti veća od **5 prosečnih mesečnih zarada** u RS prema poslednjem objavljenom RZS podatku na dan početka prava. Sa prosekom za jun 2026 (166.123 RSD bruto) to je **830.615 RSD bruto** mesečne osnovice. Do 2022. limit je bio 3 prosečne zarade — podatak „tri prosečne" koji se još sreće po tekstovima je zastareo.

## Preduzetnice, paušalke i frilenserke — „ostale naknade"

Žene koje nisu u radnom odnosu, a ostvarivale su prihode, imaju posebno pravo — **ostale naknade po osnovu rođenja i nege deteta** (čl. 17–19). Pravo ostvaruju preduzetnice (uključujući [paušalke](/pausal)), nosilje porodičnog poljoprivrednog gazdinstva, poljoprivredne osiguranice, kao i žene koje su radile po ugovoru o delu, autorskom ugovoru ili ugovoru o privremenim i povremenim poslovima — pa i nezaposlene koje su u prethodnih 18 meseci imale takve prihode.

Obračun se razlikuje od obračuna za zaposlene:

1. Saberu se osnovice na koje su plaćeni doprinosi u **18 meseci pre rođenja deteta** (za paušalku: paušalna osnovica iz rešenja Poreske uprave).
2. Zbir se podeli sa **18** (maksimum je i ovde 5 prosečnih zarada).
3. Dobijena osnovica se podeli **koeficijentom 1,5** — to je pun mesečni iznos.

**Primer:** paušalka sa paušalnom osnovicom od 50.000 RSD u svih 18 meseci: 50.000 ÷ 1,5 = **33.333 RSD mesečno**. Naknada se isplaćuje **bez poreza i doprinosa** (staž za penziju u tom periodu ne teče po ovom osnovu) — godinu dana za prvo i drugo dete, dve godine za treće i naredno. Koliko paušalka mesečno plaća državi dok radi, računa [paušal kalkulator](/pausal), a poresku sliku frilensera objašnjava [vodič o porezu za frilensere](/blog/porez-za-frilensere).

## Prava kod poslodavca za vreme porodiljskog

- **Zabrana otkaza:** poslodavac ne može otkazati ugovor za vreme trudnoće, porodiljskog odsustva, nege i posebne nege deteta ([otkaz ugovora o radu](/blog/otkaz-ugovora-o-radu) dat u tom periodu je ništav).
- **Ugovor na određeno** se produžava do isteka korišćenja prava na odsustvo.
- **Godišnji odmor** za tu kalendarsku godinu može se iskoristiti do 30. juna naredne godine ([naknada za godišnji odmor](/blog/godisnji-odmor-naknada)).
- **Povratak na posao:** zaposlena ima pravo da se vrati na svoje ili odgovarajuće radno mesto, a porodiljsko može prekinuti ranije samo na sopstveni zahtev.

## Kako se podnosi zahtev

Zahtev za naknadu zarade podnosi se **nadležnom organu jedinice lokalne samouprave** (gradska/opštinska uprava — u Beogradu Sekretarijat za socijalnu zaštitu) ili elektronski preko eUprave, do isteka trajanja prava. Uz zahtev ide: doznaka ginekologa o otvaranju porodiljskog, rešenje poslodavca o korišćenju odsustva, izvod iz matične knjige rođenih za svu decu, očitana lična karta i prva strana kartice tekućeg računa. Roditeljski dodatak (od novembra 2024: 500.000 RSD jednokratno za prvo dete) je odvojeno pravo i podnosi se poseban zahtev.

## Izvori

- [Zakon o finansijskoj podršci porodici sa decom](https://www.paragraf.rs/propisi/zakon-o-finansijskoj-podrsci-porodici-sa-decom.html) — čl. 12–20 (naknada zarade, ostale naknade, minimum i maksimum), čl. 14 st. 5 i 7 (ko podnosi poresku prijavu i vrši centralizovanu isplatu), čl. 16 st. 2 i 3 (rokovi 8. i 15. u mesecu)
- Zakon o radu, čl. 94–100 (porodiljsko odsustvo i odsustvo radi nege deteta)
- RZS — prosečna zarada, jun 2026 (objavljeno 25. avgusta 2026); [pregled prosečnih zarada](/prosecna-zarada)
`;

export const faq = [
  { q: "Koliko traje porodiljsko odsustvo u 2026?", a: "Ukupno 365 dana za prvo i drugo dete — porodiljsko odsustvo (od 28–45 dana pre termina do 3 meseca posle porođaja) plus odsustvo radi nege deteta do godinu dana. Za treće i svako naredno dete ukupno traje 2 godine." },
  { q: "Kako se računa naknada za porodiljsko odsustvo?", a: "Saberu se osnovice na koje su plaćeni doprinosi za poslednjih 18 meseci pre odsustva i podele sa 18 — i kada je rađeno kraće od 18 meseci. Dobijena mesečna osnovica je bruto iznos; na račun stiže neto, kao kod zarade." },
  { q: "Kolika je maksimalna naknada za porodiljsko u 2026?", a: "Mesečna osnovica ne može biti veća od 5 prosečnih zarada u Srbiji prema poslednjem RZS podatku na dan početka prava — sa prosekom za jun 2026 (166.123 RSD bruto) to je 830.615 RSD bruto. Limit od 3 prosečne zarade ne važi od 2022." },
  { q: "Kolika je minimalna naknada za porodiljsko?", a: "Tokom porodiljskog odsustva (prva 3 meseca) pun mesečni iznos ne može biti manji od minimalne zarade obračunate na 184 sata — za 2026. oko 68.264 RSD neto. Tokom odsustva radi nege deteta (od 4. meseca) taj minimum ne važi." },
  { q: "Ko isplaćuje porodiljsko i kada?", a: "Ministarstvo nadležno za finansijsku podršku porodici sa decom, iz budžeta RS, direktno na tekući račun korisnice — po pravilu oko 20. u mesecu. Poslodavac ne isplaćuje naknadu za porodiljsko odsustvo." },
  { q: `Kada je isplata porodiljskog za ${MESEC} ${GODINA}?`, a: `Zakon ne propisuje tačan datum. Promene prijavljene do 8. ${MESEC_GEN} i evidentirane do 15. ${MESEC_GEN} (čl. 16) ulaze u obračun, posle čega ministarstvo podnosi poresku prijavu, pa se isplata očekuje oko 20. ${MESEC_GEN} ${GODINA}. Tačan dan varira iz meseca u mesec i ne objavljuje se unapred.` },
  { q: "Zašto porodiljsko kasni ovog meseca?", a: "Najčešći razlog nije ministarstvo nego obrada kod nadležnog organa lokalne samouprave — nepotpun zahtev ili promena prijavljena posle 8. u mesecu ne uđe u tekući ciklus i prenosi se u sledeći. Isplata sledi tek kada Poreska uprava prihvati poresku prijavu, pa se datum pomera za nekoliko dana." },
  { q: "Da li otac može da koristi porodiljsko odsustvo?", a: "Odsustvo radi nege deteta (posle prva 3 meseca) roditelji mogu koristiti po dogovoru. Samo porodiljsko odsustvo otac koristi izuzetno — ako majka nije živa, napustila je dete ili je objektivno sprečena da brine o njemu." },
  { q: "Šta dobijaju preduzetnice i paušalke?", a: "Ostale naknade po osnovu rođenja i nege deteta: zbir osnovica doprinosa za 18 meseci pre rođenja podeli se sa 18, pa sa koeficijentom 1,5. Isplaćuje se bez poreza i doprinosa, godinu dana za prvo i drugo dete, dve godine za treće i naredno." },
];
