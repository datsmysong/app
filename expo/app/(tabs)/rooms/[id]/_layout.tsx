import { Stack } from "expo-router";

export default function RoomTabLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Nom de la salle" }} />
      <Stack.Screen
        name="invite"
        options={{ presentation: "modal", title: "Menu d'invitation" }}
      />
      <Stack.Screen
        name="qrcode"
        options={{
          title: "Rejoindre la salle",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen name="add" options={{ title: "Ajouter une musique" }} />
      <Stack.Screen
        name="searchMusic"
        options={{ title: "Ajouter une musique" }}
      />
    </Stack>
  );
}
