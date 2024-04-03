import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const LibraryComponent = ({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactElement;
  onPress: () => void;
}) => {
  icon = React.cloneElement(icon, { size: 24, color: "white" });
  return (
    <Pressable style={styles.component} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon}
      </View>
      <Text style={styles.text}>{subtitle}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: "Outfit-Bold",
    fontSize: 20,
    color: "white",
  },
  text: {
    color: "white",
    fontFamily: "Outfit-Regular",
    fontSize: 14,
  },
  component: {
    flexDirection: "column",
    backgroundColor: "black",
    borderRadius: 14,
    padding: 24,
    rowGap: 8,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default LibraryComponent;
