import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";

import { Text, View } from "../Tamed";

const SettingsOptions = ({
  icon,
  title,
  linkhref,
  color = "black",
}: {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  title: string;
  linkhref: string;
  color?: string;
}) => {
  return (
    <View style={[styles.container]}>
      <MaterialIcons name={icon} size={40} color={color} />
      <Text style={[styles.label, { width: "100%", color }]}>{title}</Text>
      <Link href={linkhref as any}>
        <MaterialIcons name="keyboard-arrow-right" size={40} color={color} />
      </Link>
    </View>
  );
};

export default SettingsOptions;

const styles = StyleSheet.create({
  container: {
    gap: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontFamily: "Outfit-Regular",
  },
});
