// Block Blast scoring (matched to real game):
// - 10 points per block cleared (8 blocks per line = 80 pts per line)
// - Multi-line bonus: +20 for 1 line, +30 for 2, +40 for 3, ... +100 for 9
// - Combo counter: increments each time you clear, resets after 3 non-clearing placements
// - Combo multiplier: each combo level adds +10% to score

const POINTS_PER_BLOCK = 10;
const BLOCKS_PER_LINE = 8;
const COMBO_GRACE_MOVES = 3; // moves without clearing before combo resets

// Multi-line bonus for clearing N lines in a single placement
function getMultiLineBonus(lineCount) {
  if (lineCount <= 0) return 0;
  // +20 for 1 line, +30 for 2, +40 for 3, ... capped at +100
  return Math.min(10 + lineCount * 10, 100);
}

export function calculatePlacementScore() {
  return 0; // Block Blast does not award points for placing
}

export function calculateClearScore(lineCount, combo) {
  if (lineCount === 0) return { lineScore: 0, newCombo: combo };

  // Base: 10 pts per block cleared
  const baseScore = lineCount * BLOCKS_PER_LINE * POINTS_PER_BLOCK;

  // Multi-line bonus
  const multiLineBonus = getMultiLineBonus(lineCount);

  // Combo multiplier: each combo level adds 10%
  const comboMultiplier = 1 + combo * 0.1;

  const lineScore = Math.round((baseScore + multiLineBonus) * comboMultiplier);
  const newCombo = combo + 1;

  return { lineScore, newCombo };
}

// Track whether combo should reset based on moves since last clear
export function shouldResetCombo(movesSinceLastClear) {
  return movesSinceLastClear >= COMBO_GRACE_MOVES;
}
