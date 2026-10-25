const MOODS = [
  { key: 'happy', label: 'Happy', emoji: '😊' },
  { key: 'sad', label: 'Sad', emoji: '😢' },
  { key: 'angry', label: 'Angry', emoji: '😡' },
  { key: 'neutral', label: 'Neutral', emoji: '😐' },
  { key: 'surprised', label: 'Surprised', emoji: '😲' },
  { key: 'calm', label: 'Calm', emoji: '😌' },
  { key: 'energetic', label: 'Energetic', emoji: '⚡' },
  { key: 'chill', label: 'Chill', emoji: '🎧' }
];

export default function MoodSelector({ selected, onSelect, onClear }) {
  return (
    <div className="selector-panel">
      <div className="selector-panel-header">
        <h3>Manual Mood Selection</h3>
        {selected && (
          <button className="link-button" onClick={onClear}>Use camera detection instead</button>
        )}
      </div>
      <p className="selector-hint">Facial detection not accurate? Pick your mood directly.</p>
      <div className="mood-grid">
        {MOODS.map((mood) => (
          <button
            key={mood.key}
            className={`mood-button ${selected === mood.key ? 'mood-button-active' : ''}`}
            onClick={() => onSelect(mood.key, mood.label, mood.emoji)}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span>{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
