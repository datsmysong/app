import { Link } from "expo-router";

import React from "react";
import { Text, View } from "react-native";

export default function TabsRooms() {
  return (
    <View>
      <Text>Room</Text>
      <Link href="/modal">Modal</Link>
      <Link href="/AddMusic" asChild>
        Add Music
      </Link>
      <Link href="/rooms/create">Create Room</Link>
    </View>
  );
}
