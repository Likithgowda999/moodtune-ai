const GENRES = ['All', 'Pop', 'Rock', 'Romantic', 'Study', 'Workout', 'Relaxing', 'Classical', 'Party', 'Lo-fi', 'Instrumental'];

export default function GenreSelector({ value, onChange }) {
  return (
    <div className="dropdown-field">
      <label htmlFor="genre-select">Genre</label>
      <select id="genre-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {GENRES.map((genre) => (
          <option key={genre} value={genre}>{genre}</option>
        ))}
      </select>
    </div>
  );
}
