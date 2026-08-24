import { useState, useCallback } from 'react';
import { FORMS, PRONOUNS } from '../data/conjugations';

export function useDrill() {
  const [phase, setPhase] = useState('setup'); // setup | drill | results
  const [currentForm, setCurrentForm] = useState(null);
  const [currentTense, setCurrentTense] = useState(null);
  const [queue, setQueue] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [retypeMode, setRetypeMode] = useState(false);
  const [mistakeMap, setMistakeMap] = useState({});
  const [sessionResults, setSessionResults] = useState(Array(13).fill(null)); // null | true (first-time) | false (needed help)

  const getCurrentPronounIndex = useCallback(() => {
    if (queue.length === 0) return null;
    return queue[cardIndex];
  }, [queue, cardIndex]);

  const getCurrentAnswer = useCallback(() => {
    if (!currentForm || !currentTense) return '';
    const pronounIndex = getCurrentPronounIndex();
    if (pronounIndex === null) return '';
    return FORMS[currentForm][currentTense][pronounIndex];
  }, [currentForm, currentTense, queue, cardIndex]);

  const getCurrentPronoun = useCallback(() => {
    const idx = getCurrentPronounIndex();
    if (idx === null) return null;
    return PRONOUNS[idx];
  }, [queue, cardIndex]);

  const startDrill = useCallback((formNum, tense) => {
    setCurrentForm(formNum);
    setCurrentTense(tense);

    // Shuffle 0-12 into queue
    const shuffled = Array.from({ length: 13 }, (_, i) => i).sort(
      () => Math.random() - 0.5
    );
    setQueue(shuffled);
    setCardIndex(0);
    setRetypeMode(false);
    setMistakeMap({});
    setSessionResults(Array(13).fill(null));
    setPhase('drill');
  }, []);

  const submitAnswer = useCallback(
    (inputValue) => {
      const expected = getCurrentAnswer();
      const isCorrect = inputValue.trim() === expected;
      const pronounIndex = getCurrentPronounIndex();

      if (isCorrect) {
        // Mark result if first time seeing this pronoun
        const newResults = [...sessionResults];
        if (newResults[pronounIndex] === null) {
          newResults[pronounIndex] = retypeMode ? false : true;
        }
        setSessionResults(newResults);
        setRetypeMode(false);

        // Move to next card
        if (cardIndex < queue.length - 1) {
          setCardIndex(cardIndex + 1);
        } else {
          // End of queue - check if all 13 pronouns are done
          if (newResults.every((r) => r !== null)) {
            setPhase('results');
          }
        }
      } else {
        // Wrong answer
        if (!retypeMode) {
          // First wrong attempt - add to end of queue for later retry
          setRetypeMode(true);
          setQueue((prev) => [...prev, pronounIndex]);
          setMistakeMap((prev) => ({
            ...prev,
            [pronounIndex]: (prev[pronounIndex] || 0) + 1,
          }));
        }
        // If already in retypeMode and still wrong: stay in retypeMode
        // Don't increment cardIndex - student must retype
      }
    },
    [queue, cardIndex, currentForm, currentTense, sessionResults, retypeMode]
  );

  const endDrill = useCallback(() => {
    setPhase('results');
  }, []);

  return {
    phase,
    currentForm,
    currentTense,
    queue,
    cardIndex,
    retypeMode,
    mistakeMap,
    sessionResults,
    getCurrentPronounIndex,
    getCurrentAnswer,
    getCurrentPronoun,
    startDrill,
    submitAnswer,
    endDrill,
  };
}
