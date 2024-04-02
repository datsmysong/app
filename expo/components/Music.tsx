import { PlayedJSONTrack } from "commons/backend-types";
import { Image } from "expo-image";
import Heart from "phosphor-react-native/src/icons/Heart";
import { StyleSheet } from "react-native";

import { Text, View } from "./Themed";

type InactiveMusicProps = {
  music: PlayedJSONTrack;
};

const InactiveMusic: React.FC<InactiveMusicProps> = ({ music }) => {
  return (
    <View style={styles.musicContainer}>
      <View style={styles.musicDetails}>
        <MusicArtwork imageUrl={music.imgUrl} addedBy={music.addedBy} />
        <MusicContent
          title={music.title}
          artists={music.artistsName}
          position={music.position}
        />
      </View>
      <MusicActions />
    </View>
  );
};

type MusicArtworkProps = {
  imageUrl: string;
  addedBy: string;
};

const MusicArtwork: React.FC<MusicArtworkProps> = ({ imageUrl, addedBy }) => {
  // TODO: Use a component to load the avatar of an user
  const avatarUrl = "https://unsplash.it/22/22";

  return (
    <View style={styles.artworkContainer}>
      <Image source={{ uri: imageUrl }} style={styles.artwork} />
      <Image source={{ uri: avatarUrl }} style={styles.artworkAvatar} />
    </View>
  );
};

type MusicContentProps = {
  title: string;
  artists: string;
  position: number;
};

const MusicContent: React.FC<MusicContentProps> = ({
  title,
  artists,
  position,
}) => {
  return (
    <View>
      <View style={{ flexDirection: "row", gap: 4 }}>
        <Text style={styles.title}>{position}.</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.artists}>{artists}</Text>
    </View>
  );
};

const MusicActions: React.FC = () => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Heart />
    </View>
  );
};

const styles = StyleSheet.create({
  musicContainer: {
    gap: 10,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  musicDetails: {
    gap: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontFamily: "Outfit-Medium",
    fontSize: 15,
  },
  artists: {
    fontFamily: "Outfit-Medium",
    fontSize: 15,
    color: "#C3C3C3",
  },
  artworkContainer: {
    position: "relative",
    width: 46,
    height: 46,
    marginRight: 22 / 2 / 1.33,
  },
  artwork: {
    width: 46,
    height: 46,
    borderRadius: 6,
    borderCurve: "continuous",
  },
  artworkAvatar: {
    position: "absolute",
    top: 46 - (22 / 2) * 1.33,
    width: 22,
    height: 22,
    left: 46 - (22 / 2) * 1.33,
    backgroundColor: "red",
    borderRadius: 22,
  },
});

export default InactiveMusic;
