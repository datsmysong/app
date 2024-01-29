import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { StreamingPlatformRemote } from "../lib/types";
import { ActiveRoom } from "../lib/useRoom";
import SoundCloudPlayer, { SoundCloudPlayerRemote } from "./SoundCloudPlayer";

type AudioRemoteProps = {
  streamingService: ActiveRoom["streaming_services"];
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
    streamingService: AudioRemoteProps["streamingService"]
  ): StreamingPlatformRemote | null {
    if (streamingService?.service_name === "SoundCloud") {
      return soundCloudRef.current;
    } else if (streamingService?.service_name === "Spotify") {
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
      {streamingService?.service_name === "SoundCloud" && (
        <SoundCloudPlayer ref={soundCloudRef} />
      )}
    </>
  );
});

export default AudioRemote;
