import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import { Text, View } from "../Tamed";

type CommonProps = {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  title: string;
  color?: string;
};

type LinkProps = CommonProps & { href: string; onPress?: never };
type PressableProps = CommonProps & { onPress: () => void; href?: never };

type SettingsOptionsProps = LinkProps | PressableProps;

const SettingsOptions = ({
  icon,
  title,
  color = "black",
  href,
  onPress,
}: SettingsOptionsProps) => {
  const content = (
    <View style={[styles.container, { width: "100%" }]}>
      <MaterialIcons name={icon} size={40} color={color} />
      <Text style={[styles.label, { width: "100%", color }]}>{title}</Text>
      <MaterialIcons name="keyboard-arrow-right" size={40} color={color} />
    </View>
  );

  if (href) return <Link href={href as any}>{content}</Link>;
  return <Pressable onPress={onPress}>{content}</Pressable>;
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
