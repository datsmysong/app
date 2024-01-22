import { ActiveRoom } from "commons/database-types-utils";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import Alert from "../../../components/Alert";
import Button from "../../../components/Button";
import { supabase } from "../../../lib/supabase";

const generatedInvitationLink = (currentUrl: string, roomCode: string) => {
  const production = process.env.NODE_ENV === "production";
  if (production) {
    return `https://datsmysong.app/join/${roomCode}`;
  } else {
    const mobile = Platform.OS === "ios" || Platform.OS === "android";
    if (mobile) {
      const webLink = currentUrl.replace("exp://", "http://");
      return `${webLink}/join/${roomCode}`;
    } else {
      const host = currentUrl.split("/").slice(0, 3).join("/");
      return `${host}/join/${roomCode}`;
    }
  }
};

export default function RoomPage() {
  const { id } = useLocalSearchParams();
  const currentPageLink = Linking.useURL();

  const [room, setRoom] = useState<ActiveRoom>();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("active_rooms")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        Alert.alert(
          "Une erreur est survenue lors de la récupération de la salle"
        );
        return;
      }
      setRoom(data);
    };

    fetchData();
  }, []);

  const handleShare = async () => {
    if (!currentPageLink) {
      Alert.alert("Aucun lien n'a été retourné");
      return;
    }

    const roomCode = room?.code ?? "";
    const invitationLink = generatedInvitationLink(currentPageLink, roomCode);

    await Clipboard.setStringAsync(invitationLink);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <View style={styles.headerContainer}>
      {room && (
        <>
          <Text style={styles.title}>Salle "{room.name}"</Text>
          <View style={styles.buttonContainer}>
            {isCopied ? (
              <Button block prependIcon="check" onPress={handleShare}>
                Lien copié
              </Button>
            ) : (
              <Button block onPress={handleShare}>
                Partager
              </Button>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 14,
    gap: 10,
  },
  buttonContainer: {
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
