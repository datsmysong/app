import React, { useState } from "react";
import { TextInput, InputModeOptions, StyleSheet } from "react-native";

interface CustomTextInputProps {
  placeholder?: string;
  style?: object;
  inputMode?: InputModeOptions;
  value?: string;
  onChangeText?: (text: string) => void;
  disabled?: boolean;
}

export default function CustomTextInput({
  placeholder = "",
  style = {},
  inputMode = "text",
  value,
  onChangeText,
  disabled,
}: CustomTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      value={value}
      style={[styles.input, style, isFocused && styles.inputFocused]}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={placeholder}
      placeholderTextColor={"#949494"}
      inputMode={inputMode}
      onChangeText={onChangeText}
      editable={!disabled}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 11,
    backgroundColor: "#CCCCCC",
    color: "#1A1A1A",
  },
  inputFocused: {
    borderStyle: "solid",
  }
});
