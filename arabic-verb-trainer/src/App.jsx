import { useEffect } from 'react';
import './App.css';
import { useDrill } from './hooks/useDrill';
import { useScorePersistence } from './hooks/useScorePersistence';
import { FormSelector } from './components/FormSelector';
import { DrillCard } from './components/DrillCard';
import { ProgressPips } from './components/ProgressPips';
import { ResultsScreen } from './components/ResultsScreen';

function App() {
  const drill = useDrill();
  const { saveScore } = useScorePersistence();

  const handleStartDrill = (formNum, tense) => {
    drill.startDrill(formNum, tense);
  };

  const handleNewDrill = () => {
    window.location.href = '/';
  };

  useEffect(() => {
    if (drill.phase === 'results') {
      const firstTimeCorrect = drill.sessionResults.filter((r) => r === true).length;
      saveScore(drill.currentForm, drill.currentTense, firstTimeCorrect);
    }
  }, [drill.phase, drill.currentForm, drill.currentTense, drill.sessionResults, saveScore]);

  if (drill.phase === 'setup') {
    return <FormSelector onStartDrill={handleStartDrill} />;
  }

  if (drill.phase === 'drill') {
    return (
      <div className="app-drill">
        <header className="drill-header">
          <button onClick={() => window.location.href = '/'} className="btn-back">
            ← Back
          </button>
          <ProgressPips
            sessionResults={drill.sessionResults}
            currentPronounIndex={drill.getCurrentPronounIndex()}
          />
        </header>

        <main className="drill-main">
          <DrillCard
            pronoun={drill.getCurrentPronoun()}
            correctAnswer={drill.getCurrentAnswer()}
            retypeMode={drill.retypeMode}
            onSubmit={drill.submitAnswer}
            formNum={drill.currentForm}
            tense={drill.currentTense}
            pronounIndex={drill.getCurrentPronounIndex()}
          />
        </main>
      </div>
    );
  }

  if (drill.phase === 'results') {
    return (
      <div className="app-results">
        <ResultsScreen
          sessionResults={drill.sessionResults}
          mistakeMap={drill.mistakeMap}
          onNewDrill={handleNewDrill}
        />
      </div>
    );
  }
}

export default App;
