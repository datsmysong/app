import { router } from "expo-router";
import { ArrowRight } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { Keyboard, StyleSheet } from "react-native";

import Alert from "../../../components/Alert";
import CustomTextInput from "../../../components/CustomTextInput";
import { View } from "../../../components/Themed";
import Warning from "../../../components/Warning";
import Button from "../../../components/ui/Button";
import { getParticipant, getRoomId, joinRoom } from "../../../lib/room-utils";
import { useUserProfile } from "../../../lib/userProfile";

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState<string>("");
  const [isTextPresent, setIsTextPresent] = useState<boolean>(false);
  const [noRoomFound, setNoRoomFound] = useState<boolean>();

  const userProfile = useUserProfile();

  useEffect(() => {
    setIsTextPresent(roomCode.length > 0);
  }, [roomCode]);

  const searchRoom = async () => {
    setNoRoomFound(false);
    Keyboard.dismiss();

    if (!roomCode) return;

    const { data: roomId, error: roomsError } = await getRoomId(roomCode);

    if (roomsError || !roomId) {
      setNoRoomFound(true);
      return;
    }

    if (!userProfile)
      return Alert.alert(
        "Une erreur est survenue lors de la récupération de votre profil"
      );

    const { data } = await getParticipant(roomId, userProfile);
    const isParticipant = (data?.length ?? 0) > 0;

    if (!isParticipant) {
      const { error: roomUsersError } = await joinRoom(
        roomId,
        userProfile,
        isParticipant
      );

      if (roomUsersError) {
        return Alert.alert("Impossible de rejoindre la salle d'écoute");
      }
    }

    router.replace(`/rooms/${roomId}`);
  };

  return (
    <View style={styles.mainContainer}>
      {noRoomFound && (
        <Warning label="Aucune salle n'a été trouvée avec ce code." />
      )}
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
        appendIcon={<ArrowRight />}
        onPress={searchRoom}
      >
        Rejoindre
      </Button>
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
});
