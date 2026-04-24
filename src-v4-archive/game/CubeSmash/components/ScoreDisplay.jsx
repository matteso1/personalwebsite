import React, { useRef, useEffect, useState } from 'react';

export default function ScoreDisplay({ score, combo, linesCleared }) {
  const prevScoreRef = useRef(score);
  const [bumping, setBumping] = useState(false);

  useEffect(() => {
    if (score !== prevScoreRef.current) {
      prevScoreRef.current = score;
      setBumping(true);
      const t = setTimeout(() => setBumping(false), 300);
      return () => clearTimeout(t);
    }
  }, [score]);

  return (
    <div className="bb-score flex items-center gap-6 text-sm">
      <div>
        <span className="text-terminal-muted text-xs">SCORE</span>
        <div
          className={`bb-score-value text-terminal-green text-xl font-bold ${bumping ? 'bb-score-value--bump' : ''}`}
        >
          {score.toLocaleString()}
        </div>
      </div>
      <div>
        <span className="text-terminal-muted text-xs">LINES</span>
        <div className="text-terminal-cyan text-lg">{linesCleared}</div>
      </div>
      {combo > 0 && (
        <div className="bb-streak">
          <span className="text-terminal-muted text-xs">COMBO</span>
          <div className="text-terminal-amber text-lg">x{combo}</div>
        </div>
      )}
    </div>
  );
}
