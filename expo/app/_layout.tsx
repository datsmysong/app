import * as Sentry from "@sentry/react-native";
import { useFonts } from "expo-font";
import {
  SplashScreen,
  Stack,
  router,
  useNavigationContainerRef,
} from "expo-router";
import { IconContext } from "phosphor-react-native";
import { useEffect } from "react";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";

import ApplicationLoadingScreen from "../components/ApplicationLoadingScreen";
import { View } from "../components/Themed";
import { AccountHeader } from "../components/headers/AccountHeader";
import Colors from "../constants/Colors";
import { supabase } from "../lib/supabase";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: "https://7085409d423f186cbaf15178a350408f@o4507124937064448.ingest.de.sentry.io/4507124939620432",
  debug: process.env.NODE_ENV === "development",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  _experiments: {
    // profilesSampleRate is relative to tracesSampleRate.
    // Here, we'll capture profiles for 100% of transactions.
    profilesSampleRate: 1.0,
  },
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
    }),
  ],
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  // Capture the NavigationContainer ref and register it with the instrumentation.
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

  const [loaded, error] = useFonts({
    "Outfit-Medium": require("../assets/fonts/outfit/Outfit-Medium.ttf"),
    "Outfit-Regular": require("../assets/fonts/outfit/Outfit-Regular.ttf"),
    "Outfit-Bold": require("../assets/fonts/outfit/Outfit-Bold.ttf"),
    "Unbounded-Bold": require("../assets/fonts/unbounded/Unbounded-Bold.ttf"),
    "Unbounded-Regular": require("../assets/fonts/unbounded/Unbounded-Regular.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

      supabase.auth.onAuthStateChange((_event, session) => {
        // user session is automatically refresh, but middlewares are called only on page refresh/change
        if (_event === "SIGNED_OUT") {
          router.replace("/auth");
        }
      });
    }
  }, [loaded]);

  if (!loaded) {
    return <ApplicationLoadingScreen />;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "gray",
      }}
    >
      <View
        style={{
          flex: 1,
          maxWidth: 600,
          borderRadius: 40,
        }}
      >
        <IconContext.Provider
          value={{
            color: Colors.light.text,
            size: 32,
            weight: "regular",
          }}
        >
          <SafeAreaProvider
            style={{ backgroundColor: Colors.light.background }}
          >
            <MenuProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
                <Stack.Screen
                  name="ask-name"
                  options={{ header: () => <AccountHeader /> }}
                />
              </Stack>
            </MenuProvider>
          </SafeAreaProvider>
        </IconContext.Provider>
      </View>
    </View>
  );
}

export default Sentry.wrap(RootLayout);
