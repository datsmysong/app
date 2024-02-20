import * as Linking from "expo-linking";
import { Redirect, Stack, useRootNavigation, useRouter } from "expo-router";
import { useEffect } from "react";

import { Text, View } from "../../components/Themed";
import { supabase } from "../../lib/supabase";
import { useSupabaseUserHook } from "../../lib/useSupabaseUser";

export default function TabLayout() {
  const user = useSupabaseUserHook();

  const router = useRouter();
  const navigation = useRootNavigation();
  const url = Linking.useURL();

  useEffect(() => {
    (async () => {
      if (!url || !navigation || !router) return;
      const refresh_token = url.split("#refresh_token=")[1];
      if (!refresh_token) return;
      // clear the url history to avoid the user to go back to the login page & delete the refresh_token from the url
      // router.replace clear not the history
      const state = navigation.getState();
      navigation.reset({
        ...state,
        routes: state.routes.map((route) => ({ ...route, state: undefined })),
      });

      const { error } = await supabase.auth.refreshSession({
        refresh_token,
      });

      if (error) {
        return router.replace("/auth");
      }
      router.replace("/(tabs)");
    })();
  }, [url]);

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
