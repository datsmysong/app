import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "commons/socket.io-types";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

import SoundCloudPlayer from "./SoundCloudPlayer";
import { LocalPlayerRemote } from "../../lib/audioRemote";
import { ActiveRoom } from "../../lib/useRoom";

type LocalPlayerProps = {
  streamingService: ActiveRoom["streaming_services"];
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
};

const LocalPlayer = forwardRef<LocalPlayerRemote | null, LocalPlayerProps>(
  ({ streamingService, socket }, ref) => {
    // Storing the ref of the SoundCloudPlayer component that returns a LocalPlayerRemote
    const soundCloudRef: React.RefObject<LocalPlayerRemote> = useRef(null);

    const [remote, setRemote] = useState<LocalPlayerRemote | null>();

    useEffect(() => {
      const remote = soundCloudRef.current;
      setRemote(remote);
    }, [soundCloudRef]);

    useEffect(() => {
      const playbackStateRequest = async () => {
        if (!remote)
          return noLocalRemote("player:playbackStateRequest", socket);

        const currentPlaybackState = await remote.getPlaybackState();

        socket.emit("player:playbackStateRequest", currentPlaybackState);
      };

      const playTrackRequest = async (trackId: string) => {
        if (!remote) return noLocalRemote("player:playTrackRequest", socket);

        const response = await remote.playTrack(trackId);
        socket.emit("player:playTrackRequest", response);
      };

      const pauseRequest = async () => {
        if (!remote) return noLocalRemote("player:pauseRequest", socket);
        const response = await remote.pause();

        socket.emit("player:pauseRequest", response);
      };

      const playRequest = async () => {
        if (!remote) return noLocalRemote("player:playRequest", socket);
        const response = await remote.play();

        socket.emit("player:playRequest", response);
      };

      const seekToRequest = async (position: number) => {
        if (!remote) return noLocalRemote("player:seekToRequest", socket);

        const response = await remote.seekTo(position);
        socket.emit("player:seekToRequest", response);
      };

      const setVolumeRequest = async (volume: number) => {
        if (!remote) return noLocalRemote("player:setVolumeRequest", socket);

        const response = await remote.setVolume(volume);
        socket.emit("player:setVolumeRequest", response);
      };

      const skipRequest = async () => {
        if (!remote) return noLocalRemote("player:skipRequest", socket);

        const response = await remote.next();
        socket.emit("player:skipRequest", response);
      };

      const prevRequest = async () => {
        if (!remote) return noLocalRemote("player:previousRequest", socket);

        const response = await remote.previous();
        socket.emit("player:previousRequest", response);
      };

      socket.on("player:playbackStateRequest", playbackStateRequest);
      socket.on("player:playTrackRequest", playTrackRequest);
      socket.on("player:pauseRequest", pauseRequest);
      socket.on("player:playRequest", playRequest);
      socket.on("player:seekToRequest", seekToRequest);
      socket.on("player:setVolumeRequest", setVolumeRequest);
      socket.on("player:skipRequest", skipRequest);
      socket.on("player:previousRequest", prevRequest);

      return () => {
        socket.off("player:playbackStateRequest", playbackStateRequest);
        socket.off("player:playTrackRequest", playTrackRequest);
        socket.off("player:pauseRequest", pauseRequest);
        socket.off("player:playRequest", playRequest);
        socket.off("player:seekToRequest", seekToRequest);
        socket.off("player:setVolumeRequest", setVolumeRequest);
        socket.off("player:skipRequest", skipRequest);
        socket.off("player:previousRequest", prevRequest);
      };
    }, [socket, remote]);

    return (
      <>
        {/* If the streaming service is SoundCloud, we return the SoundCloudPlayer component*/}
        {streamingService?.service_name === "SoundCloud" && (
          <SoundCloudPlayer ref={soundCloudRef} />
        )}
      </>
    );
  }
);

export default LocalPlayer;

function noLocalRemote(
  event: keyof ClientToServerEvents,
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
): void | PromiseLike<void> {
  socket.emit(event, {
    data: null,
    error: "No local remote",
  });
}
