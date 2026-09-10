// src/lead.jsx — the "softver po meri" lead funnel.
//
// One module owns the whole custom-software funnel so App.jsx does not carry a
// second copy of it:
//   • LeadFormContent  — the form itself (name, email, description, consent)
//   • LeadModalHost    — mounted once at the app root; listens for the
//                        "open-lead-modal" event that ProCTA dispatches inside
//                        the professional calculator tabs
//   • BlogSoftwareCTA   — the end-of-post card on allowlisted business posts
//
// The /softver-po-meri landing page itself lives in src/SoftverPoMeri.jsx and
// must NOT be moved here: this module is statically imported, so folding the
// lazy route in would ship the whole case study in the main bundle.
//
// Placement rule (decided 10.9.2026): this funnel lives on the PROFESSIONAL
// surfaces (Obračun / Stope / PPP-PD tabs) and on its own landing page — NOT on
// the homepage. The homepage keeps the jobs affiliate banner, because homepage
// traffic is employees checking their net salary and they cannot buy software.
// See project memory: lead-funnel-strategy.
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { track } from "./track.js";

export const LEAD_PATH = "/softver-po-meri";
// Kept for the Service JSON-LD only. There is deliberately NO mailto: link and
// no visible address on this page — every enquiry goes through the form so it
// is captured in Brevo and counted by `lead_submit`. A mailto: bypasses both.
export const CONTACT_EMAIL = "kontakt@platnilistic.rs";

// ── FORM ─────────────────────────────────────────────────────────────────────

// Shared submit logic. `source` is a fixed label (never a user value) so we can
// tell which surface produced the lead — see the allowlist in track.js.
export function useLeadForm(source) {
  const [form, setForm] = useState({ ime: "", email: "", opis: "", saglasnost: false });
  const [status, setStatus] = useState("idle");

  const submit = useCallback(async (e) => {
    e.preventDefault();
    if (!form.ime || !form.email.includes("@") || !form.saglasnost) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "lead",
          email: form.email.trim().toLowerCase(),
          ime: form.ime,
          opis: form.opis,
        }),
      });
      // Only a 2xx means the lead actually reached Brevo. Do NOT treat 400 as
      // success (the old newsletter code did): /api/subscribe returns 400 only
      // on real failures — invalid email, missing fields, Brevo rejecting the
      // contact. An already-existing contact comes back as 200 {duplicate:true},
      // so 400 buys nothing and telling the visitor "Upit primljen!" when we
      // never got the lead is the worst outcome this form can produce.
      if (res.ok) {
        setStatus("success");
        track("lead_submit", source);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }, [form, source]);

  return { form, setForm, status, submit };
}

export function LeadFormContent({ onSubmit, form, setForm, status }) {
  if (status === "success") return (
    <div className="lead-success" role="status">
      <div className="lead-success-icon" aria-hidden="true">✓</div>
      <div className="lead-success-title">Upit primljen!</div>
      <div className="lead-success-sub">Javljam se u roku od 24 sata — bez obaveze.</div>
    </div>
  );
  const canSubmit = form.ime && form.email.includes("@") && form.saglasnost && status !== "loading";
  return (
    <form className="lead-form" onSubmit={onSubmit}>
      <label htmlFor="lead-ime" className="visually-hidden">Ime i prezime</label>
      <input id="lead-ime" className="lead-input" type="text" placeholder="Ime i prezime" autoComplete="name" value={form.ime} onChange={e => setForm(f => ({...f, ime: e.target.value}))} disabled={status === "loading"} required />
      <label htmlFor="lead-email" className="visually-hidden">Email adresa</label>
      <input id="lead-email" className="lead-input" type="email" placeholder="Email adresa" autoComplete="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} disabled={status === "loading"} required />
      <label htmlFor="lead-opis" className="visually-hidden">Opis problema (opciono)</label>
      <textarea id="lead-opis" className="lead-input lead-textarea" placeholder="Ukratko: čime se firma bavi i gde se posao najčešće zaglavi? (opciono)" value={form.opis} onChange={e => setForm(f => ({...f, opis: e.target.value}))} disabled={status === "loading"} rows={3} />

      {/* Zakon o zaštiti podataka o ličnosti / GDPR: an explicit, unticked,
          separate consent box is what makes this collection lawful. Do not
          pre-tick it and do not make the form submittable without it. */}
      <label className="lead-consent">
        <input
          type="checkbox"
          checked={form.saglasnost}
          onChange={e => setForm(f => ({...f, saglasnost: e.target.checked}))}
          disabled={status === "loading"}
          required
        />
        <span>
          Saglasan/na sam da se moji podaci koriste isključivo radi odgovora na ovaj upit.
          Ne šaljemo newsletter niti podatke prosleđujemo trećim licima.{" "}
          <Link to="/privatnost" className="lead-consent-link">Politika privatnosti</Link>
        </span>
      </label>

      <button className="lead-btn" type="submit" disabled={!canSubmit}>
        {status === "loading" ? "Šaljem..." : "Zakažite besplatan razgovor →"}
      </button>
      {status === "error" && <div className="brevo-error" role="alert">Slanje nije uspelo. Proverite internet vezu i pokušajte ponovo za koji trenutak.</div>}
    </form>
  );
}

