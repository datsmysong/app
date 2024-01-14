import { Button, StyleSheet } from "react-native";
import { PlaybackState, StreamingPlatformRemote } from "../lib/types";
import { View } from "./Tamed";

type PlayerControlsProps = {
  state: PlaybackState;
  remote: StreamingPlatformRemote;
};

const PlayerControls: React.FC<PlayerControlsProps> = ({ state, remote }) => {
  const handlePlayPause = () => {
    state.isPlaying ? remote.pause() : remote.play();
  };

  const handlePreviousTrack = () => {
    remote.prev();
  };

  const handleNextTrack = () => {
    remote.next();
  };

  return (
    <View style={styles.controls}>
      <Button onPress={handlePreviousTrack} title="Previous" />
      <Button
        onPress={handlePlayPause}
        title={state.isPlaying ? "Pause" : "Play"}
      />
      <Button onPress={handleNextTrack} title="Next" />P
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default PlayerControls;
