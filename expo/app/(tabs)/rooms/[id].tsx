import { useLocalSearchParams } from "expo-router";
import { Linking, View } from "react-native";
import Button from "../../../components/Button";
import * as Clipboard from "expo-clipboard";

export default function RoomPage() {
  const { id } = useLocalSearchParams();
  const roomCode = "A1B2C3";

  const onCopyLink = () => {
    Linking.getInitialURL().then(async (url) => {
      if (url) {
        await Clipboard.setStringAsync(url);
      } else {
        console.log("Couldn't get the URL.");
      }
    });
  };

  return (
    <View>
      <Button label="Partager" theme="filled" onPress={onCopyLink}></Button>
    </View>
  );
}
