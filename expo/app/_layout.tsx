import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import useSupabaseUser from "../lib/useSupabaseUser";
import { supabase } from "../lib/supabase";
import { getUserProfile } from "../lib/userProfile";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [userNameFind, setSetUserNameFind] = useState(false);
  const [loaded, error] = useFonts({
    "Outfit-Thin": require("../assets/fonts/outfit/Outfit-Thin.ttf"),
    "Outfit-ExtraLight": require("../assets/fonts/outfit/Outfit-ExtraLight.ttf"),
    "Outfit-Light": require("../assets/fonts/outfit/Outfit-Light.ttf"),
    "Outfit-Medium": require("../assets/fonts/outfit/Outfit-Medium.ttf"),
    "Outfit-Regular": require("../assets/fonts/outfit/Outfit-Regular.ttf"),
    "Outfit-SemiBold": require("../assets/fonts/outfit/Outfit-SemiBold.ttf"),
    "Outfit-Bold": require("../assets/fonts/outfit/Outfit-Bold.ttf"),
    "Outfit-ExtraBold": require("../assets/fonts/outfit/Outfit-ExtraBold.ttf"),
    "Outfit-Black": require("../assets/fonts/outfit/Outfit-Black.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      useSupabaseUser().then((user) => !user && router.replace("/(auth)"));

      supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          // SIGNED_IN is fired on session refresh (like alt+tab...)
          // we don't want to fetch the user profile again if is already done
          if (_event === "SIGNED_IN" && userNameFind) return;
          getUserProfile(session.user.id).then((userProfile) => {
            if (!userProfile.username) {
              setSetUserNameFind(true);
              router.replace("/ask-name");
              return;
            }
            router.replace("/(tabs)");
          });
          setSetUserNameFind(true);
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
