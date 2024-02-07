import { Room, RoomUser } from "commons/database-types-utils";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import Alert from "./Alert";
import RoomHistoryInfoCard from "./RoomHistoryInfoCard";
import { Text, View } from "./Themed";
import { getApiUrl } from "../lib/apiUrl";
import { getRoom } from "../lib/room";
import { useUserProfile } from "../lib/userProfile";

export default function UserRoomHistory() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomUser, setRoomUser] = useState<RoomUser[]>([]);
  const baseUrl = getApiUrl();

  useEffect(() => {
    (async () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const user = await useUserProfile();
      if (!user) {
        Alert.alert("Erreur lors de la récupération de l'utilisateur");
        return;
      }
      const userId = user.user_profile_id;

      const history = await fetch(baseUrl + "/user/room/history/" + userId);
      const historyJson = await history.json();

      if (historyJson.error) {
        Alert.alert("Erreur lors de la récupération des salles d'écoute");
        return;
      }

      setRoomUser(historyJson);
    })();
  }, []);

  useEffect(() => {
    if (roomUser.length === 0) return;
    (async () => {
      const tmpRooms: Room[] = [];
      for (const userRoom of roomUser) {
        const room = await getRoom(userRoom.room_id);
        if (!room) {
          Alert.alert("Erreur lors de la récupération de la salle d'écoute");
          return;
        }

        tmpRooms.push(room);
      }
      setRooms(tmpRooms);
    })();
  }, [roomUser]);

  return (
    <View>
      <Text style={styles.title}>Historique</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <RoomHistoryInfoCard room={item} />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Outfit-Bold",
    fontSize: 24,
    marginBottom: 10,
  },
});
