import { useCallback } from 'react';

const STORAGE_KEY = 'drill_scores';

export function useScorePersistence() {
  const getScores = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, []);

  const getScore = useCallback(
    (formNum, tense) => {
      const scores = getScores();
      const key = `${formNum}_${tense}`;
      return scores[key] || null;
    },
    [getScores]
  );

  const saveScore = useCallback((formNum, tense, correctCount) => {
    try {
      const scores = getScores();
      const key = `${formNum}_${tense}`;
      const today = new Date().toISOString().split('T')[0];

      scores[key] = {
        correct: correctCount,
        total: 13,
        lastDrilled: today,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch {
      console.error('Failed to save scores');
    }
  }, [getScores]);

  return { getScores, getScore, saveScore };
}
