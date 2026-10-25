export default function NowPlaying({ video }) {
  if (!video) {
    return (
      <div className="now-playing now-playing-empty">
        <p>🎵 Select a song to start playing</p>
      </div>
    );
  }

  return (
    <div className="now-playing">
      <div className="now-playing-frame">
        <iframe
          key={video.videoId}
          src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="now-playing-info">
        <p className="now-playing-title">{video.title}</p>
        <p className="now-playing-channel">{video.channelTitle}</p>
      </div>
    </div>
  );
}
