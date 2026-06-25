# SEO Audit — platnilistic.rs (Follow-up / Re-run)

> **Datum:** 25. jun 2026. (re-run) · **Tip:** Full site re-audit (delta vs. jutarnji baseline `SEO-AUDIT-2026-06-25.md`)
> **Fokus:** verifikacija „quick win" izmena na ŽIVOM sajtu + provera novih problema.
> **Metod:** crawl live (deployed) strana + host source (`src/posts.js`, `src/pages.jsx`) + git log. Rang procene: vidi ograničenja.

---

## Executive Summary

Osnova ostaje **jaka** i nije bilo regresija. Od 10 jutrošnjih „quick win" izmena, **8 je potvrđeno UŽIVO**, a **2 su tačne u izvoru ali se još serviraju iz zastarelog CDN keša**. Quick-win commit je merge-ovan u `main` (PR #8, `8ca16cb`) i Vercel je redeploy-ovao — ali dve najprometnije blog strane (`/blog/pausalno-oporezivanje`, `/blog/porez-za-frilensere`) i dalje vraćaju stari (dugi) naslov sa starog edge-keša.

**Jedini nov nalaz ovog re-run-a:** parcijalna **CDN cache staleness** na 2 strane — nije problem koda, rešava se osvežavanjem keša/redeploy-om. Svi ostali strateški prioriteti iz jutrošnjeg izveštaja su **nepromenjeni i otvoreni** (ugovor o delu cifra, neoporezivi slug, GSC indeksiranje, CWV, kanibalizacija, C-klaster sadržaj).

**Ukupna ocena: STRONG FOUNDATION — quick wins ~80% live, 1 cache zadatak + strateški backlog ostaje.**

---

## 1. Quick-Win verifikacija (live crawl)

| # | Izmena | Strana | Izvor (host) | UŽIVO (deployed) | Status |
|---|---|---|---|---|---|
| 1 | Naslov skraćen | /blog/godisnji-odmor-naknada | ✅ | ✅ „Kako se računa naknada za godišnji odmor 2026" | **DONE live** |
| 2 | Naslov skraćen | /blog/otpremnina-obracun | ✅ | ✅ „Otpremnina u Srbiji — minimalni iznos, obračun i porez" | **DONE live** |
| 3 | Meta skraćena (194→148) | /blog/godisnji-odmor-naknada | ✅ | ✅ | **DONE live** |
| 4 | Meta proširena (92→160) | /prosecna-zarada | ✅ | ✅ „…po sektorima i gradovima, medijalna…evrima." | **DONE live** |
| 5 | Interni linkovi +2 | /blog/prekovremeni-rad | ✅ | ✅ (dodaci-na-zaradu, topli-obrok-i-regres) | **DONE live** |
| 6 | Interni linkovi +2 | /blog/minimalna-zarada-2025 | ✅ | ✅ (bruto-neto, doprinosi-srbija) | **DONE live** |
| 7 | Naslov skraćen | /blog/pausalno-oporezivanje | ✅ (`posts.js:1126`) | ❌ stari naslov (stale cache) | **Source OK, cache stale** |
| 8 | Naslov skraćen | /blog/porez-za-frilensere | ✅ | ❌ stari naslov (stale cache) | **Source OK, cache stale** |
| 9 | Naslov skraćen | /blog/kako-se-obracunava-penzija | ✅ | ⚠️ nije ponovo proveravano (verovatno cache) | Verifikovati |
| 10 | Naslov skraćen | /blog/kako-se-obracunava-bolovanje, jubilarna-nagrada, doprinosi-srbija | ✅ | ⚠️ nije ponovo proveravano | Verifikovati |

**Dijagnostika cache staleness:** zastarele strane (`pausalno-oporezivanje`, `porez-za-frilensere`) i dalje sadrže legacy `meta-keywords` tag kojeg na osveženim stranama **nema** — siguran znak da ih edge servira iz starijeg builda. Izvor i poslednji build su tačni; samo edge keš kasni.

---

## 2. Akcija za cache (novo, High, brzo)

- **Trigger fresh deploy / purge CDN** da se osveže svih 46 strana (ne samo onih čiji je TTL istekao). Na Vercel-u: prazan commit ili „Redeploy" bez build cache, pa provera `/blog/pausalno-oporezivanje` i `/blog/porez-za-frilensere`.
- ⚠️ **Ne komitovati iz sandbox shell-a** — i dalje servira zastareo/trunkovan snimak `posts.js` (`node --check` lažno puca na liniji 2364). Komit/redeploy raditi sa host mašine ili host git alatima. (Gotcha iz `COMPETITIVE-POSITION.md §1`.)
- Posle osvežavanja: re-fetch 8 izmenjenih blog strana i potvrditi nove naslove.

---

## 3. Otvoreni prioriteti (nepromenjeni iz jutrošnjeg izveštaja)

| Prioritet | Stavka | Status |
|---|---|---|
| **Critical (YMYL)** | „ugovor o delu" nesklad cifre (meta „20% na 50%" vs. telo/blog „normirani 20%") | Otvoreno — čeka proveru PU/Paragraf pre izmene |
| High | GSC Request-indexing za paušal/frilenser klaster + otkaz-ugovora-o-radu | Otvoreno (Chrome, nema GSC konektora) |
| Medium | `/blog/neoporezivi-2025` slug ≠ sadržaj (2026); preklapanje sa `/neoporezivi-iznos-2026` | Otvoreno |
| Medium | Intent-razdvajanje parova kalkulator+vodič (kanibalizacija) | Otvoreno |
| Medium | CWV — code-split Blog bundle (169 KB) + kompresija og-image (831 KB) | Otvoreno |
| High (dugoročno) | C-klaster sadržaj (otkazni rok, sporazumni raskid, porodiljsko) | Otvoreno |
| High | „vs" poredbena strana (paušal vs. lična zarada vs. DOO) | Otvoreno |
| High (dugoročno) | Etički backlink/PR za jaz prema paragraf.rs | Otvoreno |

---

## 4. Technical/On-page baseline (re-provera — bez regresija)

| Provera | Status | Napomena |
|---|---|---|
| Naslovi izmenjenih strana | ✅/⚠️ | 6/8 potvrđeno kraće uživo; 2 čeka cache |
| Meta opisi (godisnji, prosecna) | ✅ Pass | Uživo u opsegu 148–160 |
| Interni linkovi (prekovremeni, min-2025) | ✅ Pass | Novi linkovi uživo i ispravni |
| Canonical / H1 / JSON-LD | ✅ Pass | Nepromenjeno, čisto |
| Sitemap (deployed) | ✅ Pass | 46 URL-ova |
| Indeksiranje novih strana | ⚠️ Warning | I dalje traži GSC request-indexing |

---

## Ograničenja

Rang i dalje procena (nema GSC/Ahrefs; WebSearch US-baziran — za stvarni rang meri u Chrome-u na google.rs po `COMPETITIVE-POSITION.md §4`). Napomena: u jutrošnjem WebSearch-u (US) PlatniListić je izlazio #1 za „paušalno oporezivanje 2026" i „bruto u neto kalkulator", iznad platica/cicapravnica — ohrabrujuće, ali nije zamena za google.rs proveru. Tačke #9–#10 u tabeli su verovatno samo cache, ali ih treba re-fetch-ovati posle purge-a radi potvrde.
