import Hammer from "phosphor-react-native/src/icons/Hammer";
import React from "react";
import { View } from "react-native";

import { Text } from "../../components/Themed";

export default function TabsFriends() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: 32,
      }}
    >
      <Hammer size={32} weight="fill" color="black" />
      <Text
        style={{
          fontSize: 16,
          textAlign: "center",
          fontFamily: "Outfit-Bold",
        }}
      >
        Cette page est en cours de développement. Merci de revenir plus tard.
      </Text>
    </View>
  );
}
