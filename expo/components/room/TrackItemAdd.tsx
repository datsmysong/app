import { JSONTrack } from "commons/backend-types";
import { Pressable } from "react-native";

import TrackItem from "./TrackItem";

export default function TrackItemAdd(props: {
  track: JSONTrack;
  index: number;
  roomId: string;
  action: (url: string) => void;
}) {
  return (
    <Pressable
      onPress={() => {
        const url = props.track.url;

        props.action(url);
      }}
    >
      <TrackItem
        track={props.track}
        index={props.index}
        roomId={props.roomId}
        isMenuDisabled
      />
    </Pressable>
  );
}
