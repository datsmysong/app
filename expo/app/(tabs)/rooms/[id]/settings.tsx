import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

import { MusicRoomParams } from "./index";
import ParametersList from "../../../../components/NewParametersList";
import { Text, View } from "../../../../components/Themed";

export default function RoomSettings() {
  const { id } = useLocalSearchParams() as MusicRoomParams;

  return (
    <ScrollView>
      <View style={styles.pageLayout}>
        <Text style={styles.title}>Paramètres de la salle</Text>
        <ParametersList roomId={id} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageLayout: {
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
