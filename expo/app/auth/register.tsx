import { Link, router } from "expo-router";
import { useForm, useWatch } from "react-hook-form";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import Alert from "../../components/Alert";
import Button from "../../components/Button";
import ControlledInput from "../../components/ControlledInput";
import {
  emailRules,
  passwordRules,
  usernameRules,
} from "../../constants/InputRules";
import { getApiUrl } from "../../lib/apiUrl";

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
};

export default function Register() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
    },
  });
  const password = useWatch({ control, name: "password" });

  const onSubmit = async ({
    email,
    password,
    username,
    displayName,
  }: FormData) => {
    displayName = displayName ?? username;

    const baseUrl = getApiUrl();

    const data = await fetch(baseUrl + "/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        username,
        displayName,
      }),
    });
    if (data.status === 200) {
      Alert.alert("Veuillez confirmer votre compte via le lien reçu par mail.");
      return router.replace("/auth/");
    }
    if (data.status === 409) {
      // Username already exists
      setError("username", {
        message: "Ce nom d'utilisateur est déjà pris",
      });
    }
    Alert.alert("Une erreur est survenue, veuillez réessayer plus tard.");
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.form}>
        <ControlledInput
          onSubmitEditing={handleSubmit(onSubmit)}
          control={control}
          label="Adresse email"
          name="email"
          rules={emailRules}
          placeholder="votre@adresse.email"
          errorMessage={errors.email && errors.email.message}
          autoComplete="email"
        />
        <ControlledInput
          onSubmitEditing={handleSubmit(onSubmit)}
          control={control}
          label={"Nom d'utilisateur"}
          name="username"
          rules={usernameRules}
          placeholder={"Nom d'utilisateur"}
          errorMessage={errors.username && errors.username.message}
          autoComplete="username"
        />
        <ControlledInput
          onSubmitEditing={handleSubmit(onSubmit)}
          control={control}
          label={"Nom d'affichage"}
          name="displayName"
          placeholder="LePetitRenard"
          errorMessage={errors.displayName && errors.displayName.message}
          autoComplete="nickname"
        />
        <ControlledInput
          onSubmitEditing={handleSubmit(onSubmit)}
          control={control}
          label="Mot de passe"
          name="password"
          rules={passwordRules}
          placeholder="Mon mot de passe robuste"
          errorMessage={errors.password && errors.password.message}
          autoComplete="password"
          secureTextEntry
        />
        <ControlledInput
          onSubmitEditing={handleSubmit(onSubmit)}
          control={control}
          label="Confirmer le mot de passe"
          name="confirmPassword"
          rules={{
            required: "Veuillez confirmer votre mot de passe",
            validate: (value) =>
              value === password || "Les mots de passe ne correspondent pas",
          }}
          placeholder="Mon mot de passe robuste"
          errorMessage={
            errors.confirmPassword && errors.confirmPassword.message
          }
          autoComplete="current-password"
          secureTextEntry
        />

        <Button onPress={handleSubmit(onSubmit)} block>
          S'inscrire
        </Button>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Link href="/auth/login" replace>
            <Text style={{ ...styles.text, textAlign: "center" }}>
              Déjà un compte ? Connectez-vous !
            </Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 51,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  form: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 11,
    flex: 1,
    gap: 13,
    width: "100%",
  },
  text: {
    color: "rgba(0, 0, 0, 0.78)",
    fontFamily: "Outfit-Medium",
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
