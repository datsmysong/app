import { StyleProp, StyleSheet, TextStyle } from "react-native";

import Font from "../../../constants/Font";
import { Text } from "../../Themed";

export type TypographyComponentProps = {
  children: string | string[];
  style?: StyleProp<TextStyle>;
};

/**
 * H1 component for displaying level 1 headings. (Unbounded Bold, 32px)
 */
export const H1: React.FC<TypographyComponentProps> = ({ children, style }) => {
  return <Text style={[styles.h1, style]}>{children}</Text>;
};

/**
 * H2 component for displaying level 2 headings. (Outfit Bold, 24px)
 */
export const H2: React.FC<TypographyComponentProps> = ({ children, style }) => {
  return <Text style={[styles.h2, style]}>{children}</Text>;
};

/**
 * H3 component for displaying level 3 headings. (Outfit Bold, 20px)
 */
export const H3: React.FC<TypographyComponentProps> = ({ children, style }) => {
  return <Text style={[styles.h3, style]}>{children}</Text>;
};

/**
 * H4 component for displaying level 4 headings. (Outfit Bold, 18px)
 */
export const H4: React.FC<TypographyComponentProps> = ({ children, style }) => {
  return <Text style={[styles.h4, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontFamily: Font.Unbounded.Bold,
  },
  h2: {
    fontSize: 24,
    fontFamily: Font.Outfit.Bold,
  },
  h3: {
    fontSize: 20,
    fontFamily: Font.Outfit.Bold,
  },
  h4: {
    fontSize: 18,
    fontFamily: Font.Outfit.Bold,
  },
});
