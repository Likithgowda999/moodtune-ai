import { useCallback, useEffect, useRef, useState } from 'react';
import Camera from './components/Camera';
import EmotionResult from './components/EmotionResult';
import MoodSelector from './components/MoodSelector';
import LanguageSelector from './components/LanguageSelector';
import GenreSelector from './components/GenreSelector';
import MusicList from './components/MusicList';
import NowPlaying from './components/NowPlaying';
import { fetchMusicRecommendations } from './services/api';
import './App.css';

export default function App() {
  const [detectedExpression, setDetectedExpression] = useState(null); // from camera
  const [manualMood, setManualMood] = useState(null); // { key, label, emoji }
  const [language, setLanguage] = useState('English');
  const [genre, setGenre] = useState('All');

  const [videos, setVideos] = useState([]);
  const [musicLoading, setMusicLoading] = useState(false);
  const [musicError, setMusicError] = useState('');
  const [nowPlaying, setNowPlaying] = useState(null);

  // Tracks the last query we actually sent, so repeated identical detections
  // (e.g. "happy, happy, happy...") don't trigger repeated API calls.
  const lastQueryKeyRef = useRef('');

  const effectiveMood = manualMood || detectedExpression;

  const handleExpressionDetected = useCallback((expression) => {
    setDetectedExpression(expression);
  }, []);

  const handleManualMoodSelect = (key, label, emoji) => {
    setManualMood({ key, label, emoji });
  };

  const handleClearManualMood = () => setManualMood(null);

  useEffect(() => {
    if (!effectiveMood) return;

    const queryKey = `${effectiveMood.key}|${language}|${genre}`;
    if (queryKey === lastQueryKeyRef.current) return; // mood/settings unchanged - skip the API call
    lastQueryKeyRef.current = queryKey;

    const loadMusic = async () => {
      setMusicLoading(true);
      setMusicError('');
      try {
        const data = await fetchMusicRecommendations({ emotion: effectiveMood.key, language, genre });
        setVideos(data.results);
      } catch (err) {
        setMusicError(err.message);
      } finally {
        setMusicLoading(false);
      }
    };

    loadMusic();
  }, [effectiveMood, language, genre]);

  const handlePlay = (video) => setNowPlaying(video);

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>🎵 MoodTune AI</h1>
        <p>Music recommendations based on your facial expression</p>
      </header>

      <main className="app-main">
        <section className="panel">
          <Camera onExpressionDetected={handleExpressionDetected} disabled={!!manualMood} />
          <EmotionResult expression={effectiveMood} isManual={!!manualMood} />
        </section>

        <section className="panel">
          <MoodSelector selected={manualMood?.key} onSelect={handleManualMoodSelect} onClear={handleClearManualMood} />
          <div className="selector-row">
            <LanguageSelector value={language} onChange={setLanguage} />
            <GenreSelector value={genre} onChange={setGenre} />
          </div>
        </section>

        <section className="panel panel-wide">
          <h2 className="section-title">Recommended Music</h2>
          <MusicList videos={videos} loading={musicLoading} error={musicError} nowPlayingId={nowPlaying?.videoId} onPlay={handlePlay} />
        </section>

        <section className="panel panel-wide">
          <h2 className="section-title">Now Playing</h2>
          <NowPlaying video={nowPlaying} />
        </section>
      </main>

      <footer className="app-footer">
        <p>MoodTune AI &mdash; a final-year project. Facial detection runs entirely in your browser; nothing is uploaded.</p>
      </footer>
    </div>
  );
}
