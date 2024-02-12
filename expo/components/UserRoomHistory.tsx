import { Room, RoomUser } from "commons/database-types-utils";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import Alert from "./Alert";
import RoomHistoryInfoCard from "./RoomHistoryInfoCard";
import { Text, View } from "./Themed";
import { getApiUrl } from "../lib/apiUrl";
import { useUserProfile } from "../lib/userProfile";

type RoomUserAndRoom = { rooms: Room } & RoomUser;

export default function UserRoomHistory() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomUser, setRoomUser] = useState<RoomUserAndRoom[]>([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (roomUser.length === 0) return;
    (async () => {
      const tmpRooms: Room[] = [];
      for (const userRoom of roomUser) {
        tmpRooms.push(userRoom.rooms);
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
