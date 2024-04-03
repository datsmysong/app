import MailIcon from "phosphor-react-native/src/icons/Envelope";
import { StyleSheet, Text, View } from "react-native";

import ConnectWithGoogle from "./connect-with-google";
import ConnectWithSpotify from "./connect-with-spotify";
import Button from "../../components/Button";
import Separator from "../../components/Separator";
import H1 from "../../components/text/H1";

export default function Onboarding() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <H1>datsmysong</H1>
      </View>
      <View
        style={[styles.container, { maxWidth: 400, alignItems: "stretch" }]}
      >
        <ConnectWithGoogle />
        <ConnectWithSpotify />
        <View style={styles.containerWithDivider}>
          <Separator />
          <Text style={{ marginHorizontal: 10 }}>ou</Text>
          <Separator />
        </View>
        <Button
          prependIcon={<MailIcon />}
          type="outline"
          href="/auth/login"
          block
        >
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
    paddingHorizontal: 10,
  },
  buttonContainer: {
    alignItems: "center",
  },
  titleContainer: {
    marginVertical: 50,
  },
  containerWithDivider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    alignSelf: "center",
  },
});
