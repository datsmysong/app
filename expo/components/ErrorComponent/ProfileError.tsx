import { CellSignalX } from "phosphor-react-native";
import { StyleSheet } from "react-native";

import Button from "../Button";
import { View, Text } from "../Themed";

export default function ProfileErrorBoundary(): JSX.Element {
  return (
    <View style={errorStyle.page}>
      <View style={errorStyle.title}>
        <CellSignalX size={60} color="red" />
        <Text
          style={{
            fontSize: 30,
            fontFamily: "Outfit-Regular",
          }}
        >
          Impossible de charger les données de votre compte
        </Text>
      </View>

      <Button href="/profile">Retourner à votre page de profil</Button>
    </View>
  );
}

const errorStyle = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    rowGap: 40,
    flexDirection: "column",
  },
  title: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
});
