import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet } from "react-native";

import Alert from "../../components/Alert";
import Button from "../../components/Button";
import ControlledInput from "../../components/ControlledInput";
import { View } from "../../components/Themed";
import Warning from "../../components/Warning";
import Avatar from "../../components/profile/Avatar";
import {
  AuthErrorMessage,
  SupabaseErrorCode,
} from "../../constants/SupabaseErrorCode";
import { emailRules, usernameRules } from "../../lib/inputRestriction";
import { supabase } from "../../lib/supabase";
import { useSupabaseUserHook } from "../../lib/useSupabaseUser";
import { getUserProfile } from "../../lib/userProfile";

type EditForm = {
  email: string;
  username: string;
};

export default function PersonalInfo() {
  const user = useSupabaseUserHook();
  const avatarRef = useRef<{
    saveImage: () => Promise<{
      error: string | null;
    }>;
  }>();

  const scrollViewRef = useRef<ScrollView>(null);

  const [initialUsername, setInitialUsername] = useState<string | null>(null);
  const [profilePictureChanged, setProfilePictureChanged] =
    useState<boolean>(false);
  const [subbmitable, setSubbmitable] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<EditForm>({
    defaultValues: {
      email: "",
      username: "",
    },
    shouldFocusError: true,
  });

  const inputsChange = watch();

  useEffect(() => {
    if (user && user.email) {
      setValue("email", user.email);
      getUserProfile(user.id).then((profile) => {
        if (profile && profile.username) {
          setValue("username", "@" + profile.username);
          setInitialUsername(profile.username);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (inputsChange.email !== user?.email) return setSubbmitable(true);
    if (inputsChange.username !== "@" + initialUsername)
      return setSubbmitable(true);
    if (profilePictureChanged) return setSubbmitable(true);

    setSubbmitable(false);
  }, [inputsChange]);

  /**
   *  Update email
   * @param email valid email
   * @returns string if success, undefined if error
   */
  const updateEmail = async (email: string): Promise<string | undefined> => {
    console.log("Mise a jour email", email);

    const { error } = await supabase.auth.updateUser({ email });
    if (error) {
      setError("email", {
        message:
          error.message === AuthErrorMessage.EmailAlreadyUsed
            ? "Cette adresse email est déjà utilisée"
            : error.message,
      });
      return;
    }
    return "Email mise à jour, veuillez confirmer votre nouvelle adresse email";
  };

  /**
   * Update username
   * @param username username without @
   * @returns string if success, undefined if error
   */
  const updateUsername = async (
    username: string
  ): Promise<string | undefined> => {
    console.log("Mise a jour username");

    const accountId = user?.id;
    if (!accountId) return;

    const usernameWithoutAt = username.replace("@", "");
    const { error } = await supabase
      .from("user_profile")
      .update({
        username: usernameWithoutAt,
      })
      .eq("account_id", accountId);
    if (error) {
      setValue("username", "@" + initialUsername, {
        shouldDirty: false,
      });
      const errorMessage =
        error.code === SupabaseErrorCode.CONSTRAINT_VIOLATION
          ? "Le pseudo '" +
            username +
            "' est déjà pris par un autre utilisateur"
          : error.message;
      setError("username", {
        message: errorMessage,
      });
      return;
    }
    setInitialUsername(usernameWithoutAt);
    setValue("username", "@" + usernameWithoutAt);
    return "Pseudo mis à jour";
  };

  const onSubmit = async ({ email, username }: EditForm) => {
    const succedResum: string[] = [];

    if (inputsChange.email !== user?.email) {
      const res = await updateEmail(email);
      if (res) succedResum.push(res);
    }

    if (inputsChange.username !== "@" + initialUsername) {
      const res = await updateUsername(username);
      if (res) succedResum.push(res);
    }

    if (profilePictureChanged) {
      if (!avatarRef.current) return;
      setProfilePictureChanged(false);

      const { error } = await avatarRef.current.saveImage();
      if (error) {
        return setError("root", {
          message: "Impossible d'ajouter la photo de profil" + error,
        });
      }
      succedResum.push("Photo de profil mise à jour");
    }

    if (succedResum.length > 0) setSuccessMessage(succedResum.join("\n"));
    else setSuccessMessage(null);

    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    setSubbmitable(false);
  };

  return (
    <ScrollView ref={scrollViewRef} style={styles.rootContainer}>
      <View style={styles.container}>
        {errors.root && errors.root.message && (
          <Warning label={errors.root.message} variant="warning" />
        )}
        {successMessage && <Warning label={successMessage} variant="success" />}
        <ControlledInput
          control={control}
          label="Adresse email"
          name="email"
          placeholder="nouvelle adresse email"
          rules={emailRules}
          errorMessage={errors.email && errors.email.message}
        />
        <ControlledInput
          control={control}
          label="Nom d'uilisateur"
          name="username"
          placeholder="@nouveau_nom"
          rules={usernameRules}
          errorMessage={errors.username && errors.username.message}
        />
        <Avatar
          ref={avatarRef}
          onImageLoad={() => {
            setProfilePictureChanged(true);
          }}
        />
        <Button block onPress={handleSubmit(onSubmit)} disabled={!subbmitable}>
          Sauvegarder
        </Button>
      </View>
      <View style={styles.container}>
        <Button
          type="outline"
          color="danger"
          size="small"
          block
          onPress={() => Alert.alert("Not implemented")}
        >
          Supprimer mon compte
        </Button>
      </View>
    </ScrollView>
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
