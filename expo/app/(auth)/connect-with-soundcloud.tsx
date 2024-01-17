import * as WebBrowser from "expo-web-browser";
import React from "react";
import { makeRedirectUri } from "expo-auth-session";
import { Pressable, Text } from "react-native";
//import { URL } from "react-native-url-polyfill";

interface params {
  title: string;
  buttonStyle?: object;
  textStyle?: object;
}

const directUri = makeRedirectUri();
export default function ConnectWithSoundcloud({
  title,
  buttonStyle = {},
  textStyle = {},
}: params) {
  const baseUrl = directUri.includes("exp://")
    ? "http://" + directUri.split(":8081")[0].split("//")[1]
    : directUri.split(":8081")[0];
  function getSoundCloudAuthorizationUrl(
    clientId: string,
    redirectUri: string,
  ) {
    const baseUrl = "https://soundcloud.com/connect";
    const responseType = "code";

    const url = new URL(baseUrl);
    url.searchParams.append("client_id", clientId);
    url.searchParams.append("redirect_uri", redirectUri);
    url.searchParams.append("response_type", responseType);

    return url.toString();
  }
  const handleConnect = async () => {
    if (!process.env.EXPO_PUBLIC_SOUNDCLOUD_CLIENT_ID) {
      throw new Error("Missing EXPO_PUBLIC_SOUNDCLOUD_CLIENT_ID env variable");
    }

    const clientId = process.env.EXPO_PUBLIC_SOUNDCLOUD_CLIENT_ID;
    const redirectUri = "http://localhost:3000";
    const authUrl = getSoundCloudAuthorizationUrl(clientId, redirectUri);

    await WebBrowser.openAuthSessionAsync(authUrl);
  };

  return (
    <Pressable onPress={handleConnect} style={buttonStyle}>
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
}
