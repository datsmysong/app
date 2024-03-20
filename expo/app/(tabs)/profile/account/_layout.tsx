import { Stack } from "expo-router";

import ErrorBoundary from "../../../../components/ErrorBoundary";
import ProfileErrorBoundary from "../../../../components/ErrorComponent/ProfileError";

export default function AccountLayout() {
  return (
    <ErrorBoundary fallback={<ProfileErrorBoundary />}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Gérer mon compte" }} />
        <Stack.Screen
          name="edit"
          options={{
            presentation: "modal",
            title: "Informations personnelles",
          }}
        />
        <Stack.Screen
          name="integration"
          options={{
            presentation: "modal",
            title: "Lier ses comptes de streaming",
          }}
        />
      </Stack>
    </ErrorBoundary>
  );
}
