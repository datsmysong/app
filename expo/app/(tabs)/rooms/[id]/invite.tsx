import { StyleSheet } from "react-native";

import Button from "../../../../components/Button";
import { View } from "../../../../components/Themed";

export default function InvitationModal() {
  // TODO: add onPress to Buttons when feat/room-links is merged into main
  // Check if the space in the icon button is visible
  return (
    <View style={styles.modalContent}>
      <View style={styles.shareButtonsContainer}>
        <Button block>Copier le lien</Button>
        <Button type="outline" icon="qr-code">
          Afficher le QR code
        </Button>
      </View>
      <Button block href="/rooms/id">
        Revenir à la salle d'écoute
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
    alignItems: "flex-start",
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
