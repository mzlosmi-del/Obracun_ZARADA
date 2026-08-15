import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { POSTS, LIVE_POSTS, REDIRECT_MAP } from "./posts.js";
import { useSeo } from "./seo.jsx";
import { JobsWidget } from "./JobsWidget.jsx";
import { JobSlideIn } from "./JobSlideIn.jsx";

const SITE_URL = "https://www.platnilistic.rs";

// Each post's body + FAQ is its own module, so Vite emits one chunk per article
// and a reader downloads only the one they opened. Previously every body shipped
// in the Blog chunk (~150KB of unread articles) on the LCP critical path.
const POST_MODULES = import.meta.glob("./posts/*.js");

function loadPostBody(id) {
  const load = POST_MODULES[`./posts/${id}.js`];
  if (!load) return Promise.resolve(null);
  return load().catch(() => {
    // A failed article chunk is almost always a stale deploy: the visitor (or
    // Googlebot's renderer) holds an old index.html whose hashed chunk URLs no
    // longer exist. One hard reload picks up the fresh build; the sessionStorage
    // guard prevents a reload loop if the chunk is genuinely unreachable.
    const key = `chunk-retry-${id}`;
    try {
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        window.location.reload();
      }
    } catch { /* sessionStorage unavailable — fall through */ }
    return null;
  });
}

function renderMd(text) {
  let imgN = 0;
  return text.trim()
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    // Blockquotes ("> ") were never handled, so the leading "> " leaked into the
    // paragraph as a literal character - all 40 posts, 89 occurrences, including the
    // "Provereno i azurirano" freshness stamp and the legal disclaimer, i.e. exactly
    // the two trust signals. Tagged per line with a placeholder so the grouping pass
    // can merge consecutive lines into one <blockquote> (5 posts have multi-line
    // quotes) without the greedy-/s bug that once merged every table in a post.
    .replace(/^> (.+)$/gm, '<bq>$1</bq>')
    .replace(/(?:^<bq>.*<\/bq>[ \t]*$\r?\n?)+/gm, (block) =>
      `<blockquote>${block.trim().split(/\r?\n/).map(l => l.replace(/^<bq>/, '').replace(/<\/bq>$/, '')).join(' ')}</blockquote>\n`)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, src) => {
      // First image = hero (LCP): load eagerly + high priority; rest stay lazy.
      const isHero = imgN++ === 0;
      const loadAttr = isHero ? 'fetchpriority="high"' : 'loading="lazy"';
      // Hero photos are self-hosted (public/media/blog) rather than fetched from
      // images.unsplash.com: the cross-origin DNS + TLS + transfer sat directly in
      // front of LCP on throttled mobile. Same responsive WebP widths, served from
      // our own origin. Posts still author these as Unsplash URLs; the photo id is
      // mapped to the local file here.
      if (/images\.unsplash\.com/.test(src)) {
        const id = (src.match(/photo-([a-zA-Z0-9_-]+)/) || [])[1];
        const mk = (w) => `/media/blog/photo-${id}-${w}.webp`;
        if (id) {
          return `<img src="${mk(800)}" srcset="${mk(480)} 480w, ${mk(800)} 800w, ${mk(1200)} 1200w" sizes="(max-width: 700px) 100vw, 680px" alt="${alt}" class="post-img" ${loadAttr} decoding="async" width="800" height="300" />`;
        }
        const u = src.split('?')[0];
        const rmk = (w) => `${u}?w=${w}&fm=webp&q=70`;
        return `<img src="${rmk(800)}" srcset="${rmk(480)} 480w, ${rmk(800)} 800w, ${rmk(1200)} 1200w" sizes="(max-width: 700px) 100vw, 680px" alt="${alt}" class="post-img" ${loadAttr} decoding="async" width="800" height="300" />`;
      }
      // Local images (charts, infographics) render full-size, not cropped to a 300px banner.
      return `<img src="${src}" alt="${alt}" class="post-chart" ${loadAttr} decoding="async" width="1200" height="630" />`;
    })
    .replace(/\[([^\]]+)\]\((\/[^)]*)\)/g, '<a href="$2" class="post-link post-link-internal">$1</a>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="post-link">$1</a>')
    // Drop the markdown separator row (|---|---|) together with its newline, so the
    // header and body rows stay on contiguous lines for the grouping pass below.
    // Matching only pipes/dashes/colons/space keeps real data rows (which contain
    // digits or letters) and em-dash placeholder cells like "| — |" safe.
    .replace(/^\|[\s|:-]+\|[ \t]*\r?\n/gm, '')
    .replace(/^\|(.+)\|[ \t]*$/gm, (m) => {
      // Slice off the leading/trailing pipe rather than filter(Boolean) on the split:
      // filtering silently DROPS a deliberately empty cell, which shifts every later
      // cell one column left for that row.
      const cells = m.trim().replace(/^\|/, '').replace(/\|$/, '').split('|')
        .map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    })
    // Group ONLY consecutive row lines into a table, and promote the first row to
    // a real <thead>/<th>. The previous pattern used /s (dot matches newline) with
    // a greedy .*, so a single match ran from the first <tr> in the article to the
    // last one — collapsing every table in the post into one and swallowing all the
    // prose, headings and lists in between. Anchored per line with no /s flag, each
    // run of adjacent rows becomes its own table.
    .replace(/(?:^<tr>.*<\/tr>[ \t]*$\r?\n?)+/gm, (block) => {
      const rows = block.trim().split(/\r?\n/);
      const head = rows[0].replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>');
      return `<div class="post-table-wrap"><table><thead>${head}</thead><tbody>${rows.slice(1).join('')}</tbody></table></div>\n`;
    })
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(?:^<li>.*<\/li>[ \t]*$\r?\n?)+/gm, (block) => `<ul>${block.trim().split(/\r?\n/).join('')}</ul>\n`)
    // Ordered lists ("1. ", "2. ") — previously unsupported, so a numbered list ran
    // together into a single paragraph. Tagged with a placeholder element first so
    // the grouping pass can tell them apart from bullet <li>s.
    .replace(/^\d+\. (.+)$/gm, '<oli>$1</oli>')
    .replace(/(?:^<oli>.*<\/oli>[ \t]*$\r?\n?)+/gm, (block) =>
      `<ol>${block.trim().split(/\r?\n/).join('').replace(/<oli>/g, '<li>').replace(/<\/oli>/g, '</li>')}</ol>\n`)
    .split(/\n\n+/)
    .map(b => b.startsWith('<') ? b : `<p>${b.replace(/\n/g,' ')}</p>`)
    .join('\n');
}

