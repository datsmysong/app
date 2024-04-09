import { PlayingJSONTrack } from "commons/backend-types";
import { Image } from "expo-image";
import ThumbsDown from "phosphor-react-native/src/icons/ThumbsDown";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useWebSocket } from "../../app/(tabs)/rooms/[id]/_layout";
import { useUserProfile } from "../../lib/userProfile";
import Button from "../Button";

type PlayerProps = {
  state: PlayingJSONTrack | null;
  isHost: boolean;
  children?: React.ReactNode;
};

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const Player: React.FC<PlayerProps> = ({ state, isHost, children }) => {
  const [voteSkipActualTrack, setVoteSkipActualTrack] =
    useState<boolean>(false);
  const socket = useWebSocket();
  const userProfile = useUserProfile();

  /**
   * Handle the dislike of a track
   * @param index -1 for actual track, otherwise the index of the track in the queue
   * @returns void
   */
  const handleDislike = (index: number) => {
    if (!socket || !userProfile) return;
    const userId = userProfile.user_profile_id;

    socket.emit("queue:voteSkip", index, userId);
    if (index === -1) {
      setVoteSkipActualTrack(!voteSkipActualTrack);
    }
  };

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
          <View style={styles.trackInfo}>
            <View>
              <Text style={styles.title}>{state.title}</Text>
              <View>
                <Text style={styles.artistName}>{state.artistsName}</Text>
              </View>
            </View>
            <Button
              onPress={() => {
                handleDislike(-1);
              }}
              prependIcon={<ThumbsDown />}
              size="small"
              type={voteSkipActualTrack ? "filled" : "outline"}
              style={{ gap: 8 }}
            >
              Voter pour passer
            </Button>
            {isHost && (
              <View style={{ gap: 2 }}>
                <View
                  style={[
                    { flexDirection: "row", justifyContent: "space-between" },
                  ]}
                >
                  <Text style={styles.progressBarText}>
                    {formatDuration(state.currentTime)}
                  </Text>
                  <Text style={styles.progressBarText}>
                    {formatDuration(state.duration)}
                  </Text>
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progress,
                        {
                          width: `${(state.currentTime / state.duration) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            )}
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
    alignItems: "flex-start",
    gap: 10,
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
    borderRadius: 6,
  },
  title: {
    fontSize: 18,
    fontFamily: "Outfit-Medium",
  },
  artistName: {
    color: "#C3C3C3",
    fontFamily: "Outfit-Medium",
  },
  trackInfo: {
    gap: 16,
  },
  progress: {
    height: "100%",
    backgroundColor: "#000000",
    borderRadius: 9999,
    transition: "all 1s linear",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 234,
  },
  progressBar: {
    flex: 1,
    height: 7,
    backgroundColor: "#D1D5DB",
    borderRadius: 9999,
  },
  progressBarText: {
    fontFamily: "Outfit-Medium",
    fontSize: 15,
  },
});

export default Player;
