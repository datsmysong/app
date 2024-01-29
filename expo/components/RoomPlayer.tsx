import { RoomJSON } from "commons/backend-types";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Socket } from "socket.io-client";

import { PlaybackState, StreamingPlatformRemote } from "../lib/types";
import { ActiveRoom } from "../lib/useRoom";
import AudioRemote from "./AudioRemote";
import Button from "./Button";
import Player from "./Player";
import PlayerControls from "./PlayerControls";
import {
  SoundCloudPlayerRemote,
  isSoundCloudPlayerRemote,
} from "./SoundCloudPlayer";

type RoomPlayerProps = {
  room: ActiveRoom;
  liveRoom: RoomJSON;
  socket: Socket;
};

type StateUpdatedMessage = {
  type: "stateUpdated";
  data: PlaybackState;
};

type StateRequestMessage = {
  type: "stateRequest";
};

const RoomPlayer: React.FC<RoomPlayerProps> = ({ room, liveRoom, socket }) => {
  const isHost = true;
  const remote = useRef<StreamingPlatformRemote>(null);

  const [playbackState, setCurrentPlaybackState] = useState<PlaybackState>({
    currentMusic: null,
    isPlaying: false,
    progressMs: 0,
    volume: 0,
  });

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
    if (room.streaming_services?.service_name !== "SoundCloud") return;
    if (!isSoundCloudPlayerRemote(remote.current)) return;

    const soundCloudRemote = remote.current as SoundCloudPlayerRemote;
    const currentPlaybackState = await soundCloudRemote.fetchCurrent();

    socket.emit("player:stateUpdated", {
      type: "player:stateUpdated",
      data: currentPlaybackState,
    });
  };
  useEffect(() => {
    if (socket == null) return;
    console.log("[WS] Setting up event listeners");

    socket.on("connect", () => {
      console.log("[WS] Connected to room server");
    });

    socket.on("player:stateUpdated", (message: any) => {
      console.log("[WS] Received stateUpdated message");
      onStateUpdated(socket, message);
    });

    socket.on("player:stateRequest", (message: any) => {
      console.log("[WS] Server is requesting playback state");
      onStateRequest(socket, message as StateRequestMessage);
    });
  }, [socket]);

  useEffect(() => {
    return () => {
      console.log("[WS] Disconnecting from room server");
      socket?.disconnect();
    };
  }, []);

  const playCoolSong = async () => {
    if (remote.current === null) return;

    if (room.streaming_services?.service_name === "Spotify") {
      await remote.current.playMusic("spotify:track:44yeyFTKxJR5Rd9ppeKVkp");
    } else if (room.streaming_services?.service_name === "SoundCloud") {
      console.log("Playing cool song");

      await remote.current.playMusic(
        "https://soundcloud.com/dukeandjones/call-me-chill-mix"
      );
    }
  };

  return (
    <>
      <View>
        {isHost && (
          <AudioRemote
            ref={remote}
            streamingService={room.streaming_services}
          />
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
    </>
  );
};

export default RoomPlayer;
