import { router } from "expo-router";
import { StyleSheet } from "react-native";

import Button from "./Button";
import { View, Text } from "./Themed";

type ChoicePageProps = {
  message: React.ReactNode;
  buttons: {
    first: {
      label: React.ReactNode;
      onPress?: () => void;
      href?: string;
    };
    second: {
      label: React.ReactNode;
      onPress?: () => void;
      href?: string;
    };
  };
};

const ChoicePage: React.FC<ChoicePageProps> = ({ message, buttons }) => {
  const handleFirstButtonPress = buttons.first.href
    ? () => router.push(buttons.first.href as any)
    : buttons.first.onPress;
  const handleSecondButtonPress = buttons.second.href
    ? () => router.push(buttons.second.href as any)
    : buttons.second.onPress;

  return (
    <View style={styles.choiceContainer}>
      <Text style={styles.title}>{message}</Text>
      <View style={styles.buttonContainer}>
        <Button block type="filled" onPress={handleFirstButtonPress}>
          {buttons.first.label}
        </Button>
        <Button block type="outline" onPress={handleSecondButtonPress}>
          {buttons.second.label}
        </Button>
      </View>
    </View>
  );
};

export default ChoicePage;

const styles = StyleSheet.create({
  choiceContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 24,
    gap: 10,
  },
  buttonContainer: {
    gap: 8,
  },
  title: {
    marginBottom: 20,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
});
