import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{ presentation: "modal", title: "Connexion" }}
      />
      <Stack.Screen
        name="register"
        options={{ presentation: "modal", title: "Inscription" }}
      />
    </Stack>
  );
}
