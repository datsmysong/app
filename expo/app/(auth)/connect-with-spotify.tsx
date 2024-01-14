import "react-native-url-polyfill/auto";

import { Platform, Pressable, Text } from "react-native";
import { supabase } from "../../lib/supabase";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import Alert from "../../components/Alert";
import { getSpotifyScopes } from "../../constants/Api";

const directUri = makeRedirectUri();
WebBrowser.maybeCompleteAuthSession(); // required for web only

export default function ConnectWithSpotify() {
  const handleSignUp = async () => {
    const baseUrl = directUri.includes("exp://")
      ? "http://" + directUri.split(":8081")[0].split("//")[1]
      : directUri.split(":8081")[0];

    // Get from auth manager the url to redirect the user to Spotify
    // and a cookie to verify the user later
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "spotify",
      options: {
        skipBrowserRedirect: true,
        redirectTo: encodeURI(
          baseUrl +
            ":3000/auth/callback?redirect_url=" +
            directUri.split(":3000")[0]
        ),
        scopes: getSpotifyScopes(),
      },
    });
    if (error || !data || !data.url) {
      console.error("error", error ? error : "No data url");
      Alert.alert(
        "Une erreur est survenue, impossible de contacter le serveur"
      );
    }

    // Backend need verify the user, so we use it to add the cookie on the WebBrowser
    // with the route /auth/redirection, who will redirect to the Spotify auth page with the code verifier
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) throw new Error("No supabaseUrl");
    const supabaseProjectId = supabaseUrl.split(".")[0].split("//")[1];

    const codeVerifier: string | null = await getCookie(
      "sb-" + supabaseProjectId + "-auth-token-code-verifier"
    );
    if (!codeVerifier) throw new Error("No codeVerifier");
    const satanizedCodeVerifier = encodeURIComponent(
      codeVerifier.replace(/"/g, "")
    );

    const urlBackendRedirection =
      baseUrl +
      ":3000/auth/redirection?redirect_url=" +
      data.url +
      "#code_verifier=" +
      satanizedCodeVerifier;

    const webBrowser = await WebBrowser.openAuthSessionAsync(
      urlBackendRedirection,
      directUri
    );
    // At end, if all is good, user come back to the app with a refresh_token to fetch new session
    if (webBrowser.type === "success" && webBrowser.url) {
      const refreshToken = decodeURIComponent(
        webBrowser.url.split("#refresh_token=")[1]
      );
      const { error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });
      if (!error) return;
      console.error("error", error);
      Alert.alert(
        "Une erreur est survenue, l'authentification est impossible pour le moment"
      );
    }
    console.error("WebBrowser n'a pas retourné le bon type", webBrowser.type);
    Alert.alert("Une erreur est survenue avec votre navigateur.");
  };

  return (
    <Pressable onPress={handleSignUp}>
      <Text>Rejoindre avec Spotify</Text>
    </Pressable>
  );
}

const getCookie = async (key: string): Promise<string | null> => {
  if (Platform.OS === "web") {
    if (typeof localStorage === "undefined") {
      return null;
    }
    return localStorage.getItem(key);
  }
  return await AsyncStorage.getItem(key);
};
