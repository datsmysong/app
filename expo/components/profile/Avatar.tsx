import { ImageStyle } from "expo-image";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Image, StyleProp, StyleSheet, View } from "react-native";

import { supabase } from "../../lib/supabase";

export type AvatarRemote = {
  refresh: () => void;
};
type AvatarProps = {
  id: string | undefined;
  tempoAvatarImage?: string; // if we want to pass an image url directly (on edit profile)
  style?: StyleProp<ImageStyle>;
  noCache?: boolean;
  radius?: number;
};

const Avatar = forwardRef<AvatarRemote, AvatarProps>(
  ({ id, tempoAvatarImage, noCache, radius = 9999, style }, ref) => {
    const [avatarUrl, setAvatarUrl] = useState<string>();

    useImperativeHandle(ref, () => ({
      refresh: async () => {
        await downloadUserImage();
      },
    }));

    useEffect(() => {
      if (!id) return;
      downloadUserImage();
    }, [id]);

    async function downloadUserImage() {
      let path = `${id}.jpg`;
      if (noCache) path += "?avoidCache=" + Math.random();
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);

      setAvatarUrl(data.publicUrl);
    }

    return (
      <>
        {avatarUrl ? (
          <Image
            source={{ uri: tempoAvatarImage ?? avatarUrl }}
            aria-aria-label="Avatar"
            style={[
              { borderRadius: radius },
              styles.avatar,
              styles.image,
              style,
            ]}
          />
        ) : (
          <View
            style={[
              { borderRadius: radius },
              styles.avatar,
              styles.noImage,
              style,
            ]}
          />
        )}
      </>
    );
  }
);

const styles = StyleSheet.create({
  avatar: {
    overflow: "hidden",
    maxWidth: "100%",
    aspectRatio: 1,
    width: "100%",
  },
  image: {
    objectFit: "cover",
    paddingTop: 0,
    backgroundColor: "#CCCCCC",
  },
  noImage: {
    backgroundColor: "red",
    border: "1px solid rgb(200, 200, 200)",
    borderRadius: 5,
  },
});

export default Avatar;
