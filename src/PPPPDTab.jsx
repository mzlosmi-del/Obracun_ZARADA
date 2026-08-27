import { useState } from "react";
import { SectionTitle, TextInput, ResultRow } from "./ui.jsx";
import { track } from "./track.js";

function generatePPPPD(inputs, r, info) {
  const pad2 = (n) => String(n).padStart(2, "0");
  const fmtXml = (n) => (Math.round((n || 0) * 100) / 100).toFixed(2);
  const period = `${info.year}-${pad2(info.month)}`;
  const datumPlacanja = `${info.year}-${pad2(info.month)}-${pad2(new Date(info.year, info.month, 0).getDate())}`;
  const efektivniSati = r.workedDays * 8 + (inputs.overtimeH || 0);
  const kalendarskiDani = Math.round(r.workedDays + r.sickDaysActual + r.publicHolidayDaysActual);

  const nameParts = (info.employeeName || "Zaposleni").trim().split(" ");
  const prezime = nameParts[0] || "";
  const ime = nameParts.slice(1).join(" ") || "-";

  return `<?xml version="1.0" encoding="UTF-8"?>
<PodaciPoreskeDeklaracije xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <PodaciOPrijavi>
    <VrstaPrijave>1</VrstaPrijave>
    <ObracunskiPeriod>${period}</ObracunskiPeriod>
    <DatumPlacanja>${datumPlacanja}</DatumPlacanja>
  </PodaciOPrijavi>
  <PodaciOIsplatiocu>
    <TipIsplatioca>1</TipIsplatioca>
    <PoreskiIdentifikacioniBroj>${info.companyPib || "000000000"}</PoreskiIdentifikacioniBroj>${info.companyMbr ? `\n    <MaticniBrojisplatioca>${info.companyMbr}</MaticniBrojisplatioca>` : ""}${info.companyName ? `\n    <NazivPrezimeIme>${info.companyName}</NazivPrezimeIme>` : ""}
    <SedistePrebivaliste>${info.companyOpstina || "000"}</SedistePrebivaliste>${info.companyTelefon ? `\n    <Telefon>${info.companyTelefon}</Telefon>` : ""}${info.companyAddress ? `\n    <UlicaIBroj>${info.companyAddress}</UlicaIBroj>` : ""}
    <eMail>${info.companyEmail || "kontakt@firma.rs"}</eMail>
  </PodaciOIsplatiocu>
  <DeklarisaniPrihodi>
    <PodaciOPrihodima>
      <RedniBroj>1</RedniBroj>
      <VrstaIdentifikatoraPrimaoca>1</VrstaIdentifikatoraPrimaoca>
      <IdentifikatorPrimaoca>${info.employeeJmbg || "0000000000000"}</IdentifikatorPrimaoca>
      <Prezime>${prezime}</Prezime>
      <Ime>${ime}</Ime>
      <OznakaPrebivalista>${info.employeeOpstina || "000"}</OznakaPrebivalista>
      <SVP>${info.svp || "111001001"}</SVP>
      <BrojKalendarskihDana>${kalendarskiDani}</BrojKalendarskihDana>
      <BrojEfektivnihSati>${efektivniSati.toFixed(2)}</BrojEfektivnihSati>
      <MesecniFondSati>${(inputs.standardHours || 168).toFixed(2)}</MesecniFondSati>
      <Bruto>${fmtXml(r.bruto1)}</Bruto>
      <OsnovicaPorez>${fmtXml(r.taxBase)}</OsnovicaPorez>
      <Porez>${fmtXml(r.tax)}</Porez>
      <OsnovicaDoprinosi>${fmtXml(r.contribBase)}</OsnovicaDoprinosi>
      <PIO>${fmtXml(r.pio_emp)}</PIO>
      <ZDR>${fmtXml(r.health_emp)}</ZDR>
      <NEZ>${fmtXml(r.unemp)}</NEZ>
      <PIOBen>0.00</PIOBen>
    </PodaciOPrihodima>
  </DeklarisaniPrihodi>
</PodaciPoreskeDeklaracije>`;
}

