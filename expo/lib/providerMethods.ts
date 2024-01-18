import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "@supabase/supabase-js";
import { makeRedirectUri } from "expo-auth-session";
import * as Device from "expo-device";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import Alert from "../components/Alert";
import { getApiUrl } from "./apiURL";
import { supabase } from "./supabase";

WebBrowser.maybeCompleteAuthSession(); // required for web only
const directUri = makeRedirectUri();

export const signInWithProvider = async ({
  provider,
  scopes,
}: {
  provider: Provider;
  scopes?: string;
}) => {
  // verify if dev or prod
  const baseUrl = getApiUrl();

  // Get from auth manager the url to redirect the user to Spotify
  // and a cookie to verify the user later
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      skipBrowserRedirect: true,
      redirectTo: encodeURI(
        baseUrl + "/auth/callback?redirect_url=" + directUri.split(":3000")[0]
      ),
      scopes: scopes,
    },
  });
  if (error || !data || !data.url) {
    console.error("error", error ? error : "No data url");
    Alert.alert("Une erreur est survenue, impossible de contacter le serveur");
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
  const urlEncodedCodeVerifier = encodeURIComponent(
    codeVerifier.replace(/"/g, "")
  );

  const urlBackendRedirection =
    baseUrl +
    "/auth/redirection?redirect_url=" +
    data.url +
    "#code_verifier=" +
    urlEncodedCodeVerifier;

  if (Platform.OS === "web" && Device.osName !== "Windows") {
    // if (Platform.OS === "web" ) {
    // Second implementation for web browser on mobile:
    // WebBrowser.openAuthSessionAsync doesn't work on mobile web browser (bug, open new tab and not redirect to app at the end of the auth process)
    // So we redirect the user to the backend, and the middleware will support the refresh_token retourned and allowing the session to be refreshed
    window.location.href = urlBackendRedirection;
    return;
  }

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
    if (!error) {
      router.replace("/(tabs)");
      return;
    }
    Alert.alert(
      "Une erreur est survenue, l'authentification est impossible pour le moment"
    );
  }
  Alert.alert("Une erreur est survenue avec votre navigateur.");
};

const getCookie = async (key: string): Promise<string | null> => {
  if (Platform.OS === "web") {
    if (typeof localStorage === "undefined") {
      return null;
    }
    return localStorage.getItem(key);
  }
  return await AsyncStorage.getItem(key);
};
