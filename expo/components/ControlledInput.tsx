import { Controller, RegisterOptions } from "react-hook-form";
import { StyleSheet, Text, TextInputProps, View } from "react-native";

import CustomPasswordInput from "./CustomPasswordInput";
import CustomTextInput, { CustomTextInputProps } from "./CustomTextInput";
import { Subtitle } from "./typography/Paragraphs";

interface ControlledInputProps extends CustomTextInputProps {
  control: any;
  label: string;
  name: string;
  rules?: RegisterOptions;
  placeholder: string;
  autoComplete?: TextInputProps["autoComplete"];
  secureTextEntry?: boolean;
  errorMessage?: string | undefined;
  onSubmitEditing?: () => void;
  info?: string;
}

export default function ControlledInput({
  control,
  label,
  name,
  rules,
  secureTextEntry,
  errorMessage,
  info,
  ...props
}: ControlledInputProps) {
  return (
    <View style={formStyles.vbox}>
      <View style={formStyles.hbox}>
        <Text style={formStyles.label}>{label}</Text>
        {rules?.required && <Text style={formStyles.required}>*</Text>}
      </View>
      <Controller
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) =>
          !secureTextEntry ? (
            <CustomTextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={secureTextEntry}
              {...props}
            />
          ) : (
            // We used two components because we can't change secureTextEntry value dynamically
            // and we don't want load many states and logical conditions in CustomTextInput
            <CustomPasswordInput
              {...props}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={secureTextEntry}
            />
          )
        }
        name={name}
      />
      {info && <Subtitle>{info}</Subtitle>}
      {errorMessage && (
        <Text style={formStyles.text}>
          {errorMessage ?? "Le champ est invalide"}
        </Text>
      )}
    </View>
  );
}
export const formStyles = StyleSheet.create({
  vbox: {
    gap: 5,
    minHeight: 100,
  },
  text: {
    color: "red",
    fontFamily: "Outfit-Medium",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "500",
    alignSelf: "stretch",
  },
  label: {
    color: "#1A1A1A",
    fontFamily: "Outfit-Bold",
    fontSize: 20,
    fontStyle: "normal",
    lineHeight: 24,
    paddingBottom: 5,
  },
  textAlignCenter: {
    textAlign: "center",
  },
  required: {
    color: "red",
    fontFamily: "Outfit-Bold",
    fontSize: 20,
    fontStyle: "normal",
    lineHeight: 24,
    paddingBottom: 5,
  },
  hbox: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
});
