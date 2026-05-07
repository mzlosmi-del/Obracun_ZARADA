import { useSeo } from "./seo.jsx";

export function PolitikaPrivatnosti({ onBack }) {
  useSeo({
    title: "Politika privatnosti | PlatniListić",
    description: "Politika privatnosti sajta PlatniListić. Saznajte koje podatke prikupljamo, kako koristimo Vercel Analytics bez kolačića i kako se rukuje email adresama prijavljenim na newsletter.",
    path: "/privatnost",
  });

  return (
    <div className="legal-page">
      <button className="back-btn" onClick={onBack} aria-label="Nazad na kalkulator">← Nazad</button>
      <h1 className="legal-title">Politika privatnosti</h1>
      <p className="legal-date">Poslednje ažuriranje: februar 2025.</p>

      <div className="legal-body">
        <h2>Ko smo mi</h2>
        <p>PlatniListić (<strong>platnilistic.rs</strong>) je besplatni online kalkulator za obračun zarada u Republici Srbiji. Usluga je namenjena zaposlenima, poslodavcima i računovođama koji žele brz i transparentan uvid u strukturu zarade.</p>

        <h2>Koje podatke prikupljamo</h2>
        <p>Prikupljamo isključivo podatke koje nam vi dobrovoljno date:</p>
        <ul>
          <li><strong>Email adresa</strong> — samo ako se prijavite na newsletter putem forme u bočnom meniju. Ova adresa se čuva u sistemu Brevo (brevo.com) i koristi se samo za slanje informacija o promenama poreskih parametara i novostima vezanim za obračun zarada.</li>
        </ul>
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

        <h2>Newsletter</h2>
        <p>Ako se prijavite na newsletter, vaša email adresa se šalje servisu Brevo (SAS, Francuska), koji je usklađen sa GDPR regulativom. Možete se odjaviti u bilo kom trenutku klikom na link u svakom emailu koji primite.</p>

        <h2>Vaša prava</h2>
        <p>Imate pravo da zatražite uvid u podatke koje smo prikupili, ispravku ili brisanje iste. Pišite nam na: <strong>kontakt@platnilistic.rs</strong></p>

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
