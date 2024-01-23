import { MaterialIcons } from "@expo/vector-icons";
import { Text, View, StyleSheet } from "react-native";

const Warning = ({ label }: { label: string }) => {
  return (
    <View style={styles.warning}>
      <MaterialIcons name="warning" size={24} color="red" />
      <Text style={styles.warningText}>{label}</Text>
    </View>
  );
};

export default Warning;

const styles = StyleSheet.create({
  warning: {
    alignSelf: "auto",
    padding: 10,
    gap: 10,
    flexDirection: "row",
    borderColor: "red",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 11,
  },
  warningText: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Outfit-Bold",
  },
});
