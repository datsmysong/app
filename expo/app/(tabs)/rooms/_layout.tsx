import { Stack } from "expo-router";

import { CreateRoomHeader } from "./create";

export default function RoomsTabLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Salle" }} />
      <Stack.Screen name="join" options={{ title: "Rejoindre une salle" }} />
      <Stack.Screen
        name="create"
        options={{
          presentation: "modal",
          title: "Création d'une salle",
          header: () => <CreateRoomHeader />,
        }}
      />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
