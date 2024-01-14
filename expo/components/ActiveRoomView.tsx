import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "react-native";
import {
  ActiveRoom,
  OrderedMusic,
  PlaybackState,
  StreamingPlatformRemote,
  StreamingService,
} from "../lib/types";
import AudioRemote from "./AudioRemote";
import Player from "./Player";
import PlayerControls from "./PlayerControls";
import { View } from "./Tamed";
import { Socket, io } from "socket.io-client";

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
  const isHost = true;
  const remote = useRef<StreamingPlatformRemote>(null);

  const [playbackState, setCurrentPlaybackState] = useState<PlaybackState>({
    currentMusic: null,
    isPlaying: false,
    progressMs: 0,
    volume: 0,
  });
  const [queue, setQueue] = useState<OrderedMusic[]>([]);

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    setSocket(io('http://localhost:3000'));

    socket?.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket?.on('stateUpdated', (message: any) => {
      onWebSocketMessage(message);
    });

    return () => {
      socket?.disconnect();
    };
  }, []);

  const onWebSocketMessage = useCallback((message: any) => {
    if (message.type === 'playbackState') {
      setCurrentPlaybackState(message.data);
    }
  }, []);

  const playCoolSong = async () => {
    console.log("playCoolSong");
    console.log(remote.current);

    if (remote.current === null) return;

    if (room.streamingService.serviceName === "Spotify") {
      await remote.current.playMusic("spotify:track:44yeyFTKxJR5Rd9ppeKVkp");
    } else if (room.streamingService.serviceName === "SoundCloud") {
      await remote.current.playMusic(
        "https://soundcloud.com/dukeandjones/call-me-chill-mix"
      );
    }
  };

  return (
    <>
      <View>
        {isHost && (
          <AudioRemote ref={remote} streamingService={room.streamingService} />
        )}
        <Player state={playbackState}>
          {isHost && remote.current && (
            <PlayerControls state={playbackState} remote={remote.current} />
          )}
        </Player>
      </View>

      <Button
        onPress={playCoolSong}
        title="play Duke & Jones - Call Me (Chill Mix)"
      />
    </>
  );
};

export default ActiveRoomView;
