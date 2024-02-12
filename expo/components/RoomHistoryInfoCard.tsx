import { MaterialIcons } from "@expo/vector-icons";
import { Room } from "commons/database-types-utils";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import Alert from "./Alert";
import { Text, View } from "./Themed";
import { getUserProfileFromUserProfileId } from "../lib/userProfile";

interface RoomHistoryInfoCardProps {
  room: Room;
}
export default function RoomHistoryInfoCard({
  room,
}: RoomHistoryInfoCardProps) {
  const [username, setUsername] = useState("");
  const [formatedDate, setFormatedDate] = useState("");

  const getUsername = async (userProfileId: string) => {
    const user = await getUserProfileFromUserProfileId(userProfileId);
    if (!user) {
      Alert.alert("Erreur lors de la récupération de l'utilisateur");
      return;
    }
    return user.username;
  };
  useEffect(() => {
    (async () => {
      const username = await getUsername(room.host_user_profile_id || "");
      if (!username) {
        Alert.alert("Erreur lors de la récupération de l'utilisateur");
        return;
      }
      const formattedDate = new Date(room.created_at).toLocaleDateString(
        "fr-FR",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      setUsername(username);
      setFormatedDate(formattedDate);
    })();
  }, []);

  return (
    <View style={styles.layout}>
      <View style={styles.infos}>
        <Text style={styles.roomName}>{room.name}</Text>
        <Text style={styles.roomInfo}>
          par {username} le {formatedDate}
        </Text>
      </View>
      <Link href={`/rooms/${room.id}/history`}>
        <MaterialIcons name="keyboard-arrow-right" size={32} color="black" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  infos: {
    flexDirection: "column",
    marginVertical: 8,
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
