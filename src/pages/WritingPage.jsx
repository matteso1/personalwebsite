import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listPosts } from "../lib/posts";
import { useAuth } from "../lib/useAuth";

function fmt(iso) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function WritingPage() {
  const [posts, setPosts] = useState([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    listPosts().then((p) =>
      setPosts([...p].sort((a, b) => new Date(b.date) - new Date(a.date)))
    );
  }, []);

  return (
    <div className="q-page">
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <h1 className="q-name" style={{ marginBottom: 0 }}>
          Writing<em>.</em>
        </h1>
        {isAdmin && (
          <Link to="/writing/new" className="q-mono" style={{ fontSize: 12, color: "var(--c-green)", textDecoration: "none" }}>
            + new
          </Link>
        )}
      </div>
      <p className="q-tagline" style={{ marginBottom: 32 }}>
        Notes, mostly on systems and ML infra. Posted when I think I've
        figured something out.
      </p>

      <ul className="q-posts">
        {posts.map((p) => (
          <li key={p.slug} style={{ paddingTop: 18, paddingBottom: 18 }}>
            <div className="q-post-meta">{fmt(p.date)} · {p.readTime}</div>
            <Link to={`/writing/${p.slug}`} className="q-post-title" style={{ fontSize: 21 }}>
              {p.title}
            </Link>
            <div className="q-post-sub">{p.subtitle}</div>
            {p.tags && (
              <div className="q-mono" style={{ fontSize: 11, color: "var(--ink-ghost)", marginTop: 6, letterSpacing: "0.04em" }}>
                {p.tags.slice(0, 5).map((t) => t.toLowerCase()).join(" · ")}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
