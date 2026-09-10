import { useSeo } from "./seo.jsx";

export function PolitikaPrivatnosti({ onBack }) {
  useSeo({
    title: "Politika privatnosti | PlatniListić",
    description: "Politika privatnosti sajta PlatniListić: koje podatke prikupljamo, analitika bez kolačića, Google AdSense oglasi i kolačići, saglasnost i rukovanje email adresama.",
    path: "/privatnost",
  });

  return (
    <div className="legal-page">
      <button className="back-btn" onClick={onBack} aria-label="Nazad na kalkulator">← Nazad</button>
      <h1 className="legal-title">Politika privatnosti</h1>
      <p className="legal-date">Poslednje ažuriranje: septembar 2026.</p>

      <div className="legal-body">
        <h2>Ko smo mi</h2>
        <p>PlatniListić (<strong>platnilistic.rs</strong>) je besplatni online kalkulator za obračun zarada u Republici Srbiji. Usluga je namenjena zaposlenima, poslodavcima i računovođama koji žele brz i transparentan uvid u strukturu zarade.</p>

        <h2>Koje podatke prikupljamo</h2>
        <p>Prikupljamo isključivo podatke koje nam vi dobrovoljno date:</p>
        <ul>
          <li><strong>Email adresa</strong> — samo ako se prijavite na newsletter putem forme u bočnom meniju. Ova adresa se čuva u sistemu Brevo (brevo.com) i koristi se samo za slanje informacija o promenama poreskih parametara i novostima vezanim za obračun zarada.</li>
          <li><strong>Ime, email adresa i opis koji sami napišete</strong> — samo ako pošaljete upit preko forme za <a href="/softver-po-meri">softver po meri</a>. Ove podatke šaljete dobrovoljno, uz izričitu saglasnost koju potvrđujete pre slanja, i koriste se <strong>isključivo</strong> radi kontakta i odgovora na vaš upit. Ne koriste se za newsletter, ne prodaju se i ne prosleđuju trećim licima radi oglašavanja. Podaci se čuvaju u sistemu Brevo (Brevo SAS, Francuska), u posebnoj listi odvojenoj od newsletter liste.</li>
        </ul>
        <p><strong>Pravni osnov i rok čuvanja.</strong> Obrada se vrši na osnovu vaše saglasnosti (čl. 12 st. 1 tač. 1 Zakona o zaštiti podataka o ličnosti, odnosno čl. 6(1)(a) GDPR). Saglasnost možete povući u bilo kom trenutku, bez obrazloženja, pisanjem na <strong>kontakt@platnilistic.rs</strong> — povlačenje ne utiče na zakonitost obrade pre povlačenja. Podatke iz upita čuvamo dok traje komunikacija i najduže <strong>24 meseca</strong> od poslednjeg kontakta, nakon čega se brišu.</p>
        <p>Podaci koje unosite u kalkulator (iznosi zarada, sati rada, bonusi) <strong>se ne čuvaju</strong> ni na kakvom serveru — obračun se vrši isključivo u vašem pregledaču i nigde se ne prenosi.</p>

        <h2>Analitika i praćenje</h2>
        <p>Koristimo <strong>Vercel Web Analytics</strong> — sistem analitike koji je dizajniran sa privatnošću kao prioritetom. Vercel Analytics:</p>
        <ul>
          <li>Ne koristi kolačiće (cookies)</li>
          <li>Ne prikuplja lične podatke</li>
          <li>Ne prati korisnike između sajtova</li>
          <li>Usklađen je sa GDPR regulativom bez potrebe za pristankom</li>
        </ul>
        <p>Prikupljamo isključivo anonimne agregatne podatke: broj poseta, posećene stranice i geografsku regiju (na nivou države).</p>

        <h2>Oglasi (Google AdSense) i kolačići</h2>
        <p>Sajt prikazuje oglase putem servisa <strong>Google AdSense</strong> (Google Ireland Ltd.). Google i njegovi partneri mogu koristiti <strong>kolačiće i slične tehnologije</strong> za prikazivanje oglasa, merenje njihovog učinka i, uz vašu saglasnost, za personalizaciju oglasa na osnovu prethodnih poseta ovom i drugim sajtovima.</p>
        <ul>
          <li>Google koristi oglašivačke kolačiće (npr. za ograničavanje broja prikazivanja i merenje učinka oglasa).</li>
          <li>Posetiocima iz Evropskog ekonomskog prostora, Ujedinjenog Kraljevstva i Švajcarske pre učitavanja oglasa prikazuje se <strong>poruka za saglasnost</strong> (Google-ova sertifikovana CMP platforma), gde možete prihvatiti, odbiti ili detaljno podesiti obradu podataka. Izbor možete promeniti u bilo kom trenutku.</li>
          <li>Personalizaciju oglasa možete isključiti i u <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google podešavanjima oglasa</a>, a više o tome kako Google koristi podatke: <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/partner-sites</a>.</li>
          <li>Kolačiće možete obrisati ili blokirati i u podešavanjima svog pregledača; sajt i kalkulator rade i bez oglašivačkih kolačića.</li>
        </ul>

        <h2>Partnerski (affiliate) linkovi</h2>
        <p>Pojedini linkovi ka oglasima za posao partnerske agencije su partnerski linkovi — ako se preko njih prijavite i zaposlite, ostvarujemo proviziju. To ne utiče na uslove posla niti na vašu zaradu, a takvi blokovi su na sajtu jasno označeni kao „oglasi partnera".</p>
        <p>Na pojedinim člancima prikazujemo i partnerske ponude drugih usluga (na primer <strong>eSIM kartice za internet u inostranstvu</strong>), preko affiliate mreže <strong>Impact.com</strong>. Ako kupite preko takvog linka, ostvarujemo proviziju — <strong>cena za vas je ista</strong>. Klikom na partnerski link napuštate ovaj sajt; prodavac tada može postaviti sopstvene kolačiće radi evidentiranja porudžbine, u skladu sa svojom politikom privatnosti. Sami linkovi ne prenose nikakve podatke koje ste uneli u kalkulator — obračun je i dalje u celosti na vašem uređaju.</p>

        <h2>Newsletter</h2>
        <p>Ako se prijavite na newsletter, vaša email adresa se šalje servisu Brevo (SAS, Francuska), koji je usklađen sa GDPR regulativom. Možete se odjaviti u bilo kom trenutku klikom na link u svakom emailu koji primite.</p>

        <h2>Vaša prava</h2>
        <p>Imate pravo na pristup podacima, ispravku, brisanje, ograničenje obrade, prenosivost podataka i pravo na prigovor, kao i pravo da povučete datu saglasnost. Zahtev pošaljite na: <strong>kontakt@platnilistic.rs</strong> — odgovaramo u zakonskom roku.</p>
        <p>Ako smatrate da su vaša prava povređena, možete podneti pritužbu Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti Republike Srbije (<a href="https://www.poverenik.rs" target="_blank" rel="noopener noreferrer">poverenik.rs</a>).</p>

        <h2>Izmene politike</h2>
        <p>Zadržavamo pravo izmene ove politike. Svaka izmena biće objavljena na ovoj stranici sa datumom poslednjeg ažuriranja.</p>
      </div>
    </div>
  );
}

