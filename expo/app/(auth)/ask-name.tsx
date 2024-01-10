import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Screen } from "react-native-screens";
import { supabase } from "../../lib/supabase";
import useSupabaseUser from "../../lib/useSupabaseUser";
import { AlertNatif } from "../../components/Alert";
import { router } from "expo-router";

export default function AskName() {
  const [username, setUsername] = useState("");

  const handleSubmitUsername = async () => {
    const user = await useSupabaseUser();
    if (!user?.id) return;

    if (username.length < 5) {
      AlertNatif("Le pseudo doit faire au moins 5 caractères");
      return;
    }
    const { data, error } = await supabase
      .from("user_profile")
      .update({ username: username })
      .eq("account_id", user?.id);
    if (error) {
      if (error.code == "23505") {
        Alert.alert("Erreur", "Ce pseudo est déjà pris");
        return;
      }
      Alert.alert("Erreur", "Une erreur est survenue");
    }
    router.replace("/(tabs)");
  };

  return (
    <Screen>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Choisi ton pseudo</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Pseudo"
          style={{
            borderColor: "gray",
            width: "100%",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
          }}
        />
        <Pressable onPress={() => handleSubmitUsername()}>
          <Text>Valider</Text>
        </Pressable>
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
  form: {
    padding: 20,
    alignItems: "center",
    gap: 30,
  },
  buttonContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
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
