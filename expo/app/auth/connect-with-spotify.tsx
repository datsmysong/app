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
