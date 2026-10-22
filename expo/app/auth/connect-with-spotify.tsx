import { MusicNote } from "phosphor-react-native";

import Button from "../../components/ui/Button";
import { getSpotifyScopes } from "../../constants/Api";
import { signInWithProvider } from "../../lib/providerMethods";

export default function ConnectWithSpotify() {
  const handleSignUp = async () => {
    signInWithProvider({ provider: "spotify", scopes: getSpotifyScopes() });
  };

  return (
    <Button prependIcon={<MusicNote />} onPress={handleSignUp} block>
      Rejoindre avec Spotify
    </Button>
  );
}
