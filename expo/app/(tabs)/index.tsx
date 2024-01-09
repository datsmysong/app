import { Link } from "expo-router";
import { Text } from "react-native";

export default function TabOneScreen() {
  return (
    <>
      <Text>Index</Text>
      <Link replace href={"/onboarding"}>
        On boarding
      </Link>
    </>
  );
}
