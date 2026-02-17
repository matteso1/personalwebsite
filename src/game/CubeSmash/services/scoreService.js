import { supabase } from './supabaseClient.js';

export async function getScores(limit = 10) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('high_scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('Failed to fetch scores:', error);
    return [];
  }
  return data;
}

export async function saveScore(playerName, score) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('high_scores')
    .insert([{ player_name: playerName, score }])
    .select();
  if (error) {
    console.error('Failed to save score:', error);
    return null;
  }
  return data?.[0];
}

export async function isHighScore(score, limit = 10) {
  if (!supabase) return true;
  const scores = await getScores(limit);
  if (scores.length < limit) return true;
  return score > scores[scores.length - 1].score;
}
