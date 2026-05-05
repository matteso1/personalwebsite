import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Shell from "./components/Shell";
import HomePage from "./pages/HomePage";
import WritingPage from "./pages/WritingPage";
import WritingPostPage from "./pages/WritingPostPage";
import WritingNewPage from "./pages/WritingNewPage";
import FsPage from "./pages/FsPage";
import FsGraphPage from "./pages/FsGraphPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Shell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/writing/new" element={<WritingNewPage />} />
          <Route path="/writing/:slug" element={<WritingPostPage />} />
          <Route path="/writing/:slug/edit" element={<WritingNewPage />} />
          <Route path="/fs" element={<FsPage />} />
          <Route path="/fs/graph" element={<FsGraphPage />} />
          <Route path="/blog" element={<Navigate to="/writing" replace />} />
          <Route path="/blog/:slug" element={<WritingPostPage />} />
          <Route path="/work" element={<Navigate to="https://github.com/matteso1" replace />} />
          <Route path="/projects" element={<Navigate to="https://github.com/matteso1" replace />} />
        </Routes>
      </Shell>
    </>
  );
}
