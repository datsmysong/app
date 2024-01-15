import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../../components/Button";
import { Link } from "expo-router";

export default function RoomsPage() {
  const roomCode = "A1B2C3";

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Salles d'écoute</Text>
        <View style={styles.buttonContainer}>
          <Button block href={"/rooms/create"}>
            Créer une salle
          </Button>
          <Button block type="outline" href={`/rooms/${roomCode}`}>
            Rejoindre une salle
          </Button>
        </View>
      </View>
    </View>
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
