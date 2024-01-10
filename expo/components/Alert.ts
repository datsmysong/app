import { Alert, Platform } from "react-native";

export const AlertNatif = (content: string) => {
  Platform.OS === "web" ? alert(content) : Alert.alert(content);
};
