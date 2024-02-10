import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import SoundCloudPlayer from "./SoundCloudPlayer";
import { LocalPlayerRemote } from "../../lib/audioRemote";
import { ActiveRoom } from "../../lib/useRoom";

type LocalPlayerProps = {
  streamingService: ActiveRoom["streaming_services"];
};

const LocalPlayer = forwardRef<LocalPlayerRemote | null, LocalPlayerProps>(
  ({ streamingService }, ref) => {
    // Storing the ref of the SoundCloudPlayer component that returns a LocalPlayerRemote
    const soundCloudRef: React.RefObject<LocalPlayerRemote> = useRef(null);

    const [remote, setRemote] = useState<LocalPlayerRemote | null>(null);

    useEffect(() => {
      const remote = soundCloudRef.current;
      setRemote(remote);
    }, [soundCloudRef]);

    useImperativeHandle(ref, () => {
      return remote as LocalPlayerRemote;
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
