import "react-native-url-polyfill/auto";

import Button from "../../components/Button";
import { signInWithProvider } from "../../lib/providerMethods";

export default function ConnectWithGoogle() {
  // TODO : Nativ Google Sign In
  const handleSignUp = async () => {
    signInWithProvider({ provider: "google" });
  };

  return (
    <Button type="outline" onPress={handleSignUp} block>
      Rejoindre avec Google
    </Button>
  );
}
