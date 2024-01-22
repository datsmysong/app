import type { ProcessedRoom } from "commons/room-types";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import InfoCard from "./InfoCard";
import { Text, View } from "./Tamed";

type RoomHistoryProps = {
  roomId: string;
};

const RoomHistory: React.FC<RoomHistoryProps> = ({ roomId }) => {
  const [processedRoom, setProcessedRoom] = useState<ProcessedRoom>();

  useEffect(() => {
    const fetchProcessedRoomData = async () => {
      const data = await fetch(`http://localhost:3000/rooms/${roomId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const processedRoomData = await data.json();
      setProcessedRoom(processedRoomData as ProcessedRoom);
    };
    fetchProcessedRoomData();
  }, [roomId]);

  return (
    <View style={styles.header}>
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
          <Text>{processedRoom.name}</Text>
          <View style={styles.headerInfos}>
            <View style={styles.headerLeft}>
              <Text>{JSON.stringify(processedRoom)}</Text>
            </View>
          </View>
        </>
      )}
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
    alignItems: "flex-start",
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
