import { ScrollView, StyleSheet } from "react-native";

import ParametersList from "../../../../components/NewParametersList";
import { Text } from "../../../../components/Themed";

export default function RoomSettings() {
  return (
    <ScrollView contentContainerStyle={styles.pageLayout}>
      <Text style={styles.title}>Paramètres de la salle</Text>
      <ParametersList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageLayout: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginVertical: 16,
    alignSelf: "stretch",
  },

  title: {
    color: "#000",
    fontFamily: "Outfit",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "700",
    letterSpacing: 0.48,
    padding: 20,
  },
});
