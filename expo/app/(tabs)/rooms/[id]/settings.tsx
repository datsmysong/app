import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../../../../components/Themed";
import ParametersList from "../../../../components/NewParametersList";

export default function RoomSettings() {
  return (
    <ScrollView contentContainerStyle={styles.pageLayout}>
      <Text style={styles.title}>Paramètres de la salle</Text>
      <View style={styles.settings}>
        <ParametersList />
      </View>
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

  settings: {
    display: "flex",
    width: 394,
    flexDirection: "column",
    alignItems: "flex-start",
    marginVertical: 12,
  },

  slider: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginVertical: 32,
  },
});
