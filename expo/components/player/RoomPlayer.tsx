import { PlayingJSONTrack, RoomJSON } from "commons/backend-types";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "commons/socket.io-types";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Socket } from "socket.io-client";

import buildAudioRemote, { AudioRemote } from "../../lib/audioRemote";
import { ActiveRoom } from "../../lib/useRoom";
import Button from "../Button";
import LocalPlayer from "./LocalPlayer";
import Player from "./Player";
import PlayerControls from "./PlayerControls";

type RoomPlayerProps = {
  room: ActiveRoom;
  liveRoom: RoomJSON;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
};

const RoomPlayer: React.FC<RoomPlayerProps> = ({ room, liveRoom, socket }) => {
  const isHost = true;
  const [remote, setRemote] = useState<AudioRemote>();
  const localPlayerRemote = useRef<AudioRemote | null>(null);

  const [playbackState, setCurrentPlaybackState] =
    useState<PlayingJSONTrack | null>(null);

  /**
   * When receiving a state request from the server, it means that the music platform in use
   * uses a local player (eg. SoundCloud) and that the server needs to know the current playback
   * state of the player.
   */
  const onStateRequest = async (socket: RoomPlayerProps["socket"]) => {
    if (!isHost) return;
    if (!localPlayerRemote.current) return;

    const currentPlaybackState =
      await localPlayerRemote.current.getPlaybackState();

    socket.emit("player:updatePlaybackState", currentPlaybackState);
  };

  useEffect(() => {
    if (socket == null) return;
    setRemote(buildAudioRemote(socket));

    socket.on(
      "player:updatePlaybackState",
      (message: PlayingJSONTrack | null) => {
        console.log("[WS] Server is updating playback state");
        setCurrentPlaybackState(message);
      }
    );

    socket.on("player:getPlaybackState", () => {
      console.log("[WS] Server is requesting playback state");
      onStateRequest(socket);
    });

    socket.on("player:");
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
