import { Text, View } from "react-native";

import Font from "../../constants/Font";
import H1 from "../text/H1";

export default function FriendHeader() {
  return (
    <View
      style={{
        flexDirection: "column",
        backgroundColor: "#E6E6E6",
        flex: 1,
        paddingVertical: 18,
        rowGap: 12,
        paddingHorizontal: 38,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <H1>Amis</H1>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View
          style={{
            height: 8,
            width: 8,
            backgroundColor: "red",
            borderRadius: 5,
          }}
        />
        <Text
          style={{
            fontFamily: Font.Unbounded.Regular,
            fontSize: 14,
          }}
        >
          0 amis en ligne
        </Text>
      </View>
    </View>
  );
}
