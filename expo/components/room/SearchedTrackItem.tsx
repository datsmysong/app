import { JSONTrack } from "commons/backend-types";
import { Plus } from "phosphor-react-native";
import { Pressable, StyleSheet } from "react-native";

import MinimalistTrackItem from "./MinimalistTrackItem";

export default function SearchedTrackItem({
  track,
  handleAddMusic,
}: {
  track: JSONTrack;
  handleAddMusic: () => void;
}) {
  return (
    <Pressable onPress={handleAddMusic}>
      <MinimalistTrackItem
        title={track.title}
        artistsName={track.artistsName}
        imgUrl={track.imgUrl}
      >
        <Plus style={itemStyles.icon} />
      </MinimalistTrackItem>
    </Pressable>
  );
}

const itemStyles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    fontSize: 24,
    textAlign: "center",
  },
});
