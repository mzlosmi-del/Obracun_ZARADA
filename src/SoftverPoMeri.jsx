// src/SoftverPoMeri.jsx — the /softver-po-meri landing page.
//
// Since 17.11.2026 this ONE page sells both offers: website building (#sajt)
// and custom software (the case study, #prica). The URL stays /softver-po-meri
// — it is indexed and linked; every on-site hint (src/WebsitePromo.jsx, ProCTA,
// BlogSoftwareCTA) leads here. Figures in the #sajt section come from
// WEB_STATS in WebsitePromo.jsx — read the accuracy rules there before editing.
//
// ⚠️ SPLIT OUT OF lead.jsx DELIBERATELY. This route is lazy-loaded, but lead.jsx
// is ALSO statically imported by App.jsx (LeadModalHost, LEAD_PATH) and Blog.jsx
// (BlogSoftwareCTA). Vite therefore cannot move a lazily-imported lead.jsx into
// its own chunk — it warns "dynamically imported but also statically imported"
// and folds the WHOLE landing page into the main bundle, shipping ~1.400 words
// of marketing JSX to every visitor of the payroll calculator.
//
// Keep it that way: nothing may statically import this file.
import { Link } from "react-router-dom";
import { useSeo } from "./seo.jsx";
import { track } from "./track.js";
import { LEAD_PATH, CONTACT_EMAIL, useLeadForm, LeadFormContent } from "./lead.jsx";
import { WEB_STATS, StatsSource } from "./WebsitePromo.jsx";

// ── LANDING PAGE ─────────────────────────────────────────────────────────────

const FAQ = [
  {
    q: "Koliko košta izrada sajta za firmu?",
    a: "Zavisi od obima — predstavljanje firme na nekoliko strana nije isto što i katalog proizvoda ili onlajn poručivanje. Zato posle prvog razgovora dobijate grubu procenu opsega i cene. Taj korak je besplatan i ni na šta vas ne obavezuje.",
  },
  {
    q: "Već imamo sajt, ali je zastareo. Da li mora sve ispočetka?",
    a: "Ne nužno. Prvo pogledam šta postoji. Adresa sajta (domen) i sadržaj koji vredi po pravilu ostaju, a menja se ono što koči: brzina, prikaz na telefonu, preglednost i put do kontakta.",
  },
  {
    q: "Treba li nam sajt ako već imamo stranicu na društvenim mrežama?",
    a: "Stranica na društvenoj mreži je korisna, ali nije vaša — pravila i vidljivost određuje platforma. Sajt je mesto koje vi kontrolišete: ponuda, cene i kontakt stoje onako kako ste ih vi postavili, i nalaze se i preko pretraživača.",
  },
  {
    q: "Koliko košta softver po meri za malu firmu?",
    a: "Zavisi od obima — nije isto pokriti evidenciju porudžbina i napraviti kompletan sistem. Zato posle prvog razgovora dobijate popis zahteva po prioritetu i grubu procenu opsega i cene. Taj korak je besplatan i ni na šta vas ne obavezuje.",
  },
  {
    q: "Koliko traje izrada?",
    a: "Radi se u fazama. Prvi deo koji stvarno možete da koristite obično je gotov za nekoliko nedelja, a ne tek na kraju projekta. Tako se greške vide rano, dok su još jeftine za ispravku.",
  },
  {
    q: "Možemo li da zamenimo Excel tabelu kojom sad vodimo evidenciju?",
    a: "To je najčešći povod za poziv. Excel radi dok ga koristi jedan čovek; problem počinje kada istu tabelu otvara više ljudi, kada je neko slučajno prepiše i kada niko ne zna koja je verzija poslednja. Alat po meri zadržava logiku koju ste već razradili u tabeli, ali dodaje ono što Excel ne može: istovremeni rad više ljudi, prava pristupa i istoriju izmena.",
  },
  {
    q: "Radimo sa radnim nalozima u proizvodnji. Da li i to pokrivate?",
    a: "Da. Evidencija radnih naloga je isti problem kao evidencija porudžbina — nalog uđe, prođe kroz nekoliko ruku i negde se izgubi. Radionica dobija svoju radnu listu, vlasnik pregled šta je otvoreno i šta kasni, a ko vidi cene određujete vi.",
  },
  {
    q: "Šta se dešava posle isporuke — ko održava alat?",
    a: "Ja. Zakon se menja, proces se menja i firma raste, pa alat mora da prati. Dogovaramo se unapred kako izgleda podrška posle isporuke da ne biste ostali sa softverom koji niko ne dira.",
  },
  {
    q: "Već koristimo neki program i Excel. Da li sve moramo da menjamo?",
    a: "Najčešće ne. Ima smisla pokriti samo mesto na kome se gubi vreme ili se posao zagubi, a ostalo ostaviti kako jeste. Postojeći program se u većini slučajeva može zadržati i povezati.",
  },
  {
    q: "Da li radite samo za firme iz Srbije?",
    a: "Ne. Razgovori i rad idu online, tako da lokacija nije prepreka. Radim na srpskom, engleskom i nemačkom.",
  },
  {
    q: "Gde se čuvaju podaci naše firme?",
    a: "U vašem sistemu, na serveru koji vi birate. Podaci koje unesete u ovaj kalkulator na sajtu se nigde ne šalju — obračun se u celosti odvija u vašem pregledaču.",
  },
];

