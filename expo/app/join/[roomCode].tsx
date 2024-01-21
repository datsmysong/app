import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { supabase } from "../../lib/supabase";
import Button from "../../components/Button";
import * as Linking from "expo-linking";
import * as Device from "expo-device";
import Alert from "../../components/Alert";
import { useUserProfile } from "../../lib/userProfile";

export default function JoinPage() {
  const { roomCode } = useLocalSearchParams();

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isParticipant, setIsParticipant] = useState<boolean>(false);

  let userProfileId: string = "";
  let isMobile: boolean = false;

  useEffect(() => {
    if (!roomCode) {
      Alert.alert("Aucun code n'a été retourné");
      return;
    }
    isMobile = Device.deviceType === Device.DeviceType.PHONE;
    useUserProfile().then((userProfile) => {
      if (userProfile) {
        userProfileId = userProfile.user_profile_id;
        setIsConnected(true);
        getParticipant().then((result) => {
          if (!result) {
            return;
          }
          if (result.error) {
            Alert.alert(
              "Aucun participant n'a été trouvé avec ce compte dans cette salle d'écoute."
            );
            return;
          }
          setIsParticipant(true);
        });
        handleIncomingLinks();
      } else {
        setIsConnected(false);
        // ... when anonymous users are implemented, verifiy if the user is a participant or not
      }
    });
  }, [roomCode]);

  const handleIncomingLinks = async () => {
    if (!isMobile) {
      await onContinueWebsite(`rooms/${roomCode}`);
    }
  };

  const onOpenApp = async (path: string) => {
    if (!isParticipant) {
      await addUserToRoom();
    }
    const deepLink = Linking.createURL(path);
    Linking.openURL(deepLink);
  };

  const onContinueWebsite = async (path: string) => {
    if (!isParticipant) {
      await addUserToRoom();
    }
    router.replace(path as any);
  };

  const addUserToRoom = async () => {
    const { data: roomId, error: errorRoomId } = await getRoomId();
    if (errorRoomId) {
      Alert.alert("Aucune salle d'écoute n'a été trouvée avec ce code.");
      return;
    }
    const { error: roomUsersError } = await supabase.from("room_users").insert({
      room_id: roomId,
      profile_id: userProfileId,
    });
    if (roomUsersError) {
      return { error: roomUsersError };
    }
  };

  const getRoomId = async () => {
    const { data: room, error: activeRoomError } = await supabase
      .from("active_rooms")
      .select("id")
      .eq("code", roomCode)
      .single();
    if (activeRoomError) {
      return { data: null, error: activeRoomError };
    }
    return { data: room.id, error: null };
  };

  const getParticipant = async () => {
    const { data: roomId, error: errorRoomId } = await getRoomId();
    if (errorRoomId) {
      Alert.alert("Aucune salle d'écoute n'a été trouvée avec ce code.");
      return;
    }
    const { data: participant, error: roomUsersError } = await supabase
      .from("room_users")
      .select("profile_id")
      .eq("profile_id", userProfileId)
      .eq("room_id", roomId)
      .single();
    if (roomUsersError) {
      return { data: null, error: roomUsersError };
    }
    return { data: participant, error: null };
  };

  if (isConnected) {
    return (
      <View style={styles.choiceContainer}>
        <Text style={styles.title}>
          Vous êtes sur le point de rejoindre la salle d'écoute "{roomCode}"
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            block
            type="filled"
            onPress={async () => await onOpenApp(`rooms/${roomCode}`)}
          >
            Ouvrir dans l'application
          </Button>
          <Button
            block
            type="outline"
            onPress={async () => await onContinueWebsite(`rooms/${roomCode}`)}
          >
            Continuer sur le site
          </Button>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.choiceContainer}>
        <Text style={styles.title}>
          Vous êtes sur le point de rejoindre la salle d'écoute "{roomCode}",
          mais vous n'êtes pas connecté
        </Text>
        <View style={styles.buttonContainer}>
          <Button block type="filled" href={`auth`}>
            Se connecter
          </Button>
          <Button block type="outline">
            Continuer en tant qu'invité
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  choiceContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 24,
    gap: 10,
  },
  buttonContainer: {
    gap: 8,
  },
  title: {
    marginBottom: 20,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
});
