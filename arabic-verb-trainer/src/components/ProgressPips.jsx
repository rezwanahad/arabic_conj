import { PRONOUNS } from '../data/conjugations';

export function ProgressPips({ sessionResults, currentPronounIndex }) {
  return (
    <div className="progress-container">
      <div className="progress-pips">
        {sessionResults.map((result, idx) => {
          const pronoun = PRONOUNS[idx];
          let className = 'pip';
          if (idx === currentPronounIndex) {
            className += ' pip-current';
          }
          if (result === true) {
            className += ' pip-mastered';
          } else if (result === false) {
            className += ' pip-needed-help';
          }
          return (
            <div key={idx} className="pip-wrapper" title={`${pronoun.en}: ${pronoun.ar}`}>
              <div className={className} />
              <div className="pip-label">{pronoun.ar}</div>
            </div>
          );
        })}
      </div>
      <div className="progress-info">
        {currentPronounIndex !== null && (
          <div className="current-pronoun">
            <span className="current-en">{PRONOUNS[currentPronounIndex].en}</span>
            <span className="current-ar">{PRONOUNS[currentPronounIndex].ar}</span>
          </div>
        )}
      </div>
    </div>
  );
}
