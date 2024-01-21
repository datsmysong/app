import { View, StyleSheet, Platform, Text } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import Button from "../../../components/Button";
import * as Linking from "expo-linking";
import * as Clipboard from "expo-clipboard";
import Alert from "../../../components/Alert";

export default function RoomPage() {
  const { roomCode } = useLocalSearchParams();
  const currentPageLink = Linking.useURL();

  const [isCopied, setIsCopied] = useState<boolean>(false);

  const onShare = async () => {
    if (!currentPageLink) {
      Alert.alert("Aucun lien n'a été retourné")
      return;
    }
    let invitationLink = "";
    if (Platform.OS === "ios" || Platform.OS === "android") {
      const webLink = currentPageLink.replace("exp://", "http://");
      const deepLink = Linking.createURL(`rooms/${roomCode}`);
      invitationLink = `${webLink}/join/${roomCode}?deepLink=${encodeURIComponent(deepLink)}`;
    } else {
      invitationLink = currentPageLink.replace("/rooms", "/join");
    }
    await Clipboard.setStringAsync(invitationLink);
    setIsCopied(true);
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Salle "{roomCode}"</Text>
      <View style={styles.buttonContainer}>
        {isCopied ? (
          <Button block prependIcon="check" onPress={onShare}>
            Lien copié
          </Button>
        ) : (
          <Button block onPress={onShare}>
            Partager
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 14,
    gap: 10,
  },
  buttonContainer: {
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
