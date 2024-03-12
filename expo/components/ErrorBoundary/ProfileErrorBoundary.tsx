import Button from "../Button";
import { View, Text } from "../Tamed";

export default function profileErrorBoundary(): JSX.Element {
  return (
    <View>
      <Text>Impossible de charger les données de votre compte</Text>;
      <Button href="/profile">Back to account settings</Button>
    </View>
  );
}
