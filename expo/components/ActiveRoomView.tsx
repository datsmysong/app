import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Socket, io } from "socket.io-client";
import {
  ActiveRoom,
  OrderedMusic,
  PlaybackState,
  StreamingPlatformRemote,
  StreamingService,
} from "../lib/types";
import AudioRemote from "./AudioRemote";
import Button from "./Button";
import Player from "./Player";
import PlayerControls from "./PlayerControls";
import {
  SoundCloudPlayerRemote,
  isSoundCloudPlayerRemote,
} from "./SoundCloudPlayer";

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

type StateUpdatedMessage = {
  type: "stateUpdated";
  data: PlaybackState;
};

type StateRequestMessage = {
  type: "stateRequest";
};

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

  const onStateUpdated = (socket: Socket, message: PlaybackState): void => {
    setCurrentPlaybackState(message);
  };

  const onStateRequest = async (
    socket: Socket,
    message: StateRequestMessage
  ) => {
    if (!isHost) return;
    // This should never happen because the server should only send that message when the room
    // is using SoundCloud
    if (room.streamingService.serviceName !== "SoundCloud") return;
    if (!isSoundCloudPlayerRemote(remote.current)) return;

    const soundCloudRemote = remote.current as SoundCloudPlayerRemote;
    const currentPlaybackState = await soundCloudRemote.fetchCurrent();

    socket.emit("stateUpdated", {
      type: "stateUpdated",
      data: currentPlaybackState,
    });
  };
  useEffect(() => {
    if (socket == null) return;
    console.log("[WS] Setting up event listeners");

    socket.on("connect", () => {
      console.log("[WS] Connected to room server");
    });

    socket.on("stateUpdated", (message: any) => {
      console.log("[WS] Received stateUpdated message");
      onStateUpdated(socket, message);
    });

    socket.on("stateRequest", (message: any) => {
      console.log("[WS] Server is requesting playback state");
      onStateRequest(socket, message as StateRequestMessage);
    });
  }, [socket]);

  useEffect(() => {
    setSocket(
      io("http://localhost:3000", {
        withCredentials: true,
      })
    );

    return () => {
      console.log("[WS] Disconnecting from room server");
      socket?.disconnect();
    };
  }, []);

  const playCoolSong = async () => {
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

  const fetchCurrent = async () => {
    const soundCloudRemote = remote.current as SoundCloudPlayerRemote;
    const currentPlaybackState = await soundCloudRemote.fetchCurrent();
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

      <Button type="outline" onPress={playCoolSong}>
        play Duke & Jones - Call Me (Chill Mix)
      </Button>
      <Button type="filled" onPress={fetchCurrent}>
        Fetch!
      </Button>
    </>
  );
};

export default ActiveRoomView;
