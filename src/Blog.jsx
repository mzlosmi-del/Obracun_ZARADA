import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { POSTS } from "./posts.js";

function renderMd(text) {
  return text.trim()
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="post-img" loading="lazy" decoding="async" width="800" height="300" />')
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

export function BlogList() {
  useEffect(() => {
    document.title = "Blog – Novosti i vodiči o zaradi | PlatniListić";
    return () => { document.title = "Platni Listić – Kalkulator Bruto Neto Zarade Srbija 2026 | PlatniListić"; };
  }, []);

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
              <h3 className="post-title">{post.title}</h3>
              <p className="post-summary">{post.summary}</p>
              <div className="post-read" aria-hidden="true">Pročitaj više →</div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

function BlogPost({ post, onBack }) {
  return (
    <article className="blog-page">
      <button className="back-btn" onClick={onBack} aria-label="Nazad na sve članke">← Svi članci</button>
      <div className="post-meta" style={{marginBottom: 16}}>
        <span className="post-tag">{post.tag}</span>
        <span className="post-date">{post.date}</span>
      </div>
      <h1 className="post-full-title">{post.title}</h1>
      <div className="post-body" dangerouslySetInnerHTML={{ __html: renderMd(post.body) }} />
      <div className="post-cta">
        <p>Proverite tačan obračun vaše zarade koristeći naš besplatni kalkulator.</p>
        <button className="cta-btn" onClick={onBack}>← Nazad na blog</button>
      </div>
    </article>
  );
}

export function BlogPostRoute() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = POSTS.find(p => p.id === slug);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | PlatniListić`;
    }
    return () => { document.title = "Platni Listić – Kalkulator Bruto Neto Zarade Srbija 2026 | PlatniListić"; };
  }, [post]);

  if (!post) return (
    <div className="blog-page">
      <button className="back-btn" onClick={() => navigate("/blog")}>← Svi članci</button>
      <h1 style={{marginTop:32}}>Članak nije pronađen</h1>
    </div>
  );
  return <BlogPost post={post} onBack={() => navigate("/blog")} />;
}
