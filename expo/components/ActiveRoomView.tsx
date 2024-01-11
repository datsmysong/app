import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "react-native";
import {
  ActiveRoom,
  OrderedMusic,
  PlayingMusic,
  StreamingPlatformRemote,
  StreamingService,
} from "../lib/types";
import { SoundCloud } from "../utils/soundcloud";
import { Spotify } from "../utils/spotify";
import Player, { PlayerHandle } from "./Player";
import { Text, View } from "./Tamed";

type ActiveRoomViewProps = {
  room: ActiveRoom;
};

const knownStreamingServices: Array<StreamingService> = [
  {
    serviceId: "a2d17b25-d87e-42af-9e79-fd4df6b59222",
    serviceName: "Spotify",
  },
  {
    serviceId: "c99631a2-f06c-4076-80c2-13428944c3a8",
    serviceName: "SoundCloud",
  },
];

const ActiveRoomView: React.FC<ActiveRoomViewProps> = ({ room }) => {
  // TODO: Connect to the backend websocket and fetch the room data once connected

  const [currentMusic, setCurrentMusic] = useState<PlayingMusic | null>(null);
  const [queue, setQueue] = useState<OrderedMusic[]>([]);

  const [isSoundCloudReady, setIsSoundCloudReady] = useState(false);

  const streamingPlatform: StreamingPlatformRemote | null = useMemo(() => {
    if (
      room?.streamingService.serviceId ===
      "a2d17b25-d87e-42af-9e79-fd4df6b59222"
    ) {
      return new Spotify();
    } else if (
      room?.streamingService.serviceId ===
        "c99631a2-f06c-4076-80c2-13428944c3a8" &&
      isSoundCloudReady
    ) {
      return new SoundCloud();
    } else {
      return null;
    }
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
    console.log("playCoolSong");
    console.log(player.current);

    if (player.current === null) return;

    if (streamingPlatform instanceof Spotify) {
      await player.current.playMusic("spotify:track:44yeyFTKxJR5Rd9ppeKVkp");
    } else if (streamingPlatform instanceof SoundCloud) {
      await player.current.playMusic(
        "https://soundcloud.com/dukeandjones/call-me-chill-mix"
      );
    }
  };

  const player: React.RefObject<PlayerHandle> = useRef(null);

  return (
    <>
      <View>
        {streamingPlatform && (
          <Player ref={player} music={currentMusic} api={streamingPlatform} />
        )}
        {!streamingPlatform && (
          <>
            <Text>
              {knownStreamingServices
                .map(
                  (service) => `[${service.serviceId} = ${service.serviceName}]`
                )
                .join("\n ")}
            </Text>
            <Text>
              {room?.streamingService.serviceName} is not supported yet.
              {room?.streamingService.serviceId}
            </Text>
          </>
        )}
      </View>

      <Button
        onPress={playCoolSong}
        title="play Duke & Jones - Call Me (Chill Mix)"
      />
    </>
  );
};

export default ActiveRoomView;
