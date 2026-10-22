import { Stack, useRouter } from "expo-router";
import ArrowSquareOut from "phosphor-react-native/src/icons/ArrowSquareOut";
import LinkBreak from "phosphor-react-native/src/icons/LinkBreak";
import { ScrollView, View } from "react-native";

import Button from "../components/ui/Button";
import { Subtitle } from "../components/ui/typography/Paragraphs";
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
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          padding: 32,
          gap: 64,
          maxWidth: 512,
        }}
      >
        <View style={{ gap: 16, justifyContent: "center" }}>
          <LinkBreak size={64} />
          <H1>Cette page n'existe pas</H1>
          <Subtitle>
            La page que vous essayez d'atteindre n'existe pas ou a été
            supprimée.
          </Subtitle>
        </View>
        <Button onPress={goBack} block appendIcon={<ArrowSquareOut />}>
          {expoRouter.canGoBack() && "Retourner à la page précédente"}
          {!expoRouter.canGoBack() && "Retourner à la page d'accueil"}
        </Button>
      </ScrollView>
    </>
  );
}
