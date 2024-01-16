import "react-native-url-polyfill/auto";

import Button from "../../components/Button";
import { signInWithProvider } from "../../lib/providerMethods";

export default function ConnectWithGoogle() {
  // TODO : Nativ Google Sign In
  const handleSignUp = async () => {
    signInWithProvider({ provider: "google" });
  };

  return <Button onPress={handleSignUp}>Rejoindre avec Google</Button>;
}