export function UsloviKoriscenja({ onBack }) {
  useSeo({
    title: "Uslovi korišćenja | PlatniListić",
    description: "Uslovi korišćenja kalkulatora zarade PlatniListić. Informativni alat za obračun zarada u Srbiji — odricanje od odgovornosti, intelektualna svojina, merodavno pravo.",
    path: "/uslovi",
  });

  return (
    <div className="legal-page">
      <button className="back-btn" onClick={onBack} aria-label="Nazad na kalkulator">← Nazad</button>
      <h1 className="legal-title">Uslovi korišćenja</h1>
      <p className="legal-date">Poslednje ažuriranje: februar 2025.</p>

      <div className="legal-body">
        <h2>Prihvatanje uslova</h2>
        <p>Korišćenjem sajta platnilistic.rs prihvatate ove uslove korišćenja. Ako se ne slažete sa uslovima, molimo vas da ne koristite sajt.</p>

        <h2>Svrha alata</h2>
        <p>PlatniListić je informativni alat za okvirni obračun zarada u Republici Srbiji. Alat je namenjen za brzo i pregledono razumevanje strukture zarade — nije zamena za profesionalni računovodstveni ili pravni savet.</p>

        <h2>Odricanje od odgovornosti</h2>
        <p>PlatniListić pruža <strong>isključivo informativne obračune</strong> zasnovane na važećim poreskim propisima i parametrima koji su bili dostupni u trenutku razvoja alata.</p>
        <ul>
          <li>Rezultati obračuna <strong>ne predstavljaju pravni ni poreski savet</strong>.</li>
          <li>Za zvanični i pravno obavezujući obračun zarade konsultujte ovlašćenog računovođu ili nadležni organ.</li>
          <li>Poreske stope i parametri mogu se promeniti zakonodavnim izmenama. PlatniListić ne garantuje ažurnost parametara u svakom trenutku.</li>
          <li>Korisnik snosi punu odgovornost za eventualne odluke donete na osnovu rezultata ovog kalkulatora.</li>
        </ul>

        <h2>Intelektualna svojina</h2>
        <p>Sav sadržaj na sajtu platnilistic.rs, uključujući dizajn, tekstove i kod, zaštićen je autorskim pravom. Nije dozvoljeno kopiranje, reprodukcija ni komercijalno korišćenje bez pisane saglasnosti.</p>

        <h2>Dostupnost usluge</h2>
        <p>Zadržavamo pravo da u bilo kom trenutku, bez prethodnog obaveštenja, izmenimo, privremeno ili trajno obustavimo pristup sajtu. Nismo odgovorni za eventualne štete nastale usled nedostupnosti usluge.</p>

        <h2>Merodavno pravo</h2>
        <p>Na ove uslove primenjuje se pravo Republike Srbije. Svi eventualni sporovi rešavaju se pred nadležnim sudom u Republici Srbiji.</p>

        <h2>Kontakt</h2>
        <p>Za sva pitanja vezana za uslove korišćenja: <strong>kontakt@platnilistic.rs</strong></p>
      </div>
    </div>
  );
}
