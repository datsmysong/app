import { StyleProp, StyleSheet, TextStyle } from "react-native";

import Font from "../../constants/Font";
import { Text } from "../Themed";

export type TypographyComponentProps = {
  children: string | string[];
  style?: StyleProp<TextStyle>;
};

/**
 * Represents a level 1 heading component. (Unbounded Bold, 32px)
 *
 * @component
 * @param {TypographyComponentProps} props - The component props.
 * @param {React.ReactNode} props.children - The content of the heading.
 * @param {StyleProp<TextStyle>} props.style - The additional styles to apply to the heading.
 * @returns {React.ReactElement} The rendered level 1 heading component.
 */
export const H1: React.FC<TypographyComponentProps> = ({ children, style }) => {
  return <Text style={[styles.h1, style]}>{children}</Text>;
};

/**
 * H2 component for displaying level 2 headings. (Outfit Bold, 24px)
 *
 * @param children - The content to be displayed within the H2 component.
 * @param style - Additional styles to be applied to the H2 component.
 * @returns The rendered H2 component.
 */
export const H2: React.FC<TypographyComponentProps> = ({ children, style }) => {
  return <Text style={[styles.h2, style]}>{children}</Text>;
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
});