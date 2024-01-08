import { useState, useEffect, useMemo, useCallback } from "react";
import { SoundCloud } from "../utils/soundcloud";
import { Spotify } from "../utils/spotify";
import Player from "./Player";

type ActiveRoomProps = {
  roomId: string;
};

const ActiveRoom: React.FC<ActiveRoomProps> = ({ roomId }) => {
  const [currentMusic, setCurrentMusic] = useState<PlayingMusic | null>(null);
  const [queue, setQueue] = useState<OrderedMusic[]>([]);

  // connect to the backend websocket and fetch the room data once connected
  const [isSoundCloudReady, setIsSoundCloudReady] = useState(false);

  useEffect(() => {
    const scriptElement = document.querySelector(
      "[src='https://w.soundcloud.com/player/api.js']"
    );

    if (scriptElement) {
      scriptElement.addEventListener("load", () => {
        setIsSoundCloudReady(true);
      });
    }
  }, []);

  const streamingPlatform: StreamingPlatform | null = useMemo(() => {
    if (isSoundCloudReady) {
      return new Spotify();
    }
    return null;
  }, [isSoundCloudReady]);

  const fetchData = useCallback(async () => {
    if (!streamingPlatform) return;

    const currentMusicData = await streamingPlatform.fetchCurrent();
    const queueData = await streamingPlatform.fetchQueue();
    setCurrentMusic(currentMusicData);
    setQueue(queueData);
  }, [streamingPlatform]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch the current music and queue every second
  useEffect(() => {
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const playCoolSong = async () => {
    if (streamingPlatform instanceof Spotify) {
      await streamingPlatform.playMusic("spotify:track:44yeyFTKxJR5Rd9ppeKVkp");
    } else if (streamingPlatform instanceof SoundCloud) {
      await streamingPlatform.playMusic(
        "https://soundcloud.com/dukeandjones/call-me-chill-mix"
      );
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        {currentMusic && streamingPlatform && (
          <Player music={currentMusic} api={streamingPlatform} />
        )}
        {!currentMusic && <p>Nothing is playing, start a song</p>}
      </div>

      <button onClick={playCoolSong}>
        play Duke & Jones - Call Me (Chill Mix)
      </button>
    </>
  );
};

export default ActiveRoom;