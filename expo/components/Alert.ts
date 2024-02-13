import { Alert as ReactNativeAlert, Platform } from "react-native";

function alert(content: string) {
  if (Platform.OS === "web") {
    return window.alert(content);
  } else {
    return ReactNativeAlert.alert(content);
  }
}
export default { alert };
