import React, { useState } from "react";
import {
  InputModeOptions,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
} from "react-native";

export interface CustomTextInputProps {
  placeholder?: string;
  style?: StyleProp<TextStyle>;
  inputMode?: InputModeOptions;
  value?: string;
  onChangeText?: (text: string) => void;
  disabled?: boolean;
  onBlur?: () => void;
  autoComplete?: TextInputProps["autoComplete"];
  secureTextEntry?: boolean;
  onSubmitEditing?: () => void;
  autofocus?: boolean;
}

export default function CustomTextInput({
  placeholder = "",
  style = {},
  inputMode = "text",
  value,
  onChangeText,
  disabled,
  onBlur,
  autoComplete,
  secureTextEntry,
  onSubmitEditing,
  autofocus,
}: CustomTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      value={value}
      style={[styles.input, style, isFocused && styles.inputFocused]}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        onBlur ? onBlur() : setIsFocused(false);
      }}
      autoFocus={autofocus}
      placeholder={placeholder}
      placeholderTextColor="#949494"
      inputMode={inputMode}
      onChangeText={onChangeText}
      editable={!disabled}
      autoComplete={autoComplete ? autoComplete : "off"}
      secureTextEntry={secureTextEntry}
      onSubmitEditing={onSubmitEditing}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    backgroundColor: "#FFF",
    color: "#1A1A1A",
    fontFamily: "Outfit-Regular",
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
