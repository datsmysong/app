import { Stack } from "expo-router";

import RoomsHeader from "../../../components/headers/RoomsHeader";

export default function RoomsTabLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ header: () => <RoomsHeader /> }} />
      <Stack.Screen name="join" options={{ title: "Rejoindre une salle" }} />
      <Stack.Screen
        name="create"
        options={{ presentation: "modal", title: "Création d'une salle" }}
      />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
