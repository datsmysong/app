import { Room } from "commons/database-types-utils";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet } from "react-native";

import Button from "../../../../components/Button";
import { View } from "../../../../components/Themed";
import { supabase } from "../../../../lib/supabase";

export default function InvitationModal() {
  const { id } = useLocalSearchParams();
  const currentUrl = Linking.useURL();

  const [room, setRoom] = useState<Room>();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: room, error: roomsError } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();
      if (roomsError) {
        Alert.alert(
          "Une erreur est survenue lors de la récupération de la salle"
        );
        return;
      }
      setRoom(room);
    };

    fetchData();
  }, []);

  const handleShare = async () => {
    if (!currentUrl || !room) {
      Alert.alert("Aucun lien disponible");
      return;
    }
    const invitationLink = generatedInvitationLink({
      currentUrl,
      roomCode: room.code,
    });

    await Clipboard.setStringAsync(invitationLink);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <View style={styles.modalContent}>
      <View style={styles.shareButtonsContainer}>
        {isCopied ? (
          <Button block prependIcon="check">
            Lien copié
          </Button>
        ) : (
          <Button block onPress={handleShare} prependIcon="share">
            Copier le lien
          </Button>
        )}
        <Button type="outline" icon="qr-code" href={`/rooms/${id}/qrcode`}>
          Afficher le QR code
        </Button>
      </View>
      <Button block href={`/rooms/${id}`} prependIcon="arrow-back">
        Retour à la salle d'écoute
      </Button>
    </View>
  );
}

export const generatedInvitationLink = ({
  currentUrl,
  roomCode,
}: {
  currentUrl: string;
  roomCode: string;
}) => {
  const production = process.env.NODE_ENV === "production";
  if (production) {
    return `https://datsmysong.app/join/${roomCode}`;
  } else {
    const mobile = Platform.OS === "ios" || Platform.OS === "android";
    if (mobile) {
      const baseUrl = "http://" + currentUrl.split("/").slice(2, 3).join("/");
      return `${baseUrl}/join/${roomCode}`;
    } else {
      const host = currentUrl.split("/").slice(0, 3).join("/");
      return `${host}/join/${roomCode}`;
    }
  }
};

const styles = StyleSheet.create({
  modalContent: {
    display: "flex",
    paddingHorizontal: 20,
    paddingVertical: 32,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    alignSelf: "stretch",
  },
  shareButtonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    alignSelf: "stretch",
  },
});
