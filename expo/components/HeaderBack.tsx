import { Link } from "expo-router";
import { CaretLeft } from "phosphor-react-native";

import { Subtitle } from "./typography/Paragraphs";
import Colors from "../constants/Colors";

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
      <Subtitle>Retour</Subtitle>
    </Link>
  );
}
