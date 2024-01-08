import React, { useState, useEffect } from "react";
import { Image } from "expo-image";

type PlayerProps = {
  music: PlayingMusic;
  api: StreamingPlatform;
};

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const Player: React.FC<PlayerProps> = ({ music, api }) => {
  const [progress, setProgress] = useState(music.progress_ms);
  const [isPlaying, setIsPlaying] = useState(music.is_playing);

  // Synchronize progress and isPlaying with the music prop
  useEffect(() => {
    setProgress(music.progress_ms);
    setIsPlaying(music.is_playing);
  }, [music]);

  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    isPlaying ? api.pause() : api.play();
    setIsPlaying(!isPlaying);
  };

  const handlePreviousTrack = () => {
    api.prev();
  };

  const handleNextTrack = () => {
    api.next();
  };

  return (
    <div className="flex items-center space-x-4">
      <Image
        source={music.artwork}
        placeholder={blurhash}
        alt={music.title}
        className="w-32 h-32"
      />
      <div>
        <h2 className="text-lg font-semibold">{music.title}</h2>
        <div className="flex items-center">
          {music.artists.map((artist, index) => (
            <React.Fragment key={artist.id}>
              <span>{artist.name}</span>
              {index !== music.artists.length - 1 && <span>,</span>}
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <span>{formatDuration(progress)}</span>
          <div className="flex-grow h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-black rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(progress / music.duration_ms) * 100}%` }}
            ></div>
          </div>
          <span>{formatDuration(music.duration_ms)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handlePreviousTrack}>Previous</button>
          <button onClick={handlePlayPause}>
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button onClick={handleNextTrack}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default Player;
