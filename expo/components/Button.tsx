import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Pressable,
  PressableStateCallbackType,
  StyleSheet,
} from "react-native";
import { Text } from "./Tamed";

type ButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  href?: string;
  disabled?: boolean;
  type?: "filled" | "outline";
  icon?: keyof typeof MaterialIcons.glyphMap;
  prependIcon?: keyof typeof MaterialIcons.glyphMap;
  appendIcon?: keyof typeof MaterialIcons.glyphMap;
  size?: "small" | "normal";
  block?: boolean;
};

const ICON_SIZE_SMALL = 20;
const ICON_SIZE_NORMAL = 30;
const ICON_COLOR_FILLED = "white";
const ICON_COLOR_OUTLINE = "#1A1A1A";

const Button: React.FC<ButtonProps> = ({
  children,
  type = "filled",
  size = "normal",
  disabled = false,
  appendIcon,
  href,
  icon,
  onPress,
  onLongPress,
  prependIcon,
  block,
}) => {
  const isSmall = size === "small";
  const isFilled = type === "filled";
  const iconSize = isSmall ? ICON_SIZE_SMALL : ICON_SIZE_NORMAL;
  const iconColor = isFilled ? ICON_COLOR_FILLED : ICON_COLOR_OUTLINE;

  const buttonStyles = [
    styles.button,
    icon && (isSmall ? styles.iconSmall : styles.iconNormal),
    !icon && (isSmall ? styles.small : styles.normal),
    prependIcon &&
      (isSmall
        ? styles.smallPrependIconPadding
        : styles.normalPrependIconPadding),
    !prependIcon &&
      !icon &&
      (isSmall ? styles.smallPadding : styles.normalPadding),
    appendIcon &&
      (isSmall
        ? styles.smallAppendIconPadding
        : styles.normalAppendIconPadding),
    !appendIcon &&
      !icon &&
      (isSmall ? styles.smallPadding : styles.normalPadding),
    isFilled ? styles.filled : styles.outline,
    disabled && styles.disabled,
    block && styles.block,
  ];

  const pressableStyle = (state: PressableStateCallbackType) => [
    buttonStyles,
    state.hovered && styles.hovered,
    state.pressed && styles.pressed,
  ];

  const handlePress = href ? () => router.push(href as any) : onPress;

  return (
    <Pressable
      style={pressableStyle}
      onPress={handlePress}
      onLongPress={onLongPress}
      disabled={disabled}
      accessibilityLabel={children as string}
    >
      {prependIcon && (
        <MaterialIcons name={prependIcon} size={iconSize} color={iconColor} />
      )}
      {icon && <MaterialIcons name={icon} size={iconSize} color={iconColor} />}
      {!icon && (
        <Text
          style={{
            ...styles.buttonText,
            fontSize: isSmall ? 16 : 24,
            color: iconColor,
            fontFamily: isSmall ? "Outfit-Regular" : "Outfit-Bold",
          }}
        >
          {children}
        </Text>
      )}
      {appendIcon && (
        <MaterialIcons name={appendIcon} size={iconSize} color={iconColor} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  block: {
    alignSelf: "auto",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
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
  hovered: {
    opacity: 0.8,
  },
  pressed: {
    opacity: 0.5,
  },
});

export default Button;
