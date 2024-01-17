import "react-native-url-polyfill/auto";

import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import Button from "../../components/Button";
import { getSpotifyScopes } from "../../constants/Api";
import { signInWithProvider } from "../../lib/providerMethods";


export default function ConnectWithSpotify() {
  const handleSignUp = async () => {
    signInWithProvider({ provider: "spotify", scopes: getSpotifyScopes() });
  };

  return (
    <Button prependIcon="music-note" onPress={handleSignUp} block>
      Rejoindre avec Spotify
    </Button>
  );
}
