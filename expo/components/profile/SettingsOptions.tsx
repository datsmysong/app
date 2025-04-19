import { Link } from "expo-router";
import { CaretRight } from "phosphor-react-native";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

import { Text, View } from "../Themed";

type CommonProps = {
  icon: React.ReactElement;
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
  icon = React.cloneElement(icon, { size: 30, color });
  const content = (
    <View style={styles.container}>
      {icon}
      <Text style={[styles.label, { color }]}>{title}</Text>
      <CaretRight size={30} color={color} />
    </View>
  );

  if (href)
    // using asChild because in android, <Link> are not styled
    return (
      <Link href={href as any} asChild>
        <Pressable>{content}</Pressable>
      </Link>
    );
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
    flex: 1,
    justifyContent: "space-between",
  },
  label: {
    fontFamily: "Outfit-Regular",
    fontSize: 18,
    flex: 1,
  },
});
