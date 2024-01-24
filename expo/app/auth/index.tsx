import { StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-elements";

import ConnectWithGoogle from "./connect-with-google";
import ConnectWithSpotify from "./connect-with-spotify";
import Button from "../../components/Button";

export default function Onboarding() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Datsmysong</Text>
      </View>
      <View
        style={[styles.container, { maxWidth: 400, alignItems: "stretch" }]}
      >
        <ConnectWithGoogle />
        <ConnectWithSpotify />
        <View style={styles.containerWithDivider}>
          <Divider style={{ width: "80%", margin: 20 }} />
          <Text>ou</Text>
          <Divider style={{ width: "80%", margin: 20 }} />
        </View>
        <Button prependIcon="mail" type="outline" href="/auth/login" block>
          Rejoindre avec une adresse email
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: "center",
    padding: 15,
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
