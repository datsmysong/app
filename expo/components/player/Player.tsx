import { PlayingJSONTrack } from "commons/backend-types";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type PlayerProps = {
  state: PlayingJSONTrack | null;
  children?: React.ReactNode;
};

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const Player: React.FC<PlayerProps> = ({ state, children }) => {
  const [progress, setProgress] = useState(0);

  // Synchronize progress and isPlaying with the music prop
  useEffect(() => {
    if (!state) return;

    setProgress(state.currentTime);
  }, [state]);

  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      {state && (
        <>
          <Image
            source={state.imgUrl}
            placeholder={blurhash}
            alt={state.title}
            style={styles.image}
          />
          <View>
            <Text style={styles.title}>{state.title}</Text>
            <View style={styles.artistContainer}>
              <Text>{state.artistsName}</Text>
            </View>
            <View style={styles.progressContainer}>
              <Text>{formatDuration(progress)}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progress,
                    {
                      width: `${(progress / state.duration) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text>{formatDuration(state.duration)}</Text>
            </View>
            {children}
          </View>
        </>
      )}
      {!state && <Text>Nothing is playing, start a song</Text>}
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
