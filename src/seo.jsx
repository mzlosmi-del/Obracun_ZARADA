import { useEffect } from "react";

const SITE_URL = "https://www.platnilistic.rs";
const DEFAULT_TITLE = "Platni Listić – Kalkulator Bruto Neto Zarade Srbija 2026 | PlatniListić";
const DEFAULT_DESCRIPTION = "Besplatni online platni listić i kalkulator bruto neto zarade u Srbiji za 2026. godinu. Obračun poreza, doprinosa, bolovanja, minulog rada, regresa i PDF export.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

function setMeta(name, content, attr = "name") {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = url;
}

export function useSeo({ title, description, path = "/", image, jsonLd, faq }) {
  const jsonLdStr = jsonLd ? JSON.stringify(jsonLd) : "";
  const faqLd = faq && faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faq.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a },
        })),
      }
    : null;
  const faqLdStr = faqLd ? JSON.stringify(faqLd) : "";

  useEffect(() => {
    const fullTitle = title || DEFAULT_TITLE;
    const desc = description || DEFAULT_DESCRIPTION;
    const url = `${SITE_URL}${path}`;
    const img = image || DEFAULT_OG_IMAGE;

    document.title = fullTitle;
    setMeta("description", desc);
    setCanonical(url);

    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", desc, "property");
    setMeta("og:url", url, "property");
    setMeta("og:image", img, "property");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:url", url);
    setMeta("twitter:image", img);

    const ROUTE_LD_ID = "route-jsonld";
    const prev = document.getElementById(ROUTE_LD_ID);
    if (prev) prev.remove();
    const FAQ_LD_ID = "route-faq-jsonld";
    const prevFaq = document.getElementById(FAQ_LD_ID);
    if (prevFaq) prevFaq.remove();

    let scriptEl = null;
    if (jsonLdStr) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.id = ROUTE_LD_ID;
      scriptEl.textContent = jsonLdStr;
      document.head.appendChild(scriptEl);
    }

    let faqEl = null;
    if (faqLdStr) {
      faqEl = document.createElement("script");
      faqEl.type = "application/ld+json";
      faqEl.id = FAQ_LD_ID;
      faqEl.textContent = faqLdStr;
      document.head.appendChild(faqEl);
    }

    return () => {
      if (scriptEl && scriptEl.parentNode) scriptEl.parentNode.removeChild(scriptEl);
      if (faqEl && faqEl.parentNode) faqEl.parentNode.removeChild(faqEl);
    };
  }, [title, description, path, image, jsonLdStr, faqLdStr]);
}