// ── BLOG CTA ─────────────────────────────────────────────────────────────────
// Rendered at the end of allowlisted business-owner posts (src/software.js), in
// the slot the jobs widget occupies on employee-facing posts. Links to the case
// study rather than opening the form: this reader is mid-article and cold, and
// the story is what does the selling.
export function BlogSoftwareCTA({ placement }) {
  return (
    <aside className="blog-swcta" aria-label="Softver po meri za firme">
      <div className="blog-swcta-eyebrow">Za vlasnike firmi</div>
      <h3 className="blog-swcta-title">Firma raste, a posao se sve češće zaglavi?</h3>
      <p className="blog-swcta-body">
        Kada porudžbine stignu na tri kanala i evidencija živi u svesci i Excel
        tabeli, prva stvar koja se gubi je porudžbina koju niko nije ispratio.
        Napisao sam kako je to rešeno u jednoj proizvodnoj firmi od sedam ljudi —
        šta smo pitali, šta smo napravili i šta se promenilo.
      </p>
      <Link
        className="blog-swcta-btn"
        to={LEAD_PATH}
        onClick={() => track("lead_page_click", placement || "blog")}
      >
        Pročitajte priču projekta →
      </Link>
    </aside>
  );
}

// ── MODAL HOST ───────────────────────────────────────────────────────────────
// Mounted once at the app root. ProCTA (inside the professional tabs) dispatches
// "open-lead-modal"; this opens the form over the page on any screen size, so a
// user never loses the calculator state they were in the middle of.
export function LeadModalHost() {
  const [open, setOpen] = useState(false);
  const { form, setForm, status, submit } = useLeadForm("modal");

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-lead-modal", handler);
    return () => window.removeEventListener("open-lead-modal", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  return (
    <div className="lead-modal-overlay lead-modal-overlay--any" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">
      <div className="lead-modal" onClick={e => e.stopPropagation()}>
        <button className="lead-modal-close" onClick={() => setOpen(false)} aria-label="Zatvori">✕</button>
        <div className="lead-eyebrow">Za firme i knjigovođe · softver po meri</div>
        <h2 id="lead-modal-title" className="lead-title" style={{marginBottom:10}}>Vašoj firmi treba alat koji radi posao umesto vas?</h2>
        <p className="lead-body" style={{marginBottom:16}}>
          Ostavite kontakt i javljam se u roku od 24 sata. Prvi razgovor je besplatan i bez obaveze —{" "}
          <Link to={LEAD_PATH} className="lead-consent-link" onClick={() => setOpen(false)}>pročitajte kako je izgledao jedan projekat</Link>.
        </p>
        <LeadFormContent onSubmit={submit} form={form} setForm={setForm} status={status} />
      </div>
    </div>
  );
}
