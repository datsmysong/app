import * as WebBrowser from "expo-web-browser";
import React from "react";
import { router } from "expo-router";
import Button from "../../components/Button";
import { getApiUrl } from "../../lib/apiUrl";

interface params {
  title: string;
  onPress?: void | (() => void) | undefined;
  isBound?: boolean;
}
export default function ConnectWithSoundcloud({
  title,
  onPress = () => {},
  isBound = false,
}: params) {
  function getSoundCloudAuthorizationUrl(
    clientId: string,
    redirectUri: string
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

    const baseUrl = getApiUrl();

    const clientId = process.env.EXPO_PUBLIC_SOUNDCLOUD_CLIENT_ID;
    const redirectUri = getApiUrl() || "";
    const authUrl = getSoundCloudAuthorizationUrl(clientId, redirectUri);

    await WebBrowser.openAuthSessionAsync(authUrl);

    router.push("/profile");
  };

  // TODO: Adapt with integration page
  return (
    <Button
      prependIcon="music-note"
      onPress={isBound ? onPress : handleConnect}
      type={isBound ? "outline" : "filled"}
      block
    >
      {title}
    </Button>
  );
}
