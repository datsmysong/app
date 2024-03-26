import { Redirect, Tabs } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import House from "phosphor-react-native/src/icons/House";
import MusicNote from "phosphor-react-native/src/icons/MusicNote";
import User from "phosphor-react-native/src/icons/User";
import Users from "phosphor-react-native/src/icons/Users";
import { useColorScheme } from "react-native";

import { Text } from "../../components/Tamed";
import { useSupabaseUserHook } from "../../lib/useSupabaseUser";

WebBrowser.maybeCompleteAuthSession();

function TabBarLabel(props: {
  color: string;
  focused: boolean;
  children: React.ReactNode;
}) {
  return (
    <Text
      style={{
        // color: props.color,
        fontWeight: props.focused ? "bold" : "normal",
        fontSize: 20,
        fontFamily: "Outfit-Regular",
      }}
    >
      {props.children}
    </Text>
  );
}
export default function TabLayout() {
  WebBrowser.maybeCompleteAuthSession(); // required for web only"

  const colorScheme = useColorScheme();

  const user = useSupabaseUserHook();

  if (user === undefined) return <Text>Loading..</Text>;

  if (!user) return <Redirect href="/auth/" />;

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarActiveTintColor: "black",
        tabBarStyle: {
          height: 100,
        },
        tabBarItemStyle: {
          flexDirection: "column",
          height: 85,
          display: "flex",
          paddingHorizontal: 4,
          paddingVertical: 10,
          alignItems: "center",
        },
      }}
      backBehavior="initialRoute" //
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarLabel: ({ color, focused, children }) => (
            <TabBarLabel color={color} focused={focused}>
              {children}
            </TabBarLabel>
          ),
          tabBarIcon: ({ color, focused }) => (
            <House size={32} weight={focused ? "fill" : "regular"} />
          ),
        }}
      />
      <Tabs.Screen
        name="rooms"
        options={{
          title: "Salles",
          headerShown: false,
          tabBarLabel: ({ color, focused, children }) => (
            <TabBarLabel color={color} focused={focused}>
              {children}
            </TabBarLabel>
          ),
          tabBarIcon: ({ color, focused }) => (
            <MusicNote size={32} weight={focused ? "fill" : "regular"} />
          ),
        }}
      />
      <Tabs.Screen
        name="Friends"
        options={{
          title: "Amis",
          tabBarLabel: ({ color, focused, children }) => (
            <TabBarLabel color={color} focused={focused}>
              {children}
            </TabBarLabel>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Users size={32} weight={focused ? "fill" : "regular"} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          headerShown: false,
          tabBarLabel: ({ color, focused, children }) => (
            <TabBarLabel color={color} focused={focused}>
              {children}
            </TabBarLabel>
          ),
          tabBarIcon: ({ color, focused }) => (
            <User size={32} weight={focused ? "fill" : "regular"} />
          ),
        }}
      />
    </Tabs>
  );
}
