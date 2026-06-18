// Server-side proxy for Brevo contact creation.
// Runs only on Vercel's servers — the API key never reaches the browser.
// Reads BREVO_API_KEY from the environment (NOT a VITE_-prefixed var).

const NEWSLETTER_LIST_ID = 3;
const LEAD_LIST_ID = 4;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server not configured" });
  }

  // Vercel parses JSON bodies automatically, but guard for string bodies too.
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { type, email, ime, opis } = body || {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }
  const cleanEmail = email.trim().toLowerCase();

  let payload;
  if (type === "lead") {
    if (!ime) {
      return res.status(400).json({ error: "Missing fields" });
    }
    payload = {
      email: cleanEmail,
      attributes: {
        FIRSTNAME: String(ime).slice(0, 200),
        OPIS: String(opis || "").slice(0, 2000),
      },
      listIds: [LEAD_LIST_ID],
      updateEnabled: true,
    };
  } else {
    payload = {
      email: cleanEmail,
      listIds: [NEWSLETTER_LIST_ID],
      updateEnabled: true,
    };
  }

  try {
    const r = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (r.ok || r.status === 204) {
      return res.status(200).json({ ok: true });
    }
    if (r.status === 400) {
      const data = await r.json().catch(() => ({}));
      // Already subscribed — treat as success for the user.
      if (data.code === "duplicate_parameter") {
        return res.status(200).json({ ok: true, duplicate: true });
      }
      return res.status(400).json({ error: "invalid" });
    }
    return res.status(502).json({ error: "upstream" });
  } catch {
    return res.status(502).json({ error: "network" });
  }
}
