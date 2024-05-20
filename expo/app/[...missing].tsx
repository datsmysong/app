import { Stack, useRouter } from "expo-router";
import ArrowSquareOut from "phosphor-react-native/src/icons/ArrowSquareOut";
import LinkBreak from "phosphor-react-native/src/icons/LinkBreak";
import { View } from "react-native";

import Button from "../components/ui/Button";
import { H1 } from "../components/ui/typography/Titles";

export default function NotFoundScreen() {
  const expoRouter = useRouter();

  const goBack = () => {
    if (expoRouter.canGoBack()) {
      expoRouter.back();
    } else {
      expoRouter.replace("/");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
          gap: 64,
        }}
      >
        <View
          style={{ alignItems: "center", gap: 16, justifyContent: "center" }}
        >
          <LinkBreak size={64} />
          <H1>Cette page n'existe pas</H1>
        </View>
        <Button onPress={goBack} block appendIcon={<ArrowSquareOut />}>
          {expoRouter.canGoBack() && "Retourner à la page précédente"}
          {!expoRouter.canGoBack() && "Retourner à la page d'accueil"}
        </Button>
      </View>
    </>
  );
}
