import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Spotify } from "../lib/spotify";
import { StreamingPlatformRemote, StreamingService } from "../lib/types";
import SoundCloudPlayer from "./SoundCloudPlayer";

type AudioRemoteProps = {
  streamingService: StreamingService;
};

const AudioRemote = forwardRef<StreamingPlatformRemote, AudioRemoteProps>(
  ({ streamingService }, ref) => {
    // Storing the ref of the SoundCloudPlayer component that returns a StreamingPlatformRemote
    const soundCloudRef: React.RefObject<StreamingPlatformRemote> =
      useRef(null);

    // Getting the remote from the streaming service
    const [remote, setRemote] = useState<StreamingPlatformRemote | null>(null);
    useEffect(() => {
      const remote = getRemoteFromService(streamingService);
      setRemote(remote);
    }, [soundCloudRef]);

    // If the streaming service is SoundCloud, we return the SoundCloudPlayer component
    // If it's Spotify, we return the Spotify remote
    // If it's not supported, we return null
    function getRemoteFromService(
      streamingService: StreamingService
    ): StreamingPlatformRemote | null {
      if (streamingService.serviceName === "SoundCloud") {
        return soundCloudRef.current;
      } else if (streamingService.serviceName === "Spotify") {
        return new Spotify();
      }
      console.log("Streaming service not supported");
      return null;
    }

    // This AudioRemote component returns a StreamingPlatformRemote
    // That either executes the methods on the remote, or does nothing/return null if the remote is null
    useImperativeHandle(ref, () => ({
      play: async () => {
        if (remote === null) return;
        remote.play();
      },
      pause: async () => {
        if (remote === null) return;
        remote.pause();
      },
      next: async () => {
        if (remote === null) return;
        remote.next();
      },
      prev: async () => {
        if (remote === null) return;
        remote.prev();
      },
      setVolume: async (volume: number) => {
        if (remote === null) return;
        remote.setVolume(volume);
      },
      seekTo: async (position: number) => {
        if (remote === null) return;
        remote.seekTo(position);
      },
      playMusic: async (url: string) => {
        console.log("play");
        console.log("remote = ", remote);

        if (remote === null) return;
        remote.playMusic(url);
      },
    }));

    return (
      <>
        {/* If the streaming service is SoundCloud, we return the SoundCloudPlayer component*/}
        {streamingService.serviceName === "SoundCloud" && (
          <SoundCloudPlayer ref={soundCloudRef} />
        )}
      </>
    );
  }
);

export default AudioRemote;
