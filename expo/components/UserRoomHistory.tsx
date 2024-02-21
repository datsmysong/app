import { Room, RoomUser } from "commons/database-types-utils";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import Alert from "./Alert";
import RoomHistoryInfoCard from "./RoomHistoryInfoCard";
import { Text, View } from "./Themed";
import { supabase } from "../lib/supabase";
import useSupabaseUser from "../lib/useSupabaseUser";
import { getUserProfile } from "../lib/userProfile";

type RoomUserAndRoom = { rooms: Room } & RoomUser;

export default function UserRoomHistory() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomUser, setRoomUser] = useState<RoomUserAndRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // If I have use the method useUserProfileUser, I have an error,
      // so the only way I find to fix it is to use the method useSupabaseUser

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const user = await useSupabaseUser();
      if (!user) {
        Alert.alert("Erreur lors de la récupération de l'utilisateur");
        return;
      }
      const userProfile = await getUserProfile(user.id);
      if (!userProfile) {
        Alert.alert(
          "Erreur lors de la récupération du profil de l'utilisateur"
        );
        return;
      }
      const userId = userProfile.user_profile_id;

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

      setRoomUser(history);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (roomUser.length === 0) return;
    (async () => {
      const tmpRooms: Room[] = [];
      roomUser.forEach((userRoom) => {
        tmpRooms.push(userRoom.rooms);
      });
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
