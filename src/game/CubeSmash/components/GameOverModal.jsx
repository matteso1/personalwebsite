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
      // Ease-out quad
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

export default function GameOverModal({ score, onReset, onSubmitScore, checkHighScore }) {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isHigh, setIsHigh] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const displayScore = useCountUp(score, 1000);

  useEffect(() => {
    checkHighScore(score).then(setIsHigh);
  }, [score, checkHighScore]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    await onSubmitScore(name.trim(), score);
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="bb-gameover-overlay">
      <div className="terminal-card p-6 max-w-sm w-full mx-4 text-center bb-gameover-card">
        <div className="section-label mb-2">GAME_OVER</div>
        <div className="text-terminal-green text-3xl font-bold mb-4 bb-score">
          {displayScore.toLocaleString()}
        </div>

        {isHigh && !submitted && (
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="text-terminal-amber text-xs mb-2">NEW HIGH SCORE -- ENTER YOUR NAME</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={16}
              placeholder="PLAYER_NAME"
              className="w-full bg-terminal-surface border border-terminal text-terminal-green px-3 py-2 text-sm font-mono focus:outline-none focus:border-terminal-green mb-3"
              autoFocus
            />
            <button
              type="submit"
              disabled={!name.trim() || submitting}
              className="w-full border border-terminal-green text-terminal-green py-2 text-sm font-mono hover:bg-terminal-green/10 transition-colors disabled:opacity-30"
            >
              {submitting ? 'SUBMITTING...' : 'SUBMIT_SCORE'}
            </button>
          </form>
        )}

        {submitted && (
          <div className="text-terminal-green text-xs mb-4">SCORE SUBMITTED</div>
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
