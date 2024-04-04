import { Redirect, Tabs } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import HouseLine from "phosphor-react-native/src/icons/HouseLine";
import MusicNote from "phosphor-react-native/src/icons/MusicNote";
import User from "phosphor-react-native/src/icons/User";
import Users from "phosphor-react-native/src/icons/Users";
import { ActivityIndicator } from "react-native";

import { Text } from "../../components/Tamed";
import { View } from "../../components/Themed";
import FriendHeader from "../../components/headers/FriendHeader";
import Colors from "../../constants/Colors";
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
        color: props.color,
        fontSize: 20,
        fontFamily: props.focused ? "Outfit-Bold" : "Outfit-Medium",
      }}
    >
      {props.children}
    </Text>
  );
}
export default function TabLayout() {
  // This is only required for web
  // This is used to close the authentication popup on web
  WebBrowser.maybeCompleteAuthSession();

  const user = useSupabaseUserHook();

  if (user === undefined)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        <ActivityIndicator size={64} color={Colors.light.text} />
        <Text style={{ textAlign: "center" }}>
          Chargement de l'application en cours...
        </Text>
      </View>
    );

  if (!user) return <Redirect href="/auth/" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tabIconSelected,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarStyle: {
          height: 87,
          overflow: "hidden",
        },
        tabBarLabelPosition: "below-icon",
        tabBarIconStyle: {
          minHeight: 32,
          minWidth: 32,
        },
        tabBarItemStyle: {
          flexDirection: "column",
          height: 87,
          display: "flex",
          paddingHorizontal: 4,
          paddingTop: 10,
          gap: 10,
          justifyContent: "center",
          alignItems: "center",
        },
      }}
      backBehavior="initialRoute"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarLabel: (props) => <TabBarLabel {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <HouseLine
              color={color}
              size={32}
              weight={focused ? "fill" : "regular"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rooms"
        options={{
          title: "Salles",
          headerShown: false,
          tabBarLabel: (props) => <TabBarLabel {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <MusicNote
              color={color}
              size={32}
              weight={focused ? "fill" : "regular"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Amis",
          tabBarLabel: (props) => <TabBarLabel {...props} />,
          header: () => <FriendHeader />,
          tabBarIcon: ({ color, focused }) => (
            <Users
              color={color}
              size={32}
              weight={focused ? "fill" : "regular"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          headerShown: false,
          tabBarLabel: (props) => <TabBarLabel {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <User
              color={color}
              size={32}
              weight={focused ? "fill" : "regular"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
