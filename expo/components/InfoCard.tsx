import { MaterialIcons } from "@expo/vector-icons";
import { ReactElement } from "react";
import { StyleSheet, View, Text, StyleProp, ViewStyle } from "react-native";

type InfoCardProps = {
  title: string;
  description: string;
  content: string;
  icon: ReactElement;
  style?: StyleProp<ViewStyle>;
};

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  content,
  icon,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardTitle}>
        <Text style={styles.cardTitleText}>{title}</Text>
        <View style={styles.cardTitleIcon}>{icon}</View>
      </View>
      <View>
        <Text style={styles.cardContentText}>{content}</Text>
        <Text style={styles.cardDescriptionText}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 240,
    borderRadius: 12,
    borderCurve: "continuous",
    backgroundColor: "#fff",
    padding: 18,
    gap: 8,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  cardTitle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    alignSelf: "stretch",
    flexDirection: "row",
  },
  cardTitleText: {
    fontFamily: "Outfit-Regular",
    fontSize: 16,
    color: "#1A1A1A",
  },
  cardTitleIcon: {
    width: 24,
    height: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContentText: {
    fontFamily: "Outfit-Bold",
    fontSize: 24,
    color: "#1A1A1A",
  },
  cardDescriptionText: {
    fontFamily: "Outfit-Regular",
    fontSize: 12,
    color: "#1A1A1A",
  },
});

export default InfoCard;
