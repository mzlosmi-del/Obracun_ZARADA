# PlatniListić — Konkurentska pozicija i uputstvo za agenta (repo)

> **Verzija:** 1.0 — 25. jun 2026.
> **Za koga:** Claude Code / agent koji radi u ovom repozitorijumu (`Obracun_ZARADA`, sajt platnilistic.rs).
> **Cilj (CEO):** pozicija #1 na google.rs za ciljane upite na SVIM klasterima → rast organskog saobraćaja = prihod (AdSense + lead funnel).
> Puna strategija sadržaja: `CONTENT-STRATEGY.md` (planiranje, u zasebnom planning folderu). Ovaj fajl = kako pobediti konkurenciju + kako objaviti članak u OVOM repou.

---

## 1. Kako se objavljuje članak u ovom repou (VAŽNO)

Sajt je Vite/React. **Sav sadržaj bloga živi u `src/posts.js`** kao niz objekata `POSTS`. Build (`npm run build` → `scripts/prerender.mjs`) automatski:
- prerenderuje svaku stranicu u `dist/blog/<id>/`,
- generiše `dist/sitemap.xml` iz `POSTS`,
- generiše SEO/JSON-LD (Article/FAQ/Breadcrumb) iz polja posta.

**Da objaviš novi članak:** dodaj NOV objekat na vrh niza `POSTS` (najnoviji prvi). Format:

