import React from "react";
import { ScrollView } from "react-native";

import UserRoomHistory from "../../../components/UserRoomHistory";

export default function TabsProfile() {
  return (
    <ScrollView
      contentContainerStyle={{
        paddingVertical: 32,
        paddingHorizontal: 18,
      }}
    >
      <UserRoomHistory limit={10} />
    </ScrollView>
  );
}
