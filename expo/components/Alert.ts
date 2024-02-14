import { Alert as ReactNativeAlert, Platform } from "react-native";

function alert(content: string) {
  return Platform.OS === "web"
    ? window.alert(content)
    : ReactNativeAlert.alert(content);
}
export default { alert };
