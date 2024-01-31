import { Stack } from "expo-router";

// Account will be mooved to (tabs)/profile/account...
export default function AccountLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Gérer mon compte" }} />
      <Stack.Screen
        name="edit"
        options={{ presentation: "modal", title: "Informations personnelles" }}
      />
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
