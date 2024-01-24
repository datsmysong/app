import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Keyboard } from "react-native";

import Button from "../../../components/Button";
import CustomTextInput from "../../../components/CustomTextInput";
import { Text, View } from "../../../components/Tamed";
import { supabase } from "../../../lib/supabase";

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [isTextPresent, setIsTextPresent] = useState(false);
  const [noRoomFound, setNoRoomFound] = useState(false);

  useEffect(() => {
    setIsTextPresent(roomCode.length > 0);
  }, [roomCode]);

  const searchRoom = async () => {
    Keyboard.dismiss();

    const { data: room, error: roomError } = await supabase
      .from("active_rooms")
      .select("id")
      .eq("code", roomCode)
      .single();

    if (roomError) {
      setNoRoomFound(true);
      setTimeout(() => {
        setNoRoomFound(false);
      }, 3000);
      return;
    }

    // The user should not be able to go back to the search page if he is already in a room.
    router.replace(`/rooms/${room.id}`);
  };

  return (
    <View style={styles.mainContainer}>
      <CustomTextInput
        placeholder="Code de la salle"
        value={roomCode}
        onChangeText={setRoomCode}
        onSubmitEditing={searchRoom}
      />
      <Button
        type="filled"
        block
        disabled={!isTextPresent}
        appendIcon="arrow-forward"
        onPress={searchRoom}
      >
        Rejoindre
      </Button>
      {noRoomFound && (
        <Text style={styles.message}>
          Aucune salle n'a été trouvée avec ce code.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    padding: 24,
    flexDirection: "column",
    gap: 24,
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
  },
});
