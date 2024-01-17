import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { supabase } from "../../lib/supabase";
import Button from "../../components/Button";
import useSupabaseUser from "../../lib/useSupabaseUser";
import * as Linking from "expo-linking";
import * as Device from "expo-device";
import { User } from "@supabase/supabase-js";

export default function JoinPage() {
  const { roomCode } = useLocalSearchParams();

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isParticipant, setIsParticipant] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!roomCode) throw new Error("No room code provided");

    const subscription = Linking.addEventListener("url", handleIncomingLinks);

    setIsMobile(Device.deviceType === Device.DeviceType.PHONE);

    useSupabaseUser().then(async (user) => {
      if (user) {
        setUser(user);
        setIsConnected(true);

        const { data: participant, error: roomUsersError } = await supabase
          .from("room_users")
          .select("profile_id")
          .eq("profile_id", user.id)
          .eq("room_id", await getRoomId())
          .single();

        if (roomUsersError)
          throw new Error("Error while fetching data from supabase");

        setIsParticipant(participant ? true : false);
      } else {
        setIsConnected(false);
        // ... when anonymous users are implemented, verifiy if the user is a participant or not
      }
    });

    return () => {
      subscription.remove();
    };
  }, [roomCode]);

  const handleIncomingLinks = async () => {
    if (!isMobile && isConnected) {
      if (!isParticipant) await addUserToRoom();
      router.replace(`/rooms/${roomCode}`);
    }
  };

  const onOpenApp = async (path: string) => {
    const deepLink = Linking.createURL(path);
    if (!isParticipant) await addUserToRoom();
    Linking.openURL(deepLink);
  };

  const onContinueWebsite = async (path: string) => {
    if (!isParticipant) await addUserToRoom();
    router.replace(path as any);
  };

  const addUserToRoom = async () => {
    const { error: roomUsersError } = await supabase.from("room_users").insert({
      room_id: await getRoomId(),
      profile_id: user!.id, // Change when anonymous users are implemented
    });
    if (roomUsersError)
      throw new Error("Error while inserting data in supabase");
  };

  const getRoomId = async () => {
    const { data: room, error: activeRoomError } = await supabase
      .from("active_rooms")
      .select("id")
      .eq("code", roomCode)
      .single();
    if (activeRoomError)
      throw new Error("Error while fetching data from supabase");
    return room.id;
  };

  if (isConnected) {
    return (
      <View style={styles.choiceContainer}>
        <Text style={styles.title}>
          Vous êtes sur le point de rejoindre la salle d'écoute "{roomCode}"...
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
          <Button block type="filled" href={`(auth)`}>
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
