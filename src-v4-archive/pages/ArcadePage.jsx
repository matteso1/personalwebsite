import React, { Suspense } from "react";
import { motion } from "framer-motion";
import HolographicCard from "../components/HolographicCard";

const BlockBlast = React.lazy(() => import("../game/CubeSmash/index.jsx"));

export default function ArcadePage() {
  return (
    <div className="relative">
      {/* ── Header ───────────────────────────── */}
      <section className="pt-20 pb-12">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="eyebrow mb-6">arcade</div>
            <h1
              className="display mb-6"
              style={{
                fontSize: "clamp(64px, 11vw, 180px)",
                lineHeight: "0.86",
                letterSpacing: "-0.055em",
              }}
            >
              <span className="text-outline">block</span>
              <br />
              <span className="serif-italic lowercase" style={{ color: "var(--violet)" }}>
                blast.
              </span>
            </h1>
            <p className="max-w-2xl text-lg" style={{ color: "var(--text-mid)" }}>
              8×8 grid. Drag pieces, fill rows and columns. Place all three to refill.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Game ─────────────────────────────── */}
      <section className="pb-16">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <HolographicCard accent="violet" className="!p-4">
              <Suspense
                fallback={
                  <div
                    className="flex items-center justify-center h-96 mono text-sm"
                    style={{ color: "var(--acid)" }}
                  >
                    <span>loading block blast</span>
                    <span className="animate-pulse">_</span>
                  </div>
                }
              >
                <BlockBlast />
              </Suspense>
            </HolographicCard>
          </motion.div>
        </div>
      </section>

      {/* ── How to play ──────────────────────── */}
      <section className="pb-32">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <HolographicCard accent="cyan">
              <div className="eyebrow mb-5">how to play</div>
              <div className="grid sm:grid-cols-2 gap-4 mono text-xs">
                {[
                  "Drag a piece from the tray onto the 8×8 grid",
                  "Green ghost = valid placement, red = invalid",
                  "Fill a complete row or column to clear it",
                  "Clear multiple lines at once for bonus points",
                  "Place all 3 pieces to receive new ones",
                  "Chain clears on consecutive placements for streaks",
                ].map((line, i) => (
                  <div key={i} style={{ color: "var(--text-mid)" }}>
                    <span style={{ color: "var(--cyan)" }}>
                      {String(i + 1).padStart(2, "0")}.
                    </span>{" "}
                    {line}
                  </div>
                ))}
              </div>
            </HolographicCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
