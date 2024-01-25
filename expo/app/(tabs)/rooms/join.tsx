import { UserProfile } from "commons/database-types-utils";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Keyboard } from "react-native";

import Alert from "../../../components/Alert";
import Button from "../../../components/Button";
import CustomTextInput from "../../../components/CustomTextInput";
import { Text, View } from "../../../components/Tamed";
import { getParticipant, getRoomId, joinRoom } from "../../../lib/room-utils";
import { useUserProfile } from "../../../lib/userProfile";

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState<string>("");
  const [isTextPresent, setIsTextPresent] = useState<boolean>(false);
  const [noRoomFound, setNoRoomFound] = useState<boolean>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>();
  const [isParticipant, setIsParticipant] = useState<boolean>();

  useEffect(() => {
    const fetchData = async () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      setUserProfile(await useUserProfile());
    };

    fetchData();
  }, []);

  useEffect(() => {
    setIsTextPresent(roomCode.length > 0);
  }, [roomCode]);

  const searchRoom = async () => {
    Keyboard.dismiss();

    const { data: roomId, error: activeRoomError } = await getRoomId(roomCode);

    if (activeRoomError || !roomId) {
      setNoRoomFound(true);
      setTimeout(() => {
        setNoRoomFound(false);
      }, 3000);
      return;
    }

    if (userProfile === undefined)
      return Alert.alert(
        "Une erreur est survenue lors de la récupération de votre profil"
      );

    const { data } = await getParticipant(roomId, userProfile);
    setIsParticipant((data?.length ?? 0) > 0);

    if (!isParticipant) {
      const { error: roomUsersError } = await joinRoom(
        roomId,
        userProfile,
        isParticipant
      );

      /**
       * This returns an error even when the user is already in the room
       * so we should prevent him to go back to this page if he is in a room, unless he leaves it
       */
      if (roomUsersError) {
        return Alert.alert("Impossible de rejoindre la salle d'écoute");
      }
    }

    router.replace(`/rooms/${roomId}`);
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
