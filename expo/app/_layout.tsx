import FontAwesome from "@expo/vector-icons/FontAwesome";
import { NavigationState } from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  SplashScreen,
  Stack,
  router,
  useRootNavigationState,
} from "expo-router";
import { useEffect } from "react";
import Alert from "../components/Alert";
import { supabase } from "../lib/supabase";
import useSupabaseUser from "../lib/useSupabaseUser";
import { getUserProfile } from "../lib/userProfile";

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
      authVerificationFetchUser({
        currentRoute:
          rootNavigation.routes[rootNavigation.routes.length - 1].name,
      }).then(() => {
        SplashScreen.hideAsync();
      });

      supabase.auth.onAuthStateChange(async (_event, session) => {
        // user session is automatically refresh, but middlewares are called only on page refresh/change
        if (_event === "SIGNED_OUT") {
          router.replace("/auth");
        }
        // Verify if user has a username
        if (_event === "TOKEN_REFRESHED" || _event === "INITIAL_SESSION") {
          if (!session) return;
          const profile = await getUserProfile(session.user.id);
          if (!profile) {
            Alert.alert("Erreur, Une erreur est survenue");
            return;
          }
          if (!profile.username) {
            router.replace("/ask-name");
          }
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
          if (!e.data) return;
          const state = (e.data as { state: NavigationState }).state;
          const currentPage = state.routes[state.routes.length - 1];
          authVerificationFetchUser({ currentRoute: currentPage.name });
        },
      })}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="ask-name" options={{ headerShown: false }} />
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
