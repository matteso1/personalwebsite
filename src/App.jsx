import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Shell from "./components/Shell";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import WritingPage from "./pages/WritingPage";
import WritingPostPage from "./pages/WritingPostPage";

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
          <Route path="/projects" element={<WorkPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/blog" element={<WritingPage />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/blog/:slug" element={<WritingPostPage />} />
          <Route path="/writing/:slug" element={<WritingPostPage />} />
        </Routes>
      </Shell>
    </>
  );
}
