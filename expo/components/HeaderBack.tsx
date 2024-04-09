import { Link } from "expo-router";
import CaretLeft from "phosphor-react-native/src/icons/CaretLeft";

import { Text } from "./Themed";
import Colors from "../constants/Colors";
import Font from "../constants/Font";

export default function HeaderBack() {
  return (
    <Link
      style={{
        flexDirection: "row",
        display: "flex",
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: Colors.light.lightGray,
      }}
      href="/(tabs)/rooms"
    >
      <CaretLeft size={24} color={Colors.light.gray} />
      <Text
        style={{
          fontFamily: Font.Unbounded.Regular,
          fontSize: 16,
          color: Colors.light.gray,
        }}
      >
        Retour
      </Text>
    </Link>
  );
}
