import { Room, RoomUser } from "commons/database-types-utils";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import Alert from "./Alert";
import RoomHistoryInfoCard from "./RoomHistoryInfoCard";
import { Text, View } from "./Themed";
import { supabase } from "../lib/supabase";
import { useUserProfile } from "../lib/userProfile";

type RoomUserAndRoom = { rooms: Room } & RoomUser;

export default function UserRoomHistory() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const user = useUserProfile();
  useEffect(() => {
    (async () => {
      if (!user) return;
      const userId = user.user_profile_id;

      const { error, data } = await supabase
        .from("room_users")
        .select("*, rooms(*)")
        .eq("profile_id", userId)
        .order("rooms(created_at)", { ascending: false })
        .limit(5);

      if (error) {
        Alert.alert("Erreur lors de la récupération des salles d'écoute");
      }

      const history: RoomUserAndRoom[] =
        (data?.filter((roomUser) => {
          return roomUser.rooms?.is_active === false;
        }) as RoomUserAndRoom[]) ?? [];

      const tmpRooms: Room[] = [];
      history.forEach((userRoom) => {
        tmpRooms.push(userRoom.rooms);
      });
      setRooms(tmpRooms);
    })();
  }, [user]);

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
