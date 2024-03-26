import React from "react";
import { StyleSheet, Text, View } from "react-native";

const LibraryComponent = ({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactElement;
}) => {
  icon = React.cloneElement(icon, { size: 24, color: "white" });
  return (
    <View style={styles.component}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon}
      </View>
      <Text style={styles.text}>{subtitle}</Text>
    </View>
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
