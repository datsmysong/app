import { Stack } from "expo-router";

import { ProfileHeader } from "../../../components/profile/HeaderProfil";

export default function ProfileTabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Profil", header: () => <ProfileHeader /> }}
      />
      <Stack.Screen name="account" options={{ headerShown: false }} />
    </Stack>
  );
}
