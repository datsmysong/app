import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../../components/Button";

export default function RoomsPage() {
  const roomId = "956992d0-f039-47d1-9475-ccacf10104d7";

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Salles d'écoute</Text>
      <View style={styles.buttonContainer}>
        <Button block href={"/rooms/create"}>
          Créer une salle
        </Button>
        <Button block type="outline" href={`/rooms/${roomId}`}>
          Rejoindre une salle
        </Button>
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
