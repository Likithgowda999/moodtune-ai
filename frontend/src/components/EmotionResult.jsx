export default function EmotionResult({ expression, isManual }) {
  if (!expression) {
    return (
      <div className="emotion-result emotion-result-empty">
        <p>Detecting your expression...</p>
      </div>
    );
  }

  return (
    <div className="emotion-result">
      <p className="emotion-result-title">
        {isManual ? 'Selected Mood' : 'Detected Expression'}
      </p>
      <div className="emotion-result-main">
        <span className="emotion-emoji">{expression.emoji}</span>
        <span className="emotion-label">{expression.label}</span>
      </div>
      {!isManual && typeof expression.confidence === 'number' && (
        <div className="emotion-confidence">
          <div className="emotion-confidence-bar">
            <div className="emotion-confidence-fill" style={{ width: `${expression.confidence}%` }} />
          </div>
          <span>Confidence: {expression.confidence}%</span>
        </div>
      )}
    </div>
  );
}
