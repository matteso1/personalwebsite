import { useState, useEffect, useCallback } from 'react';
import { getScores, saveAuthenticatedScore, getPersonalBest } from '../services/scoreService.js';

export function useHighScores(userId, displayName) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [personalBest, setPersonalBest] = useState(null);

  const fetchScores = useCallback(async () => {
    setLoading(true);
    const data = await getScores(25);
    setScores(data);
    setLoading(false);
  }, []);

  const fetchPersonalBest = useCallback(async () => {
    if (!userId) { setPersonalBest(null); return; }
    const best = await getPersonalBest(userId);
    setPersonalBest(best);
  }, [userId]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  useEffect(() => {
    fetchPersonalBest();
  }, [fetchPersonalBest]);

  const submitScore = useCallback(async (score) => {
    if (!userId || !displayName) return null;
    const result = await saveAuthenticatedScore(userId, displayName, score);
    if (result) {
      setPersonalBest(prev => Math.max(prev ?? 0, score));
      await fetchScores();
    }
    return result;
  }, [userId, displayName, fetchScores]);

  return { scores, loading, personalBest, submitScore, refetch: fetchScores };
}
