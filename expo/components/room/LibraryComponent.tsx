import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

const LibraryComponent = ({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}) => {
  return (
    <View style={styles.component}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <MaterialIcons
          name={icon}
          color="white"
          style={{
            fontSize: 24,
          }}
        />
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
