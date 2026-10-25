const LANGUAGES = ['English', 'Kannada', 'Hindi', 'Telugu', 'Tamil', 'Malayalam'];

export default function LanguageSelector({ value, onChange }) {
  return (
    <div className="dropdown-field">
      <label htmlFor="language-select">Language</label>
      <select id="language-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
    </div>
  );
}
