import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native";

import Button from "../../components/Button";
import ControlledInput from "../../components/ControlledInput";
import { View } from "../../components/Themed";
import Avatar from "../../components/profile/Avatar";
import { supabase } from "../../lib/supabase";
import { useSupabaseUserHook } from "../../lib/useSupabaseUser";
import { getUserProfile } from "../../lib/userProfile";

type LoginForm = {
  email: string;
  username: string;
};

export default function PersonalInfo() {
  const user = useSupabaseUserHook();
  const [username, setUsername] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    getFieldState,
    watch,
    formState: {
      errors,
      isDirty,
      isValid,
      isValidating,
      dirtyFields,
      touchedFields,
    },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      username: "",
    },
    shouldFocusError: true,
  });

  const avatarRef = useRef<{ saveImage: () => Promise<void> }>();
  const [loading, setLoading] = useState(false);
  const [profilePictureChanged, setProfilePictureChanged] =
    useState<boolean>(false);
  const [subbmitable, setSubbmitable] = useState<boolean>(false);

  const inputs = watch();

  useEffect(() => {
    if (user && user.email) {
      setValue("email", user.email, {
        shouldDirty: false,
      });
      getUserProfile(user.id).then((profile) => {
        if (profile && profile.username) {
          setValue("username", "@" + profile.username, {
            shouldDirty: false,
          });
          setUsername(profile.username);
        }
      });
    }
  }, [user]);

  const onSubmit = async ({ email, username }: LoginForm) => {
    setLoading(true);
    if (dirtyFields.email) {
      console.log("email changed");
      await supabase.auth.updateUser({ email });
    }

    if (dirtyFields.username) {
      console.log("username changed");
      const usernameWithoutAt = username.replace("@", "");
      const { data, error } = await supabase.from("user_profile").upsert({
        account_id: user?.id,
        username: usernameWithoutAt,
      });
    }

    if (profilePictureChanged) {
      console.log("profile picture changed");
      await avatarRef.current?.saveImage();
      setLoading(false);
      setProfilePictureChanged(false);
    }
  };

  useEffect(() => {
    if (inputs.email !== user?.email) return setSubbmitable(true);
    if (inputs.username !== "@" + username) return setSubbmitable(true);
    if (profilePictureChanged) return setSubbmitable(true);

    setSubbmitable(false);
  }, [inputs]);

  return (
    <View style={styles.rootContainer}>
      <View style={styles.container}>
        <ControlledInput
          control={control}
          label="Adresse email"
          name="email"
          placeholder="nouvelle adresse email"
        />
        <ControlledInput
          control={control}
          label="Nom d'uilisateur"
          name="username"
          placeholder="@nouveau_nom"
        />
        <View>
          <Avatar
            ref={avatarRef}
            onImageLoad={() => {
              setProfilePictureChanged(true);
            }}
          />
        </View>
        <Button
          block
          onPress={handleSubmit(onSubmit)}
          disabled={!subbmitable || loading}
        >
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
