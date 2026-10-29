import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Alert, Platform, Pressable, View } from "react-native";

import Avatar, { AvatarRemote } from "./Avatar";
import { supabase } from "../../lib/supabase";
import { useUserProfile } from "../../lib/userProfile";
import { formStyles } from "../ControlledInput";
import { Text } from "../Themed";
import Button from "../ui/Button";

interface AvatarProps {
  onImageLoad: () => void;
}

/**
 * Component with a button to select an image from the device and display it.
 * It also has a saveImage method to upload the image to Supabase Storage.
 */
const AvatarForm = forwardRef((props: AvatarProps, ref) => {
  const { onImageLoad } = props;
  const user = useUserProfile();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const avatarRef = useRef<AvatarRemote | null>(null);

  useImperativeHandle(ref, () => ({
    saveImage: async () => {
      return await uploadAvatar();
    },
  }));

  async function uploadAvatar(): Promise<{
    error: string | null;
  }> {
    if (!user || !avatarUrl) {
      return {
        error: "No user or avatar",
      };
    }

    const fileName = `${user.user_profile_id}.jpg`;
    const image = await getBase64Image(avatarUrl);

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, image, {
        upsert: true,
        contentType: "image/jpeg",
      });

    if (error) {
      return {
        error: error.message,
      };
    }
    avatarRef.current?.refresh();
    return {
      error: null,
    };
  }

  async function selectAvatar() {
    if (!user) return;
    // setUploading(true);

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
    // setUploading(false);
  }

  return (
    <View style={{ width: "100%", gap: 10 }}>
      <Text style={formStyles.label}>Photo de profil</Text>
      <Pressable
        onPress={selectAvatar}
        style={{
          width: "100%",
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar
          id={user?.user_profile_id}
          ref={avatarRef}
          tempoAvatarImage={avatarUrl}
          noCache
          style={{ width: "60%" }}
        />
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

export default AvatarForm;

const getBase64Image = async (uri: string) => {
  if (Platform.OS === "web") {
    const uriWithoutMIME = uri.split(",")[1];
    const base64data = decode(uriWithoutMIME);
    return base64data;
  }

  const fileUri = uri;
  const base64Data = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return decode(base64Data);
};
