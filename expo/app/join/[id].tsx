import { Text, View, StyleSheet } from "react-native";
import Button from "../../components/Button";
import { Link } from "expo-router";

export default function JoinPage() {
  // When the user is logged in
  return (
    <View style={styles.choiceContainer}>
      <Text style={styles.title}>
        Vous êtes sur le point de rejoindre une salle d'écoute...
      </Text>
      <Button theme="filled">Ouvrir dans l'application</Button>
      <Link style={styles.link} href="/rooms/A1B2C3">
        Ouvrir dans le navigateur
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  choiceContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    marginTop: 5,
    fontSize: 16,
    color: "#1a1a1a",
    textDecorationLine: "underline",
  },
});
