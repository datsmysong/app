import { MaterialIcons } from "@expo/vector-icons";

import { View, Text } from "../Themed";

export default function WebsocketError() {
  return (
    <View
      style={{
        backgroundColor: "#fffbe6",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          padding: 10,
          gap: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MaterialIcons name="warning" size={24} color="red" />
        <Text
          style={{
            fontFamily: "Outfit-Regular",
          }}
        >
          Vous n'êtes plus connecté au serveur, tentative de reconnexion en
          cours
        </Text>
      </View>
    </View>
  );
}
