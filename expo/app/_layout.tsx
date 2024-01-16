import FontAwesome from "@expo/vector-icons/FontAwesome";
import { User } from "@supabase/supabase-js";
import { useFonts } from "expo-font";
import {
  SplashScreen,
  Stack,
  router,
  useNavigation,
  useRootNavigationState,
} from "expo-router";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import useSupabaseUser from "../lib/useSupabaseUser";
import { NavigationState } from "@react-navigation/native";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const requiredAuthPaths = ["(tabs)"];
const authRoutes = ["auth"];

export default function RootLayout() {
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

  const rootNavigation = useRootNavigationState();

  useEffect(() => {
    if (loaded) {
      useSupabaseUser().then(async (user) => {
        await authVerificationFetchUser({
          currentRoute:
            rootNavigation.routes[rootNavigation.routes.length - 1].name,
        });
        SplashScreen.hideAsync();
      });
      supabase.auth.onAuthStateChange((_event, session) => {
        // user session is automatically refresh, but middlewares are called only on page refresh/change
        if (_event === "SIGNED_OUT") {
          router.replace("/auth");
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
    <Stack
      screenListeners={({ navigation }) => ({
        state: (e) => {
          // Do something with the state
          console.log("state", e.data);
          if (!e.data) return;
          const state = (e.data as { state: NavigationState }).state;

          const currentPage = state.routes[state.routes.length - 1];
          console.log("currentPage", currentPage.name);
          authVerificationFetchUser({ currentRoute: currentPage.name });

          // Do something with the `navigation` object
        },
      })}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}

const authVerificationFetchUser = async ({
  currentRoute,
}: {
  currentRoute: string;
}) => {
  const user = await useSupabaseUser();
  if (requiredAuthPaths.includes(currentRoute) && !user) {
    router.replace("/auth");
  }
  if (authRoutes.includes(currentRoute) && user) {
    router.replace("/(tabs)");
  }
};
