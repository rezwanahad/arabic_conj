export function FeedbackDisplay({ state, correctAnswer, showAnswer }) {
  if (state === 'correct') {
    return (
      <div className="feedback feedback-correct">
        ✓ صحيح
      </div>
    );
  }

  if (state === 'wrong') {
    return (
      <div className="feedback feedback-wrong">
        {showAnswer && <div className="correct-answer">الإجابة الصحيحة: {correctAnswer}</div>}
      </div>
    );
  }

  if (state === 'retype') {
    return (
      <div className="feedback feedback-retype">
        حاول مرة أخرى
      </div>
    );
  }

  return null;
}
