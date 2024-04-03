import { Room } from "commons/database-types-utils";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import Alert from "./Alert";
import RoomHistoryInfoCard from "./RoomHistoryInfoCard";
import { View } from "./Themed";
import H2 from "./text/H2";
import { supabase } from "../lib/supabase";
import { useUserProfile } from "../lib/userProfile";

export default function UserRoomHistory({ limit = 5 }: { limit?: number }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const user = useUserProfile();

  useEffect(() => {
    (async () => {
      if (!user) return;
      const userId = user.user_profile_id;

      const { error, data } = await supabase
        .from("rooms")
        .select("*, room_users(*)")
        .eq("room_users.profile_id", userId)
        .eq("is_active", false)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        return Alert.alert(
          "Erreur lors de la récupération des salles d'écoute"
        );
      }

      setRooms(data);
    })();
  }, [user]);

  return (
    <View style={{ gap: 10 }}>
      <H2>Historique</H2>
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
