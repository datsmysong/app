import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { Text } from "./Tamed";
import Colors from "../constants/Colors";

const BUTTON_COLORS = ["primary", "success", "danger"] as const;

type ButtonColor = (typeof BUTTON_COLORS)[number];

const COLOR_PALETTE: Record<ButtonColor, string> = {
  primary: Colors.light.text,
  success: Colors.light.success,
  danger: Colors.light.danger,
};

export type ButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  loading?: boolean;
  href?: string;
  disabled?: boolean;
  type?: "filled" | "outline";
  icon?: React.ReactElement;
  prependIcon?: React.ReactElement;
  appendIcon?: React.ReactElement;
  size?: "small" | "normal";
  color?: ButtonColor;
  block?: boolean;
  style?: StyleProp<ViewStyle>;
};

const ICON_SIZE_SMALL = 20;
const ICON_SIZE_NORMAL = 30;
const ICON_COLOR_FILLED: string = "white";

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
  color = "primary",
  style,
  loading = false,
}) => {
  const isSmall = size === "small";
  const isFilled = type === "filled";
  const iconSize = isSmall ? ICON_SIZE_SMALL : ICON_SIZE_NORMAL;
  const buttonColor = COLOR_PALETTE[color];

  const iconColor = isFilled ? ICON_COLOR_FILLED : buttonColor;

  // Styled icons
  prependIcon =
    prependIcon &&
    React.cloneElement(prependIcon, { size: iconSize, color: iconColor });
  icon = icon && React.cloneElement(icon, { size: iconSize, color: iconColor });
  appendIcon =
    appendIcon &&
    React.cloneElement(appendIcon, { size: iconSize, color: iconColor });

  const buttonStyles = [
    styles.button,
    style,
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
    isFilled
      ? { backgroundColor: buttonColor }
      : { ...styles.outline, borderColor: buttonColor },
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
      disabled={disabled || loading}
      accessibilityLabel={children as string}
    >
      {loading && (
        <View
          style={{
            width: iconSize,
            height: iconSize,
            justifyContent: "center",
            position: "absolute",
          }}
        >
          <ActivityIndicator
            size="small"
            color={isFilled ? "white" : buttonColor}
          />
        </View>
      )}
      <View
        style={{
          ...styles.button,
          opacity: loading ? 0 : 1,
          maxWidth: "100%",
        }}
      >
        {prependIcon}
        {icon}
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
        {appendIcon}
      </View>
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
  outline: {
    borderWidth: 2,
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
