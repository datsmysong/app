// import * as WebBrowser from "expo-web-browser";
import ClockCounterClockwise from "phosphor-react-native/src/icons/ClockCounterClockwise";
import React from "react";
import { View as NativeView, ScrollView } from "react-native";

import Button from "../../components/Button";
import { View } from "../../components/Themed";
import UserRoomHistory from "../../components/UserRoomHistory";
import H1 from "../../components/text/H1";
import H2 from "../../components/text/H2";
import { useUserProfile } from "../../lib/userProfile";

export default function HomeTab() {
  // This shouldn't be needed, but I'm leaving this here just in case that breaks something
  // WebBrowser.maybeCompleteAuthSession();

  return (
    <ScrollView contentContainerStyle={{ gap: 36, padding: 24 }}>
      <View
        style={{
          gap: 12,
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <View
          style={{
            gap: 12,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <ClockCounterClockwise />
          <H2>Votre dernière salle</H2>
        </View>
        <UserRoomHistory />
      </View>
    </ScrollView>
  );
}

export function HomeTabHeader() {
  const userProfile = useUserProfile();

  return (
    <NativeView
      style={{
        flexDirection: "column",
        backgroundColor: "#E6E6E6",
        flex: 1,
        padding: 24,
        gap: 36,
      }}
    >
      <NativeView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <H1>Salut {userProfile?.username ?? ""} 👋</H1>
      </NativeView>
      <NativeView style={{ flex: 1, gap: 8, paddingVertical: 12 }}>
        <Button block href="/rooms/create">
          Créer une salle
        </Button>
        <Button block type="outline" href="/rooms/join">
          Rejoindre une salle
        </Button>
      </NativeView>
    </NativeView>
  );
}
