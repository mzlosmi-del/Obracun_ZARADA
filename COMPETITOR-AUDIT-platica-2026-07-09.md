# SEO poređenje: PlatniListić vs Platica — kalkulator head-termovi

> **Datum:** 9. jul 2026 · **Upiti:** "bruto u neto kalkulator", "paušal kalkulator"
> **Metod:** live fetch obe strane oba sajta + google.rs SERP (audit od jutros) + CROSO provera cifara.
> **Kontekst:** naše strane ažurirane 8. jula — izmene još NISU recrawl-ovane (vidi §4).

## Executive summary

Platica trenutno pobeđuje na oba upita (#4 i #6 vs mi van top 10), ali iz **različitih razloga po upitu**. Na "bruto u neto kalkulator" gubimo zbog **samokanibalizacije** — naša početna i /bruto-neto ciljaju istu frazu i dele signale, dok platica koncentriše autoritet na jednu stranu. Na "paušal kalkulator" gubimo na **dubini sadržaja** — njihova /pausal je 3–4× duži vodič. Naša prednost je **tačnost**: platica koristi zastarelu PIO stopu (25,5%) na paušal strani. Uz fixeve ispod, realno je da ih prestignemo na "paušal kalkulator" u 4–8 nedelja; "bruto u neto" zahteva arhitektonsku odluku + backlink jaz je veći.

## 1. Head-to-head: "bruto u neto kalkulator"

| Dimenzija | PlatniListić /bruto-neto | Platica (rangira homepage; ima i /bruto-neto) | Pobednik |
|---|---|---|---|
| Title | "Bruto u neto kalkulator 2026 — Srbija" — tačan match | Homepage: brend; /bruto-neto: "Bruto neto kalkulator 2026 — iz bruto u neto zaradu" | ≈ izjednačeno |
| H1 | "Bruto u neto kalkulator za Srbiju (2026)" | "Bruto neto kalkulator 2026" | mi (tačnija fraza) |
| Alat (funkcionalnost) | Pun obračun: prekovremeni, noćni, minuli rad, bolovanje, odbici, PDF + PPP-PD XML | Jednostavan unos → rezultat + statična razrada 100k primera | **mi** (veliki jaz) |
| Prateći sadržaj | Kratak "kako se računa" + 3 FAQ + 4 interna linka | Razrada obračuna po stavkama, povezani kalkulatori | ≈ |
| Schema | WebApplication + FAQPage + Breadcrumb (sprint 8. jul) | Nije uočena strukturirana prednost | mi |
| Svežina (vidljivo) | **"Ažurirano: jun 2026" — NIJE bump-ovano posle jučerašnje izmene** | "Ažurirano: maj 2026" | ⚠️ niko |
| Arhitektura signala | **Kanibalizacija:** naša početna (title/H1 "Kalkulator zarade 2026 — bruto u neto…" + bruto-neto tabela + FAQ) takmiči se sa /bruto-neto za istu frazu | Homepage = brend "kalkulator zarade"; fraza čisto mapirana | **platica** (ključni faktor) |
| Domen/backlink signali | Mlad domen, malo linkova | Stariji fokusiran kalkulator-sajt, agencijski footer link (Desymphony), rangira #4 | **platica** |

**Presuda:** dok god dve naše strane ciljaju istu frazu, Google bira slabije i rangiramo ispod top 10. Platica pobeđuje na ovom upitu do naše arhitektonske odluke (dole).

## 2. Head-to-head: "paušal kalkulator"

| Dimenzija | PlatniListić /pausal | Platica /pausal | Pobednik |
|---|---|---|---|
| Title | "Paušal kalkulator 2026 — porez i doprinosi" — tačan match fraze na početku | "Kalkulator paušala 2026 — porez i doprinosi za paušalce" — invertovana fraza | **mi** |
| Dubina sadržaja | ~350 reči: stope tabela, 3-reda primer, 3 FAQ | ~1.200+ reči: šta je paušal, ko može, kako se utvrđuje osnovica, **IT šifre 6201/6202 (nacionalna osnovica)**, ograničenje rasta 10%, pravo žalbe, paušalac vs zaposleni, link na zvanični informator kalkulator | **platica** (ključni faktor) |
| Tačnost cifara (YMYL) | Porez 10% + PIO **24%** + zdravstvo 10,3% = 44,3% (naš standard, CROSO konvencija) | Porez 10% + PIO **25,5%** + zdravstvo 10,3% + nezaposlenost 0,75% = **46,55%** — PIO 25,5% je stopa iz ~2020, zastarela | **mi** ⚠️ uz proveru dole |
| ⚠️ Provera za NAS | Ne uključujemo **nezaposlenost 0,75%** za paušalce — platica i zvanični izvori je uključuju. Pre napada na njihovu cifru, verifikovati na PU/informator da li paušalac plaća 0,75% (verovatno DA → naša efektivna stopa bi bila 45,05%) | | |
| FAQ schema | Da (3 pitanja) | Nije uočena | mi |
| Interni linkovi ka strani | Blog klaster B rangira #2 na tri upita i linkuje na /pausal | Homepage nav | **mi** (neiskorišćeno — proveriti da li SVI B-klaster postovi linkuju na /pausal) |
| Svežina | "Ažurirano: jun 2026" — nije bump-ovano | "maj 2026", ali citiraju Sl. glasnik 115/2025 | ≈ |

**Presuda:** ovo je osvojivo. Title match + tačne cifre + klaster B koji već rangira su naši aduti; jedino što nedostaje je dubina strane. Kad dodamo sekcije koje platica ima (a mi napišemo tačnije i sa 2026 ciframa), realan cilj je #2–3 (PURS drži #1 kao država).

## 3. Kritični nalazi (naša strana)

| # | Nalaz | Ozbiljnost | Fix |
|---|---|---|---|
| 1 | Kanibalizacija / vs /bruto-neto za "bruto u neto" | **Critical (rank)** | Odluka: početna = "kalkulator zarade" (izbaciti "bruto u neto" iz title/H1, tabelu premestiti na /bruto-neto), /bruto-neto = jedini vlasnik fraze |
| 2 | /pausal preplitka vs platica | High | +800 reči: IT 6201/6202, limit 10% rasta osnovice, žalba na rešenje, paušal vs zaposleni poređenje, link na informator kalkulator; interlink sa B-klaster postova |
| 3 | Vidljiv datum "Ažurirano: jun 2026" posle jučerašnje izmene | High | Bump na "jul 2026" na obe strane — svežina je signal, a bez toga ni recrawl ne pokazuje promenu |
| 4 | Nezaposlenost 0,75% za paušalce — moguća rupa u našem obračunu | **Critical (YMYL, verify-first)** | Verifikovati na PU/informator; ako važi, dodati u kalkulator i sve paušal tekstove (44,3% → 45,05%) |
| 5 | Platica-ina zastarela PIO 25,5% | Prilika | Posle #4: sekcija "najčešća greška: stara PIO stopa 25,5%" — targetira i njihove korisnike |
| 6 | CROSO /lat/Statistika/Stope_doprinosa servira PRE-2019 stope (PIO 12+14, nezaposlenost 2×0,75) | ⚠️ interno | Ne koristiti tu CROSO stranu kao citat za tekuće stope; koristiti PU/Sl. glasnik. Proveriti gde je već citirana |

## 4. Odgovor na pitanje: da li GSC još nije pokupio jučerašnje izmene?

**Da, gotovo sigurno.** Obe strane SU u indeksu (potvrđeno jutros), ali Google recrawl-uje strane malog sajta na dane-do-nedelje; live SERP još odražava staru verziju, a rank pomak kasni i posle recrawl-a. Ubrzanje: GSC URL inspection → Request indexing za `/bruto-neto` i `/pausal` (dodati na današnju listu od 5). Ali napomena: recrawl će pomoći samo ako je izmena vidljiva — trenutno strane i dalje prikazuju "Ažurirano: jun 2026", pa prvo bump datuma + fixevi iz §3, pa request indexing.

## 5. Plan

**Ove nedelje (quick wins):**
1. Bump "Ažurirano" na jul 2026 (obe strane) — 15 min
2. GSC request indexing: +/bruto-neto, +/pausal na postojeću listu — 5 min
3. Verifikacija nezaposlenost 0,75% za paušalce (PU/informator) — 30 min, blokira #4
4. Interlink audit: svi B-klaster postovi → /pausal sa anchor "paušal kalkulator" — 1h

**Sledeći sprint (strateško):**
5. Anti-kanibalizacija: razdvojiti intent početne i /bruto-neto — pola dana, najveći očekivani pomak na head-termu
6. /pausal dubina: +800 reči tačnijih od platica-inih — pola dana
7. Backlink jaz: ostaje dugoročni prioritet (etički PR, kalkulator kao citirani izvor)

_Merenje: sledeći nedeljni audit ~16. jul — obe fraze, pozicije vs platica._
