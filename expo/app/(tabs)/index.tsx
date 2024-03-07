import * as WebBrowser from "expo-web-browser";
import { Text } from "react-native";

export default function TabOneScreen() {
  WebBrowser.maybeCompleteAuthSession();
  return (
    <>
      <Text>Index</Text>
    </>
  );
}
