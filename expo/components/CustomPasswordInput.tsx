import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  InputModeOptions,
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { useTogglePasswordVisibility } from "../lib/useTogglePasswordVisibility";

interface CustomTextInputProps {
  placeholder?: string;
  style?: object;
  inputMode?: InputModeOptions;
  value?: string;
  onChangeText?: (text: string) => void;
  disabled?: boolean;
  onBlur?: () => void;
  autoComplete?: TextInputProps["autoComplete"];
  secureTextEntry?: boolean;
}

export default function CustomPasswordInput({
  placeholder = "",
  style = {},
  inputMode = "text",
  value,
  onChangeText,
  disabled,
  onBlur,
  autoComplete,
  secureTextEntry,
}: CustomTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  return (
    <View style={styles.inputContainer}>
      <TextInput
        value={value}
        style={[styles.input, style, isFocused && styles.inputFocused]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          onBlur ? onBlur() : setIsFocused(false);
        }}
        placeholder={placeholder}
        placeholderTextColor={"#949494"}
        inputMode={inputMode}
        onChangeText={onChangeText}
        editable={!disabled}
        autoComplete={autoComplete ? autoComplete : "off"}
        secureTextEntry={passwordVisibility}
      />
      <Pressable style={styles.icon} onPress={handlePasswordVisibility}>
        <MaterialCommunityIcons name={rightIcon} size={22} color="#232323" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {},
  icon: {
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  input: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    backgroundColor: "#FFF",
    color: "#1A1A1A",
    fontFamily: "Outfit-regular",
    fontSize: 18,
    borderColor: "#DFDFDF",
    borderStyle: "solid",
    borderWidth: 3,
    borderRadius: 11,
  },
  inputFocused: {
    borderStyle: "solid",
  },
});
