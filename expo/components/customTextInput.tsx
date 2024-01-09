import React from "react";
import {TextInput, InputModeOptions} from "react-native";

interface CustomTextInputProps {
    placeholder?: string;
    style?: object;
    inputMode?: InputModeOptions;
}

export default function CustomTextInput({placeholder = "", style = {}, inputMode = "text"} : CustomTextInputProps) {

    return (
        <TextInput
          style={[styles.input, style]}
          placeholder={placeholder}
          placeholderTextColor={"#949494"}
          inputMode={inputMode}
        />
    );
}

const styles = {
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "#949494",
    borderBlockWidth: 2,
  },
};