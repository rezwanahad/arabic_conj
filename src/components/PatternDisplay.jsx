import { FORMS, PRONOUNS } from '../data/conjugations';

export function PatternDisplay({ formNum, tense, correctAnswer, pronounIndex }) {
  if (!formNum || !tense || pronounIndex === null) return null;

  const basePattern = FORMS[formNum].pattern[tense];
  const pronoun = PRONOUNS[pronounIndex];
  const formLabel = FORMS[formNum].label;

  if (!correctAnswer) {
    return (
      <div className="pattern-display">
        <div className="pattern-header">
          <div className="pattern-form-label">{formLabel} - {tense}</div>
        </div>

        <div className="pattern-prompt">
          <div className="pattern-section">
            <div className="pattern-label-small">Pronoun</div>
            <div className="pattern-pronoun">{pronoun.ar}</div>
            <div className="pattern-pronoun-en">{pronoun.en}</div>
          </div>

          <div className="pattern-plus">+</div>

          <div className="pattern-section">
            <div className="pattern-label-small">Base Pattern</div>
            <div className="pattern-verb">{basePattern}</div>
          </div>

          <div className="pattern-equals">=</div>

          <div className="pattern-section">
            <div className="pattern-label-small">Type the result</div>
            <div className="pattern-verb pattern-placeholder">?</div>
          </div>
        </div>
      </div>
    );
  }

  // Extract what changed in the verb
  const getVerbChanges = (base, full) => {
    const baseLen = base.length;
    const fullLen = full.length;

    // No change - answer is the same as base
    if (base === full) {
      return { prefix: '', base: full, suffix: '' };
    }

    // Suffix added (change at end)
    if (full.startsWith(base)) {
      const suffix = full.slice(baseLen);
      return { prefix: '', base: base, suffix: suffix };
    }

    // Prefix added (change at start)
    if (full.endsWith(base)) {
      const prefix = full.slice(0, fullLen - baseLen);
      return { prefix: prefix, base: base, suffix: '' };
    }

    // Prefix and suffix
    for (let i = 1; i < baseLen; i++) {
      const middle = base.slice(i);
      if (full.endsWith(middle)) {
        const prefix = full.slice(0, fullLen - middle.length);
        return { prefix: prefix, base: middle, suffix: '' };
      }
    }

    // Complex - just return the full form
    return { prefix: '', base: full, suffix: '' };
  };

  const { prefix, base, suffix } = getVerbChanges(basePattern, correctAnswer);

  return (
    <div className="pattern-display">
      <div className="pattern-prompt">
        <div className="pattern-pronoun">{pronoun.ar}</div>
        <div className="pattern-plus">+</div>
        <div className="pattern-verb">{basePattern}</div>
      </div>

      <div className="pattern-arrow">=</div>

      <div className="pattern-answer">
        <div className="pattern-answer-form">
          {prefix && <span className="pattern-highlighted">{prefix}</span>}
          {base && <span className="pattern-base-part">{base}</span>}
          {suffix && <span className="pattern-highlighted">{suffix}</span>}
        </div>
      </div>
    </div>
  );
}
