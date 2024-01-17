import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Spotify } from "../lib/spotify";
import { StreamingPlatformRemote, StreamingService } from "../lib/types";
import SoundCloudPlayer, { SoundCloudPlayerRemote } from "./SoundCloudPlayer";

type AudioRemoteProps = {
  streamingService: StreamingService;
};

const AudioRemote = forwardRef<
  StreamingPlatformRemote | null,
  AudioRemoteProps
>(({ streamingService }, ref) => {
  // Storing the ref of the SoundCloudPlayer component that returns a StreamingPlatformRemote
  const soundCloudRef: React.RefObject<SoundCloudPlayerRemote> = useRef(null);

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
      //return new Spotify();
      return null;
    }
    console.log("Streaming service not supported");
    return null;
  }

  useImperativeHandle(ref, () => {
    if (remote == null)
      return {
        playMusic: async () => {},
        play: async () => {},
        pause: async () => {},
        setVolume: async (volume: number) => {},
        seekTo: async (positionMs: number) => {},
        fetchCurrent: async () => {
          return null;
        },
        next: async () => {},
        prev: async () => {},
      };
    else return remote;
  });

  return (
    <>
      {/* If the streaming service is SoundCloud, we return the SoundCloudPlayer component*/}
      {streamingService.serviceName === "SoundCloud" && (
        <SoundCloudPlayer ref={soundCloudRef} />
      )}
    </>
  );
});

export default AudioRemote;
