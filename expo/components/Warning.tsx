import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type Variant = {
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
};

type Variants = {
  success: Variant;
  warning: Variant;
  error: Variant;
};

const variants: Variants = {
  success: {
    icon: "check-circle",
    color: "green",
  },
  warning: {
    icon: "warning",
    color: "red",
  },
  error: {
    icon: "error",
    color: "red",
  },
};

const Warning = ({
  label,
  children,
  variant = "warning",
}: {
  label: string;
  children?: React.ReactNode;
  variant?: keyof typeof variants;
}) => {
  const variantStyles = styles[variant];
  const { icon: variantIcon, color: variantColorIcon } = variants[variant];

  return (
    <View style={[styles.root, variantStyles]}>
      <MaterialIcons name={variantIcon} size={24} color={variantColorIcon} />
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
  error: {
    backgroundColor: "#fff1f0",
    borderColor: "#ffa39e",
    color: "#f5222d",
  },
});
