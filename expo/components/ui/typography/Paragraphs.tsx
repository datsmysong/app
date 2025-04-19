import { StyleSheet } from "react-native";

import { TypographyComponentProps } from "./Titles";
import Colors from "../../../constants/Colors";
import Font from "../../../constants/Font";
import { Text } from "../../Themed";

/**
 * Subtitle component (Outfit Regular, 16px)
 */
export const Subtitle: React.FC<TypographyComponentProps> = ({
  children,
  style,
}) => {
  return <Text style={[styles.subtitle, style]}>{children}</Text>;
};

/**
 * A medium subtitle component. (Outfit Regular, 18px)
 */
export const MediumSubtitle: React.FC<TypographyComponentProps> = ({
  children,
  style,
}) => {
  return (
    <Text style={[styles.subtitle, styles.mediumSubtitle, style]}>
      {children}
    </Text>
  );
};

/**
 * A big subtitle component. (Outfit Regular, 20px)
 */
export const BigSubtitle: React.FC<TypographyComponentProps> = ({
  children,
  style,
}) => {
  return (
    <Text style={[styles.subtitle, styles.bigSubtitle, style]}>{children}</Text>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontFamily: Font.Outfit.Regular,
    fontSize: 16,
    color: Colors.light.gray,
  },
  mediumSubtitle: {
    fontSize: 18,
  },
  bigSubtitle: {
    fontSize: 20,
  },
});
