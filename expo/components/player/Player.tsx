import { PlayingJSONTrack } from "commons/backend-types";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type PlayerProps = {
  state: PlayingJSONTrack | null;
  children?: React.ReactNode;
};

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const Player: React.FC<PlayerProps> = ({ state, children }) => {
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
});

export default Player;
