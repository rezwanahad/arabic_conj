import { useEffect, useRef, useState } from 'react';
import { FeedbackDisplay } from './FeedbackDisplay';
import { PatternDisplay } from './PatternDisplay';

export function DrillCard({
  pronoun,
  correctAnswer,
  retypeMode,
  onSubmit,
  formNum,
  tense,
  pronounIndex,
}) {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [feedbackState, setFeedbackState] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  useEffect(() => {
    setInputValue('');
    setFeedbackState(null);
    setShowCorrectAnswer(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  }, [pronoun, retypeMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedbackState === 'correct') return;

    const isCorrect = inputValue.trim() === correctAnswer;

    if (isCorrect) {
      setFeedbackState('correct');
      const timer = setTimeout(() => {
        onSubmit(inputValue);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setFeedbackState('wrong');
      setShowCorrectAnswer(true);

      const timer = setTimeout(() => {
        setFeedbackState('retype');
        setShowCorrectAnswer(false);
        setInputValue('');
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);
      }, 1400);

      return () => clearTimeout(timer);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const inputClassName = `drill-input ${
    feedbackState === 'correct'
      ? 'input-correct'
      : feedbackState === 'wrong'
        ? 'input-wrong'
        : feedbackState === 'retype'
          ? 'input-retype'
          : ''
  }`;

  return (
    <div className="drill-card">
      <PatternDisplay
        formNum={formNum}
        tense={tense}
        correctAnswer={feedbackState === 'correct' ? correctAnswer : null}
        pronounIndex={pronounIndex}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className={inputClassName}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب الفعل المصرف"
          dir="rtl"
          disabled={feedbackState === 'correct'}
          autoComplete="off"
        />

        <FeedbackDisplay
          state={feedbackState}
          correctAnswer={correctAnswer}
          showAnswer={showCorrectAnswer}
        />

        <button
          type="submit"
          className="btn-submit"
          disabled={feedbackState === 'correct' || feedbackState === 'wrong'}
        >
          {feedbackState === 'correct' ? '✓' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
