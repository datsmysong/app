import Button from "../../components/Button";
import { signInWithProvider } from "../../lib/providerMethods";

export default function ConnectWithGoogle() {
  // TODO : Native Google Sign In
  const handleSignUp = async () => {
    signInWithProvider({ provider: "google" });
  };

  return (
    <Button type="outline" onPress={handleSignUp} block>
      Rejoindre avec Google
    </Button>
  );
}