// src/track.js — own event wrapper.
//
// One place that knows about analytics. Call sites only know track("event").
// To add or swap a tool later (PostHog, Umami), edit send() below and nothing
// else in the codebase changes.
//
// RULES — do not break these:
//  1. NEVER pass a user-entered value. Labels and booleans only.
//     No PIB, JMBG, name, address, bank account, or salary figure.
//     The calculator is 100% client-side and must stay that way.
//  2. Production hostname only. Local and preview builds stay silent.
//  3. Never throws. Analytics must not be able to break the calculator.

const PROD_HOST = /(^|\.)platnilistic\.rs$/;

// The complete contract: every event that may fire, and every detail value it
// may carry. Anything not listed here is dropped. This is deliberately a hard
// allowlist and not a sanitiser — a sanitiser lets new strings through by
// default, and the one thing that must never happen is a user-entered value
// (PIB, JMBG, name, address, bank account, salary) reaching an analytics call.
// Adding an event means editing this table, which is the point.
const RATE_FIELDS = [
  "taxRate", "nonTaxable", "pioPct_emp", "health_emp", "unemp_emp",
  "pio_er", "health_er", "overtimeCoef", "nightCoef", "weekendCoef",
  "holidayCoef", "minBase", "maxBase", "mealDaily", "transportMax", "minWage",
];

const EVENTS = {
  ppppd_generate:      [],           // clicked "Generiši PPP-PD XML" — employer/bookkeeper
  ppppd_download:      [],           // took the .xml file
  ppppd_copy:          [],           // copied XML (pasting into another system)
  payslip_pdf:         [],           // generated a PDF payslip — an employer act
  company_pib_entered: ["valid"],    // a complete 9-digit PIB was typed. Value NEVER sent
  rates_edited:        RATE_FIELDS,  // overrode a statutory rate — only a professional
};

// Returns the path suffix, or null if this call is not permitted.
function suffixFor(event, detail) {
  const allowed = EVENTS[event];
  if (!allowed) return null;                       // unknown event
  if (detail === undefined || detail === null) {
    return allowed.length === 0 ? "" : null;       // detail required but missing
  }
  return allowed.includes(detail) ? `/${detail}` : null;
}

function isProd() {
  try { return PROD_HOST.test(window.location.hostname); } catch { return false; }
}

function send(path, event) {
  try {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path, title: `event: ${event}`, event: true });
    }
  } catch { /* no-op */ }
  // Second sink goes here when we add one. Call sites never change.
}

export function track(event, detail) {
  const tail = suffixFor(event, detail);
  if (tail === null || !isProd()) return;
  send(`evt/${event}${tail}`, event);
}

// Fire at most once per browser session. Use for "state reached" events so one
// person editing one field ten times counts as one professional, not ten.
export function trackOnce(event, detail) {
  if (suffixFor(event, detail) === null) return;
  const key = `pl_evt:${event}:${detail || ""}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch { /* private mode — fall through and count it */ }
  track(event, detail);
}
