import { Controller, RegisterOptions } from "react-hook-form";
import { StyleSheet, Text, TextInputProps, View } from "react-native";

import CustomPasswordInput from "./CustomPasswordInput";
import CustomTextInput from "./CustomTextInput";

export default function ControlledInput({
  control,
  label,
  name,
  rules,
  placeholder,
  autoComplete,
  secureTextEntry,
  errorMessage,
  onSubmitEditing,
}: {
  control: any;
  label: string;
  name: string;
  rules?: RegisterOptions;
  placeholder: string;
  autoComplete?: TextInputProps["autoComplete"];
  secureTextEntry?: boolean;
  errorMessage?: string | undefined;
  onSubmitEditing?: () => void;
}) {
  return (
    <View style={styles.vbox}>
      <View style={styles.hbox}>
        <Text style={styles.label}>{label}</Text>
        {rules?.required && <Text style={styles.required}>*</Text>}
      </View>
      <Controller
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) =>
          !secureTextEntry ? (
            <CustomTextInput
              placeholder={placeholder}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoComplete={autoComplete}
              secureTextEntry={secureTextEntry}
              onSubmitEditing={onSubmitEditing}
            />
          ) : (
            // We used two components because we can't change secureTextEntry value dynamically
            // and we don't want load many states and logical conditions in CustomTextInput
            <CustomPasswordInput
              InputProps={{
                placeholder,
                onBlur,
                onChangeText: onChange,
                value,
                autoComplete,
                onSubmitEditing,
              }}
            />
          )
        }
        name={name}
      />
      {errorMessage && (
        <Text style={styles.text}>
          {errorMessage ?? "Le champ est invalide"}
        </Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
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
