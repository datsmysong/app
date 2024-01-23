import { StyleSheet, View, Text } from "react-native";
import CustomTextInput from "../../../components/CustomTextInput";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Button from "../../../components/Button";
import { router } from "expo-router";

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [isTextPresent, setIsTextPresent] = useState(false);
  const [noRoomFound, setNoRoomFound] = useState(false);

  useEffect(() => {
    setIsTextPresent(roomCode.length > 0);
  }, [roomCode]);

  const onSubmitSearchRoom = async (roomCode: string) => {
    if (!roomCode) {
      return;
    }

    const { data: room, error: roomError } = await supabase
      .from("active_rooms")
      .select("id")
      .eq("code", roomCode)
      .single();

    if (roomError) {
      setNoRoomFound(true);
      return;
    }

    router.push(`/rooms/${room.id}`);
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <CustomTextInput
          placeholder="Code de la salle"
          value={roomCode}
          onChangeText={setRoomCode}
          onSubmitEditing={() => onSubmitSearchRoom(roomCode)}
        />
        <Button
          type="filled"
          block
          disabled={!isTextPresent}
          prependIcon="search"
          onPress={() => onSubmitSearchRoom(roomCode)}
        >
          Rechercher
        </Button>
      </View>
      {noRoomFound && (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            Aucune salle n'a été trouvée avec ce code.
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    paddingHorizontal: 24,
    paddingTop: 24,
    flexDirection: "column",
    gap: 24,
    alignSelf: "stretch",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
  },
});
