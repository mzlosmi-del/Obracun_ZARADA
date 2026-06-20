import { preview } from "vite";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdir, writeFile, readFile, readdir } from "node:fs/promises";
import { POSTS } from "../src/posts.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const SITE_URL = "https://www.platnilistic.rs";

const STATIC_ROUTES = ["/", "/blog", "/o-nama", "/privatnost", "/uslovi", "/bruto-neto", "/neto-bruto", "/pausal", "/bolovanje", "/otpremnina", "/minuli-rad", "/dodaci-na-zaradu", "/godisnji-porez", "/ugovor-o-delu", "/minimalna-zarada-2026", "/radni-dani-2026", "/praznici-2026", "/prosecna-zarada", "/neoporezivi-iznos-2026", "/stope-doprinosa-2026"];
const ROUTES = [...STATIC_ROUTES, ...POSTS.map((p) => `/blog/${p.id}`)];

const MONTHS = {
  januar: "01", februar: "02", mart: "03", april: "04", maj: "05", jun: "06",
  jul: "07", avgust: "08", septembar: "09", oktobar: "10", novembar: "11", decembar: "12",
};

function isoDate(dateStr) {
  const m = dateStr.match(/(\d+)\.\s+(\w+)\s+(\d{4})/);
  if (!m) return new Date().toISOString().slice(0, 10);
  const [, day, month, year] = m;
  return `${year}-${MONTHS[month.toLowerCase()] || "01"}-${String(day).padStart(2, "0")}`;
}

