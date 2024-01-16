import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-elements";
import Button from "../../components/Button";
import ConnectWithSpotify from "./connect-with-spotify";

export default function Onboarding() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Datsmysong</Text>
      </View>
      <View style={styles.container}>
        <Button prependIcon="home" type="outline">
          Rejoindre avec Google
        </Button>
        <ConnectWithSpotify />
        <View style={styles.containerWithDivider}>
          <Divider style={{ width: "80%", margin: 20 }} />
          <Text>ou</Text>
          <Divider style={{ width: "80%", margin: 20 }} />
        </View>
        <Button prependIcon="mail" type="outline" href="/auth/login">
          Rejoindre avec une adresse email
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 20,
    width: "100%",
  },
  buttonContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  titleContainer: {
    marginTop: 100,
    marginBottom: 100,
  },
  containerWithDivider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
