import { Stack } from "expo-router";

export default function RoomsTabLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Salle" }} />
      <Stack.Screen name="join" options={{ title: "Rejoindre une salle" }} />
      <Stack.Screen
        name="create"
        options={{ presentation: "modal", title: "Création d'une salle" }}
      />
      <Stack.Screen name="[id]/index" options={{ title: "Salle d'écoute" }} />
      <Stack.Screen
        name="[id]/add"
        options={{ title: "Ajouter une musique" }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: "Nom de la salle", headerShown: false }}
      />
    </Stack>
  );
}
