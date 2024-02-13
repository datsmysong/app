import { MaterialIcons } from "@expo/vector-icons";
import { JSONTrack } from "commons/backend-types";
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
    <MinimalistTrackItem
      title={track.title}
      artistsName={track.artistsName}
      imgUrl={track.imgUrl}
    >
      <Pressable onPress={handleAddMusic}>
        <MaterialIcons name="add" style={itemStyles.icon} />
      </Pressable>
    </MinimalistTrackItem>
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