function outPathFor(route) {
  if (route === "/") return join(DIST, "index.html");
  return join(DIST, route.replace(/^\//, ""), "index.html");
}

function sitemapXml() {
  const meta = {
    "/": { changefreq: "monthly", priority: "1.0", lastmod: new Date().toISOString().slice(0, 10) },
    "/blog": { changefreq: "weekly", priority: "0.9", lastmod: new Date().toISOString().slice(0, 10) },
    "/o-nama": { changefreq: "monthly", priority: "0.6", lastmod: new Date().toISOString().slice(0, 10) },
    "/privatnost": { changefreq: "yearly", priority: "0.3", lastmod: "2025-02-01" },
    "/uslovi": { changefreq: "yearly", priority: "0.3", lastmod: "2025-02-01" },
    "/bruto-neto": { changefreq: "monthly", priority: "0.8", lastmod: new Date().toISOString().slice(0, 10) },
    "/neto-bruto": { changefreq: "monthly", priority: "0.8", lastmod: new Date().toISOString().slice(0, 10) },
    "/pausal": { changefreq: "monthly", priority: "0.8", lastmod: new Date().toISOString().slice(0, 10) },
    "/bolovanje": { changefreq: "monthly", priority: "0.8", lastmod: new Date().toISOString().slice(0, 10) },
    "/otpremnina": { changefreq: "monthly", priority: "0.8", lastmod: new Date().toISOString().slice(0, 10) },
    "/minuli-rad": { changefreq: "monthly", priority: "0.8", lastmod: new Date().toISOString().slice(0, 10) },
    "/dodaci-na-zaradu": { changefreq: "monthly", priority: "0.8", lastmod: new Date().toISOString().slice(0, 10) },
    "/godisnji-porez": { changefreq: "monthly", priority: "0.8", lastmod: new Date().toISOString().slice(0, 10) },
    "/ugovor-o-delu": { changefreq: "monthly", priority: "0.8", lastmod: new Date().toISOString().slice(0, 10) },
    "/minimalna-zarada-2026": { changefreq: "yearly", priority: "0.7", lastmod: new Date().toISOString().slice(0, 10) },
    "/radni-dani-2026": { changefreq: "yearly", priority: "0.7", lastmod: new Date().toISOString().slice(0, 10) },
    "/praznici-2026": { changefreq: "yearly", priority: "0.7", lastmod: new Date().toISOString().slice(0, 10) },
    "/prosecna-zarada": { changefreq: "yearly", priority: "0.7", lastmod: new Date().toISOString().slice(0, 10) },
    "/neoporezivi-iznos-2026": { changefreq: "yearly", priority: "0.7", lastmod: new Date().toISOString().slice(0, 10) },
    "/stope-doprinosa-2026": { changefreq: "yearly", priority: "0.7", lastmod: new Date().toISOString().slice(0, 10) },
  };
  const entries = [];
  for (const r of STATIC_ROUTES) {
    const m = meta[r];
    entries.push({ loc: r, lastmod: m.lastmod, changefreq: m.changefreq, priority: m.priority });
  }
  for (const p of POSTS) {
    entries.push({ loc: `/blog/${p.id}`, lastmod: isoDate(p.date), changefreq: "yearly", priority: "0.8" });
  }
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${SITE_URL}${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
    )
    .join("\n\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n${urls}\n\n</urlset>\n`;
}

async function run() {
  const server = await preview({ preview: { port: 4191, strictPort: true } });
  const base = `http://localhost:4191`;

  // Read the built main CSS so we can inline it into each prerendered page.
  // This removes the render-blocking stylesheet request on the critical path,
  // which is the main lever for FCP/LCP on mobile (CSS gated first paint).
  let inlineCss = "";
  try {
    const assetsDir = join(DIST, "assets");
    const cssFile = (await readdir(assetsDir)).find((f) => /^index-.*\.css$/.test(f));
    if (cssFile) inlineCss = await readFile(join(assetsDir, cssFile), "utf8");
  } catch {
    /* if not found, pages fall back to the external stylesheet */
  }

  chromium.setGraphicsMode = false;
  // Local dev: set PUPPETEER_EXECUTABLE_PATH to a system Chrome/Edge binary so
  // prerendering works off-Lambda. On Vercel the var is unset and we fall back
  // to the bundled @sparticuz/chromium binary — production build is unchanged.
  const localChrome = process.env.PUPPETEER_EXECUTABLE_PATH;
  const browser = await puppeteer.launch({
    args: localChrome
      ? ["--no-sandbox", "--disable-setuid-sandbox"]
      : [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: localChrome || (await chromium.executablePath()),
    headless: true,
  });

  let failures = 0;
  for (const route of ROUTES) {
    const page = await browser.newPage();
    try {
      await page.goto(base + route, { waitUntil: "networkidle0", timeout: 30000 });
      await page.waitForFunction(() => document.getElementById("root")?.children.length > 0, { timeout: 15000 });
      // Confirm useSeo ran for THIS route (canonical reflects the path).
      await page.waitForFunction(
        (expected) => {
          const el = document.querySelector('link[rel="canonical"]');
          if (!el) return false;
          const path = new URL(el.href).pathname.replace(/\/$/, "") || "/";
          return path === expected;
        },
        { timeout: 15000 },
        route
      );
      if (route.startsWith("/blog/")) {
        await page.waitForSelector(".post-body", { timeout: 15000 });
      }
      let html = "<!DOCTYPE html>\n" + (await page.content()).replace(/^<!DOCTYPE html>/i, "");
      // Inline the main CSS and drop the render-blocking <link> so first paint
      // doesn't wait on a network round-trip for the stylesheet.
      if (inlineCss) {
        html = html.replace(
          /<link\b[^>]*rel="stylesheet"[^>]*href="\/assets\/index-[^"]*\.css"[^>]*>/i,
          `<style>${inlineCss}</style>`
        );
      }
      const out = outPathFor(route);
      await mkdir(dirname(out), { recursive: true });
      await writeFile(out, html, "utf8");
      console.log(`✓ prerendered ${route} → ${out.replace(DIST, "dist")}`);
    } catch (err) {
      failures++;
      console.error(`✗ FAILED ${route}: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));

  await writeFile(join(DIST, "sitemap.xml"), sitemapXml(), "utf8");
  console.log(`✓ wrote dist/sitemap.xml (${ROUTES.length} routes)`);

  if (failures > 0) {
    console.error(`\nPrerender failed for ${failures} route(s).`);
    process.exit(1);
  }
  console.log(`\nPrerendered ${ROUTES.length} routes successfully.`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
