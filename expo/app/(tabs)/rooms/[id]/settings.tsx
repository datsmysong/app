import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

import { MusicRoomParams } from "./index";
import { Text, View } from "../../../../components/Themed";
import RoomConfigurationParametersList from "../../../components/RoomConfigurationParametersList";

export default function RoomSettings() {
  const { id } = useLocalSearchParams() as MusicRoomParams;

  return (
    <ScrollView>
      <View style={styles.pageLayout}>
        <Text style={styles.title}>Paramètres de la salle</Text>
        <RoomConfigurationParametersList roomId={id} />
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
    fontFamily: "Outfit-Regular",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "700",
    letterSpacing: 0.48,
    padding: 10,
  },
});
