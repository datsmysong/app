import { Pressable, Text } from "react-native";
import { supabase } from "../../lib/supabase";

import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { AlertNatif } from "../../components/Alert";

const directUri = makeRedirectUri();
WebBrowser.maybeCompleteAuthSession(); // required for web only

export default function ConnectWithSpotify() {
  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "spotify",
      options: {
        skipBrowserRedirect: true,
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
    if (error) {
      //TODO handle error
      console.error("error", error);
    }
    //! On iOS, the modal Safari will not share cookies with the system Safari. If you need this, use openAuthSessionAsync
    const res = (await WebBrowser.openAuthSessionAsync(
      data?.url ?? "",
      directUri
    )) as {
      type: "success" | "cancel" | "dismiss";
      url?: string;
    };
    if (res.type === "success" && res.url) {
      const refresh_token = res.url.split("#refresh_token=")[1];
      await supabase.auth.refreshSession({ refresh_token });
      return;
    }
    console.error("WebBrowser a retourner ", res);
    AlertNatif("Une erreur est survenue");
  };

  return (
    <Pressable onPress={handleSignUp}>
      <Text>Rejoindre avec Spotify</Text>
    </Pressable>
  );
}
