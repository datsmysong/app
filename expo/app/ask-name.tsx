import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Screen } from "react-native-screens";

import Button from "../components/Button";
import ControlledInput from "../components/ControlledInput";
import { Text } from "../components/Themed";
import Font from "../constants/Font";
import { usernameRules } from "../constants/InputRules";
import { SupabaseErrorCode } from "../constants/SupabaseErrorCode";
import { supabase } from "../lib/supabase";
import { useSupabaseUserHook } from "../lib/useSupabaseUser";

type UsernameForm = {
  username: string;
};

export default function AskName() {
  const user = useSupabaseUserHook();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UsernameForm>({
    defaultValues: {
      username: "",
    },
    shouldFocusError: true,
  });

  /**
   * Possible to upgrade with parallel requests
   * @param inputs
   * @returns
   */
  const onSubmit = async ({ username }: UsernameForm) => {
    console.log("submitting", username);
    console.log("profile", user);
    if (!user) return;

    console.log("submitting", username);
    const { error } = await supabase
      .from("user_profile")
      .update({ username })
      .eq("account_id", user.id);

    if (!error) {
      router.push("/");
    }
    if (error?.code === SupabaseErrorCode.CONSTRAINT_VIOLATION) {
      setError("username", {
        type: "manual",
        message: "Ce nom d'utilisateur est déjà pris",
      });
    }
  };

  return (
    <Screen
      style={{
        flex: 1,
        alignItems: "stretch",
        gap: 26,
        padding: 16,
      }}
    >
      <Text
        style={{
          // textAlign: "center",
          marginVertical: 16,
          fontFamily: Font.Outfit.Medium,
          fontSize: 16,
        }}
      >
        Ici, tu peux choisir un nom d'utilisateur pour que tes amis puissent te
        trouver plus facilement. Ce nom est unique sur datsmysong !
      </Text>
      <ControlledInput
        autofocus
        control={control}
        label="Nom d'utilisateur"
        name="username"
        placeholder="@MonNomDutilisateur"
        rules={usernameRules}
        errorMessage={errors.username && errors.username.message}
        onSubmitEditing={handleSubmit(onSubmit)}
        info="Tu n'as le droit qu'à des lettres, des chiffres..."
      />
      <Button block onPress={handleSubmit(onSubmit)}>
        Ajouter ce nom
      </Button>
    </Screen>
  );
}
