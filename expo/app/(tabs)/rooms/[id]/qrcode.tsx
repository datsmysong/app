import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

import Alert from "../../../../components/Alert";
import Button from "../../../../components/Button";
import { View } from "../../../../components/Themed";
import { supabase } from "../../../../lib/supabase";
import { generatedInvitationLink } from "./invite";

export default function InvitationModal() {
  const { id } = useLocalSearchParams();
  const currentUrl = Linking.useURL();

  const [qrCodeString, setQrCodeString] = useState<string | null>(null);

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

      if (!currentUrl) {
        Alert.alert("Aucun lien disponible");
        return;
      }

      const invitationLink = generatedInvitationLink({
        currentUrl,
        roomCode: room.code,
      });
      setQrCodeString(invitationLink);
    };
    if (currentUrl) fetchData();
  }, [currentUrl]);

  return (
    <View style={styles.modalContent}>
      {qrCodeString && (
        <QRCode
          value={qrCodeString}
          size={300}
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
