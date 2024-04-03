import { StyleSheet } from "react-native";

import { Text } from "../Themed";

type H2Props = {
  children: string | string[];
};

const H2: React.FC<H2Props> = ({ children }) => {
  return <Text style={styles.h2}>{children}</Text>;
};

const styles = StyleSheet.create({
  h2: {
    fontSize: 24,
    fontFamily: "Outfit-Bold",
  },
});

export default H2;