const OPSTINE = [
  ["000","— nije odabrano —"],["701","Beograd - Stari Grad"],["703","Beograd - Savski Venac"],
  ["705","Beograd - Vračar"],["707","Beograd - Rakovica"],["709","Beograd - Čukarica"],
  ["711","Beograd - Palilula"],["713","Beograd - Zvezdara"],["715","Beograd - Voždovac"],
  ["717","Beograd - Novi Beograd"],["719","Beograd - Zemun"],["721","Beograd - Surčin"],
  ["723","Beograd - Grocka"],["725","Beograd - Lazarevac"],["727","Beograd - Obrenovac"],
  ["729","Beograd - Sopot"],["731","Beograd - Barajevo"],["733","Beograd - Mladenovac"],
  ["101","Novi Sad"],["105","Subotica"],["107","Zrenjanin"],["109","Pančevo"],
  ["111","Sombor"],["113","Kikinda"],["115","Vršac"],["201","Niš"],["203","Leskovac"],
  ["205","Vranje"],["207","Pirot"],["209","Zaječar"],["301","Kragujevac"],["303","Čačak"],
  ["305","Kraljevo"],["307","Kruševac"],["309","Jagodina"],["401","Novi Pazar"],
  ["403","Subotica - ostalo"],["501","Šabac"],["503","Valjevo"],["505","Smederevo"],
];

const SVP_LIST = [
  ["111001001","111001001 — Zarada (redovni rad)"],
  ["111001002","111001002 — Zarada (prekovremeni rad)"],
  ["111002001","111002001 — Naknada zarade (bolovanje do 30 dana)"],
  ["111002002","111002002 — Naknada zarade (godišnji odmor)"],
  ["111002003","111002003 — Naknada zarade (praznik)"],
  ["111005001","111005001 — Regres za godišnji odmor"],
  ["111006001","111006001 — Jubilarna nagrada"],
  ["101001001","101001001 — Zarada preduzetnika"],
];

