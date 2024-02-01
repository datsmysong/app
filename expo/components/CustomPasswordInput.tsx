import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import CustomTextInput, { CustomTextInputProps } from "./CustomTextInput";
import { useTogglePasswordVisibility } from "../lib/useTogglePasswordVisibility";

interface CustomPasswordInputProps extends CustomTextInputProps {}

export default function CustomPasswordInput({
  ...props
}: CustomPasswordInputProps) {
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  return (
    <View>
      <CustomTextInput {...props} secureTextEntry={passwordVisibility} />
      <Pressable style={styles.icon} onPress={handlePasswordVisibility}>
        <MaterialCommunityIcons name={rightIcon} size={22} color="#232323" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});
