import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

import { supabase } from "../../lib/supabase";

export type AvatarRemote = {
  refresh: () => void;
};
type AvatarProps = {
  id: string | undefined;
  tempoAvatarImage?: string; // if we want to pass an image url directly (on edit profile)
  trackItemStyle?: any;
};

const Avatar = forwardRef<AvatarRemote, AvatarProps>(
  ({ id, tempoAvatarImage, trackItemStyle }, ref) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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
      const path = `${id}.jpg`;
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(path + "?avoidCache=" + Math.random());

      if (!data) {
        // No image for this user
        return;
      }
      setAvatarUrl(data.publicUrl);
    }

    return (
      <>
        {avatarUrl ? (
          <Image
            source={{ uri: tempoAvatarImage ?? avatarUrl }}
            aria-aria-label="Avatar"
            style={[
              { aspectRatio: 1, width: "100%" },
              styles.avatar,
              styles.image,
              trackItemStyle ?? {},
            ]}
          />
        ) : (
          <View
            style={[
              { aspectRatio: 1, width: "100%" },
              styles.avatar,
              styles.noImage,
              trackItemStyle ?? {},
            ]}
          />
        )}
      </>
    );
  }
);

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

export default Avatar;
