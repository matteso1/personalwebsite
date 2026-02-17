const POINTS_PER_BLOCK = 10;
const POINTS_PER_LINE = 100;

export function calculatePlacementScore(cellCount) {
  return cellCount * POINTS_PER_BLOCK;
}

export function calculateClearScore(lineCount, streak) {
  if (lineCount === 0) return { lineScore: 0, newStreak: 0 };

  // Multi-clear bonus: 1 line = 100, 2 = 300, 3 = 600, 4 = 1000, ...
  let lineScore = 0;
  for (let i = 0; i < lineCount; i++) {
    lineScore += POINTS_PER_LINE * (i + 1);
  }

  // Streak multiplier: consecutive clears multiply by streak count
  const newStreak = streak + 1;
  const streakMultiplier = newStreak;
  lineScore *= streakMultiplier;

  return { lineScore, newStreak };
}
