import React from 'react';

export default function HighScoreBoard({ scores, loading }) {
  if (loading) {
    return (
      <div className="text-terminal-muted text-xs font-mono">
        Loading scores<span className="animate-blink">_</span>
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="text-terminal-muted text-xs font-mono">
        No scores yet. Be the first.
      </div>
    );
  }

  return (
    <div className="font-mono text-xs">
      <div className="grid grid-cols-[2rem_1fr_4rem] gap-2 text-terminal-muted mb-2">
        <span>#</span>
        <span>NAME</span>
        <span className="text-right">SCORE</span>
      </div>
      {scores.map((s, i) => (
        <div
          key={s.id || i}
          className={`grid grid-cols-[2rem_1fr_4rem] gap-2 py-1 border-b border-terminal/30 ${
            i === 0 ? 'text-terminal-green' : i < 3 ? 'text-terminal-cyan' : 'text-terminal-muted'
          }`}
        >
          <span>{String(i + 1).padStart(2, '0')}</span>
          <span className="truncate">{s.player_name}</span>
          <span className="text-right">{s.score.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
