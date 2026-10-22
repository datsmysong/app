import { View } from "react-native";

import { Subtitle } from "../ui/typography/Paragraphs";
import { H1 } from "../ui/typography/Titles";

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
        <Subtitle>0 amis en ligne</Subtitle>
      </View>
    </View>
  );
}
