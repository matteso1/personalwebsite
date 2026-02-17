// Block Blast scoring:
// - 10 points per block cleared (8 blocks per line = 80 pts per line)
// - Combo bonus for clearing multiple lines in one placement
// - Streak multiplier for consecutive clears across placements

const POINTS_PER_BLOCK = 10;
const BLOCKS_PER_LINE = 8;

// Combo bonus for multi-line clears in a single move
const COMBO_BONUS = [0, 0, 10, 30, 60, 100, 150, 210, 280, 360];

export function calculatePlacementScore() {
  return 0; // Block Blast does not award points for placing
}

export function calculateClearScore(lineCount, streak) {
  if (lineCount === 0) return { lineScore: 0, newStreak: 0 };

  // Base: 10 pts per block cleared
  const baseScore = lineCount * BLOCKS_PER_LINE * POINTS_PER_BLOCK;

  // Combo bonus for multi-line clears
  const combo = COMBO_BONUS[Math.min(lineCount, COMBO_BONUS.length - 1)] || 0;

  // Streak: consecutive placements that clear at least one line
  const newStreak = streak + 1;
  const streakMultiplier = 1 + newStreak * 0.5;

  const lineScore = Math.round((baseScore + combo) * streakMultiplier);

  return { lineScore, newStreak };
}
