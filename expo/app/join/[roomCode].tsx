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

  const onOpenApp = (url: string) => {
    const deepLink = Linking.createURL(url);
    Linking.openURL(deepLink);
  };

  if (Platform.OS === "web" && !hasChoicePlatform) {
    return (
      <View style={styles.choiceContainer}>
        <Text style={styles.title}>
          Vous êtes sur le point de rejoindre la salle d'écoute {roomCode}
        </Text>
        <Button theme="filled" onPress={() => onOpenApp(`join/${roomCode}`)}>
          Ouvrir dans l'application
        </Button>
        <Button theme="outlined" onPress={() => setHasChoicePlatform(true)}>
          Continuer sur le site
        </Button>
      </View>
    );
  }

  const handleJoinRoom = () => {
    //logic to add user to the
    onOpenApp(`rooms/${roomCode}`);
  };

  if (isConnected)
    return (
      <View style={styles.choiceContainer}>
        <Text style={styles.title}>
          Voulez vous rejoindre la salle d'écoute {roomCode} ?
        </Text>
        <Button theme="filled" onPress={handleJoinRoom}>
          Rejoindre
        </Button>
      </View>
    );
  else
    return (
      <View style={styles.choiceContainer}>
        <Text style={styles.title}>
          Vous êtes sur le point de rejoindre la salle d'écoute {roomCode}, mais
          vous n'êtes pas connecté
        </Text>
        <Button theme="filled" href={`(auth)`}>
          Se connecter
        </Button>
        <Button theme={"outlined"} onPress={() => setIsConnected(true)}>
          Continuer en tant qu'invité (dev: setConnected)
        </Button>
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