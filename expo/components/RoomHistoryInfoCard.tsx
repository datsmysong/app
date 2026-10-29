import { Link } from "expo-router";
import { ArrowRight, CaretRight } from "phosphor-react-native";
import { StyleSheet } from "react-native";

import { Text, View } from "./Themed";

interface RoomHistoryInfoCardProps {
  createdAt: string;
  hostUsername: string;
  roomId: string;
  roomName: string;
}
export default function RoomHistoryInfoCard({
  createdAt,
  hostUsername,
  roomId,
  roomName,
}: RoomHistoryInfoCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/rooms/${roomId}`}>
      <View style={styles.layout}>
        <View style={styles.infos}>
          <Text style={styles.roomName}>{roomName}</Text>
          <Text style={styles.roomInfo}>
            par {hostUsername} le {formattedDate}
          </Text>
        </View>
        <CaretRight size={32} color="black" />
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  layout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 8,
  },

  infos: {
    flexDirection: "column",
    gap: 4,
  },

  roomName: {
    fontFamily: "Outfit-Regular",
    fontSize: 20,
  },

  roomInfo: {
    fontFamily: "Outfit-Regular",
    fontSize: 14,
    color: "#C3C3C3",
  },
});
