// src/schema.js — JSON-LD builders. Pages pass data; no raw JSON in page files.
const SITE = "https://www.platnilistic.rs";

export function breadcrumbLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((it, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": it.name,
      "item": `${SITE}${it.path}`,
    })),
  };
}

export function webAppLd({ name, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "url": `${SITE}${path}`,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "inLanguage": "sr-RS",
    "isAccessibleForFree": true,
    "dateModified": new Date().toISOString().slice(0, 10),
    "provider": { "@type": "Organization", "name": "PlatniListić", "url": `${SITE}/` },
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "RSD" },
  };
}
