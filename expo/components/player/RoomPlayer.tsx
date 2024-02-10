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
import buildAudioRemote, {
  LocalPlayerRemote,
  PlayerRemote,
} from "../../lib/audioRemote";
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
  const localPlayerRemote = useRef<LocalPlayerRemote | null>(null);
  const [error, setError] = useState<string>();

  const [playbackState, setCurrentPlaybackState] =
    useState<PlayingJSONTrack | null>(null);

  useEffect(() => {
    if (!socket) return;
    setRemote(buildAudioRemote(socket));

    socket.on("player:updatePlaybackState", (playbackState) => {
      if (playbackState.error) {
        setError(playbackState.error);
        return;
      }

      setCurrentPlaybackState(playbackState.data);
    });

    /**
     * When receiving a state request from the server, it means that the music platform in use
     * uses a local player (eg. SoundCloud) and that the server needs to know the current playback
     * state of the player.
     */
    socket.on("player:playbackStateRequest", async () => {
      if (!isHost) return;
      if (!localPlayerRemote.current) return;

      const currentPlaybackState =
        await localPlayerRemote.current.getPlaybackState();

      socket.emit("player:playbackStateRequest", currentPlaybackState);
    });

    socket.on("player:playTrackRequest", (trackId: string) => {
      if (localPlayerRemote.current)
        localPlayerRemote.current.playTrack(trackId);
    });

    socket.on("player:pauseRequest", async () => {
      if (localPlayerRemote.current) {
        localPlayerRemote.current.pause();
      }
    });

    socket.on("player:playRequest", async () => {
      if (localPlayerRemote.current) {
        localPlayerRemote.current.play();
      }
    });

    socket.on("player:seekToRequest", async (position: number) => {
      if (localPlayerRemote.current) {
        localPlayerRemote.current.seekTo(position);
      }
    });

    socket.on("player:setVolumeRequest", async (volume: number) => {
      if (localPlayerRemote.current) {
        localPlayerRemote.current.setVolume(volume);
      }
    });
  }, [socket]);

  const playCoolSong = async () => {
    if (!remote) return;

    if (room.streaming_services?.service_name === "Spotify") {
      await remote.playTrack("spotify:track:44yeyFTKxJR5Rd9ppeKVkp");
    } else if (room.streaming_services?.service_name === "SoundCloud") {
      await remote.playTrack(
        "https://soundcloud.com/dukeandjones/call-me-chill-mix"
      );
    }
  };

  return (
    <>
      {error && <Warning label={error} />}
      <View>
        {isHost && (
          <LocalPlayer
            ref={localPlayerRemote}
            streamingService={room.streaming_services}
          />
        )}
        <Player state={playbackState}>
          {isHost && remote && (
            <PlayerControls state={playbackState} remote={remote} />
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
