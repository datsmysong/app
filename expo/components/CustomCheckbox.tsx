import CheckBox from "expo-checkbox";
import { StyleSheet } from "react-native";

import { Text, View } from "./Themed";

interface CustomCheckboxProps {
  value: boolean;
  setValue: (value: boolean) => void;
  label: string;
  disabled?: boolean;
}

export default function CustomCheckbox({
  value,
  setValue,
  label,
  disabled = false,
}: CustomCheckboxProps) {
  return (
    <View style={styles.checkboxLayout}>
      <CheckBox
        value={value}
        onValueChange={setValue}
        disabled={disabled}
        color="black"
      />
      <Text style={[styles.checkboxText, disabled ? styles.strikethrough : {}]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxLayout: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
    marginLeft: 10,
    alignItems: "center",
    gap: 10,
    alignSelf: "stretch",
  },

  checkboxText: {
    fontFamily: "Outfit-Regular",
    fontSize: 17,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#1A1A1A",
    backgroundColor: "#FFF",
  },
  strikethrough: {
    textDecorationLine: "line-through",
    textDecorationColor: "#7f7f7f",
  },
});
