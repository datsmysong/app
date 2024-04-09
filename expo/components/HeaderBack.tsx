import { Link } from "expo-router";
import CaretLeft from "phosphor-react-native/src/icons/CaretLeft";

import { Text } from "./Themed";

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
      }}
      href="/(tabs)/rooms"
    >
      <CaretLeft size={24} />
      <Text
        style={{
          fontFamily: "Outfit-Medium",
          fontSize: 16,
        }}
      >
        Retour
      </Text>
    </Link>
  );
}
