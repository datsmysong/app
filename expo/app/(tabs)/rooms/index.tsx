import React from "react";
import { ScrollView, StyleSheet } from "react-native";

import UserRoomHistory from "../../../components/UserRoomHistory";

export default function RoomsPage() {
  return (
    <ScrollView contentContainerStyle={styles.headerContainer}>
      <UserRoomHistory />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 21,
    gap: 36,
    maxHeight: 270,
  },
  buttonContainer: {
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontFamily: "Outfit-Bold",
    maxWidth: 354,
  },
});
