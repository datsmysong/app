import React from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import CustomTextInput from "../../components/CustomTextInput";
import Button from "../../components/Button";
import { supabase } from "../../lib/supabase";
import { Link } from "expo-router";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = ({ email, password }: LoginForm) => {
    supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  return (
    <View style={styles.page}>
      <View style={styles.form}>
        <Text style={styles.label}>Adresse email*</Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomTextInput
              placeholder="votre@adresse.email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoComplete="email"
            />
          )}
          name="email"
        />
        {errors.email && <Text>This is required.</Text>}

        <Text style={styles.label}>Mot de passe*</Text>
        <Controller
          control={control}
          rules={{
            maxLength: 100,
            minLength: 6,
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <CustomTextInput
              placeholder="Mon mot de passe robuste"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoComplete="password"
              secureTextEntry
            />
          )}
          name="password"
        />
        {errors.password && <Text>This is required.</Text>}
        <Text style={{ ...styles.text, textAlign: "right" }}>
          Mot de passe oublié ?
        </Text>
        <Button onPress={handleSubmit(onSubmit)} block>
          Se connecter
        </Button>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
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
    gap: 12,
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
