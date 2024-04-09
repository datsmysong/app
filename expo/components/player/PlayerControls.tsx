import { PlayingJSONTrack } from "commons/backend-types";
import Pause from "phosphor-react-native/src/icons/Pause";
import Play from "phosphor-react-native/src/icons/Play";
import SkipBack from "phosphor-react-native/src/icons/SkipBack";
import SkipForward from "phosphor-react-native/src/icons/SkipForward";
import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

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
  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

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

  if (!state) return <></>;

  function skipTo90() {
    if (!state) return;
    remote.seekTo(0.9 * state.duration);
  }

  return (
    <View
      style={{
        flexDirection: "column",
        gap: 16,
      }}
    >
      <View style={styles.progressContainer}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            rowGap: 2,
          }}
        >
          <View style={[styles.progressBar]}>
            <View
              style={[
                styles.progress,
                {
                  width: `${(state.currentTime / state.duration) * 100}%`,
                  height: 7,
                },
              ]}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.progressDuration}>
              {formatDuration(state.currentTime)}
            </Text>
            <Text style={styles.progressDuration}>
              {formatDuration(state.duration)}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePreviousTrack}>
          <SkipBack weight="fill" size={42} />
        </TouchableOpacity>
        <Button
          onPress={handlePlayPause}
          icon={state.isPlaying ? <Pause /> : <Play weight="fill" />}
          loading={loading.playPause}
        >
          {state.isPlaying ? "Pause" : "Play"}
        </Button>
        <TouchableOpacity onPress={handleNextTrack}>
          <SkipForward weight="fill" size={42} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
  progressDuration: {
    fontFamily: "Outfit-Medium",
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    rowGap: 7,
  },
  progressBar: {
    flex: 1,
    height: 7,
    backgroundColor: "#D1D5DB",
    borderRadius: 9999,
  },
  progress: {
    height: "100%",
    backgroundColor: "#000000",
    borderRadius: 9999,
    transition: "all 1s linear",
  },
});

export default PlayerControls;
