import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

import RoomConfigurationParametersList from "../../../../components/RoomConfigurationParametersList";
import { View } from "../../../../components/Themed";

interface MusicRoomParams {
  id: string;
}

export default function RoomSettings() {
  const { id } = useLocalSearchParams() as MusicRoomParams;

  return (
    <ScrollView>
      <View style={styles.pageLayout}>
        <RoomConfigurationParametersList roomId={id} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageLayout: {
    marginVertical: 16,
    alignSelf: "stretch",
    alignItems: "center",
    flex: 1,
  },
});
