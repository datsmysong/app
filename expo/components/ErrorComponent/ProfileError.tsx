import { CellSignalX } from "phosphor-react-native";
import { StyleSheet } from "react-native";

import { View } from "../Themed";
import Button from "../ui/Button";
import { H1, H2 } from "../ui/typography/Titles";

export default function ProfileErrorBoundary(): JSX.Element {
  return (
    <View style={errorStyle.page}>
      <View style={errorStyle.title}>
        <CellSignalX size={60} color="red" />
        <H1>Erreur</H1>
        <H2>Impossible de charger les données de votre compte</H2>
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
