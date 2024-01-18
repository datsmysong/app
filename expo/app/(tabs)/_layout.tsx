import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Tabs} from "expo-router";
import {useColorScheme} from "react-native";
import {Text} from "../../components/Tamed";

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
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarActiveTintColor: "black",
        tabBarStyle: {
          height: 87,
          gap: 4,
        },
        tabBarItemStyle: {
          height: 87,
          display: "flex",
          paddingHorizontal: 4,
          paddingVertical: 10,
          gap: 10,
          alignItems: "center",
        },
      }}
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
            <TabBarIcon name={focused ? "home" : "sun-o"} color={color} />
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
            <TabBarIcon name={focused ? "music" : "moon-o"} color={color} />
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
            <TabBarIcon name={focused ? "users" : "star-o"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profil",
          tabBarLabel: ({ color, focused, children }) => (
            <TabBarLabel color={color} focused={focused}>
              {children}
            </TabBarLabel>
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "user" : "star-o"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
