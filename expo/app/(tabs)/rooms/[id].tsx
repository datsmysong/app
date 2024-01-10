import { View, StyleSheet } from "react-native";
import Button from "../../../components/Button";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import * as Clipboard from "expo-clipboard";

export default function RoomPage() {
  const onOpenLink = async () => {
    //WebBrowser.openBrowserAsync("https://docs.expo.io");
    const roomCode = "A1B2C3"
    const deepLink = Linking.createURL(`join/${roomCode}`, {scheme: "datsmysong"});
    await Clipboard.setStringAsync(deepLink);
  };

  return (
    <View style={styles.shareContainer}>
      <Button label="Partager" theme="filled" onPress={onOpenLink}></Button>
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