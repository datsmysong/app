import { Redirect, Stack, useNavigation, useRouter } from "expo-router";
import { Alert, Linking } from "react-native";

import { Text, View } from "../../components/Themed";
import { supabase } from "../../lib/supabase";
import { useSupabaseUserHook } from "../../lib/useSupabaseUser";

export default function TabLayout() {
  const user = useSupabaseUserHook();
  const url = Linking.getInitialURL();

  const router = useRouter();
  const navigation = useNavigation();

  url.then(async (url) => {
    if (!url) return;
    const refresh_token = url.split("#refresh_token=")[1];
    if (refresh_token) {
      const { error } = await supabase.auth.refreshSession({
        refresh_token,
      });
      // clear the url history to avoid the user to go back to the login page & delete the refresh_token from the url
      // router.replace clear not the history
      const state = navigation.getState();
      navigation.reset({
        ...state,
        routes: state.routes.map((route) => ({ ...route, state: undefined })),
      });
      if (error) {
        router.replace("/auth");
      }
      router.push("/(tabs)");
    }
  });

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
