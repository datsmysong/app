import { Controller, RegisterOptions } from "react-hook-form";
import { StyleSheet, Text, TextInputProps, View } from "react-native";
import CustomPasswordInput from "../../components/CustomPasswordInput";
import CustomTextInput from "../../components/CustomTextInput";

export default function ControledInput({
  control,
  label,
  name,
  rules,
  placeholder,
  autoComplete,
  secureTextEntry,
  errorMessage,
  onSubmit,
}: {
  control: any;
  label: string;
  name: string;
  rules?: RegisterOptions;
  placeholder: string;
  autoComplete?: TextInputProps["autoComplete"];
  secureTextEntry?: boolean;
  errorMessage?: string | undefined;
  onSubmit?: () => void;
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
              onSubmit={onSubmit}
            />
          ) : (
            <CustomPasswordInput
              placeholder={placeholder}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoComplete={autoComplete}
              secureTextEntry={secureTextEntry}
              onSubmit={onSubmit}
            />
          )
        }
        name={name}
      />
      {errorMessage && (
        <Text style={styles.text}>
          {errorMessage ?? "Le champs est invalide"}
        </Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  vbox: {
    gap: 5,
    height: 100,
  },
  text: {
    color: "rgba(0, 0, 0, 0.78)",
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
