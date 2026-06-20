import { readFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = join(process.cwd(), "dist");
const ROUTES = [
  "bruto-neto", "neto-bruto", "pausal", "bolovanje", "otpremnina", "minuli-rad",
  "minimalna-zarada-2026", "radni-dani-2026", "praznici-2026",
  "dodaci-na-zaradu", "godisnji-porez", "ugovor-o-delu",
  "prosecna-zarada", "neoporezivi-iznos-2026", "stope-doprinosa-2026",
];

let failures = 0;
function check(cond, msg) { if (!cond) { console.error(`✗ ${msg}`); failures++; } }

for (const slug of ROUTES) {
  const failuresBefore = failures;
  let html;
  try { html = await readFile(join(DIST, slug, "index.html"), "utf8"); }
  catch { console.error(`✗ ${slug}: missing dist/${slug}/index.html`); failures++; continue; }

  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  check(h1Count === 1, `${slug}: expected exactly 1 <h1>, found ${h1Count}`);

  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  check(title.length > 0 && title.length <= 65, `${slug}: title length ${title.length} (want 1..65)`);

  const desc = (html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/) || [])[1] || "";
  check(desc.length > 0 && desc.length <= 165, `${slug}: description length ${desc.length} (want 1..165)`);

  const canon = (html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/) || [])[1] || "";
  check(canon.includes(`/${slug}`), `${slug}: canonical missing slug (${canon})`);
  check(canon.startsWith("https://www.platnilistic.rs"), `${slug}: canonical not www (${canon})`);

  const ldBlocks = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g) || [];
  check(ldBlocks.length >= 1, `${slug}: no JSON-LD found`);
  for (const b of ldBlocks) {
    const json = b.replace(/<script[^>]*>/, "").replace(/<\/script>/, "");
    try { JSON.parse(json); } catch { check(false, `${slug}: JSON-LD does not parse`); }
  }
  if (failures === failuresBefore) console.log(`✓ ${slug}`);
}

if (failures > 0) { console.error(`\ncheck-seo: ${failures} failure(s).`); process.exit(1); }
console.log(`\ncheck-seo: all ${ROUTES.length} routes pass.`);
