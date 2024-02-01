import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

const Warning = ({
  label,
  children,
  variant = "warning",
}: {
  label: string;
  children?: React.ReactNode;
  variant?: "success" | "warning";
}) => {
  const variantStyles = variant === "success" ? styles.success : styles.warning;

  return (
    <View style={[styles.root, variantStyles]}>
      {variant === "success" ? (
        <MaterialIcons name="check-circle" size={24} color="green" />
      ) : (
        <MaterialIcons name="warning" size={24} color="red" />
      )}
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Text style={styles.warningText}>{label}</Text>
        {children ?? children}
      </View>
    </View>
  );
};

export default Warning;

const styles = StyleSheet.create({
  root: {
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
  success: {
    backgroundColor: "#e6ffed",
    borderColor: "#b7eb8f",
    color: "#52c41a",
  },
  warning: {
    backgroundColor: "#fffbe6",
    borderColor: "#ffe58f",
    color: "#faad14",
  },
});
