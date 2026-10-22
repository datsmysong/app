import { QueryData } from "@supabase/supabase-js/dist/module/lib/types";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";

import RoomHistoryInfoCard from "./RoomHistoryInfoCard";
import { View } from "./Themed";
import { Subtitle } from "./ui/typography/Paragraphs";
import { H2 } from "./ui/typography/Titles";
import { supabase } from "../lib/supabase";
import { useUserProfile } from "../lib/userProfile";

const historyRoom = supabase
  .from("room_users")
  .select("rooms!inner(created_at, name, id, host:user_profile(username))");

type HistoryRoomType = QueryData<typeof historyRoom>;

type RoomHistoryListProps = {
  limit?: number;
};

export function RoomHistoryList({ limit = 5 }: RoomHistoryListProps) {
  const [rooms, setRooms] = useState<HistoryRoomType | null>([]);
  const user = useUserProfile();

  useEffect(() => {
    if (!user) return;
    /**
     * Fetch all rooms where user is a member and the room is not active
     * Tips : If the filter on a referenced table's column is not satisfied, the referenced
     * table returns [] or null but the parent table is not filtered out.
     * If you want to filter out the parent table rows, use the !inner hint
     */
    const fetchRoomHistory = async () => {
      const { data } = await supabase
        .from("room_users")
        .select(
          "rooms!inner(created_at, name, id, host:user_profile(username))"
        )
        .eq("rooms.is_active", false)
        .eq("profile_id", user.user_profile_id)
        .order("rooms(created_at)", { ascending: false })
        .limit(limit);

      if (!data || data.length === 0) {
        return setRooms(null);
      }

      setRooms(data);
    };
    fetchRoomHistory();
  }, [user]);

  if (rooms == null) {
    return <Subtitle>Vous n'avez aucune salle dans votre historique</Subtitle>;
  } else {
    const everyoneHaveRoom = rooms.every((room) => room.rooms);
    const everyoneHaveId = rooms.every((room) => room.rooms?.name);
    if (!everyoneHaveId || !everyoneHaveRoom)
      return <Subtitle>Impossible de charger l'historique des salles</Subtitle>;
  }

  return (
    <FlatList
      data={rooms}
      keyExtractor={(item) => item.rooms!.id}
      renderItem={({ item }) => {
        if (!item.rooms)
          return <Subtitle>Impossible de charger cette salle</Subtitle>;
        return (
          <RoomHistoryInfoCard
            createdAt={item.rooms.created_at}
            hostUsername={
              item.rooms.host?.username ??
              "Impossible de récupérer le nom de l'hôte"
            }
            roomId={item.rooms.id}
            roomName={item.rooms.name}
          />
        );
      }}
    />
  );
}

export default function UserRoomHistory({ limit = 5 }: { limit?: number }) {
  return (
    <View style={{ gap: 10 }}>
      <H2>Historique</H2>
      <RoomHistoryList limit={limit} />
    </View>
  );
}
