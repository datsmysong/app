import { PlayingJSONTrack, RoomJSON } from "commons/backend-types";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "commons/socket.io-types";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Socket } from "socket.io-client";

import LocalPlayer from "./LocalPlayer";
import Player from "./Player";
import PlayerControls from "./PlayerControls";
import buildAudioRemote, { PlayerRemote } from "../../lib/audioRemote";
import { ActiveRoom } from "../../lib/useRoom";
import Button from "../Button";
import Warning from "../Warning";

type RoomPlayerProps = {
  room: ActiveRoom;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
};

const RoomPlayer: React.FC<RoomPlayerProps> = ({ room, socket }) => {
  const isHost = true;
  const [remote, setRemote] = useState<PlayerRemote>();
  const [error, setError] = useState<string>();

  const [playbackState, setCurrentPlaybackState] =
    useState<PlayingJSONTrack | null>(null);

  useEffect(() => {
    if (!socket) return;
    setRemote(buildAudioRemote(socket));

    socket.on("player:updatePlaybackState", (playbackState) => {
      setError(undefined);

      if (playbackState.error) {
        setError(playbackState.error);
        return;
      }

      setCurrentPlaybackState(playbackState.data);
    });
  }, [socket]);

  const playCoolSong = async () => {
    if (!remote) return;

    if (room.streaming_services?.service_name === "Spotify") {
      await remote.playTrack("spotify:track:6afdNrotJ1PCt9DoFiHpLj");
    } else if (room.streaming_services?.service_name === "SoundCloud") {
      await remote.playTrack(
        "https://soundcloud.com/martingarrix/martin-garrix-lloyiso-real-love"
      );
    }
  };

  return (
    <>
      {error && <Warning label={error} variant="error" />}
      <View>
        {isHost && (
          <LocalPlayer
            streamingService={room.streaming_services}
            socket={socket}
          />
        )}
        <Player state={playbackState}>
          {isHost && remote && (
            <PlayerControls state={playbackState} remote={remote} />
          )}
        </Player>
      </View>

      <Button type="outline" onPress={playCoolSong}>
        play Martin Garrix & Lloyiso - Real Love
      </Button>
    </>
  );
};

export default RoomPlayer;
