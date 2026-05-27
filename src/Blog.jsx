import { Link, useNavigate, useParams } from "react-router-dom";
import { POSTS } from "./posts.js";
import { useSeo } from "./seo.jsx";

const SITE_URL = "https://www.platnilistic.rs";

function renderMd(text) {
  return text.trim()
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="post-img" loading="lazy" decoding="async" width="800" height="300" />')
    .replace(/\[([^\]]+)\]\((\/[^)]*)\)/g, '<a href="$2" class="post-link post-link-internal">$1</a>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="post-link">$1</a>')
    .replace(/^\|(.+)\|$/gm, (m) => {
      if (m.includes('---')) return '';
      const cells = m.split('|').filter(Boolean).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>\n?)+/gs, (m) => `<table>${m}</table>`)
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/gs, (m) => `<ul>${m}</ul>`)
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
  const sameTag = POSTS.filter(p => p.id !== currentId && p.tag === tag);
  const others = POSTS.filter(p => p.id !== currentId && p.tag !== tag);
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
      "blogPost": POSTS.map(p => ({
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
        {POSTS.map(post => (
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
  const navigate = useNavigate();
  const post = POSTS.find(p => p.id === slug);

  useSeo({
    title: post ? `${post.title} | PlatniListić` : "Članak nije pronađen | PlatniListić",
    description: post ? post.summary : "Tražena strana nije pronađena.",
    path: post ? `/blog/${post.id}` : "/blog",
    jsonLd: post ? {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.summary,
      "datePublished": isoDate(post.date),
      "dateModified": isoDate(post.date),
      "author": { "@type": "Organization", "name": "PlatniListić", "url": SITE_URL },
      "publisher": {
        "@type": "Organization",
        "name": "PlatniListić",
        "url": SITE_URL,
        "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo.svg` }
      },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.id}` },
      "articleSection": post.tag,
      "inLanguage": "sr-RS",
      "url": `${SITE_URL}/blog/${post.id}`,
    } : null,
    faq: post && post.faq ? post.faq : null,
  });

  if (!post) return (
    <div className="blog-page">
      <button className="back-btn" onClick={() => navigate("/blog")}>← Svi članci</button>
      <h1 style={{marginTop:32}}>Članak nije pronađen</h1>
    </div>
  );
  return <BlogPost post={post} navigate={navigate} />;
}
