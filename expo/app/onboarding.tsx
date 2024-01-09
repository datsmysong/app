import { Button, StyleSheet, Text, View } from "react-native";
import ConnectWithSpotify from "./connect-with-spotify";

export default function onboarding() {
  return (
    <View style={styles.container}>
      <Text>datsmysong</Text>
      <View>
        <ConnectWithSpotify />
        <Button title="Rejoindre avec Google" />
        <Text>ou</Text>
        <Button title="Rejoindre avec une adresse email" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  buttonContainer: {
    alignItems: "center",
  },
});
