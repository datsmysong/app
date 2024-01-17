import Button from "../../components/Button";
import { getSpotifyScopes } from "../../constants/Api";
import { signInWithProvider } from "../../lib/providerMethods";

interface params {
    title: string;
}

export default function ConnectWithSpotify({title} : params) {
    const handleSignUp = async () => {
        signInWithProvider({ provider: "spotify", scopes: getSpotifyScopes() });
    };

    return (
        <Button prependIcon="music-note" onPress={handleSignUp} block>
            Rejoindre avec Spotify
        </Button>
    );
}