import { User } from "@supabase/supabase-js";
import type { ProcessedRoom } from "commons/room-types";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import InfoCard from "./InfoCard";
import InactiveMusic from "./Music";
import { Text, View } from "./Tamed";
import H2 from "./text/H2";
import { getApiUrl } from "../lib/apiUrl";
import useSupabaseUser from "../lib/useSupabaseUser";

type RoomHistoryProps = {
  roomId: string;
};

const RoomHistory: React.FC<RoomHistoryProps> = ({ roomId }) => {
  const navigation = useNavigation();

  const [processedRoom, setProcessedRoom] = useState<ProcessedRoom>();
  const [error, setError] = useState<string>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const user = await useSupabaseUser();
      if (!user) return;
      setUser(user);
    };
    fetchUser();
  }, []);

  const apiUrl = getApiUrl();

  useEffect(() => {
    const fetchProcessedRoomData = async () => {
      const data = await fetch(`${apiUrl}/rooms/${roomId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const dataJson = await data.json();
      if (dataJson.error) return setError(dataJson.error);

      const processedRoomData = dataJson as ProcessedRoom;
      setProcessedRoom(processedRoomData);
      navigation.setOptions({
        title: processedRoomData.name,
      });
    };
    console.log("roomId", roomId);
    console.log("user", user);

    if (!roomId || !user) return;
    fetchProcessedRoomData();
  }, [roomId, user]);

  return (
    <View style={styles.header}>
      {error && <Text>{error}</Text>}
      {processedRoom && (
        <>
          <View style={styles.infoCards}>
            <InfoCard
              content={processedRoom.createdAt}
              description="La date à laquelle s'est déroulée cette salle d'écoute"
              icon="calendar-today"
              title="Date"
            />
            <InfoCard
              content={processedRoom.duration}
              description="La durée de cette salle d'écoute"
              icon="timer"
              title="Durée"
            />
            <InfoCard
              content={processedRoom.participants.length + ""}
              description="Le nombre de participants à cette salle d'écoute"
              icon="people"
              title="Participants"
            />
          </View>
          <View>
            <H2>
              Historique des musiques ({processedRoom.playedSongs.length + ""})
            </H2>
            {processedRoom.playedSongs.map((song) => {
              return <InactiveMusic key={song.name} music={song} />;
            })}
          </View>
        </>
      )}
      {!processedRoom && !error && <Text>Chargement...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    backgroundColor: "transparent",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  infoCards: {
    display: "flex",
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: 12,
    alignSelf: "stretch",
    overflow: "scroll",
  },
  infoCard: {
    height: "auto",
  },
  headerInfos: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default RoomHistory;
