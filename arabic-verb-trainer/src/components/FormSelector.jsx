import { useEffect, useState } from 'react';
import { FORMS } from '../data/conjugations';
import { useScorePersistence } from '../hooks/useScorePersistence';

export function FormSelector({ onStartDrill }) {
  const [selectedForm, setSelectedForm] = useState(1);
  const [selectedTense, setSelectedTense] = useState('past');
  const [formScores, setFormScores] = useState({});
  const { getScores } = useScorePersistence();

  useEffect(() => {
    setFormScores(getScores());
  }, [getScores]);

  const handleFormClick = (formNum) => {
    setSelectedForm(formNum);
  };

  const handleStartDrill = () => {
    onStartDrill(selectedForm, selectedTense);
  };

  const getFormScore = (formNum) => {
    const pastScore = formScores[`${formNum}_past`];
    const presentScore = formScores[`${formNum}_present`];

    if (pastScore && presentScore) {
      const avg = Math.round((pastScore.correct + presentScore.correct) / 2);
      return `${avg}/13`;
    } else if (pastScore) {
      return `${pastScore.correct}/13`;
    } else if (presentScore) {
      return `${presentScore.correct}/13`;
    }
    return null;
  };

  return (
    <div className="form-selector">
      <h1>Arabic Verb Conjugation Drill</h1>

      <div className="forms-grid">
        {Object.entries(FORMS).map(([num, form]) => {
          const formNum = parseInt(num);
          const isSelected = selectedForm === formNum;
          const score = getFormScore(formNum);

          return (
            <button
              key={num}
              className={`form-card ${isSelected ? 'form-card-selected' : ''}`}
              onClick={() => handleFormClick(formNum)}
              type="button"
            >
              <div className="form-card-header">
                <div className="form-label">{form.label}</div>
                {score && <div className="form-score">{score}</div>}
              </div>

              <div className="form-pattern">
                <div className="pattern-item">
                  <span className="pattern-label">Past</span>
                  <span className="pattern-arabic">{form.pattern.past}</span>
                </div>
                <div className="pattern-item">
                  <span className="pattern-label">Present</span>
                  <span className="pattern-arabic">{form.pattern.present}</span>
                </div>
              </div>

              <div className="form-desc">{form.desc}</div>
            </button>
          );
        })}
      </div>

      <div className="tense-selector">
        <legend>Select Tense</legend>
        <div className="tense-buttons">
          <button
            type="button"
            className={`tense-btn ${selectedTense === 'past' ? 'tense-btn-active' : ''}`}
            onClick={() => setSelectedTense('past')}
          >
            Past
          </button>
          <button
            type="button"
            className={`tense-btn ${selectedTense === 'present' ? 'tense-btn-active' : ''}`}
            onClick={() => setSelectedTense('present')}
          >
            Present
          </button>
        </div>
      </div>

      <button onClick={handleStartDrill} className="btn-primary btn-start-drill">
        Start Drill
      </button>
    </div>
  );
}
