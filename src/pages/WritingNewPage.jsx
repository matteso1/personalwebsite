import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../lib/useAuth";
import { upsertPost, getPost } from "../lib/posts";
import { isSupabaseConfigured } from "../lib/supabase";

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function WritingNewPage() {
  const { slug: editSlug } = useParams();
  const navigate = useNavigate();
  const { user, loading, isAdmin, signInWithGitHub } = useAuth();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [readTime, setReadTime] = useState("");
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [hydrated, setHydrated] = useState(false);

  React.useEffect(() => {
    if (!editSlug || hydrated) return;
    getPost(editSlug).then((p) => {
      if (p) {
        setTitle(p.title || "");
        setSubtitle(p.subtitle || "");
        setSlug(p.slug || "");
        setTags((p.tags || []).join(", "));
        setContent(p.content || "");
        setReadTime(p.readTime || "");
        setGithub(p.github || "");
        setDemo(p.demo || "");
        setPublished(true);
      }
      setHydrated(true);
    });
  }, [editSlug, hydrated]);

  const computedSlug = useMemo(
    () => slug.trim() || slugify(title),
    [slug, title]
  );

  const wordCount = useMemo(
    () => content.trim().split(/\s+/).filter(Boolean).length,
    [content]
  );

  const autoReadTime = useMemo(() => {
    const m = Math.max(1, Math.round(wordCount / 220));
    return `${m} min read`;
  }, [wordCount]);

  if (!isSupabaseConfigured) {
    return (
      <div className="q-page">
        <h1 className="q-name">Writing<em>.</em></h1>
        <p className="q-tagline">
          The database isn't configured in this build.{" "}
          <code style={{ fontFamily: "'JetBrains Mono', monospace" }}>VITE_SUPABASE_URL</code>{" "}
          and{" "}
          <code style={{ fontFamily: "'JetBrains Mono', monospace" }}>VITE_SUPABASE_ANON_KEY</code>{" "}
          need to be set.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="q-page"><p className="q-tagline">…</p></div>;
  }

  if (!user) {
    return (
      <div className="q-page">
        <h1 className="q-name">Writing<em>.</em></h1>
        <p className="q-tagline">Sign in to write.</p>
        <button className="q-btn primary" onClick={signInWithGitHub} style={{ marginTop: 16 }}>
          sign in with github →
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="q-page">
        <h1 className="q-name">Writing<em>.</em></h1>
        <p className="q-tagline">
          Signed in as <code style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {user.user_metadata?.user_name || user.email}
          </code>. Not the author — only the site owner can post here.
        </p>
        <Link to="/writing" className="q-btn" style={{ marginTop: 16 }}>← back</Link>
      </div>
    );
  }

  const onSave = async (publishNow) => {
    setErr("");
    setSaving(true);
    try {
      const tagList = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const saved = await upsertPost({
        slug: computedSlug,
        title: title.trim(),
        subtitle: subtitle.trim(),
        content,
        tags: tagList,
        readTime: readTime.trim() || autoReadTime,
        github: github.trim(),
        demo: demo.trim(),
        published: publishNow,
      });
      navigate(`/writing/${saved.slug}`);
    } catch (e) {
      setErr(e.message || String(e));
      setSaving(false);
    }
  };

  return (
    <div className="q-page" style={{ maxWidth: "100%" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18 }}>
        <h1 className="q-name" style={{ marginBottom: 0 }}>
          {editSlug ? "Edit" : "New"}<em>.</em>
        </h1>
        <span className="q-mono" style={{ fontSize: 11, color: "var(--ink-dim)" }}>
          /{computedSlug || "—"} · {wordCount} words · ~{autoReadTime}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        <div className="q-form" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" />
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="subtitle" />
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={`slug (auto: ${slugify(title) || "—"})`} />
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tags, comma-separated" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder={`read time (auto: ${autoReadTime})`} />
            <input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="github url" />
          </div>
          <input value={demo} onChange={(e) => setDemo(e.target.value)} placeholder="demo url" />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# write in markdown…"
            style={{ minHeight: 480, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}
          />
          {err && <div style={{ color: "var(--c-red)", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{err}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button className="q-btn" disabled={saving || !title || !content} onClick={() => onSave(false)}>
              save draft
            </button>
            <button className="q-btn primary" disabled={saving || !title || !content} onClick={() => onSave(true)}>
              {published ? "update" : "publish"} →
            </button>
          </div>
        </div>

        <div style={{ position: "sticky", top: 24 }}>
          <div className="q-mono" style={{ fontSize: 10, color: "var(--ink-dim)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
            preview
          </div>
          <div style={{ border: "1px solid var(--rule)", padding: "20px 24px", background: "var(--bg-2)", maxHeight: "70vh", overflow: "auto" }}>
            <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28, fontWeight: 400, margin: "0 0 6px", color: "var(--ink)" }}>
              {title || "Untitled"}
            </h2>
            {subtitle && (
              <p style={{ fontFamily: "'Charter', Georgia, serif", fontStyle: "italic", color: "var(--ink-mid)", margin: "0 0 18px" }}>
                {subtitle}
              </p>
            )}
            <div style={{ fontFamily: "'Charter', Georgia, serif", fontSize: 15.5, lineHeight: 1.65, color: "var(--ink)" }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "_nothing yet…_"}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
