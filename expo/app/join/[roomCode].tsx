import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Button from "../../components/Button";

export default function JoinPage() {
  const { roomCode } = useLocalSearchParams();

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [hasChoicePlatform, setHasChoicePlatform] = useState<boolean>(false);

  useEffect(() => {
    if (!roomCode) console.error("Aucun code");

    const userConnected = false;
    setIsConnected(userConnected);
    if (userConnected) {
      // Verification if participant
      const particpant = false;
      if (particpant) {
        // Already in the room, redirect to the active room
        onOpenApp(`rooms/${roomCode}`);
      }
    }
  }, [roomCode]);

  const onOpenApp = (path: string) => {
    const deepLink = Linking.createURL(path);
    Linking.openURL(deepLink);
  };

  if (Platform.OS === "web" && !hasChoicePlatform) {
    return (
      <View style={styles.choiceContainer}>
        <Text style={styles.title}>
          Vous êtes sur le point de rejoindre la salle d'écoute "{roomCode}"...
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            block
            type="filled"
            onPress={() => onOpenApp(`join/${roomCode}`)}
          >
            Ouvrir dans l'application
          </Button>
          <Button
            block
            type="outline"
            onPress={() => setHasChoicePlatform(true)}
          >
            Continuer sur le site
          </Button>
        </View>
      </View>
    );
  }

  if (isConnected)
    return (
      <View style={styles.choiceContainer}>
        <Text style={styles.title}>
          Voulez vous rejoindre la salle d'écoute {roomCode} ?
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            block
            type="filled"
            onPress={() => onOpenApp(`rooms/${roomCode}`)}
          >
            Rejoindre
          </Button>
        </View>
      </View>
    );
  else
    return (
      <View style={styles.choiceContainer}>
        <Text style={styles.title}>
          Vous êtes sur le point de rejoindre la salle d'écoute "{roomCode}", mais
          vous n'êtes pas connecté
        </Text>
        <View style={styles.buttonContainer}>
          <Button block type="filled" href={`(auth)`}>
            Se connecter
          </Button>
          <Button block type="outline" onPress={() => setIsConnected(true)}>
            Continuer en tant qu'invité
          </Button>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  choiceContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 24,
    gap: 10,
  },
  buttonContainer: {
    gap: 8,
  },
  title: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
