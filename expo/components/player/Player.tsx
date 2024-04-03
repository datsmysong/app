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
  children?: React.ReactNode;
};

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const Player: React.FC<PlayerProps> = ({ state, children }) => {
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
          <View style={{ gap: 16 }}>
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
            >
              Voter pour passer
            </Button>
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
});

export default Player;
