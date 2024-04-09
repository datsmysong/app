import { StyleSheet, View } from "react-native";

import Button from "../Button";
import H1 from "../text/H1";

export default function RoomsHeader() {
  return (
    <View style={styles.headerContainer}>
      <H1>Salles d'écoute</H1>
      <View style={styles.buttonContainer}>
        <Button block href="/rooms/create">
          Créer une salle
        </Button>
        <Button block type="outline" href="/rooms/join">
          Rejoindre une salle
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 21,
    gap: 36,
    backgroundColor: "#E6E6E6",
  },
  buttonContainer: {
    gap: 8,
  },
});
