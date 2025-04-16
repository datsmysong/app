import { Alert as ReactNativeAlert, Platform } from "react-native";

function confirm(title: string, message: string, onPress: () => void) {
  if (Platform.OS === "web") {
    if (window.confirm(message)) {
      return onPress();
    }
  } else {
    return ReactNativeAlert.alert(title, message, [
      { text: "Oui", onPress, style: "default" },
      { text: "Non", style: "cancel" },
    ]);
  }
}
export default { confirm };
