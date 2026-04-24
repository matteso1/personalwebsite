import React from "react";
import { Github, ExternalLink, Download } from "lucide-react";

/**
 * ProjectBand — rightward-scrolling infinite marquee of project cards.
 * Duplicates the list so the loop seams invisibly; pauses on hover.
 * Meant to replace a 3-col grid when the grid starts to feel chonky.
 */
export default function ProjectBand({ projects, startIndex = 2 }) {
  const loop = [...projects, ...projects];
  return (
    <div className="proj-band">
      <div className="proj-band-edge proj-band-edge-l" />
      <div className="proj-band-edge proj-band-edge-r" />
      <div className="proj-band-track">
        {loop.map((p, i) => {
          const realIdx = i % projects.length;
          const accent = ["amber", "blue", "rust"][realIdx % 3];
          const accentVar =
            accent === "rust"
              ? "var(--rust)"
              : accent === "amber"
              ? "var(--amber)"
              : "var(--accent-3)";
          return (
            <article
              key={`${p.title}-${i}`}
              className="proj-card"
              data-accent={accent}
            >
              <div className="proj-card-top">
                <span className="mono proj-card-idx">
                  N.{String(startIndex + realIdx).padStart(2, "0")}
                </span>
                <span className="mono proj-card-year">{p.year}</span>
              </div>
              <h4 className="hed proj-card-title">{p.title}</h4>
              <p
                className="serif proj-card-sub"
                style={{ color: accentVar }}
              >
                {p.subtitle}
              </p>
              {p.receipt && (
                <p className="mono proj-card-rec">
                  <span style={{ color: accentVar }}>→ </span>
                  {p.receipt}
                </p>
              )}
              <div className="proj-card-pills">
                {p.tech.slice(0, 3).map((t) => (
                  <span key={t} className="pill">
                    {t}
                  </span>
                ))}
              </div>
              <div className="proj-card-links">
                {p.links?.repo && (
                  <a
                    href={p.links.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="mono proj-card-link"
                  >
                    <Github size={11} /> source
                  </a>
                )}
                {p.links?.demo && (
                  <a
                    href={p.links.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="mono proj-card-link"
                  >
                    <ExternalLink size={11} /> live
                  </a>
                )}
                {p.links?.download && (
                  <a
                    href={p.links.download}
                    target="_blank"
                    rel="noreferrer"
                    className="mono proj-card-link"
                  >
                    <Download size={11} /> build
                  </a>
                )}
              </div>
              {p.status === "Active" && (
                <span className="mono proj-card-active">● active</span>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
