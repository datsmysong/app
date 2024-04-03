import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import Button from "../../../components/Button";
import UserRoomHistory from "../../../components/UserRoomHistory";
import H1 from "../../../components/text/H1";

export default function RoomsPage() {
  return (
    <ScrollView contentContainerStyle={styles.headerContainer}>
      <H1>Salles d'écoute</H1>
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
});
