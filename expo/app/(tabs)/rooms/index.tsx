import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import Button from "../../../components/Button";
import UserRoomHistory from "../../../components/UserRoomHistory";

export default function RoomsPage() {
  return (
    <ScrollView contentContainerStyle={styles.headerContainer}>
      <Text style={styles.title}>Salles d'écoute</Text>
      <View style={styles.buttonContainer}>
        <Button block href="/rooms/create">
          Créer une salle
        </Button>
        <Button block type="outline" href="/rooms/join">
          Rejoindre une salle
        </Button>
      </View>
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
  },
  buttonContainer: {
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
