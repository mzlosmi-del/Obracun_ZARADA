import { useState, useEffect, useRef } from "react";

export const fmt = (n) => new Intl.NumberFormat("sr-RS", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);
export const pct = (n) => (n * 100).toFixed(2) + "%";

let inputCounter = 0;
const nextId = () => `pl-input-${++inputCounter}`;

export const NumberInput = ({ label, value, onChange, unit = "RSD", min = 0, step = 1, sublabel }) => {
  const [raw, setRaw] = useState(String(value));
  const idRef = useRef();
  if (!idRef.current) idRef.current = nextId();

  useEffect(() => {
    if (parseFloat(raw) !== value && raw !== "" && raw !== "-") {
      setRaw(String(value));
    }
  }, [value]);

  const handleChange = (e) => {
    const str = e.target.value;
    setRaw(str);
    const parsed = parseFloat(str);
    if (!isNaN(parsed)) onChange(parsed);
    else if (str === "" || str === "-") onChange(0);
  };

  const handleBlur = () => {
    const parsed = parseFloat(raw);
    const clamped = isNaN(parsed) ? 0 : Math.max(min, parsed);
    setRaw(String(clamped));
    onChange(clamped);
  };

  return (
    <div className="input-field">
      <label htmlFor={idRef.current}>{label}{sublabel && <span className="sublabel">{sublabel}</span>}</label>
      <div className="input-wrap">
        <input
          id={idRef.current}
          type="text"
          inputMode="decimal"
          value={raw}
          step={step}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{ fontFamily: "var(--mono)" }}
        />
        <span className="unit" aria-hidden="true">{unit}</span>
      </div>
    </div>
  );
};

export const TextInput = ({ label, value, onChange, placeholder = "" }) => {
  const idRef = useRef();
  if (!idRef.current) idRef.current = nextId();
  return (
    <div className="input-field">
      <label htmlFor={idRef.current}>{label}</label>
      <div className="input-wrap">
        <input id={idRef.current} type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={{ fontFamily: "var(--sans)" }} />
      </div>
    </div>
  );
};

export const ResultRow = ({ label, value, type = "neutral", sub }) => (
  <div className={`result-row ${type}`}>
    <span className="result-label">{label}{sub && <span className="result-sub">{sub}</span>}</span>
    <span className="result-value">{fmt(value)} <span className="rsd">RSD</span></span>
  </div>
);

export const SectionTitle = ({ children, icon }) => (
  <div className="section-title"><span className="section-icon" aria-hidden="true">{icon}</span><span>{children}</span></div>
);

export function AnimatedNum({ value }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const start = prev.current, end = value, dur = 400, t0 = performance.now();
    let raf = 0;
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
      setDisplay(start + (end - start) * ease);
      if (p < 1) raf = requestAnimationFrame(tick); else prev.current = end;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span>{fmt(display)}</span>;
}

export function GaugeBar({ label, value, max, color }) {
  const pctVal = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="gauge">
      <div className="gauge-header"><span>{label}</span><span style={{ color }}>{fmt(value)} RSD</span></div>
      <div className="gauge-track"><div className="gauge-fill" style={{ width: `${Math.min(pctVal, 100)}%`, background: color }} /></div>
    </div>
  );
}
