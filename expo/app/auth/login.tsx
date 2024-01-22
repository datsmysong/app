import { Link, router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import Button from "../../components/Button";
import { supabase } from "../../lib/supabase";
import ControledInput from "./ControledInput";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    shouldFocusError: true,
  });

  const onSubmit = async ({ email, password }: LoginForm) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError("root", {
        message: "Informations d'authentification incorrects.",
      });
      return;
    }
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.page}>
      <View style={styles.form}>
        {errors.root && (
          <Text style={styles.rootError}>{errors.root.message}</Text>
        )}
        <ControledInput
          control={control}
          label={"Adresse email"}
          name={"email"}
          rules={{
            required: "Veuillez saisir votre adresse email",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Veuillez saisir une adresse email valide",
            },
          }}
          placeholder={"votre@adresse.email"}
          errorMessage={errors.email && errors.email.message}
          autoComplete="email"
        />
        <ControledInput
          control={control}
          label={"Mot de passe"}
          name={"password"}
          rules={{
            required: "Veuillez saisir votre mot de passe",
          }}
          placeholder={"Mon mot de passe robuste"}
          errorMessage={errors.password && errors.password.message}
          autoComplete="password"
          secureTextEntry
        />
        <Text style={{ ...styles.text, textAlign: "right" }}>
          Mot de passe oublié ?
        </Text>
        <Button onPress={handleSubmit(onSubmit)} block>
          Se connecter
        </Button>
        <View
          style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}
        >
          <Link href={"/auth/register"} replace>
            <Text style={{ ...styles.text, textAlign: "center" }}>
              Vous n’avez pas de compte ? Inscrivez-vous !
            </Text>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootError: {
    color: "red",
    fontFamily: "Outfit-Bold",
    fontSize: 18,
    fontStyle: "normal",
    lineHeight: 24,
    paddingBottom: 5,
  },
  form: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 11,
    flex: 1,
    gap: 13,
    width: "100%",
    // alignItems: "center",
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 30,
  },
  text: {
    color: "rgba(0, 0, 0, 0.78)",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "500",
    textDecorationLine: "underline",
    alignSelf: "stretch",
    fontFamily: "Outfit-Regular",
  },
  label: {
    color: "#1A1A1A",
    fontFamily: "Outfit-Bold",
    fontSize: 20,
    fontStyle: "normal",
    lineHeight: 24,
  },
  textAlignCenter: {
    textAlign: "center",
  },
});
