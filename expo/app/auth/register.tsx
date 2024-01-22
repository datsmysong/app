import { makeRedirectUri } from "expo-auth-session";
import { Link, router } from "expo-router";
import { useForm, useWatch } from "react-hook-form";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "../../components/Button";
import ControledInput from "./ControledInput";
type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
};

const directUri = makeRedirectUri();
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
    // TODO after merge : getApiUrl() from lib
    const baseUrl = directUri.includes("exp://")
      ? "http://" + directUri.split(":8081")[0].split("//")[1]
      : directUri.split(":8081")[0];

    const data = await fetch(baseUrl + ":3000/auth/register", {
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
    console.log("Result of register", data);
    if (data.status === 200) {
      Alert.alert("Veuillez confirmer votre compte via le lien reçu par mail.");
      return router.replace("/auth/login");
    }
    if (data.status === 409) {
      // Username already exists
      setError("username", {
        message: "Ce nom d'utilisateur est déjà pris",
      });
      return;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.form}>
        <ControledInput
          onSubmit={handleSubmit(onSubmit)}
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
          onSubmit={handleSubmit(onSubmit)}
          control={control}
          label={"Nom d'utilisateur"}
          name={"username"}
          rules={{
            required: "Un nom d'utilisateur est requis",
            minLength: {
              value: 5,
              message: "Le nom d'utilisateur est trop court",
            },
          }}
          placeholder={"Nom d'utilisateur"}
          errorMessage={errors.username && errors.username.message}
          autoComplete="username"
        />
        <ControledInput
          onSubmit={handleSubmit(onSubmit)}
          control={control}
          label={"Nom d'affichage"}
          name={"displayName"}
          placeholder={"LePetitRenard"}
          errorMessage={errors.displayName && errors.displayName.message}
          autoComplete="nickname"
        />
        <ControledInput
          onSubmit={handleSubmit(onSubmit)}
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
        <ControledInput
          onSubmit={handleSubmit(onSubmit)}
          control={control}
          label={"Confirmer le mot de passe"}
          name={"confirmPassword"}
          rules={{
            required: "Veuillez confirmer votre mot de passe",
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
              sameAsPassword: (value) =>
                value == password || "Les mots de passe ne correspondent pas",
            },
          }}
          placeholder={"Mon mot de passe robuste"}
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
          <Link href={"/auth/login"} replace>
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
    paddingHorizontal: 38,
    backgroundColor: "#fff",
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
