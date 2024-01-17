import { Controller, RegisterOptions } from "react-hook-form";
import { Text, TextInputProps, View, StyleSheet } from "react-native";
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
}: {
  control: any;
  label: string;
  name: string;
  rules?: RegisterOptions;
  placeholder: string;
  autoComplete?: TextInputProps["autoComplete"];
  secureTextEntry?: boolean;
  errorMessage?: string | undefined;
}) {
  return (
    <View style={styles.form}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomTextInput
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoComplete={autoComplete}
            secureTextEntry={secureTextEntry}
          />
        )}
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
  form: {
    gap: 5,
  },
  text: {
    color: "rgba(0, 0, 0, 0.78)",
    fontFamily: "Outfit",
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
});
