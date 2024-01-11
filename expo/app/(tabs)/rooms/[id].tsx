import { View, StyleSheet, Text } from "react-native";
import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import * as Clipboard from "expo-clipboard";

export default function RoomPage() {
  const currentPageLink = Linking.useURL();

  //Listening to any incoming deep link
  useEffect(() => {
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return (() => {
      subscription.remove();
    })
  });
  
  //Handler
  const handleDeepLink = (event: any) => {};

  const onShareLink = async () => {
    // For when the user click on "Open in the app" in the web browser
    // const roomCode = "A1B2C3"
    // const deepLink = Linking.createURL(`rooms/${roomCode}`);
    let invitationLink: string;
    if (process.env.NODE_ENV === "production") {
      currentPageLink ?
      invitationLink = currentPageLink.split("//")[1] :
      invitationLink = "";
    } else {

    }
    //await Clipboard.setStringAsync();
  };

  return (
    <View style={styles.shareContainer}>
      <Button theme="filled" onPress={onShareLink}>Partager</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  shareContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});