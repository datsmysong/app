import { StyleSheet, View } from "react-native";
import { PlaybackState, StreamingPlatformRemote } from "../lib/types";
import Button from "./Button";

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
      <Button onPress={handlePreviousTrack} type="outline" icon="skip-previous">
        Previous
      </Button>
      <Button
        onPress={handlePlayPause}
        icon={state.isPlaying ? "pause" : "play-arrow"}
        type={state.isPlaying ? "outline" : "filled"}
      >
        {state.isPlaying ? "Pause" : "Play"}
      </Button>
      <Button onPress={handleNextTrack} type="outline" icon="skip-next">
        Next
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 3,
  },
});

export default PlayerControls;
