import { Warning } from "phosphor-react-native";

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
        <Warning color="red" />
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
