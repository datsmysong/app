import { useRef, useState } from "react";
import { StyleSheet } from "react-native";

import Button from "../../components/Button";
import { Text, View } from "../../components/Themed";
import Avatar from "../../components/profile/Avatar";
import { useSupabaseUserHook } from "../../lib/useSupabaseUser";

export default function PersonalInfo() {
  const user = useSupabaseUserHook();
  const avatarRef = useRef<{ saveImage: () => Promise<void> }>();
  const [loading, setLoading] = useState(false);
  const [inputChanged, setInputChanged] = useState<{
    email: boolean;
    username: boolean;
    profilePicture: boolean;
  }>({
    email: false,
    username: false,
    profilePicture: false,
  });

  const handleSubmit = async () => {
    setLoading(true);
    if (!avatarRef.current) return;

    const promiseAvatar = avatarRef.current.saveImage();

    await Promise.all([promiseAvatar]);
  };

  return (
    <View style={styles.rootContainer}>
      <View style={styles.container}>
        <Text>Adresse email</Text>
        <View>
          <Avatar
            ref={avatarRef}
            onImageLoad={() => {
              setInputChanged({ ...inputChanged, profilePicture: true });
            }}
          />
        </View>
        <Button block onPress={handleSubmit} disabled={loading}>
          Sauvegarer
        </Button>
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