```js
{
  id: "slug-bez-blog-prefiksa",      // URL postaje /blog/<id>
  date: "25. jun 2026",
  tag: "Zakon o radu",                // postojeći tagovi: Zarada, Biznis, Paušal, Frilenseri, Porez, Zakon o radu, Bolovanje, Penzija, Doprinosi, Ugovori, Osnove, Novosti
  title: "...",                        // 50–60 znakova, ključna reč na početak + 2026
  summary: "...",                      // 150–160 znakova, ključna reč + cifra
  ogImage: "https://www.platnilistic.rs/media/...png", // opciono
  body: `markdown… ## H2 … [interni link](/blog/postojeci-slug) … `,
  faq: [ { q: "...", a: "..." }, ... ], // 3–7 Q&A; generiše FAQPage schema
}
```

Pravila: interni linkovi `/blog/<postojeci-id>` (proveri da slug postoji u `POSTS`), kalkulator je `/`, kalkulator otpremnine `/otpremnina`. Slike: opisni alt. Posle dodavanja: `node --check src/posts.js`, pa `npm run build`, pa GSC Request indexing (vidi §5).

> ⚠️ **GOTCHA (kritično):** kada je folder tek povezan, **sandbox bash može prikazivati zastareo (stale) snimak** fajlova i lažno truncirati/menjati ih. Za izmene koristi isključivo host editor alate (Read/Write/Edit). NE piši u `src/posts.js` preko bash (`python`, `sed`, `>`), niti veruj `wc -l`/`node --check` iz bash-a dok ne potvrdiš host Read-om. Pisanje preko bash-a je već jednom truncalo `posts.js`.

---

## 2. Naša trajna prednost

**Tačnost YMYL cifara + vidljiv „Provereno i ažurirano" pečat.** Konkurencija kasni sa izmenama propisa; mi smo tačni i to dokazujemo. Svaka izmena čuva ovu prednost — nikad žrtvovati tačnost za obim. Primarni izvori: CROSO (stope doprinosa), RZS (statistika), Poreska uprava / Paragraf (rokovi, obrasci, zakon).

---

## 3. Mapa konkurencije po klasterima (svi upiti, ne samo paušal)

- **A · Zarada/zaposleni** (`bruto u neto`, `minimalna zarada 2026`, `doprinosi`, `neoporezivi`, `prekovremeni`, `bolovanje`, `penzija`): platica.rs (kalkulatori — head-terme ne gađamo direktno), paragraf.rs, zuniclaw.com, pitajknjigovodju.rs, nimi.rs, rezonsrbija.rs, lyceum.rs.
- **B · Paušal/frilenseri/registracija** (`paušalno oporezivanje`, `koliko paušalac plaća`, `paušal ili doo`, `porez za frilensere`, `PP-OPO`, `lična zarada`, `PDV`, `dividenda`): platica.rs/pausal, pausalko.rs, ufp.rs, ft1p.rs, cicapravnica.rs, knjigovodja.in.rs, državni purs/informator.
- **C · Prava iz radnog odnosa** (`otkaz ugovora o radu`, `otkazni rok`, `otpremnina`, `porodiljsko`, `ugovor o radu`, `probni rad`): advokatske strane (zuniclaw, cvetkoviclaw, advokatbeograd, cicapravnica) — **tanke, najlakše oborive** preciznim brojčanim vodičima.
- **D · Statistika** (`prosečna plata`, `prosečna penzija`, `medijalna plata`, `godišnji porez na dohodak`): cekos.rs, neobilten.com, stat.gov.rs (izvor), paragraf.rs, cvmaker.rs.

---

## 4. Nedeljni audit (procedura)

1. Meri rang **u Chrome-u na google.rs** (srpski, incognito) — NE preko WebSearch (US-baziran, netačan za .rs).
2. Rotiraj fokus na 1–2 klastera nedeljno + brza provera glavnih reči (bruto-neto, prosečna plata, paušalno oporezivanje, otkaz ugovora o radu).
3. Za svaku reč: naša pozicija + top 3 konkurencije + da li #1 odgovara intentu (kalkulator/vodič/državna strana).
4. Traži **zastarele cifre kod konkurencije** (npr. PIO 25% umesto 24%, stari neoporezivi iznos, stara satnica minimalca) — najbrža prilika za nadmašivanje.
5. Proveri indeksiranje (`site:platnilistic.rs/blog/<slug>`).

Pobeda: 🥇 top 3 · 🥈 poz. 4–10 (on-page/osvežavanje) · 🥉 11+ ili neindeksirano (veća intervencija/nov sadržaj). Cilj: ≥5 novih reči u top 3 / 90 dana; 100% objavljenog indeksirano u 7 dana.

---

## 5. Playbook korekcija (od najjeftinijeg ka najskupljem)

1. Konkurent ima zastarelu cifru, mi tačni → pojačaj pečat, eksplicitno istakni tačnu cifru, interno linkuj.
2. Naša strana plića od #1 → produbi (brojčani primeri, tabele, „People Also Ask" H2/H3, FAQ).
3. Slab title/meta → prepiši (ključna reč na početak, „2026", cifra + CTA).
4. Tanki interni linkovi/orphan → dodaj 3–5 opisnih internih linkova; iz starih srodnih članaka linkuj ka novom.
5. Format ≠ intent (Google traži kalkulator) → dodaj interaktivni element ili gađaj long-tail varijantu umesto head-terma.
6. Stranica ne postoji → dodaj u `CONTENT-STRATEGY.md` queue; ako je visok klik-potencijal, objavi sledeće.
7. Neindeksirano → GSC Request indexing (Chrome; nema GSC konektora), proveri sitemap/interne linkove.
8. Svežina → evergreen magnete (prosečna plata/penzija) osvežavaj čim RZS objavi; pomeri datum pečata.

---

## 6. Trenutni baseline (25.6.2026, google.rs)

- B `paušalno oporezivanje 2026`: ~poz. 8–9 (lider cicapravnica; platica ima zastarelo „PIO 25%").
- D `prosečna plata u Srbiji 2026`: ~poz. 6 (iznad nas sirove stat-tabele; pitajknjigovodju zastareo „~112.000"/2021).
- C `otkaz ugovora o radu`: članak **objavljen 25.6.2026** (ranije nismo bili prisutni) — traži indeksiranje.
- A `minimalna zarada 2026`: van top 20 — istraži indeks/on-page; paragraf #1 ima zastarelo „337".

Detaljan dnevnik audita: vidi planning `COMPETITIVE-POSITION.md` (§6) — nedeljni task ga dopunjuje.

---

## 7. Granice

Tačnost pre obima. Bez crnih SEO tehnika (cloaking, kupljeni linkovi, spinovan tekst). Ne sudarati se sa državnim/kalkulator head-termima koje strukturno ne možemo oboriti — gađaj objašnjavajuće i long-tail reči. Rang iz Chrome-a je činjenica; obim je procena (nemamo Ahrefs).