const SIGNS = [
  "Porudžbine ili upiti stižu na više kanala — telefon, Viber, mejl — i nigde se ne skupljaju na jedno mesto.",
  "Vlasnik je jedini koji ima kompletan pregled, i to uglavnom iz glave.",
  "Zajedničku Excel tabelu je već neko slučajno prepisao ili obrisao.",
  "Isti podaci o kupcu se kucaju po dva-tri puta, na dva-tri mesta.",
  "Da biste saznali koliko posla je trenutno otvoreno, morate nekoga da pitate.",
];

export function SoftverPoMeriPage() {
  const { form, setForm, status, submit } = useLeadForm("page");

  useSeo({
    title: "Izrada sajtova i softvera po meri za firme — PlatniListić",
    description: "Pravim moderne sajtove i softver po meri za male firme u Srbiji: brz sajt koji radi na telefonu, evidencija porudžbina, izveštaji. Priča jednog projekta.",
    path: LEAD_PATH,
    faq: FAQ,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [{
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Početna", "item": "https://www.platnilistic.rs/" },
          { "@type": "ListItem", "position": 2, "name": "Sajtovi i softver po meri", "item": `https://www.platnilistic.rs${LEAD_PATH}` },
        ],
      }, {
      "@type": "Service",
      "name": "Izrada sajtova i softvera po meri za male firme",
      "serviceType": "Izrada veb-sajtova, poslovnih web aplikacija i internih alata",
      "areaServed": { "@type": "Country", "name": "Srbija" },
      "availableLanguage": ["sr", "en", "de"],
      "provider": {
        "@type": "Organization",
        "name": "PlatniListić",
        "url": "https://www.platnilistic.rs",
        "email": CONTACT_EMAIL,
      },
      "description": "Izrada modernih veb-sajtova za firme i internih web aplikacija po meri za mala i srednja preduzeća: evidencija porudžbina i radnih naloga, šifarnik kupaca, prava pristupa po ulozi i izveštaji za vlasnika.",
      }],
    },
  });

  return (
    <div className="sw-page">
      <div className="sw-hero">
        <div className="lead-eyebrow">Sajtovi i softver po meri · male firme i knjigovodstvene agencije</div>
        <h1 className="sw-h1">Sajtovi i softver po meri za male firme u Srbiji</h1>
        <p className="sw-lede">
          Sajt i kalkulator koje upravo koristite su moj rad. Isti pristup primenjujem na
          vašu firmu: sajt preko kog vas kupci nalaze i alat koji radi posao umesto vas,
          napravljen prema tome kako vi stvarno radite, a ne kako je neko zamislio da bi
          trebalo.
        </p>
        <div className="sw-hero-actions">
          <button type="button" className="sw-btn-primary" onClick={() => { track("lead_form_open", "hero"); window.dispatchEvent(new Event("open-lead-modal")); }}>
            Zakažite besplatan razgovor →
          </button>
          <a className="sw-btn-ghost" href="#prica">Prvo pročitajte priču ↓</a>
        </div>
      </div>

      <section className="sw-scope sw-offer" aria-labelledby="sw-offer-title">
        <h2 id="sw-offer-title">Šta mogu da napravim za vašu firmu</h2>
        <ul className="sw-list">
          <li>
            <strong>Moderan sajt.</strong> Predstavlja firmu, ponudu i cene, brzo se
            učitava, čita se na telefonu i vodi posetioca do upita ili poziva.
            <br /><a href="#sajt">Šta dobijate sa sajtom ↓</a>
          </li>
          <li>
            <strong>Softver po meri.</strong> Jedan alat za jedan proces — onaj na kome
            se danas gubi vreme ili se posao zagubi: porudžbine, radni nalozi, obračuni,
            izveštaji.
            <br /><a href="#prica">Priča jednog projekta ↓</a>
          </li>
        </ul>
        <p style={{ marginTop: 16, marginBottom: 0 }}>
          Često ide jedno za drugim: sajt dovede upite, a alat se postara da se nijedan
          ne zaboravi. Može i samo jedno — počinjemo od onoga što vam je sada potrebnije.
        </p>
      </section>

      <section className="sw-scope sw-web" id="sajt" aria-labelledby="sw-web-title">
        <div className="sw-tag">Izrada sajta</div>
        <h2 id="sw-web-title">Vaši kupci su već na internetu. Da li tamo nalaze vas?</h2>
        <div className="web-promo-stats">
          {WEB_STATS.map((s) => (
            <div className="web-promo-stat" key={s.value}>
              <span className="web-promo-stat-value">{s.value}</span>
              <span className="web-promo-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
        <StatsSource />
        <p>
          Kada je toliko ljudi na internetu, kupac firmu često prvo potraži tamo. Ako vas nema, ili zatekne sajt
          koji se na telefonu jedva čita, lako ode kod onoga koga je našao. Pravim sajtove
          koji taj prvi utisak rade kako treba:
        </p>
        <ul className="sw-check">
          <li><strong>Dostupni ste 24 sata dnevno.</strong> Ponuda, cene i kontakt na jednom mestu, i kada ne radite.</li>
          <li><strong>Brz je i čita se na telefonu.</strong> Učitava se bez čekanja i ne traži zumiranje.</li>
          <li><strong>Upiti stižu direktno vama.</strong> Kontakt forma i poziv jednim dodirom — bez posrednika i provizije.</li>
          <li><strong>Pretraživači ga razumeju.</strong> Uredna struktura, naslovi i opisi, da vas kupac nađe kada traži ono što nudite.</li>
          <li><strong>Raste sa firmom.</strong> Kada zatreba, na isti sajt se dodaju katalog, poručivanje ili alat po meri.</li>
        </ul>
        <p style={{ marginBottom: 0 }}>
          Kako to izgleda u praksi vidite upravo sada — ovaj sajt sam napravio na isti
          način. <a href="#kontakt">Zakažite besplatan razgovor ↓</a>
        </p>
      </section>

      <article className="sw-story" id="prica">
        <div className="sw-tag">Softver po meri · priča jednog projekta</div>

        <h2>Firma od sedam ljudi kojoj je rast počeo da smeta</h2>
        <p>
          Javila mi se mala proizvodna firma iz Srbije. Sedam zaposlenih, posao ide dobro —
          i upravo to je bio problem.
        </p>
        <p>
          Tražnja je porasla brže nego što je firma stigla da se organizuje. Porudžbine su
          stizale sa tri strane: telefonom, preko Vibera i mejlom. Neko ih je zapisivao u
          svesku, neko u Excel, neko je jednostavno pamtio. Dok je bilo dvadesetak
          porudžbina mesečno, to je funkcionisalo. Kada je broj porastao, počelo je ono
          najskuplje što maloj firmi može da se desi:
        </p>
        <p className="sw-pull">Porudžbina uđe — i niko je ne isprati.</p>
        <p>
          Ne zato što neko ne radi svoj posao. Nego zato što nije postojalo jedno mesto na
          kome se vidi šta je sve otvoreno.
        </p>

        <h2>Nismo počeli od softvera. Počeli smo od pitanja.</h2>
        <p>
          Održali smo nekoliko sastanaka. Nisam pitao „kakav softver hoćete" — pitao sam
          kako posao stvarno teče. Ko primi porudžbinu. Šta se dešava odmah posle toga.
          Gde se najčešće zaglavi. Ko sme šta da vidi, a ko sme šta da menja.
        </p>
        <p>
          Iz tih razgovora izašao je popis zahteva koji je stao na dve strane. Nisu to bile
          funkcionalnosti — bili su problemi, poređani po tome koliko firmu koštaju.
        </p>

        <h2>Šta smo napravili</h2>
        <ul className="sw-list">
          <li>
            <strong>Jedno mesto za sve porudžbine.</strong> Telefon, Viber, mejl — sve
            ulazi u istu listu, sa statusom i odgovornom osobom. Ništa više ne živi u
            nečijoj svesci.
          </li>
          <li>
            <strong>Šifarnik kupaca.</strong> Podaci o kupcu se unose jednom pa se
            povlače. Nema ponovnog kucanja i nema tri verzije iste adrese.
          </li>
          <li>
            <strong>Prava pristupa po ulozi.</strong> Knjigovođa je jedini koji može da
            fakturiše i da porudžbinu označi kao fakturisanu — i vidi samo ono što mu je
            za fakturisanje potrebno. Radionica vidi svoju radnu listu, <strong>bez
            cena</strong>. Vlasnik vidi sve. Svako svoj deo: niko ne gleda tuđe podatke i
            niko slučajno ne menja tuđi korak.
          </li>
          <li>
            <strong>Izveštaji i pregled za vlasnika.</strong> Na jednom ekranu: šta je
            otvoreno, šta kasni, šta je isporučeno. Bez obilaženja i bez pitanja
            „dokle smo stigli".
          </li>
          <li>
            <strong>Radi i na telefonu i na računaru.</strong> Knjigovođa fakturiše za
            računarom, radionica gleda radnu listu sa telefona — isti, uvek ažurni podaci.
            Ništa se ne instalira: otvori se u pregledaču kao i ovaj kalkulator.
          </li>
        </ul>

        <h2>Šta se promenilo</h2>
        <p>
          Od uvođenja alata porudžbine više ne propadaju zato što su se negde zagubile.
          Svaka koja uđe ima svoj status i svog čoveka.
        </p>
        <p>
          To nije „unapređenje procesa". To je prihod koji je ranije odlazio konkurenciji
          zato što se neko nije javio na vreme — i koji sada ostaje u firmi.
        </p>
        <p className="sw-note">
          Ime firme ne navodim: klijente ne objavljujem bez njihove dozvole. Projekat je
          stvaran, a problem nije redak — skoro svaka mala firma koja poraste dođe tačno u
          ovu tačku.
        </p>
      </article>

      <section className="sw-signs" aria-labelledby="sw-signs-title">
        <h2 id="sw-signs-title">Da li vam treba softver po meri?</h2>
        <ul className="sw-check">
          {SIGNS.map((s) => <li key={s}>{s}</li>)}
        </ul>
        <p className="sw-signs-foot">
          Ako ste klimnuli glavom na dve ili više stavki, vredi da popričamo. Razgovor je
          besplatan i ni na šta vas ne obavezuje.
        </p>
      </section>

      <section className="sw-steps" aria-labelledby="sw-steps-title">
        <h2 id="sw-steps-title">Kako to izgleda kod vas</h2>
        <ol className="sw-steplist">
          <li>
            <span className="sw-step-n">1</span>
            <div>
              <strong>Razgovor, 30–45 minuta, besplatno.</strong> Ispričate mi kako posao
              teče. Bez pripreme, bez prezentacije, bez obaveze.
            </div>
          </li>
          <li>
            <span className="sw-step-n">2</span>
            <div>
              <strong>Popis zahteva i procena.</strong> Na papiru dobijate šta bi sajt ili
              alat radio, poređano po prioritetu, plus grubu procenu opsega i cene.
            </div>
          </li>
          <li>
            <span className="sw-step-n">3</span>
            <div>
              <strong>Izrada u fazama.</strong> Prvi upotrebljiv deo dobijate rano i
              koristite ga dok se ostalo radi — greške se vide dok su još jeftine.
            </div>
          </li>
        </ol>
      </section>

      <section className="sw-who" aria-labelledby="sw-who-title">
        <h2 id="sw-who-title">Ko to radi</h2>
        <p>
          Iza mene je više od deset godina rada na velikim poslovnim sistemima (SAP) u
          industriji — automobilskoj, farmaceutskoj, telekomunikacionoj — i sopstveni
          proizvodi na webu, uključujući ovaj kalkulator. Znam kako izgleda proces u
          velikoj firmi i znam da mala firma ne sme da plati takvu složenost. Zato pravim
          najmanji alat koji rešava vaš problem, a ne najveći koji se može prodati.
        </p>
      </section>

      <section className="sw-scope" aria-labelledby="sw-scope-title">
        <h2 id="sw-scope-title">Kakav softver pravim za mala i srednja preduzeća</h2>
        <p>
          Ne pravim univerzalni poslovni softver koji pokriva sve i ne rešava ništa.
          Pravim <strong>jedan alat za jedan proces</strong> — onaj koji vas trenutno
          najviše košta. Najčešće su to:
        </p>
        <ul className="sw-check">
          <li>Evidencija porudžbina i radnih naloga — od prijema do isporuke, sa statusom i odgovornom osobom.</li>
          <li>Zamena zajedničke Excel tabele koju otvara više ljudi i koju je neko već prepisao.</li>
          <li>Interni kalkulatori i obračuni po vašim pravilima — cena, norma, utrošak materijala.</li>
          <li>Alati za knjigovodstvene agencije: obračun i evidencija za više klijenata na jednom mestu.</li>
          <li>Izveštaji za vlasnika: šta je otvoreno, šta kasni, šta je naplaćeno.</li>
          <li>Automatizacija koraka koji se svakog meseca rade ručno — generisanje dokumenata, izvoz, podsetnici.</li>
        </ul>
        <p>
          Sve radi u pregledaču, na telefonu i na računaru. Kako izgleda gotov alat možete
          videti bez ijednog sastanka — <a href="/">kalkulator zarade</a> na ovom sajtu,{" "}
          <a href="/stope-doprinosa-2026">pregled stopa doprinosa</a> i{" "}
          <a href="/pausal">kalkulator za paušalce</a> su moj rad i rade isti posao koji
          bi vaš alat radio za vaš proces.
        </p>
      </section>

      <section className="lead-section" id="kontakt" aria-labelledby="sw-form-title">
        <div className="lead-inner">
          <div className="lead-text">
            <div className="lead-eyebrow">Besplatan razgovor · bez obaveze</div>
            <h2 id="sw-form-title" className="lead-title">Recite mi šta vam treba — sajt, alat ili oboje</h2>
            <p className="lead-body">
              Ostavite kontakt i kratko napišite čime se firma bavi. Javljam se u roku od
              24 sata i dogovaramo termin koji vama odgovara. Ako posle razgovora
              zaključim da vam to ne treba, reći ću vam — to je i dalje bolji
              ishod od projekta koji niko ne koristi.
            </p>
          </div>
          <LeadFormContent onSubmit={submit} form={form} setForm={setForm} status={status} />
        </div>
      </section>

      <section className="sw-faq" aria-labelledby="sw-faq-title">
        <h2 id="sw-faq-title">Česta pitanja</h2>
        {FAQ.map((f) => (
          <details key={f.q} className="sw-faq-item">
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
