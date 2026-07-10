# Rank Audit — 9. jul 2026 (google.rs, Chrome, hl=sr&gl=rs&pws=0)

> Fokus nedelje: klaster B (paušal/registracija) + head-termovi. Prethodni audit: 25. jun.

## Pozicije

| Upit | Naša pozicija | Naša strana | #1 (i ključni konkurenti) |
|---|---|---|---|
| paušalno oporezivanje 2026 | **#2** | /blog/pausalno-oporezivanje | purs.gov.rs (država); minimax #3, platica /pausal #4 |
| koliko paušalac plaća mesečno | **#2** (+ #7 drugi listing) | /blog/koliko-pausalac-placa-mesecno | pausalko.rs |
| registracija paušalca | **#2** | /blog/registracija-pausalca | apr.gov.rs (država); ft1p #3 |
| koliko košta otvaranje firme | **#4** | /blog/kosta-otvaranje-firme | osnivanjefirme.com; ideal-racunovodstvo #2 |
| prosečna plata u srbiji | **#6** | /blog/prosecna-plata-srbija | stat.gov.rs; neobilten, cekos, infoplate, paragraf |
| paušal ili doo | **#7** | /blog/pausal-ili-doo | tmconsulting; fedra, poreskosavetovanje, paragraf, reddit, birovision |
| kako registrovati firmu | **van top 10** | (pilar nije indeksiran) | apr.gov.rs; tmconsulting, eUprava, gostudy, mbfinance |
| paušal kalkulator | **van top 10** | /pausal | purs.gov.rs; pausalac.rs, jpd.rs, epreduzetnik; **platica /pausal #6** |
| bruto u neto kalkulator | **van top 10** | / (homepage) | adviser.rs; dmk.rs, servisracunara, **platica.rs #4**, unija |
| otkaz ugovora o radu | **van top 10** | (post nije indeksiran) | zuniclaw; advokatbeograd, paragraf, infostud |

## Nalazi

1. **Klaster B radi.** 5 od 7 registracionih upita u top 7, tri na #2 (iza državnih sajtova — intent ceiling). Postovi za koje smo mislili da nisu indeksirani (pausal-ili-doo, koliko-pausalac-placa-mesecno, kosta-otvaranje-firme) — jesu indeksirani i rangiraju.
2. **Pilar `kako-registrovati-firmu` i `otkaz-ugovora-o-radu` nisu u indeksu** — jedini pravi indeksni problem. GSC request-indexing prioritet.
3. **Alatni head-termovi su slabost**: "bruto u neto kalkulator" i "paušal kalkulator" — nismo u top 10, a platica.rs jeste (#4 i #6). Naše kalkulator-strane gube od platica-inih. Sledeći sprint: on-page za /bruto-neto i /pausal (title/H1 tačno na "kalkulator" frazu, interni linkovi sa blog postova na alat).
4. **AI Overview** se pojavljuje na "kako registrovati firmu" — citira APR/YouTube, ne nas. Dodatni razlog da pilar uđe u indeks + FAQ schema već imamo.

## GSC — revidirana lista za submit (samo stvarno neindeksirano)

```
https://www.platnilistic.rs/blog/kako-registrovati-firmu
https://www.platnilistic.rs/blog/otkaz-ugovora-o-radu
https://www.platnilistic.rs/blog/frilenser-pausalac-firma   (neverifikovano — proveri u GSC)
https://www.platnilistic.rs/godisnji-odmor
https://www.platnilistic.rs/jubilarna-nagrada
```

## Saobraćaj (Vercel Analytics, poslednjih 7 dana, 9. jul)

- Posetioci: **1.610** (+19% WoW) · Pregledi: **2.591** (+26% WoW) · Bounce 75%
- Izvor: google.com 1.3K (~81%) · Srbija 85% · Mobile 62%
- Top strane: /blog/jubilarna-nagrada **340**, / 333, prosecna-plata 163, godisnji-odmor-naknada 152, penzija 100, pausalno 80, frilenseri 74
- Napomena: jubilarna-nagrada post je #1 po saobraćaju → novi /jubilarna-nagrada kalkulator hitno u indeks (submit gore).

_Sledeći audit: ~16. jul. Rotacija: klaster C (otkaz/otpremnina/porodiljsko) + head-provere._
