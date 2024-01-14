import { Text, View, StyleSheet } from "react-native";
import Button from "../../components/Button";
import { Link, useLocalSearchParams } from "expo-router";
import * as Linking from "expo-linking";

export default function JoinPage() {
  const { roomCode } = useLocalSearchParams();

  const onOpenApp = () => {
    const deepLink = Linking.createURL(`rooms/${roomCode}`);
    alert(deepLink);
    Linking.openURL(deepLink);
  };

  // When the user is logged in
  return (
    <View style={styles.choiceContainer}>
      <Text style={styles.title}>
        Vous êtes sur le point de rejoindre une salle d'écoute...
      </Text>
      <Button theme="filled" onPress={onOpenApp}>
        Ouvrir dans l'application
      </Button>
      <Link style={styles.link} href={`rooms/${roomCode}`}>
        Continuer sur le site
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
