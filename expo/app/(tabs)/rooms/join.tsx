import { StyleSheet, View, Text } from "react-native";
import CustomTextInput from "../../../components/CustomTextInput";
import { useState } from "react";

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");

  return (
    <View style={styles.mainContainer}>
      <CustomTextInput
        placeholder="Code de la salle"
        value={roomCode}
        onChangeText={setRoomCode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    padding: 24,
    flexDirection: "column",
    gap: 48,
    flex: 1,
    alignSelf: "stretch",
  },
});
