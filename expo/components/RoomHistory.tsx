import type { Room } from "commons/database-types-utils";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "./Tamed";

type RoomHistoryProps = {
  room: Room;
};

const RoomHistory: React.FC<RoomHistoryProps> = ({ room }) => {
  const formatter = new Intl.RelativeTimeFormat("fr", {
    numeric: "auto",
    style: "long",
  });
  const [processedRoom, setProcessedRoom] = useState<ProcessedRoom>();

  useEffect(() => {
    const fetchProcessedRoomData = async () => {
      const processedRoomData = await fetch(
        `http://localhost:3000/rooms/${room.id}`
      );
      setProcessedRoom(processedRoomData);
    };
    fetchProcessedRoomData();
  }, [room]);

  return (
    <View style={styles.header}>
      <Text>{room.name}</Text>
      <View style={styles.headerInfos}>
        <View style={styles.headerLeft}>
          <Text>{relativeTime}</Text>
          <Text>
            {room.participants.length}
            {room.participants.length > 1 ? "participants" : "participant"}
          </Text>
          <Text>{formattedDuration}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    backgroundColor: "white",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
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
