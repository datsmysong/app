import CheckCircle from "phosphor-react-native/src/icons/CheckCircle";
import WarningIcon from "phosphor-react-native/src/icons/Warning";
import WarningCircle from "phosphor-react-native/src/icons/WarningCircle";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Variant = {
  icon: React.ReactElement;
};

type Variants = {
  success: Variant;
  warning: Variant;
  error: Variant;
};

export type WarningProps = {
  label: string;
  children?: React.ReactNode;
  variant?: keyof typeof variants;
};

const variants: Variants = {
  success: {
    icon: <CheckCircle color="green" />,
  },
  warning: {
    icon: <WarningIcon color="red" />,
  },
  error: {
    icon: <WarningCircle color="red" />,
  },
};

const Warning = ({ label, children, variant = "warning" }: WarningProps) => {
  const variantStyles = styles[variant];
  const { icon: variantIcon } = variants[variant];
  const iconStyled = React.cloneElement(variantIcon, { size: 24 });

  return (
    <View style={[styles.root, variantStyles]}>
      {iconStyled}
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
