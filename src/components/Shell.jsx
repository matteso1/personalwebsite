import React from "react";
import { Link, useLocation } from "react-router-dom";
import Ambient from "./Ambient";
import CommandPalette from "./CommandPalette";
import VimModal from "./VimModal";
import { useAuth } from "../lib/useAuth";

export default function Shell({ children }) {
  const { pathname } = useLocation();
  const isWriting = pathname.startsWith("/writing") || pathname.startsWith("/blog");
  const { isAdmin, signOut } = useAuth();

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Ambient />

      <header className="q-header">
        <Link to="/" className="q-brand">
          <b>nils matteson</b><span className="dot">.</span>
        </Link>
        <nav className="q-nav">
          <Link to="/" data-active={pathname === "/" ? "true" : undefined}>index</Link>
          <Link to="/writing" data-active={isWriting ? "true" : undefined}>writing</Link>
          <Link to="/fs" data-active={pathname === "/fs" ? "true" : undefined}>fs</Link>
          <a href="https://github.com/matteso1" target="_blank" rel="noreferrer">github</a>
          <a href="/resume.pdf" target="_blank" rel="noreferrer">resume</a>
          {isAdmin && (
            <>
              <Link to="/writing/new" data-active={pathname === "/writing/new" ? "true" : undefined}>new</Link>
              <a href="#" onClick={(e) => { e.preventDefault(); signOut(); }}>logout</a>
            </>
          )}
        </nav>
      </header>

      <main style={{ position: "relative", zIndex: 10 }}>{children}</main>
      <CommandPalette />
      <VimModal />

      <footer className="q-footer">
        <span>© {new Date().getFullYear()} · madison, wi</span>
        <span style={{ fontFeatureSettings: '"liga" 0, "calt" 0' }}>
          <a
            href={`https://github.com/matteso1/personal-website/commit/${typeof __BUILD_SHA__ !== "undefined" ? __BUILD_SHA__ : "dev"}`}
            target="_blank"
            rel="noreferrer"
            title={typeof __BUILT_AT__ !== "undefined" ? `built ${__BUILT_AT__}` : ""}
          >
            build {typeof __BUILD_SHA__ !== "undefined" ? __BUILD_SHA__ : "dev"}
          </a>
          {" · "}
          <a href="mailto:nilsmatteson@icloud.com">mail</a>
          {" · "}
          <a href="https://github.com/matteso1" target="_blank" rel="noreferrer">github</a>
        </span>
      </footer>
    </div>
  );
}
