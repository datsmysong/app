import React from "react";
import { TextInput, InputModeOptions } from "react-native";

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
  return (
    <TextInput
      value={value}
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor={"#949494"}
      inputMode={inputMode}
      onChangeText={onChangeText}
      editable={!disabled}
    />
  );
}

const styles = {
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    borderColor: "#949494",
  },
};
