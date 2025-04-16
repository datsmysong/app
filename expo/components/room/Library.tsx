import { ClockCounterClockwise, Heart, MusicNote } from "phosphor-react-native";
import { StyleSheet, View, Text } from "react-native";

import LibraryComponent from "./LibraryComponent";

const Library = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bibliothèque</Text>
      <LibraryComponent
        title="Mes titres récents"
        subtitle="Ajoute une musique à partir des titres récents que tu as écouté"
        icon={<ClockCounterClockwise />}
      />
      <LibraryComponent
        title="Mes playlists"
        subtitle="Ajoute une musique à partir de tes playlists"
        icon={<MusicNote />}
      />
      <LibraryComponent
        title="Mes titres likés"
        subtitle="Ajoute une musique à partir de tes titres likés"
        icon={<Heart />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    rowGap: 8,
  },
  title: {
    fontFamily: "Outfit-Bold",
    fontSize: 24,
  },
});

export default Library;
