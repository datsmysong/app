import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { PlaybackState } from "../lib/types";

type PlayerProps = {
  state: PlaybackState;
  children?: React.ReactNode;
};

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const Player: React.FC<PlayerProps> = ({ state, children }) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Synchronize progress and isPlaying with the music prop
  useEffect(() => {
    if(!state) return;

    setProgress(state.progressMs ?? 0);
    setIsPlaying(state.isPlaying ?? false);
  }, [state]);

  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      {state.currentMusic && (
        <>
          <Image
            source={state.currentMusic.artwork}
            placeholder={blurhash}
            alt={state.currentMusic.title}
            style={styles.image}
          />
          <View>
            <Text style={styles.title}>{state.currentMusic.title}</Text>
            <View style={styles.artistContainer}>
              {state.currentMusic.artists.map((artist, index) => (
                <React.Fragment key={artist.id}>
                  <Text>{artist.name}</Text>
                  {index !== (state.currentMusic?.artists.length ?? 1) - 1 && (
                    <Text>,</Text>
                  )}
                </React.Fragment>
              ))}
            </View>
            <View style={styles.progressContainer}>
              <Text>{formatDuration(progress)}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progress,
                    {
                      width: `${
                        (progress / state.currentMusic.durationMs) * 100
                      }%`,
                    },
                  ]}
                ></View>
              </View>
              <Text>{formatDuration(state.currentMusic.durationMs)}</Text>
            </View>
            {children}
          </View>
        </>
      )}
      {!state.currentMusic && <Text>Nothing is playing, start a song</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  artistContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBar: {
    flex: 1,
    height: 4,
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

export default Player;
