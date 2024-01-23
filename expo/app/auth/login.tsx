import { Link, router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import Button from "../../components/Button";
import ControledInput from "../../components/ControledInput";
import Warning from "../../components/Warning";
import { supabase } from "../../lib/supabase";

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
        message: "Informations d'authentification incorrects",
      });
      return;
    }
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.page}>
      <View style={styles.form}>
        {errors.root && errors.root.message && (
          <Warning label={errors.root.message} />
        )}
        <ControledInput
          control={control}
          label="Adresse email"
          name="email"
          rules={{
            required: "Veuillez saisir votre adresse email",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Veuillez saisir une adresse email valide",
            },
          }}
          placeholder="votre@adresse.email"
          errorMessage={errors.email && errors.email.message}
          autoComplete="email"
        />
        <ControledInput
          control={control}
          label="Mot de passe"
          name="password"
          rules={{
            required: "Veuillez saisir votre mot de passe",
          }}
          placeholder="Mon mot de passe robuste"
          errorMessage={errors.password && errors.password.message}
          autoComplete="password"
          secureTextEntry
        />
        <Link href="/auth/" style={{ ...styles.text, textAlign: "right" }}>
          Mot de passe oublié ?
        </Link>
        <Button onPress={handleSubmit(onSubmit)} block>
          Se connecter
        </Button>
        <View
          style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}
        >
          <Link
            href="/auth/register"
            replace
            style={{ ...styles.text, textAlign: "center" }}
          >
            Vous n’avez pas de compte ? Inscrivez-vous !
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
    borderRadius: 11,
    flex: 1,
    gap: 13,
    width: "100%",
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 51,
    paddingHorizontal: 20,
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
