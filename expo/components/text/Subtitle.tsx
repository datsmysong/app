import { StyleSheet } from "react-native";

import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import { Text } from "../Themed";

type SubtitleProps = {
  children: string | string[];
};

const Subtitle: React.FC<SubtitleProps> = ({ children }) => {
  return <Text style={styles.Subtitle}>{children}</Text>;
};

const styles = StyleSheet.create({
  Subtitle: {
    fontFamily: Font.Outfit.Regular,
    fontSize: 16,
    color: Colors.light.gray,
  },
});

export default Subtitle;
