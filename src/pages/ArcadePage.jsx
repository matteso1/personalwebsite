import React, { Suspense } from 'react';
import { motion } from 'framer-motion';

const BlockBlast = React.lazy(() => import('../game/CubeSmash/index.jsx'));

export default function ArcadePage() {
  return (
    <div className="min-h-screen px-6 md:px-12 lg:px-20 py-20">
      <div className="max-w-5xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="section-label mb-4">04 ARCADE</div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold">
            Block Blast
          </h1>
          <p className="text-terminal-muted text-lg mt-2">
            8x8 block puzzle -- drag pieces to fill rows and columns. Place all 3 to get new ones.
          </p>
        </motion.div>

        {/* Game Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="terminal-card glow-border p-4"
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-96 font-mono text-terminal-green text-sm">
                <span>Loading Block Blast</span>
                <span className="animate-blink">_</span>
              </div>
            }
          >
            <BlockBlast />
          </Suspense>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 terminal-card p-4"
        >
          <div className="section-label mb-3">HOW_TO_PLAY</div>
          <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono text-terminal-muted">
            <div>
              <span className="text-terminal-green">01.</span> Drag a piece from the tray onto the 8x8 grid
            </div>
            <div>
              <span className="text-terminal-green">02.</span> Green ghost = valid placement, red = invalid
            </div>
            <div>
              <span className="text-terminal-green">03.</span> Fill a complete row or column to clear it
            </div>
            <div>
              <span className="text-terminal-green">04.</span> Clear multiple lines at once for bonus points
            </div>
            <div>
              <span className="text-terminal-green">05.</span> Place all 3 pieces to receive new ones
            </div>
            <div>
              <span className="text-terminal-green">06.</span> Build streaks by clearing lines on consecutive placements
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
