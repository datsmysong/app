import { Link } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import Alert from "../../components/Alert";
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
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }: LoginForm) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      Alert.alert("Erreur" + error.message);
      return;
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.form}>
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
            minLength: {
              value: 6,
              message: "Le mot de passe doit contenir au moins 6 caractères",
            },
            validate: {
              hasNumber: (value) =>
                /\d/.test(value) || "Le mot de passe doit contenir un chiffre",
              hasUppercase: (value) =>
                /[A-Z]/.test(value) ||
                "Le mot de passe doit contenir une majuscule",
              hasLowercase: (value) =>
                /[a-z]/.test(value) ||
                "Le mot de passe doit contenir une minuscule",
            },
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
    fontFamily: "Outfit",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "500",
    textDecorationLine: "underline",
    alignSelf: "stretch",
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
