import { Stack } from "expo-router";

import ErrorBoundary from "../../../../components/ErrorBoundary";
import ProfileErrorBoundary from "../../../../components/ErrorComponent/ProfileError";
import { AccountHeader } from "../../../../components/headers/AccountHeader";

export default function AccountLayout() {
  return (
    <ErrorBoundary fallback={<ProfileErrorBoundary />}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Gérer mon compte",
            header: () => <AccountHeader />,
          }}
        />
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
        <Stack.Screen
          name="security"
          options={{
            presentation: "modal",
            title: "Securité de mon compte",
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            presentation: "modal",
            title: "Paramètres de notification",
          }}
        />
        <Stack.Screen
          name="help"
          options={{
            presentation: "modal",
            title: "Assistance",
          }}
        />
      </Stack>
    </ErrorBoundary>
  );
}
