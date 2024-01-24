import { UserProfile } from "commons/database-types-utils";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Keyboard } from "react-native";

import Alert from "../../../components/Alert";
import Button from "../../../components/Button";
import CustomTextInput from "../../../components/CustomTextInput";
import { Text, View } from "../../../components/Tamed";
import { supabase } from "../../../lib/supabase";
import { useUserProfile } from "../../../lib/userProfile";

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [isTextPresent, setIsTextPresent] = useState(false);
  const [noRoomFound, setNoRoomFound] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>();

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

  const joinRoom = async (roomId: string) => {
    if (!userProfile) return { error: "Unauthorized" };

    const { error: roomUsersError } = await supabase.from("room_users").insert({
      room_id: roomId,
      profile_id: userProfile.user_profile_id,
    });

    return { error: roomUsersError };
  };

  const searchRoom = async () => {
    Keyboard.dismiss();

    const { data: activeRoom, error: activeRoomError } = await supabase
      .from("active_rooms")
      .select("*")
      .eq("code", roomCode)
      .single();

    if (activeRoomError) {
      setNoRoomFound(true);
      setTimeout(() => {
        setNoRoomFound(false);
      }, 3000);
      return;
    }

    const { error: roomUsersError } = await joinRoom(activeRoom.id);

    /**
     * This returns an error even when the user is already in the room
     * so we should prevent him to go back to this page if he is in a room, unless he leaves it
     */
    if (roomUsersError) {
      return Alert.alert("Impossible de rejoindre la salle d'écoute");
    }

    router.replace(`/rooms/${activeRoom.id}`);
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
