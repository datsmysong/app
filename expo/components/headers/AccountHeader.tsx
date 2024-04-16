import { View } from "react-native";

import { H1 } from "../ui/typography/Titles";

export const AccountHeader = () => {
  return (
    <View
      style={{
        flexDirection: "column",
        backgroundColor: "#E6E6E6",
        flex: 1,
        paddingVertical: 18,
        rowGap: 18,
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
        <H1>Gérer mon compte</H1>
      </View>
    </View>
  );
};
