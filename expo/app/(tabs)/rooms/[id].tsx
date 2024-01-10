import { View, StyleSheet, Text } from "react-native";
import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import * as Clipboard from "expo-clipboard";

export default function RoomPage() {
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
    const roomCode = "A1B2C3"
    const deepLink = Linking.createURL(`rooms/${roomCode}`);
    await Clipboard.setStringAsync(deepLink);
  };

  return (
    <View style={styles.shareContainer}>
      <Button label="Partager" theme="filled" onPress={onShareLink}></Button>
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