export default function PPPPDTab({ inputs, r, info, setI }) {
  const [xml, setXml] = useState("");
  const [copied, setCopied] = useState(false);
  const [showXml, setShowXml] = useState(false);

  const generate = () => {
    track("ppppd_generate");
    const generated = generatePPPPD(inputs, r, info);
    setXml(generated);
    setShowXml(true);
    setCopied(false);
  };

  const download = () => {
    track("ppppd_download");
    const pad2 = (n) => String(n).padStart(2, "0");
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PPPPD_${info.companyPib || "PIB"}_${info.year}${pad2(info.month)}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = () => {
    navigator.clipboard.writeText(xml).then(() => {
      track("ppppd_copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const selectStyle = {fontFamily:"var(--sans)", fontSize:13, width:"100%", background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:8, padding:"8px 12px", color:"var(--text)"};

  return (
    <div className="main-grid">
      <div className="card">
        <SectionTitle icon="🏢">Podaci o isplatiocu</SectionTitle>
        <div className="inputs-body">
          <TextInput label="PIB isplatioca" value={info.companyPib} onChange={setI("companyPib")} placeholder="123456789" />
          <TextInput label="Matični broj (MBR)" value={info.companyMbr || ""} onChange={setI("companyMbr")} placeholder="12345678" />
          <TextInput label="Naziv firme" value={info.companyName} onChange={setI("companyName")} placeholder="Firma d.o.o." />
          <TextInput label="Email za kontakt" value={info.companyEmail || ""} onChange={setI("companyEmail")} placeholder="kontakt@firma.rs" />
          <TextInput label="Telefon" value={info.companyTelefon || ""} onChange={setI("companyTelefon")} placeholder="+381 11 123 4567" />
          <TextInput label="Adresa (ulica i broj)" value={info.companyAddress} onChange={setI("companyAddress")} placeholder="Ulica br. 1, Beograd" />
          <div className="input-field">
            <label htmlFor="ppppd-company-opstina">Opština sedišta isplatioca</label>
            <div className="input-wrap">
              <select id="ppppd-company-opstina" value={info.companyOpstina || "000"} onChange={e => setI("companyOpstina")(e.target.value)} style={selectStyle}>
                {OPSTINE.map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <SectionTitle icon="👤">Podaci o primaocu prihoda</SectionTitle>
        <div className="inputs-body">
          <TextInput label="Ime i prezime" value={info.employeeName} onChange={setI("employeeName")} placeholder="Prezime Ime" />
          <TextInput label="JMBG primaoca" value={info.employeeJmbg} onChange={setI("employeeJmbg")} placeholder="0101990000000" />
          <div className="input-field">
            <label htmlFor="ppppd-employee-opstina">Opština prebivališta primaoca</label>
            <div className="input-wrap">
              <select id="ppppd-employee-opstina" value={info.employeeOpstina || "000"} onChange={e => setI("employeeOpstina")(e.target.value)} style={selectStyle}>
                {OPSTINE.map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="input-field">
            <label htmlFor="ppppd-svp">Šifra vrste prihoda (ŠVP)</label>
            <div className="input-wrap">
              <select id="ppppd-svp" value={info.svp || "111001001"} onChange={e => setI("svp")(e.target.value)} style={{...selectStyle, fontFamily:"var(--mono)", fontSize:12}}>
                {SVP_LIST.map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        <SectionTitle icon="📋">Pregled vrednosti za prijavu</SectionTitle>
        <div className="results-body" style={{margin:"0 16px 16px"}}>
          {r.mealAmount > 0 && <ResultRow label="Topli obrok (u Bruto 1)" value={r.mealAmount} sub="oporezivo" />}
          {r.regresAmount > 0 && <ResultRow label="Regres (u Bruto 1)" value={r.regresAmount} sub="oporezivo" />}
          <ResultRow label="Bruto 1 (pos. 3.9)" value={r.bruto1} />
          <ResultRow label="Osnovica za porez (pos. 3.10)" value={r.taxBase} />
          <ResultRow label="Porez (pos. 3.11)" value={r.tax} />
          <ResultRow label="Osnovica za doprinose (pos. 3.12)" value={r.contribBase} />
          <ResultRow label="PIO — zaposleni (pos. 3.13)" value={r.pio_emp} />
          <ResultRow label="Zdravstvo — zaposleni (pos. 3.14)" value={r.health_emp} />
          <ResultRow label="Nezaposlenost — zaposleni (pos. 3.15)" value={r.unemp} />
        </div>

        <div style={{padding:"0 16px 16px", display:"flex", flexDirection:"column", gap:10}}>
          <button className="btn-pdf btn-pdf-full" onClick={generate} style={{background:"var(--accent)", margin: 0, width: "100%"}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            Generiši PPP-PD XML
          </button>
          {xml && (
            <div style={{display:"flex", gap:8}}>
              <button className="btn-pdf" onClick={download} style={{flex:1, background:"#00a33b", margin: 0, justifyContent: "center"}}>
                ⬇ Preuzmi .xml fajl
              </button>
              <button className="btn-pdf" onClick={copy} style={{flex:1, background: copied ? "#00a33b" : "var(--surface2)", color: copied ? "white" : "var(--text)", margin: 0, justifyContent: "center"}}>
                {copied ? "✓ Kopirano!" : "📋 Kopiraj XML"}
              </button>
            </div>
          )}
        </div>
      </div>

      {showXml && xml && (
        <div className="card full-width">
          <SectionTitle icon="📄">Generisani XML</SectionTitle>
          <div className="ppppd-note">
            ⚠️ Pre upload-a na portal ePorezi, proverite sve podatke. Prijava je vaša odgovornost.
          </div>
          <pre className="xml-preview">{xml}</pre>
        </div>
      )}
    </div>
  );
}
