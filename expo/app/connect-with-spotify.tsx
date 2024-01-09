import { Button, Text } from "react-native";
import { supabase } from "../lib/supabase";

import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { router } from "expo-router";

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
      console.log(error);
      return;
    }
    console.log("It work ? ", data);
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
      await supabase.auth.refreshSession({ refresh_token }).then((res) => {
        if (res.data.session) router.push("/");
      });
    }
  };

  return <Button title="Rejoindre avec Spotify" onPress={handleSignUp} />;
}
