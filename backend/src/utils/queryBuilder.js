// Maps a detected or manually-selected mood to the core search adjective
// used when building the YouTube search query.
const MOOD_QUERY_WORDS = {
  happy: 'happy upbeat',
  sad: 'sad emotional relaxing',
  angry: 'calm soothing',
  neutral: 'popular',
  surprised: 'energetic exciting',
  fearful: 'calm peaceful',
  disgusted: 'chill relaxing',
  // Manual-only moods
  calm: 'calm relaxing',
  energetic: 'energetic',
  chill: 'chill lo-fi'
};

const VALID_LANGUAGES = ['English', 'Kannada', 'Hindi', 'Telugu', 'Tamil', 'Malayalam'];
const VALID_GENRES = ['All', 'Pop', 'Rock', 'Romantic', 'Study', 'Workout', 'Relaxing', 'Classical', 'Party', 'Lo-fi', 'Instrumental'];

/**
 * Builds a YouTube search query string from mood + language + genre.
 * Example: buildSearchQuery('happy', 'Kannada', 'Party') -> "happy upbeat Kannada party songs"
 */
function buildSearchQuery(emotion, language, genre) {
  const normalizedEmotion = (emotion || 'neutral').toLowerCase().trim();
  const moodPhrase = MOOD_QUERY_WORDS[normalizedEmotion] || MOOD_QUERY_WORDS.neutral;

  const normalizedLanguage = VALID_LANGUAGES.includes(language) ? language : 'English';
  const normalizedGenre = VALID_GENRES.includes(genre) ? genre : 'All';

  const parts = [moodPhrase];

  // Only mention the language in the query if it isn't English, since most
  // YouTube results default to English/international content anyway.
  if (normalizedLanguage !== 'English') {
    parts.push(normalizedLanguage);
  }

  if (normalizedGenre !== 'All') {
    parts.push(normalizedGenre);
  }

  parts.push('songs');

  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

module.exports = { buildSearchQuery, MOOD_QUERY_WORDS, VALID_LANGUAGES, VALID_GENRES };
