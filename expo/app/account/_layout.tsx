import { Stack } from "expo-router";

export default function AccountLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Gérer mon compte" }} />
      <Stack.Screen
        name="personal-info"
        options={{ presentation: "modal", title: "Informations personnelles" }}
      />
    </Stack>
  );
}
