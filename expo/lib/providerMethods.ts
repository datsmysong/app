import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider } from "@supabase/supabase-js";
import { makeRedirectUri } from "expo-auth-session";
import * as Device from "expo-device";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

import { getApiUrl } from "./apiUrl";
import { base64encode, generateRandomString, sha256 } from "./codeVerifier";
import { supabase } from "./supabase";
import Alert from "../components/Alert";
import { getSpotifyScopes } from "../constants/Api";

WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectUrl = makeRedirectUri();

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
        baseUrl + "/auth/callback?redirect_url=" + redirectUrl
      ),
      scopes,
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
    redirectUrl
  );

  // At end, if all is good, user come back to the app with a refresh_token to fetch new session
  if (webBrowser.type === "success" && webBrowser.url) {
    const tokens = webBrowser.url.split("#tokens=")[1];
    const [refresh_token, access_token] = tokens.split(";");

    const { error } = await supabase.auth.setSession({
      access_token: decodeURIComponent(access_token),
      refresh_token: decodeURIComponent(refresh_token),
    });

    if (!error) {
      WebBrowser.maybeCompleteAuthSession(); // required for web only
      router.replace("/(tabs)");
      return;
    }
    Alert.alert(
      "Une erreur est survenue, l'authentification est impossible pour le moment"
    );
  }
  Alert.alert("Une erreur est survenue avec votre navigateur.");
};

export const bindServiceToAccount = async (serviceName: string) => {
  if (serviceName === "Spotify") {
    bindToSpotify();
  } else if (serviceName === "SoundCloud") {
    signInWithSoundcloud();
  } else {
    Alert.alert("Ce service n'est pas encore disponible");
  }
};

export const signInWithSoundcloud = async () => {
  if (!process.env.EXPO_PUBLIC_SOUNDCLOUD_CLIENT_ID) {
    throw new Error("Missing EXPO_PUBLIC_SOUNDCLOUD_CLIENT_ID env variable");
  }

  const clientId = process.env.EXPO_PUBLIC_SOUNDCLOUD_CLIENT_ID;
  const redirectUri = getApiUrl() || "";

  const baseUrl = "https://soundcloud.com/connect";
  const responseType = "code";

  const url = new URL(baseUrl);
  url.searchParams.append("client_id", clientId);
  url.searchParams.append("redirect_uri", redirectUri);
  url.searchParams.append("response_type", responseType);

  const authUrl = url.toString();

  await WebBrowser.openAuthSessionAsync(authUrl);

  router.replace("/profile");
};

export const bindToSpotify = async () => {
  // verify if dev or prod
  const baseUrl = getApiUrl();

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) throw new Error("No supabaseUrl");

  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);
  const urlEncodedCodeVerifier = encodeURIComponent(codeVerifier);

  if (!process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID) {
    throw new Error("Missing EXPO_PUBLIC_SPOTIFY_CLIENT_ID env variable");
  }

  const clientId = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = baseUrl + "/auth/callback/bind/spotify";

  const scope = getSpotifyScopes();
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  window.localStorage.setItem("code_verifier", codeChallenge);

  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();

  const redirectionUrl =
    baseUrl +
    "/auth/redirection?redirect_url=" +
    authUrl.toString() +
    "#code_verifier=" +
    urlEncodedCodeVerifier;

  if (Platform.OS === "web" && Device.osName !== "Windows") {
    // if (Platform.OS === "web" ) {
    // Second implementation for web browser on mobile:
    // WebBrowser.openAuthSessionAsync doesn't work on mobile web browser (bug, open new tab and not redirect to app at the end of the auth process)
    // So we redirect the user to the backend, and the middleware will support the refresh_token retourned and allowing the session to be refreshed
    window.location.href = redirectionUrl;
    return;
  }

  await WebBrowser.openAuthSessionAsync(redirectionUrl, redirectUrl);

  router.replace("/profile");
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
