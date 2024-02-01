import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { AudioRemote } from "../../lib/audioRemote";
import { ActiveRoom } from "../../lib/useRoom";
import SoundCloudPlayer from "../SoundCloudPlayer";

type LocalPlayerProps = {
  streamingService: ActiveRoom["streaming_services"];
};

const LocalPlayer = forwardRef<AudioRemote | null, LocalPlayerProps>(
  ({ streamingService }, ref) => {
    // Storing the ref of the SoundCloudPlayer component that returns a SoundCloudPlayerRemote
    const soundCloudRef: React.RefObject<AudioRemote> = useRef(null);

    const [remote, setRemote] = useState<AudioRemote | null>(null);

    useEffect(() => {
      const remote = soundCloudRef.current;
      setRemote(remote);
    }, [soundCloudRef]);

    useImperativeHandle(ref, () => {
      return remote as AudioRemote;
    });

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