function isoDate(dateStr) {
  const months = { 'januar':'01','februar':'02','mart':'03','april':'04','maj':'05','jun':'06','jul':'07','avgust':'08','septembar':'09','oktobar':'10','novembar':'11','decembar':'12' };
  const m = dateStr.match(/(\d+)\.\s+(\w+)\s+(\d{4})/);
  if (!m) return new Date().toISOString().slice(0, 10);
  const [, day, month, year] = m;
  return `${year}-${months[month.toLowerCase()] || '01'}-${String(day).padStart(2, '0')}`;
}

function relatedPosts(currentId, tag, limit = 3) {
  // Never surface redirected posts in the related rail.
  const sameTag = LIVE_POSTS.filter(p => p.id !== currentId && p.tag === tag);
  const others = LIVE_POSTS.filter(p => p.id !== currentId && p.tag !== tag);
  return [...sameTag, ...others].slice(0, limit);
}

export function BlogList() {
  useSeo({
    title: "Blog – Vodiči o zaradi, porezu i Zakonu o radu | PlatniListić",
    description: "Vodiči i analize o obračunu zarade u Srbiji: minimalna zarada 2026, doprinosi, prekovremeni rad, otpremnina, godišnji odmor, bolovanje i poreske novine.",
    path: "/blog",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "PlatniListić Blog",
      "url": `${SITE_URL}/blog`,
      "description": "Vodiči i analize o obračunu zarade u Srbiji.",
      "blogPost": LIVE_POSTS.map(p => ({
        "@type": "BlogPosting",
        "headline": p.title,
        "url": `${SITE_URL}/blog/${p.id}`,
        "datePublished": isoDate(p.date),
        "description": p.summary,
      })),
    },
  });

  return (
    <div className="blog-page">
      <div className="blog-header">
        <div className="page-eyebrow">Blog</div>
        <h1 className="page-title">Novosti i vodiči</h1>
        <p className="page-sub">Aktuelne informacije o zaradama, doprinosima i poreskim promenama u Srbiji.</p>
      </div>
      <div className="post-list">
        {LIVE_POSTS.map(post => (
          <Link key={post.id} className="post-card" to={`/blog/${post.id}`} style={{textDecoration:"none", color:"inherit", display:"block"}}>
            <article>
              <div className="post-meta">
                <span className="post-tag">{post.tag}</span>
                <span className="post-date">{post.date}</span>
              </div>
              <h2 className="post-title">{post.title}</h2>
              <p className="post-summary">{post.summary}</p>
              <div className="post-read" aria-hidden="true">Pročitaj više →</div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

function BlogPost({ post, navigate }) {
  const related = relatedPosts(post.id, post.tag);

  const onBodyClick = (e) => {
    const a = e.target.closest('a.post-link-internal');
    if (a) {
      e.preventDefault();
      navigate(a.getAttribute('href'));
    }
  };

  return (
    <article className="blog-page">
      <button className="back-btn" onClick={() => navigate("/blog")} aria-label="Nazad na sve članke">← Svi članci</button>
      <div className="post-meta" style={{marginBottom: 16}}>
        <span className="post-tag">{post.tag}</span>
        <span className="post-date">{post.date}</span>
      </div>
      <h1 className="post-full-title">{post.title}</h1>
      <div className="post-body" onClick={onBodyClick} dangerouslySetInnerHTML={{ __html: renderMd(post.body) }} />

      {post.faq && post.faq.length > 0 && (
        <section className="post-faq" aria-label="Često postavljana pitanja">
          <h2 className="post-faq-title">Često postavljana pitanja</h2>
          {post.faq.map((f, i) => (
            <div className="post-faq-item" key={i}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </section>
      )}

      <JobsWidget placement="blog" />
      <JobSlideIn trigger="exit" placement="blog-exit" />

      <div className="post-cta">
        <p>Proverite tačan obračun vaše zarade koristeći naš besplatni kalkulator — bruto u neto, doprinosi, porez i PDF platni listić u nekoliko sekundi.</p>
        <div className="cta-link-group">
          <Link to="/" className="cta-btn">⚡ Otvorite kalkulator</Link>
          <Link to="/blog" className="cta-btn cta-btn-secondary">← Svi članci</Link>
        </div>
      </div>

      {related.length > 0 && (
        <aside className="post-related" aria-label="Povezani članci">
          <div className="post-related-title">Povezani članci</div>
          <div className="post-related-grid">
            {related.map(p => (
              <Link key={p.id} to={`/blog/${p.id}`} className="post-related-card">
                <div className="post-related-tag">{p.tag}</div>
                <div className="post-related-heading">{p.title}</div>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}

export function BlogPostRoute() {
  const { slug } = useParams();

  // Consolidated slug → canonical page. Return before any other hook so a
  // redirected post never renders its old article (which would keep the stale
  // /blog/ URL alive and split rankings). `replace` mirrors a 301 in the SPA:
  // the redirect is deterministic per slug, so hook order stays stable across
  // renders (a redirected slug always takes this branch and never reaches the
  // hooks below). Belt-and-suspenders with the platform 301 in vercel.json —
  // this one covers client-side navigation and JS-rendered crawls.
  const redirectTo = slug ? REDIRECT_MAP[slug] : undefined;
  if (redirectTo) return <Navigate to={redirectTo} replace />;

  const navigate = useNavigate();
  const meta = POSTS.find(p => p.id === slug);
  // The body/FAQ arrive from the per-article chunk. Hold the whole render until
  // they land: the FAQ feeds JSON-LD via useSeo, and the prerenderer snapshots
  // the page once .post-body exists — emitting markup before the content would
  // bake an empty article and a missing FAQ schema into the static HTML.
  const [content, setContent] = useState(null);
  useEffect(() => {
    let alive = true;
    if (!meta) { setContent(null); return; }
    loadPostBody(meta.id).then(m => { if (alive && m) setContent({ body: m.body, faq: m.faq ?? null }); });
    return () => { alive = false; };
  }, [meta?.id]);

  const post = meta && content ? { ...meta, body: content.body, faq: content.faq } : null;
  // `updated` (optional) bumps dateModified / article:modified_time without
  // touching the original publish date; falls back to the publish date.
  const modified = meta ? isoDate(meta.updated || meta.date) : undefined;

  // SEO is driven by `meta` (posts.js), NOT by `post`: meta is available
  // synchronously, so the correct title/description/JSON-LD are set even while
  // the body chunk is still loading — or if it never loads. Previously this was
  // keyed on `post`, so the loading state advertised itself as
  // "Članak nije pronađen" — Googlebot rendered exactly that during the
  // 4.8.2026 deploy (stale chunk hash → import failed) and indexed the
  // porodiljsko-odsustvo article as a soft 404, dropping it from pos ~4 to
  // page 2. Only the FAQ schema still waits on the chunk, since faq lives there.
  useSeo({
    title: meta ? `${meta.title} | PlatniListić` : "Članak nije pronađen | PlatniListić",
    description: meta ? meta.summary : "Tražena strana nije pronađena.",
    path: meta ? `/blog/${meta.id}` : "/blog",
    image: meta ? meta.ogImage : undefined,
    ogType: meta ? "article" : "website",
    articlePublished: meta ? isoDate(meta.date) : undefined,
    articleModified: modified,
    jsonLd: meta ? [{
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": meta.title,
      "description": meta.summary,
      "datePublished": isoDate(meta.date),
      "dateModified": modified,
      "author": { "@type": "Organization", "name": "PlatniListić", "url": SITE_URL },
      "publisher": {
        "@type": "Organization",
        "name": "PlatniListić",
        "url": SITE_URL,
        "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo.svg` }
      },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${SITE_URL}/blog/${meta.id}` },
      "articleSection": meta.tag,
      "inLanguage": "sr-RS",
      "url": `${SITE_URL}/blog/${meta.id}`,
    }, {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Početna", "item": `${SITE_URL}/` },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}/blog` },
        { "@type": "ListItem", "position": 3, "name": meta.title, "item": `${SITE_URL}/blog/${meta.id}` },
      ],
    }] : null,
    faq: post && post.faq ? post.faq : null,
  });

  // Unknown slug: no such article. Distinct from "known article, body still in
  // flight" (meta set, content null) — rendering the not-found page for that
  // second case would let the prerenderer capture a 404 for a real article.
  if (!meta) return (
    <div className="blog-page">
      <button className="back-btn" onClick={() => navigate("/blog")}>← Svi članci</button>
      <h1 style={{marginTop:32}}>Članak nije pronađen</h1>
    </div>
  );
  if (!post) return <div className="blog-page" />;
  return <BlogPost post={post} navigate={navigate} />;
}
