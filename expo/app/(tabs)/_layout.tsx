import { Redirect, Tabs, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { HouseLine, MusicNote, User, Users } from "phosphor-react-native";
import { useEffect, useState } from "react";

import { HomeTabHeader } from ".";
import ApplicationLoadingScreen from "../../components/ApplicationLoadingScreen";
import FriendHeader from "../../components/headers/FriendHeader";
import { BigSubtitle } from "../../components/typography/Paragraphs";
import Colors from "../../constants/Colors";
import { supabase } from "../../lib/supabase";
import { useSupabaseUserHook } from "../../lib/useSupabaseUser";
import { useUserFullProfile } from "../../lib/userProfile";

WebBrowser.maybeCompleteAuthSession();

function TabBarLabel(props: {
  color: string;
  focused: boolean;
  children: string | string[];
}) {
  return (
    <BigSubtitle
      style={{
        color: props.color,
        fontSize: 20,
        fontFamily: props.focused ? "Outfit-Bold" : "Outfit-Medium",
      }}
    >
      {props.children}
    </BigSubtitle>
  );
}
export default function TabLayout() {
  // This is only required for web
  // This is used to close the authentication popup on web
  WebBrowser.maybeCompleteAuthSession();

  const user = useSupabaseUserHook();
  const router = useRouter();

  const profile = useUserFullProfile();

  const [usernameIsFine, setUsernameIsFine] = useState(true);

  useEffect(() => {
    if (!profile) return;
    setUsernameIsFine(!!profile?.username);
  }, [profile]);

  /**
   * If the user is logged in, we check if the user has a username
   * If the user not have a username, we re-fetch the user profile to check if he not comming from the ask-name page
   */
  useEffect(() => {
    if (!user) return;
    if (usernameIsFine) return;

    supabase
      .from("user_profile")
      .select("username")
      .eq("account_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.username) {
          return setUsernameIsFine(true);
        }
        router.push("/ask-name/");
      });
  }, [usernameIsFine]);

  if (user === undefined) return <ApplicationLoadingScreen />;

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
          header: () => <HomeTabHeader />,
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
