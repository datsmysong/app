import { InactiveRoomMusic, Participant } from "commons/room-types";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import { Text, View } from "./Themed";

type InactiveMusicProps = {
  music: InactiveRoomMusic;
};

const InactiveMusic: React.FC<InactiveMusicProps> = ({ music }) => {
  return (
    <View style={styles.musicContainer}>
      <MusicArtwork imageUrl={music.artwork} addedBy={music.addedBy} />
      <MusicContent
        title={music.name}
        artists={music.artist}
        position={music.position}
      />
      <MusicActions />
    </View>
  );
};

type MusicArtworkProps = {
  imageUrl: string;
  addedBy: Participant;
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
      <Text>{title}</Text>
      <Text>{artists}</Text>
      <Text>{position}</Text>
    </View>
  );
};

const MusicActions: React.FC = () => {
  return <View />;
};

const styles = StyleSheet.create({
  musicContainer: {
    gap: 10,
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
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
    borderRadius: 10,
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
