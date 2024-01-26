import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native";

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
  const [initialUsername, setInitialUsername] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { dirtyFields, errors },
  } = useForm<EditForm>({
    defaultValues: {
      email: "",
      username: "",
    },
    shouldFocusError: true,
  });

  const avatarRef = useRef<{ saveImage: () => Promise<void> }>();
  const [profilePictureChanged, setProfilePictureChanged] =
    useState<boolean>(false);
  const [subbmitable, setSubbmitable] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
          setInitialUsername(profile.username);
        }
      });
    }
  }, [user]);

  const onSubmit = async ({ email, username }: EditForm) => {
    const succedResum: string[] = [];
    if (dirtyFields.email) {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) {
        setError("email", {
          message:
            error.message === AuthErrorMessage.EmailAlreadyUsed
              ? "Cette adresse email est déjà utilisée"
              : error.message,
        });
      } else
        succedResum.push(
          "Email mise à jour, veuillez confirmer votre nouvelle adresse email"
        );
    }

    if (dirtyFields.username) {
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
        if (error.code === SupabaseErrorCode.CONSTRAINT_VIOLATION) {
          setError("username", {
            message:
              "Le pseudo '" +
              username +
              "' est déjà pris par un autre utilisateur",
          });
        } else {
          setError("root", {
            message: error.message,
          });
        }
      } else succedResum.push("- Pseudo mis à jour");
      setInitialUsername(usernameWithoutAt);
    }

    if (profilePictureChanged) {
      await avatarRef.current?.saveImage();
      setProfilePictureChanged(false);
      succedResum.push("- Photo de profil mise à jour");
    }

    if (succedResum.length > 0) setSuccessMessage(succedResum.join("\n"));
    else setSuccessMessage(null);

    setSubbmitable(false);
  };

  useEffect(() => {
    if (inputs.email !== user?.email) return setSubbmitable(true);
    if (inputs.username !== "@" + initialUsername) return setSubbmitable(true);
    if (profilePictureChanged) return setSubbmitable(true);

    setSubbmitable(false);
  }, [inputs]);

  return (
    <View style={styles.rootContainer}>
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
