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

export async function saveAuthenticatedScore(userId, displayName, score) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('high_scores')
    .upsert(
      { user_id: userId, display_name: displayName, score },
      { onConflict: 'user_id' }
    )
    .select();
  if (error) {
    console.error('Failed to save score:', error);
    return null;
  }
  return data?.[0];
}

export async function getPersonalBest(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from('high_scores')
    .select('score')
    .eq('user_id', userId)
    .single();
  if (error) return null;
  return data?.score ?? null;
}

export async function isHighScore(score, limit = 10) {
  if (!supabase) return true;
  const scores = await getScores(limit);
  if (scores.length < limit) return true;
  return score > scores[scores.length - 1].score;
}
