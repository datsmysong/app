import { ActivityIndicator } from "react-native";

import { View, Text } from "./Themed";
import Colors from "../constants/Colors";

export default function ApplicationLoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <ActivityIndicator size={64} color={Colors.light.text} />
      <Text style={{ textAlign: "center" }}>
        Chargement de l'application en cours...
      </Text>
    </View>
  );
}
