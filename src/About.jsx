import { Link } from "react-router-dom";
import { useSeo } from "./seo.jsx";

const SITE_URL = "https://www.platnilistic.rs";

export function ONama({ onBack }) {
  useSeo({
    title: "O nama – Izvori podataka i metodologija obračuna | PlatniListić",
    description: "Ko stoji iza PlatniListić kalkulatora, na kojim zakonima i pravilnicima se zasniva obračun zarade i kako održavamo aktuelnost poreskih parametara u Srbiji.",
    path: "/o-nama",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "O nama — PlatniListić",
      "url": `${SITE_URL}/o-nama`,
      "inLanguage": "sr-RS",
      "mainEntity": {
        "@type": "Organization",
        "name": "PlatniListić",
        "url": SITE_URL,
        "logo": `${SITE_URL}/logo.svg`,
        "description": "Besplatni online kalkulator za obračun zarada u Republici Srbiji.",
        "areaServed": { "@type": "Country", "name": "Serbia" },
        "knowsAbout": [
          "Obračun zarade Srbija",
          "Bruto neto kalkulator",
          "Porez na dohodak",
          "Doprinosi za socijalno osiguranje",
          "Zakon o radu Srbije",
          "PPP-PD obrazac"
        ]
      }
    }
  });

  return (
    <div className="legal-page">
      <button className="back-btn" onClick={onBack} aria-label="Nazad na kalkulator">← Nazad</button>
      <h1 className="legal-title">O PlatniListić-u</h1>
      <p className="legal-date">Izvori, metodologija i ažuriranje parametara</p>

      <div className="legal-body">
        <h2>Šta je PlatniListić?</h2>
        <p><strong>PlatniListić</strong> je besplatni online kalkulator za precizan obračun zarade u Republici Srbiji. Cilj alata je da zaposlenima, poslodavcima, knjigovođama i HR profesionalcima omogući brz i transparentan uvid u sve komponente zarade — od bruto preko poreza i doprinosa do neto iznosa, generisanja PDF platnog listića i izvoza PPP-PD XML datoteke za Poresku upravu.</p>

        <h2>Na čemu se zasniva obračun?</h2>
        <p>Sve formule, stope i limiti u kalkulatoru direktno se zasnivaju na važećim propisima Republike Srbije:</p>
        <ul>
          <li><strong><a href="https://www.paragraf.rs/propisi/zakon_o_radu.html" target="_blank" rel="noopener noreferrer">Zakon o radu</a></strong> — članovi 105–112 (zarada, prekovremeni rad, minuli rad), 68–76 (godišnji odmor), 158–160 (otpremnina)</li>
          <li><strong><a href="https://www.paragraf.rs/propisi/zakon_o_porezu_na_dohodak_gradjana.html" target="_blank" rel="noopener noreferrer">Zakon o porezu na dohodak građana</a></strong> — porez na zarade (10%), neoporezivi iznos</li>
          <li><strong><a href="https://www.paragraf.rs/propisi/zakon_o_doprinosima_za_obavezno_socijalno_osiguranje.html" target="_blank" rel="noopener noreferrer">Zakon o doprinosima za obavezno socijalno osiguranje</a></strong> — PIO (14% / 10%), zdravstvo (5,15% / 5,15%), nezaposlenost (0,75%)</li>
          <li><strong>Uredbe Vlade Srbije</strong> o minimalnoj zaradi i neoporezivim iznosima — objavljuju se u <a href="https://www.slglasnik.com/" target="_blank" rel="noopener noreferrer">Službenom glasniku</a></li>
        </ul>

        <h2>Aktuelni parametri (2026)</h2>
        <p>Kalkulator automatski koristi parametre koji važe u skladu sa kalendarskim periodom:</p>
        <ul>
          <li>Neoporezivi iznos: 28.423 RSD (do 31.01.2026.) → 34.221 RSD (od 01.02.2026.)</li>
          <li>Minimalna cena rada (od 01/2026): 371 RSD neto po radnom času (mesečno ~59.360–68.264 RSD neto)</li>
          <li>Najniža mesečna osnovica za doprinose: 51.297 RSD</li>
          <li>Najviša mesečna osnovica za doprinose: 732.820 RSD</li>
          <li>Maksimalan neoporezivi iznos prevoza: 5.782 RSD</li>
        </ul>
        <p>Sve stope i parametre korisnik može i ručno menjati u kartici „Stope" — što je korisno za obračun ranijih perioda ili specifičnih kategorija zaposlenih.</p>

        <h2>Kako se ažuriraju parametri?</h2>
        <p>Pratimo najavljene izmene poreskih i radnih propisa preko zvaničnih kanala:</p>
        <ul>
          <li><a href="https://www.mfin.gov.rs/" target="_blank" rel="noopener noreferrer">Ministarstvo finansija Srbije</a></li>
          <li><a href="https://www.purs.gov.rs/" target="_blank" rel="noopener noreferrer">Poreska uprava Republike Srbije</a></li>
          <li><a href="https://www.minrzs.gov.rs/" target="_blank" rel="noopener noreferrer">Ministarstvo za rad, zapošljavanje, boračka i socijalna pitanja</a></li>
          <li><a href="https://www.stat.gov.rs/" target="_blank" rel="noopener noreferrer">Republički zavod za statistiku</a></li>
          <li><a href="https://www.socijalnoekonomskisavet.rs/" target="_blank" rel="noopener noreferrer">Socijalno-ekonomski savet Srbije</a></li>
        </ul>
        <p>Po svakoj zvaničnoj objavi, parametri u kalkulatoru se ažuriraju u roku od 7 dana, a registrovani korisnici newsletter-a primaju obaveštenje o promenama.</p>

        <h2>Privatnost obračuna</h2>
        <p>Svi unosi (iznosi zarada, sati rada, lični podaci za PDF platni listić) <strong>obrađuju se isključivo u vašem pregledaču</strong>. Nikakvi finansijski podaci se ne šalju ni na jedan server, ne čuvaju i ne dele sa trećim licima. Više informacija u <Link to="/privatnost">Politici privatnosti</Link>.</p>

        <h2>Šta PlatniListić nije?</h2>
        <ul>
          <li>Nije zvanični kalkulator Poreske uprave ni Ministarstva finansija.</li>
          <li>Nije zamena za rad ovlašćenog knjigovođe — za zvanične obračune i podnošenje obrazaca obratite se računovodstvenoj agenciji ili poreskom savetniku.</li>
          <li>Ne pruža individualne pravne savete. Pogledajte <Link to="/uslovi">Uslove korišćenja</Link>.</li>
        </ul>

        <h2>Kontakt i feedback</h2>
        <p>Imate predlog, pronašli ste nepreciznost u obračunu ili tražite kalkulator po meri? Pišite nam: <strong>kontakt@platnilistic.rs</strong></p>

        <p style={{marginTop: 28}}>
          <Link to="/" className="cta-btn">⚡ Otvorite kalkulator</Link>
        </p>
      </div>
    </div>
  );
}
