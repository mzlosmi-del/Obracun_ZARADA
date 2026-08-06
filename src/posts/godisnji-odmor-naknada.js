// Body + FAQ for "godisnji-odmor-naknada". Split out of posts.js so a reader
// downloads only the article they open — see loadPostBody() in Blog.jsx.
export const body = `
![Godišnji odmor i odmor od posla](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80)

> **Provereno i ažurirano: 6. avgust 2026.** Iznosi, stope i osnovice u ovom vodiču usklađeni su sa zvaničnim izvorima (Poreska uprava, CROSO, Fond PIO) za 2026. godinu. Poreski parametri se mogu menjati tokom godine.

Godišnji odmor je jedno od osnovnih prava zaposlenih u Srbiji, garantovano **Zakonom o radu (čl. 68–76)**. Za vreme korišćenja godišnjeg odmora, zaposleni ima pravo na naknadu zarade — ali kako se ona tačno obračunava?

**Kratak odgovor:** naknada za godišnji odmor računa se kao **prosečna zarada zaposlenog u prethodnih 12 meseci** (čl. 104 Zakona o radu) i ne može biti niža od tog proseka. Po novom zakonu, u prosek ulaze osnovna zarada, minuli rad i sva redovna uvećanja.

> 🧮 Brzo izračunajte iznos: [kalkulator godišnjeg odmora](/godisnji-odmor) — naknada za odmor i za neiskorišćene dane.

## Pravo na godišnji odmor

Svaki zaposleni koji je zasnovao radni odnos stiče pravo na godišnji odmor. Minimalni godišnji odmor iznosi **20 radnih dana** godišnje. Kolektivnim ugovorom ili ugovorom o radu može se utvrditi duži odmor.

Pravo na godišnji odmor stiče se **nakon mesec dana** neprekidnog rada kod istog poslodavca (čl. 68 Zakona o radu).

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

## Zastarelost prava

Pravo na godišnji odmor ne može se preneti u sledeću kalendarsku godinu ako nije iskorišćeno krivicom zaposlenog. Ako nije iskorišćen krivicom poslodavca, zaposleni ima pravo na naknadu štete.

## Godišnji odmor i prestanak radnog odnosa

Ako radni odnos prestaje, a zaposleni nije iskoristio godišnji odmor krivicom poslodavca, poslodavac je dužan da isplati **naknadu štete za neiskorišćene dane** (čl. 76 Zakona o radu) — u visini prosečne zarade u prethodnih 12 meseci, srazmerno broju neiskorišćenih dana. Ovo pravo važi bez obzira na to ko je i zašto dao otkaz; rokove i postupak prestanka radnog odnosa objašnjavaju vodiči [otkaz ugovora o radu](/blog/otkaz-ugovora-o-radu) i [otkazni rok](/blog/otkazni-rok) — preostali dani odmora mogu se po dogovoru iskoristiti i tokom otkaznog roka.

Za precizan obračun naknade za godišnji odmor, koristite naš [kalkulator zarade](/) i unesite broj dana godišnjeg odmora u sekciji „Vikend i praznici".

## Izvori i korisni linkovi

- [Zakon o radu — čl. 68–76 (godišnji odmor)](https://www.paragraf.rs/propisi/zakon_o_radu.html)
- [Inspekcija rada — prava zaposlenih](https://www.minrzs.gov.rs/sr/inspekcija-rada)
- [Ministarstvo za rad](https://www.minrzs.gov.rs/)
    `;

export const faq = [
  { q: "Kako se računa godišnji odmor?", a: "Naknada za godišnji odmor računa se kao prosečna bruto zarada zaposlenog u prethodnih 12 meseci, podeljena brojem radnih dana u mesecu i pomnožena brojem dana odmora. Ne može biti niža od tog proseka (čl. 104 Zakona o radu)." },
  { q: "Kako se plaća godišnji odmor po novom zakonu o radu?", a: "Po važećem Zakonu o radu, za dane godišnjeg odmora isplaćuje se naknada u visini prosečne zarade iz prethodnih 12 meseci, sa svim doprinosima (19,90% zaposleni) i porezom (10%) kao i kod redovne zarade." },
  { q: "Koliko dana godišnjeg odmora pripada zaposlenom?", a: "Zakonski minimum je 20 radnih dana godišnje. Pravo na godišnji odmor stiče se nakon mesec dana neprekidnog rada kod istog poslodavca (čl. 68 Zakona o radu), a kolektivnim ugovorom može se utvrditi i duži odmor." },
];
