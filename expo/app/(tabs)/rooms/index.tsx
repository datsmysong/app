import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../../components/Button";
import { Link } from "expo-router";

export default function TabsRooms() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Salles d'écoutes</Text>

      <Link href="/rooms/A1B2C3">A1B2C3</Link>
      <Button href="/rooms/create">Créer une salle</Button>

      <Button type="filled" href="/rooms/A1B2C3">
        Créer une salle
      </Button>
      <Button type="outline">Rejoindre une salle</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
});
