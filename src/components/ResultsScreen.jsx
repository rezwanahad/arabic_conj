import { PRONOUNS } from '../data/conjugations';

export function ResultsScreen({ sessionResults, mistakeMap, onNewDrill }) {
  const firstTimeCorrect = sessionResults.filter((r) => r === true).length;
  const neededHelp = sessionResults.filter((r) => r === false).length;
  const total = sessionResults.length;

  const resultsByPronoun = PRONOUNS.map((pronoun, idx) => ({
    ...pronoun,
    result: sessionResults[idx],
    mistakes: mistakeMap[idx] || 0,
  }));

  return (
    <div className="results-screen">
      <h2>Round Complete!</h2>

      <div className="results-summary">
        <div className="summary-card summary-first-time">
          <div className="summary-number">{firstTimeCorrect}</div>
          <div className="summary-label">First Time Correct</div>
        </div>
        <div className="summary-card summary-needed-help">
          <div className="summary-number">{neededHelp}</div>
          <div className="summary-label">Needed Help</div>
        </div>
        <div className="summary-card summary-total">
          <div className="summary-number">{total}</div>
          <div className="summary-label">Total</div>
        </div>
      </div>

      <div className="results-breakdown">
        <h3>Breakdown by Pronoun</h3>
        <div className="breakdown-list">
          {resultsByPronoun.map((item, idx) => (
            <div key={idx} className="breakdown-item">
              <span className="breakdown-pronoun">
                <span className="ar">{item.ar}</span> ({item.en})
              </span>
              <span className="breakdown-status">
                {item.result === true ? (
                  <span className="status-first-time">✓ First time</span>
                ) : (
                  <span className="status-needed-help">
                    Tried {item.mistakes + 1}×
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onNewDrill} className="btn-primary">
        Drill Another Form
      </button>
    </div>
  );
}
