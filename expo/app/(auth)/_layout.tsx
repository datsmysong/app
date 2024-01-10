import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

import { Text } from "../../components/Tamed";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={32} {...props} />;
}

function TabBarLabel(props: {
  color: string;
  focused: boolean;
  children: React.ReactNode;
}) {
  return (
    <Text
      style={{
        color: props.color,
        fontWeight: props.focused ? "bold" : "normal",
        fontSize: 20,
      }}
    >
      {props.children}
    </Text>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{ presentation: "modal", title: "Connexion" }}
      />
    </Stack>
  );
}
