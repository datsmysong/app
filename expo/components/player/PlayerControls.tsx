import { PlayingJSONTrack } from "commons/backend-types";
import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";

import { PlayerRemote } from "../../lib/audioRemote";
import Button from "../Button";

type PlayerControlsProps = {
  state: PlayingJSONTrack | null;
  remote: PlayerRemote;
};

const PlayerControls: React.FC<PlayerControlsProps> = ({ state, remote }) => {
  const [loading, setLoading] = useState({
    previous: false,
    playPause: false,
    next: false,
  });

  const handlePlayPause = async () => {
    if (state === null) return;
    setLoading((prevState) => ({ ...prevState, playPause: true }));

    try {
      if (state.isPlaying) {
        await remote.pause();
      } else {
        await remote.play();
      }
    } catch (error) {
      console.error("Failed to play/pause:", error);
    } finally {
      setLoading((prevState) => ({ ...prevState, playPause: false }));
    }
  };

  const handlePreviousTrack = async () => {
    setLoading((prevState) => ({ ...prevState, previous: true }));

    try {
      await remote.previous();
    } catch (error) {
      console.error("Failed to go to previous track:", error);
    } finally {
      setLoading((prevState) => ({ ...prevState, previous: false }));
    }
  };

  const handleNextTrack = async () => {
    setLoading((prevState) => ({ ...prevState, next: true }));

    try {
      await remote.next();
    } catch (error) {
      console.error("Failed to go to next track:", error);
    } finally {
      setLoading((prevState) => ({ ...prevState, next: false }));
    }
  };

  return (
    <View style={styles.controls}>
      {state ? (
        <>
          <Button
            onPress={handlePreviousTrack}
            type="outline"
            icon="skip-previous"
            loading={loading.previous}
          >
            Previous
          </Button>
          <Button
            onPress={handlePlayPause}
            icon={state.isPlaying ? "pause" : "play-arrow"}
            type={state.isPlaying ? "outline" : "filled"}
            loading={loading.playPause}
          >
            {state.isPlaying ? "Pause" : "Play"}
          </Button>
          <Button
            onPress={handleNextTrack}
            type="outline"
            icon="skip-next"
            loading={loading.next}
          >
            Next
          </Button>
        </>
      ) : (
        <Text>Waiting for the host to play a song...</Text>
      )}
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
