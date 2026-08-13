# SEO poređenje: /minimalna-zarada-2026 vs platica.rs /stope/minimalna-zarada

> **Datum:** 13. avgust 2026 · **Upit-fokus:** "minimalna zarada" (head term) + varijante
> **Metod:** live fetch obe strane + SERP provere (US proxy — google.rs proveru uraditi kroz Chrome po standardnoj metodi hl=sr&gl=rs&pws=0) + analiza koda (pages.jsx, vercel.json, prerender.mjs).

## Executive summary

Na godišnjim upitima ("minimalac 2026 po mesecima") smo praktično rame uz rame sa platicom (#4 vs #3 u proxy SERP-u). Jaz je koncentrisan na **head term bez godine — "minimalna zarada"** — gde platica ulazi u top 10, a mi ne. Uzrok NIJE dubina sadržaja (naša strana je ~2.850 reči, 4 tabele, bruto obračun, istorija, schema — objektivno bogatija od njihove ~1.300 reči i 1 tabele). Uzrok je **arhitektonski: mi imamo datiran URL koji se svake godine resetuje, oni večni URL koji se svake godine samo osvežava** — a ceo top 10 na head termu čine upravo večni URL-ovi. Drugi, manji faktor: naš title i H1 vode frazom "minimalac", njihov H1 vodi frazom "minimalna zarada". Treći: poznati backlink/starost jaz domena (audit 9.7).

## 1. Head-to-head

| Dimenzija | PlatniListić /minimalna-zarada-2026 | Platica /stope/minimalna-zarada | Pobednik |
|---|---|---|---|
| **URL strategija** | Datiran (`-2026`) — svake godine nova strana od nule; istorija: /blog/minimalna-zarada-2025 → 301 → ova strana | **Večni URL** — ista adresa svake godine, akumulira starost, linkove i behavioral signale | **platica (ključni faktor)** |
| Title | "Minimalac 2026 — minimalna zarada po mesecima, 371 RSD/h" — vodi "minimalac" | "Minimalac 2026 — minimalna zarada 2026 po mesecima (371 RSD/h)" — fraza "minimalna zarada 2026" u celosti | ≈ platica (potpuna fraza sa godinom) |
| H1 | "Minimalac 2026 — minimalna zarada u Srbiji" | "Minimalna zarada za 2026. godinu" — **head term na početku** | **platica** (za upit "minimalna zarada") |
| Dubina sadržaja | ~2.850 reči; 4 tabele (pregled, 12 meseci neto+bruto, primer obračuna, istorija 2019–2026); povrh-minimalca sekcija; greške; 55%/69% od proseka/medijane | ~1.300 reči; 1 tabela (12 meseci, samo neto, + kolona praznici); fond vs stvarni sati; pravni okvir | **mi** (veliki jaz) |
| Bruto iznosi | Da — bruto po mesecima + trošak poslodavca | **Ne — samo neto** | **mi** |
| Schema | BreadcrumbList + FAQPage (bake-uje se u prerender HTML) | Nema JSON-LD | **mi** |
| Svežina | "Provereno i ažurirano: avgust 2026" | "Ažurirano: jul 2026" | mi |
| FAQ | 7 pitanja (uklj. evri, kazne) | 4 pitanja (uklj. **"minimalac za maj 2026"** — mesečno-specifično) | ≈ (njihov mesečni ugao je pametan) |
| Interni linkovi ka strani | ~10 (footer/homepage/related/2 posta) | Glavna navigacija ("Stope" sekcija) → praktično sitewide | ≈ platica |
| Domen/backlink | Mlad domen (poznat jaz, audit 9.7) | Stariji fokusiran sajt, agencijski footer link | **platica** |

## 2. Zašto tačno gubimo na "minimalna zarada" (bez godine)

Proxy SERP za "minimalna zarada Srbija": platica #3, **mi van top 10**. Ostali u top 10: mojazarada.rs `/plata/minimalna-zarada`, rezonsrbija.rs `/aktuelni-podaci/minimalne-neto-zarade`, naslednik.rs `/korisne-informacije/minimalna-zarada`, paragraf `/statistika/minimalna_zarada.html` — **svi večni URL-ovi bez godine**. Na upitu sa godinom ("minimalac 2026 po mesecima") mi smo #4, platica #3 — praktično izjednačeno.

Zaključak: Google head term tretira kao delom navigacioni/trajni intent i nagrađuje strane sa istorijom. Naš URL je star ~7 meseci i 1. januara 2027. bismo ga (po dosadašnjem obrascu) opet resetovali. Platica taj reset nikad ne plaća.

## 3. Nađen bug: samo-redirect link

Strana u uvodu linkuje "poređenje sa prethodnom godinom" → `/blog/minimalna-zarada-2025`, a taj URL je 301-redirektovan **nazad na istu ovu stranu** (vercel.json + REDIRECT_MAP). Korisnik i crawler dobiju petlju: klik vodi na stranu na kojoj već jesu. Fix: zameniti link anchor-om na sekciju istorije (`#minimalna-cena-rada-kroz-godine`) ili ga ukloniti.

## 4. Plan

**Ove nedelje (quick wins):**
1. **Fix samo-redirect linka** (§3) — 10 min.
2. **Preokret title/H1 ka head termu** — H1: "Minimalna zarada u Srbiji 2026 — minimalac 371 RSD po satu"; Title: "Minimalna zarada 2026 — minimalac po mesecima, 371 RSD/h | PlatniListić". Obe fraze ostaju (ne rizikujemo "minimalac" pozicije), samo se redosled menja u korist fraze na kojoj gubimo — 20 min.
3. **Kolona "Praznici" u mesečnoj tabeli + mini-sekcija "fond sati vs stvarni sati"** — podaci već postoje u REFERENCE_DATA.radniDani2026; pariramo njihovim jedinim unikatnim sekcijama — 45 min.
4. **Dinamičan tekući mesec** — FAQ/primer "Koliki je minimalac za avgust 2026?" izveden iz datuma (obrazac već postoji u RadniDaniPage). Platica ima statičan "maj 2026" — mi uvek aktuelni mesec — 30 min.
5. **GSC request indexing** posle deploy-a (kroz Chrome, nema GSC MCP-a) — 5 min.

**Strateško (glavna poluga za #1):**
6. **Migracija na večni URL `/minimalna-zarada`** — 301 sa `/minimalna-zarada-2026`, kolabirati lance (blog 2025/2026 redirecti da gađaju novi URL direktno, ne kroz lanac), ažurirati ~10 internih linkova, canonical, sitemap, prerender rute. Od tada se strana **osvežava u mestu** svake godine (januarske cifre + red u istorijskoj tabeli), nikad više reset.
   - **Tajming:** uraditi SADA. SES odlučuje o minimalcu za 2027. najkasnije 15. septembra — talas upita "minimalna zarada 2027" kreće za ~4 nedelje. Migracija treba da se slegne PRE talasa, da 2027-sadržaj dodamo na konsolidovan URL. Rizik migracije: 2–6 nedelja turbulencije na strani koja je "improving" — ali alternativa (novi reset u januaru 2027) košta više.
7. **15. septembar readiness:** pripremljena sekcija "Minimalac 2027" + ažuriranje u roku od nekoliko sati od objave odluke u Sl. glasniku.
8. **Backlink jaz** — ostaje dugoročno (kalkulator kao citirani izvor, etički PR).
9. **Isti obrazac kasnije proveriti za** /radni-dani-2026, /neoporezivi-iznos-2026, /stope-doprinosa-2026 — svi dele problem godišnjeg reseta (jedan po jedan, posle merenja efekta ove migracije).

_Merenje: nedeljni audit — "minimalna zarada", "minimalna zarada 2026", "minimalac 2026 po mesecima", pozicije vs platica (google.rs, hl=sr&gl=rs&pws=0)._
