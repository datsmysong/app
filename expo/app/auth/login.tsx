import { Link, router } from "expo-router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import Button from "../../components/Button";
import ControlledInput from "../../components/ControlledInput";
import Alert from "../../components/Warning";
import { emailRules } from "../../constants/InputRules";
import { AuthErrorMessage } from "../../constants/SupabaseErrorCode";
import { supabase } from "../../lib/supabase";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const [resendEmail, setResendEmail] = React.useState(false);
  const {
    control,
    handleSubmit,
    setError,
    getValues,
    reset,
    formState: { errors, isDirty },
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
      // Logic to handle when user change a input after a failed login
      reset({ email, password }, { keepDirty: false });
      if (error.message === AuthErrorMessage.EmailNotConfirmed) {
        setResendEmail(true);
        return;
      }
      if (error.message === AuthErrorMessage.InvalidCredentials) {
        return setError("password", {
          message: "Identifiants incorrects",
        });
      }
      return setError("root", {
        message: error.message,
      });
    }
    router.replace("/(tabs)");
  };

  useEffect(() => {
    if (isDirty && resendEmail) setResendEmail(false);
  }, [isDirty]);

  const handleResendEmail = async () => {
    const email = getValues("email");
    setResendEmail(false);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      // confirm email will be set in issue #67
    });
    if (error) {
      setError("root", {
        message: error.message,
      });
    }
    router.replace("/auth/");
  };

  return (
    <View
      style={[
        styles.page,
        resendEmail || errors.root ? { paddingTop: 20 } : { paddingTop: 51 },
      ]}
    >
      <View style={styles.form}>
        {errors.root && errors.root.message && (
          <Alert label={errors.root.message} />
        )}
        {resendEmail && (
          <Alert label="Veuillez confirmer votre compte via le lien reçu par mail.">
            <Button size="small" onPress={handleResendEmail} block>
              Renvoyer le mail
            </Button>
          </Alert>
        )}
        <ControlledInput
          control={control}
          label="Adresse email"
          name="email"
          rules={emailRules}
          placeholder="votre@adresse.email"
          errorMessage={errors.email && errors.email.message}
          autoComplete="email"
        />
        <ControlledInput
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
    paddingBottom: 51,
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
