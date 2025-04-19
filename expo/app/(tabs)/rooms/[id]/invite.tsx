import { Room } from "commons/database-types-utils";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import { ArrowRight, Check, QrCode, Share } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet } from "react-native";

import CustomTextInput from "../../../../components/CustomTextInput";
import { View } from "../../../../components/Themed";
import Button from "../../../../components/ui/Button";
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
        .eq("id", id as string)
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
    if (!currentUrl || !room || !room.code) {
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
      <View style={styles.shareOptions}>
        <CustomTextInput
          value={room?.code || "no code"}
          style={styles.code}
          disabled
        />
        <View style={styles.shareButtonsContainer}>
          {isCopied ? (
            <Button block prependIcon={<Check />}>
              Lien copié
            </Button>
          ) : (
            <Button block onPress={handleShare} prependIcon={<Share />}>
              Copier le lien
            </Button>
          )}
          <Button type="outline" icon={<QrCode />} href={`/rooms/${id}/qrcode`}>
            Afficher le QR code
          </Button>
        </View>
      </View>
      <Button block href={`/rooms/${id}`} prependIcon={<ArrowRight />}>
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
  shareOptions: {
    gap: 16,
    flexDirection: "column",
    maxWidth: 390,
  },
  code: {
    textAlign: "center",
    fontFamily: "Outfit-Bold",
    borderRadius: 16,
    borderWidth: 0,
  },
});
