import { Eye, EyeSlash } from "phosphor-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import CustomTextInput, { CustomTextInputProps } from "./CustomTextInput";
import { useTogglePasswordVisibility } from "../lib/useTogglePasswordVisibility";

interface CustomPasswordInputProps extends CustomTextInputProps {}

export default function CustomPasswordInput({
  ...props
}: CustomPasswordInputProps) {
  const { passwordVisibility, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  return (
    <View>
      <CustomTextInput {...props} secureTextEntry={passwordVisibility} />
      <Pressable style={styles.icon} onPress={handlePasswordVisibility}>
        {passwordVisibility ? <Eye /> : <EyeSlash />}
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
