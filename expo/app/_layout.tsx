import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, router } from "expo-router";
import { useEffect } from "react";
import useSupabaseUser from "../lib/useSupabaseUser";
import { supabase } from "../lib/supabase";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      console.log("initialRouteName", unstable_settings.initialRouteName);
      useSupabaseUser().then((user) => {
        if (!user) router.replace("/(auth)");
      });

      supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          getUserProfile(session.user.id).then((userProfile) => {
            if (!userProfile.username) {
              router.replace("/ask-name");
              return;
            }
            router.replace("/(tabs)");
          });
        } else {
          router.replace("/(auth)");
        }
      });
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="ask-name" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />

      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen
        name="AddMusic"
        options={{ presentation: "modal", title: "Ajouter une musique" }}
      />
      <Stack.Screen
        name="CreateRoom"
        options={{ presentation: "modal", title: "Nouvelle salle" }}
      />
    </Stack>
  );
}

const getUserProfile = async (id: string) => {
  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("account_id", id)
    .single();
  if (error) {
    throw error;
  }
  return data;
};
