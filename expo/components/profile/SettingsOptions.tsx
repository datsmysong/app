import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";

import { Text, View } from "../Tamed";

const SettingsOptions = ({
  icon,
  title,
  color = "black",
}: {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  title: string;
  color?: string;
}) => {
  return (
    <View style={[styles.container, { width: "100%" }]}>
      <MaterialIcons name={icon} size={40} color={color} />
      <Text style={[styles.label, { width: "100%", color }]}>{title}</Text>
      <MaterialIcons name="keyboard-arrow-right" size={40} color={color} />
    </View>
  );
};

export default SettingsOptions;

const styles = StyleSheet.create({
  container: {
    gap: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontFamily: "Outfit-Regular",
  },
});
