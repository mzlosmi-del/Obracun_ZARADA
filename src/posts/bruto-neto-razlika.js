// Body for "bruto-neto-razlika". Split out of posts.js so a reader
// downloads only the article they open — see loadPostBody() in Blog.jsx.
export const body = `
![Računanje zarade na laptopu](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80)

> **Provereno i ažurirano: 16. jul 2026.** Stope, doprinosi i neoporezivi iznos usklađeni su sa zvaničnim izvorima (Poreska uprava, CROSO, Fond PIO) za 2026. godinu (neoporezivi iznos 34.221 RSD od 1.1.2026).

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
- Primenjuje se na bruto zaradu umanjenu za [neoporezivi iznos](/neoporezivi-iznos-2026) od **34.221 RSD** (od 1.1.2026; ranije 28.423 RSD)

## Neto zarada

Neto zarada = Bruto 1 − Doprinosi zaposlenog − Porez

Konkretan obračun za **100.000 RSD bruto 1** (2026): doprinosi zaposlenog 19,90% = 19.900 RSD; poreska osnovica = 100.000 − 34.221 (neoporezivi iznos) = 65.779 RSD; porez 10% = 6.578 RSD. **Neto = 100.000 − 19.900 − 6.578 ≈ 73.522 RSD** — zaposleni prima oko 73,5% ugovorenog bruto iznosa.

## Bruto 2 — trošak poslodavca

Poslodavac pored isplate zarade plaća i sopstvene doprinose (15,15%):
- PIO na teret poslodavca: 10%
- Zdravstvo na teret poslodavca: 5,15%

**Bruto 2 = Bruto 1 + Doprinosi poslodavca**

Za zaradu od 100.000 RSD bruto 1, ukupan trošak poslodavca iznosi oko **115.150 RSD** — pre dodavanja naknada za prevoz i topli obrok.

## Probajte sami

Za precizan obračun koristite naš [bruto u neto kalkulator](/bruto-neto) kada iz bruto 1 računate neto, odnosno [neto u bruto kalkulator](/neto-bruto) za obrnuti smer — iz željenog neto iznosa dobijate bruto 1 i ukupan trošak poslodavca. Možete koristiti i [glavni kalkulator zarade](/) koji radi u oba smera.

## Izvori i korisni linkovi

- [Zakon o radu Srbije — Paragraf.rs](https://www.paragraf.rs/propisi/zakon_o_radu.html)
- [Zakon o doprinosima — Paragraf.rs](https://www.paragraf.rs/propisi/zakon_o_doprinosima_za_obavezno_socijalno_osiguranje.html)
- [Republički zavod za statistiku — prosečne zarade](https://www.stat.gov.rs/sr-latn/oblasti/trziste-rada/zarade/)
    `;
