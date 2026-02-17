import React, { useState, useEffect, useRef } from 'react';

function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return value;
}

export default function GameOverModal({ score, onReset, isLoggedIn, personalBest, onSubmitScore }) {
  const [submitted, setSubmitted] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);
  const displayScore = useCountUp(score, 1000);

  useEffect(() => {
    if (!isLoggedIn) return;
    const newBest = personalBest === null || score > personalBest;
    setIsNewBest(newBest);
    if (newBest) {
      onSubmitScore(score).then(() => setSubmitted(true));
    }
  }, []); // Run once on mount

  return (
    <div className="bb-gameover-overlay">
      <div className="terminal-card p-6 max-w-sm w-full mx-4 text-center bb-gameover-card">
        <div className="section-label mb-2">GAME_OVER</div>
        <div className="text-terminal-green text-3xl font-bold mb-4 bb-score">
          {displayScore.toLocaleString()}
        </div>

        {isLoggedIn ? (
          <div className="mb-4">
            {isNewBest ? (
              <div className="text-terminal-amber text-xs">
                {submitted ? 'NEW PERSONAL BEST -- SAVED' : 'SAVING...'}
              </div>
            ) : (
              <div className="text-terminal-muted text-xs">
                YOUR_BEST: {personalBest?.toLocaleString()}
              </div>
            )}
          </div>
        ) : (
          <div className="text-terminal-muted text-xs mb-4">
            LOGIN TO SAVE SCORES
          </div>
        )}

        <button
          onClick={onReset}
          className="w-full border border-terminal text-terminal-muted py-2 text-sm font-mono hover:border-terminal-green hover:text-terminal-green transition-colors"
        >
          PLAY_AGAIN
        </button>
      </div>
    </div>
  );
}
