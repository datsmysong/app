import { StyleSheet, View as RNView } from "react-native";

import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import { Text } from "../Themed";

type ChipProps = {
  children: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
};

const Chip: React.FC<ChipProps> = ({
  children,
  backgroundColor,
  textColor,
}) => {
  return (
    <RNView
      style={[
        styles.chip,
        {
          backgroundColor,
        },
      ]}
    >
      <Text style={[styles.chipText, { color: textColor }]}>{children}</Text>
    </RNView>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: Colors.light.black,
    color: Colors.light.lightGray,
  },
  chipText: {
    fontSize: 16,
    fontFamily: Font.Outfit.Medium,
    color: Colors.light.lightGray,
    userSelect: "none",
  },
});

export default Chip;
