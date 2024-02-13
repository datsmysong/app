import { Redirect, Stack } from "expo-router";

import { View, Text } from "../../components/Themed";
import { useSupabaseUserHook } from "../../lib/useSupabaseUser";

export default function TabLayout() {
  const user = useSupabaseUserHook();

  if (user === undefined)
    return (
      <View>
        <Text>Loading..</Text>
      </View>
    );

  if (user) return <Redirect href="/(tabs)/" />;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{ presentation: "modal", title: "Connexion" }}
      />
      <Stack.Screen
        name="register"
        options={{ presentation: "modal", title: "Inscription" }}
      />
    </Stack>
  );
}
