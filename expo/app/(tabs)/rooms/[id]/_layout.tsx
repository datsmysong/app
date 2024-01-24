import { Stack } from "expo-router";

export default function RoomTabLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Nom de la salle" }} />
      <Stack.Screen
        name="invite"
        options={{ presentation: "modal", title: "Menu d'invitation" }}
      />
    </Stack>
  );
}
