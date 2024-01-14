import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "./Tamed";
import { router } from "expo-router";

type ButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  href?: string;
  disabled?: boolean;
  type?: "filled" | "outline";
  icon?: keyof typeof MaterialIcons.glyphMap;
  prependIcon?: keyof typeof MaterialIcons.glyphMap;
  appendIcon?: keyof typeof MaterialIcons.glyphMap;
  size?: "small" | "normal";
};

const Button: React.FC<ButtonProps> = ({
  children,
  type = "filled",
  size = "normal",
  disabled = false,
  appendIcon,
  href,
  icon,
  onPress,
  prependIcon,
}) => {
  const buttonStyles = [
    styles.button,
    icon && (size === "small" ? styles.iconSmall : styles.iconNormal),
    !icon && (size === "small" ? styles.small : styles.normal),
    prependIcon && (size === "small" ? styles.smallPrependIconPadding : styles.normalPrependIconPadding),
    !prependIcon && !icon && (size === "small" ? styles.smallPadding : styles.normalPadding),
    appendIcon && (size === "small" ? styles.smallAppendIconPadding : styles.normalAppendIconPadding),
    !appendIcon && !icon && (size === "small" ? styles.smallPadding : styles.normalPadding),
    type === "filled" ? styles.filled : styles.outline,
    disabled && styles.disabled,
  ];

  if (icon) {
    return (
      <TouchableOpacity
        style={buttonStyles}
        onPress={href ? () => router.push(href as any) : onPress}
        disabled={disabled}
        accessibilityLabel={children as string}
      >
        <MaterialIcons
          name={icon}
          size={size === "small" ? 20 : 32}
          color={type === "filled" ? "white" : "#1A1A1A"}
        />
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        style={buttonStyles}
        onPress={href ? () => router.push(href as any) : onPress}
        disabled={disabled}
      >
        {prependIcon && (
          <MaterialIcons
            name={prependIcon}
            size={size === "small" ? 20 : 32}
            color={type === "filled" ? "white" : "#1A1A1A"}
          />
        )}
        <Text
          style={{
            ...styles.buttonText,
            fontSize: size === "small" ? 16 : 24,
            color: type === "filled" ? "white" : "#1A1A1A",
            fontFamily: size === "small" ? "Outfit-Regular" : "Outfit-Bold",
          }}
        >
          {children}
        </Text>
        {appendIcon && (
          <MaterialIcons
            name={appendIcon}
            size={size === "small" ? 20 : 32}
            color={type === "filled" ? "white" : "#1A1A1A"}
          />
        )}
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderCurve: "continuous",
  },
  iconSmall: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
  },
  iconNormal: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
  },
  small: {
    borderRadius: 8,
  },
  normal: {
    borderRadius: 16,
  },
  smallPadding: {
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  normalPadding: {
    paddingHorizontal: 26,
    paddingVertical: 15,
  },
  smallPrependIconPadding: {
    paddingLeft: 8,
    paddingRight: 14,
    paddingVertical: 5,
  },
  normalPrependIconPadding: {
    paddingLeft: 16,
    paddingRight: 26,
    paddingVertical: 15,
  },
  smallAppendIconPadding: {
    paddingLeft: 14,
    paddingRight: 8,
    paddingVertical: 5,
  },
  normalAppendIconPadding: {
    paddingLeft: 26,
    paddingRight: 16,
    paddingVertical: 15,
  },
  filled: {
    backgroundColor: "#1A1A1A",
  },
  outline: {
    borderWidth: 2,
    borderColor: "#1A1A1A",
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    textAlign: "center",
  },
});

export default Button;
