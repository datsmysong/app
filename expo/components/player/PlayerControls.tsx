import { PlayingJSONTrack } from "commons/backend-types";
import { StyleSheet, View } from "react-native";

import { AudioRemote } from "../../lib/audioRemote";
import Button from "../Button";
import { Text } from "../Themed";

type PlayerControlsProps = {
  state: PlayingJSONTrack | null;
  remote: AudioRemote;
};

const PlayerControls: React.FC<PlayerControlsProps> = ({ state, remote }) => {
  const handlePlayPause = () => {
    if (state === null) return;
    return state.isPlaying ? remote.pause() : remote.play();
  };

  const handlePreviousTrack = () => {
    return remote.previous();
  };

  const handleNextTrack = () => {
    return remote.next();
  };

  return (
    <View style={styles.controls}>
      {state && (
        <>
          <Button
            onPress={handlePreviousTrack}
            type="outline"
            icon="skip-previous"
          >
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
        </>
      )}
      {!state && <Text>Waiting for the host to play a song...</Text>}
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
