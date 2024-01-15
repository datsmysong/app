import { View, StyleSheet, Platform, Text } from "react-native";
import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import Button from "../../../components/Button";
import * as Linking from "expo-linking";
import * as Clipboard from "expo-clipboard";
import useSupabaseUser from "../../../lib/useSupabaseUser";

export default function RoomPage() {
  const { roomCode } = useLocalSearchParams();
  const currentPageLink = Linking.useURL();

  //Listening to any incoming deep link
  useEffect(() => {
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => {
      subscription.remove();
    };
  });

  //Deep links handler
  const handleDeepLink = (event: any) => {};

  const onShare = async () => {
    if (!currentPageLink) throw new Error("No link found.");
    let invitationLink = "";
    if (Platform.OS === "ios" || Platform.OS === "android") {
      const webLink = currentPageLink.replace("exp://", "http://");
      invitationLink = `${webLink}/join/${roomCode}`;
    } else {
      invitationLink = currentPageLink.replace("/rooms", "/join");
    }
    await Clipboard.setStringAsync(invitationLink);
  };

  return (
    <View style={styles.shareContainer}>
      <Text style={styles.title}>Salle "{roomCode}"</Text>
      <Button type="filled" onPress={onShare}>
        Partager
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  shareContainer: {
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
});

//useSupabaseUser();