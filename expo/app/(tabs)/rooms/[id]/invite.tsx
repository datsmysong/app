import { Room } from "commons/database-types-utils";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

import Button from "../../../../components/Button";
import { View } from "../../../../components/Themed";
import { supabase } from "../../../../lib/supabase";

export default function InvitationModal() {
  const { id } = useLocalSearchParams();
  const currentUrl = Linking.useURL();

  const [room, setRoom] = useState<Room>();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isQRCodeDisplayed, setIsQRCodeDisplayed] = useState<boolean>(false);

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
    const invitationLink = generatedInvitationLink();

    await Clipboard.setStringAsync(invitationLink);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const generatedInvitationLink = () => {
    if (!currentUrl) {
      Alert.alert("Aucun lien n'a été retourné");
      return "";
    }
    const roomCode = room?.code ?? "";

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
        <Button
          type="outline"
          icon="qr-code"
          onPress={() => setIsQRCodeDisplayed(true)}
        >
          Afficher le QR code
        </Button>
      </View>
      {isQRCodeDisplayed && (
        <QRCode
          value={generatedInvitationLink()}
          size={200}
          color="black"
          backgroundColor="white"
        />
      )}
      <Button block href={`/rooms/${id}`} prependIcon="arrow-back">
        Retour à la salle d'écoute
      </Button>
    </View>
  );
}

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
