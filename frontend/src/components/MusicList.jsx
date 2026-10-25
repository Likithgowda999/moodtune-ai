import MusicCard from './MusicCard';

export default function MusicList({ videos, loading, error, nowPlayingId, onPlay }) {
  if (loading) {
    return (
      <div className="music-list-status">
        <div className="spinner" />
        <p>Finding music that matches your mood...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="music-list-status music-list-error">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="music-list-status">
        <p>No recommendations yet. Let the camera detect your mood, or pick one manually.</p>
      </div>
    );
  }

  return (
    <div className="music-grid">
      {videos.map((video) => (
        <MusicCard key={video.videoId} video={video} isPlaying={video.videoId === nowPlayingId} onPlay={onPlay} />
      ))}
    </div>
  );
}
