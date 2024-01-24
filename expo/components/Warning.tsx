import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

const Warning = ({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) => {
  return (
    <View style={styles.warning}>
      <MaterialIcons name="warning" size={24} color="red" />
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Text style={styles.warningText}>{label}</Text>
        {children}
      </View>
    </View>
  );
};

export default Warning;

const styles = StyleSheet.create({
  warning: {
    alignSelf: "auto",
    padding: 10,
    gap: 20,
    flexDirection: "row",
    borderColor: "red",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 11,
    alignItems: "center",
  },
  warningText: {
    fontSize: 16,
    // textAlign: "center",
    fontFamily: "Outfit-Bold",
  },
});
