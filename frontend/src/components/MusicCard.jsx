export default function MusicCard({ video, isPlaying, onPlay }) {
  return (
    <div className={`music-card ${isPlaying ? 'music-card-active' : ''}`}>
      <div className="music-card-thumb">
        <img src={video.thumbnail} alt={video.title} loading="lazy" />
        <button className="music-card-play" onClick={() => onPlay(video)} aria-label={`Play ${video.title}`}>
          ▶
        </button>
      </div>
      <div className="music-card-body">
        <p className="music-card-title" title={video.title}>{video.title}</p>
        <p className="music-card-channel">{video.channelTitle}</p>
      </div>
    </div>
  );
}
