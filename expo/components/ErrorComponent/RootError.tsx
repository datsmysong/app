import { StyleSheet } from "react-native";

import Button from "../Button";
import { View, Text } from "../Themed";

export const RootErrorBoundary = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Oups !</Text>
      <Text style={styles.h2}>Erreur interne</Text>
      <Text style={styles.h3}>
        Une erreur est survenue, veuillez réessayer plus tard ou contacter le
        support.
      </Text>
      <Button href="/" block>
        Retourner à l'accueil
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    padding: 20,
  },
  h1: {
    fontSize: 50,
    fontFamily: "Outfit-Bold",
    textAlign: "center",
  },
  h2: {
    fontSize: 35,
    fontFamily: "Outfit-Regular",
    textAlign: "center",
  },
  h3: {
    fontSize: 20,
    fontFamily: "Outfit-Regular",
    textAlign: "center",
  },
});
