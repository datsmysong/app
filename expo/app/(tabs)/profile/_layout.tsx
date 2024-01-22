import { Stack } from "expo-router";

export default function ProfileTabLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Profil" }} />
      <Stack.Screen
        name="integration"
        options={{
          presentation: "modal",
          title: "Lier ses comptes de streaming",
        }}
      />
    </Stack>
  );
}
