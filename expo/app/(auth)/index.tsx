import { Link, router } from "expo-router";
import { Button, Text, View, StyleSheet, Pressable } from "react-native";
import { Screen } from "react-native-screens";
import ConnectWithSpotify from "./connect-with-spotify";
import { Divider } from "react-native-elements";

export default function OnBoarding() {
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>datsmysong</Text>
        </View>
        <View style={styles.container}>
          <ConnectWithSpotify />
          <Pressable onPress={() => router.push("/ask-name")}>
            <Text>Rejoindre avec Google</Text>
          </Pressable>
          <View style={styles.containerWithDivider}>
            <Divider style={{ width: "80%", margin: 20 }} />
            <Text>ou</Text>
            <Divider style={{ width: "80%", margin: 20 }} />
          </View>
          <Link href={"/(auth)/login"} asChild>
            <Pressable>
              <Text>Rejoindre avec une adresse email</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
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
