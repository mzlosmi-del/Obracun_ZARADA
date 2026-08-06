// Body for "kako-se-obracunava-bolovanje". Split out of posts.js so a reader
// downloads only the article they open — see loadPostBody() in Blog.jsx.
export const body = `
![Bolovanje i naknada zarade](https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80)

> **Provereno i ažurirano: 6. avgust 2026.** Iznosi, stope i osnovice u ovom vodiču usklađeni su sa zvaničnim izvorima (Poreska uprava, CROSO, Fond PIO) za 2026. godinu. Poreski parametri se mogu menjati tokom godine.

Bolovanje, odnosno **naknada zarade za vreme privremene sprečenosti za rad**, regulisano je **Zakonom o zdravstvenom osiguranju** (čl. 79–95) i **Zakonom o radu** (čl. 115). Evo svega što zaposleni i poslodavci treba da znaju o obračunu.

> 🧮 Brzo izračunajte naknadu: [kalkulator bolovanja](/bolovanje).

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

## Kalkulator obračuna bolovanja do 30 dana (sa PDF-om)

Naš [kalkulator zarade](/) automatski obračunava odbitak za dane bolovanja i naknadu za **bolovanje do 30 dana** prema unetom procentu (65–100%). Primer kalkulacije možete videti u kartici „Obračun" — bolovanje se prikazuje kao zasebna stavka, a ceo obračun možete preuzeti kao **PDF platni listić**.

## Izvori i korisni linkovi

- [Zakon o doprinosima za obavezno socijalno osiguranje (čl. 44)](https://www.paragraf.rs/propisi/zakon-o-doprinosima-za-obavezno-socijalno-osiguranje.html)
- [Zakon o zdravstvenom osiguranju (Paragraf.rs)](https://www.paragraf.rs/propisi/zakon-o-zdravstvenom-osiguranju.html)
- [Zakon o radu — čl. 115 (Paragraf.rs)](https://www.paragraf.rs/propisi/zakon_o_radu.html)
- [RFZO — naknada zarade za vreme bolovanja](https://www.rfzo.rs/index.php/osiguranici-s/naknada-zarade)
- [Ministarstvo zdravlja — bolovanje](https://www.zdravlje.gov.rs/)
    `;
