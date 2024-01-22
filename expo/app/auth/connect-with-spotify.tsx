import Button from "../../components/Button";
import { getSpotifyScopes } from "../../constants/Api";
import { signInWithProvider } from "../../lib/providerMethods";

interface params {
  title: string;
  onPress?: void | (() => void) | undefined;
  isBound?: boolean;
}

export default function ConnectWithSpotify({
  title,
  isBound = false,
  onPress = () => {},
}: params) {
  const handleSignUp = async () => {
    signInWithProvider({ provider: "spotify", scopes: getSpotifyScopes() });
  };

  //TODO: Adapt with integration page
  return (
    <Button
      prependIcon="music-note"
      onPress={isBound ? onPress : handleSignUp}
      type={isBound ? "outline" : "filled"}
      block
    >
      {title}
    </Button>
  );
}
