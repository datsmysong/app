import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { supabase } from "../../lib/supabase";
import { useSupabaseUserHook } from "../../lib/useSupabaseUser";
import Button from "../Button";
import { formStyles } from "../ControlledInput";
import { Text } from "../Themed";

interface AvatarProps {
  onImageLoad: () => void;
}

const Avatar = forwardRef((props: AvatarProps, ref) => {
  const { onImageLoad } = props;
  const user = useSupabaseUserHook();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      downloadUserImage();
    }
  }, [user]);

  useImperativeHandle(ref, () => ({
    saveImage: async () => {
      return await uploadAvatar();
    },
  }));

  async function downloadUserImage() {
    if (!user) {
      return;
    }
    const path = `${user.id}.jpg`;
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(path + "?avoidCache=" + Math.random());

    if (!data) {
      console.log("no data");
      return;
    }
    setAvatarUrl(data.publicUrl);
  }

  async function uploadAvatar(): Promise<{
    error: string | null;
  }> {
    if (!user || !avatarUrl) {
      return {
        error: "No user or avatar",
      };
    }
    const fileName = `${user.id}.jpg`;
    const image = await getBase64Image(avatarUrl);

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, image, {
        upsert: true,
        contentType: "image/jpeg",
      });

    if (error) {
      console.log("error", error);
      return {
        error: error.message,
      };
    }
    downloadUserImage();
    return {
      error: null,
    };
  }

  async function selectAvatar() {
    if (!user) {
      return;
    }
    setUploading(true);

    const file = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });

    if (file.assets) {
      if (file.assets.length !== 1) {
        Alert.alert("Veuillez sélectionner une seule image");
        return;
      }
      const image = file.assets[0];
      setAvatarUrl(image.uri);
      onImageLoad();
    }
    setUploading(false);
  }

  return (
    <View style={{ width: "100%", gap: 10 }}>
      <Text style={formStyles.label}>Photo de profil</Text>
      <Pressable onPress={selectAvatar}>
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            aria-aria-label="Avatar"
            style={[
              { aspectRatio: 1, width: "100%" },
              styles.avatar,
              styles.image,
            ]}
          />
        ) : (
          <View
            style={[
              { aspectRatio: 1, width: "100%" },
              styles.avatar,
              styles.noImage,
            ]}
          />
        )}
      </Pressable>
      <Button
        onPress={selectAvatar}
        disabled={uploading}
        block
        type="outline"
        size="small"
      >
        {uploading ? "Chargement ..." : "Charger une image"}
      </Button>
    </View>
  );
});

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 5,
    overflow: "hidden",
    maxWidth: "100%",
  },
  image: {
    objectFit: "cover",
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: "#333",
    border: "1px solid rgb(200, 200, 200)",
    borderRadius: 5,
  },
});

const getBase64Image = async (uri: string) => {
  if (Platform.OS === "web") {
    const uriWithoutMIME = uri.split(",")[1];
    const base64data = decode(uriWithoutMIME);
    return base64data;
  } else {
    // "uri": "file:///data/user/0/host.exp.exponent/cache/DocumentPicker/189be1eb-08a5-4bcb-8001-28aafd0febd6.jpg"}],
    const fileUri = uri;
    const base64Data = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return decode(base64Data);
  }
};
