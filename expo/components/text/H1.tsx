import { StyleSheet } from "react-native";

import { Text } from "../Themed";

type H1Props = {
  children: string | string[];
};

const H1: React.FC<H1Props> = ({ children }) => {
  return <Text style={styles.h1}>{children}</Text>;
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontFamily: "Unbounded-Bold",
  },
});

export default H1;
