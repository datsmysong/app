import { StyleSheet } from "react-native";

import Button from "../../components/Button";
import { Text, View } from "../../components/Themed";
import Avatar from "../../components/profile/Avatar";

export default function PersonalInfo() {
  return (
    <View style={styles.rootContainer}>
      <View style={styles.container}>
        <Text>Adresse email</Text>
        <View>
          <Avatar
            size={200}
            url={null}
            onUpload={(url: string) => {
              // setAvatarUrl(url);
              // updateProfile({ username, website, avatar_url: url });
              console.log("Uploaded avatar", url);
            }}
          />
        </View>
      </View>
      <View style={styles.container}>
        <Button type="outline" block>
          Supprimer mon compte
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    gap: 24,
    paddingVertical: 32,
    paddingHorizontal: 18,
  },
  container: {
    alignItems: "stretch",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 24,
    gap: 10,
    padding: 20,
  },
});
