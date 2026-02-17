import { useState, useEffect, useCallback } from 'react';
import { getScores, saveScore, isHighScore } from '../services/scoreService.js';

export function useHighScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = useCallback(async () => {
    setLoading(true);
    const data = await getScores(10);
    setScores(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const submitScore = useCallback(async (name, score) => {
    const result = await saveScore(name, score);
    if (result) {
      await fetchScores();
    }
    return result;
  }, [fetchScores]);

  const checkHighScore = useCallback(async (score) => {
    return isHighScore(score, 10);
  }, []);

  return { scores, loading, submitScore, checkHighScore, refetch: fetchScores };
}
