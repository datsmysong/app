import type { ProcessedRoom } from "commons/room-types";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import { getApiUrl } from "../lib/apiUrl";
import Button from "./Button";
import InfoCard from "./InfoCard";
import InactiveMusic from "./Music";
import { Text, View } from "./Tamed";
import Avatar from "./profile/Avatar";
import H2 from "./text/H2";

type RoomHistoryProps = {
  roomId: string;
};

const RoomHistory: React.FC<RoomHistoryProps> = ({ roomId }) => {
  const navigation = useNavigation();

  const [processedRoom, setProcessedRoom] = useState<ProcessedRoom>();
  const [error, setError] = useState<string>();

  const apiUrl = getApiUrl();

  useEffect(() => {
    const fetchProcessedRoomData = async () => {
      const data = await fetch(`${apiUrl}/room/${roomId}`, {
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

    if (!roomId) return;
    fetchProcessedRoomData();
  }, [roomId]);

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
          <View style={{ gap: 16 }}>
            <H2>
              Historique des musiques ({processedRoom.playedSongs.length + ""})
            </H2>
            {processedRoom.playedSongs.map((song) => {
              return <InactiveMusic key={song.id} music={song} />;
            })}
            <H2>Participants ({processedRoom.participants.length + ""})</H2>
            <FlatList
              data={processedRoom.participants}
              horizontal
              renderItem={({ item: participant }) => (
                <View style={styles.avatars}>
                  <Avatar id={participant.profile.userProfile?.account_id} />
                  <Text style={{ fontFamily: "Outfit-Medium" }}>
                    {participant.profile.nickname}
                  </Text>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={{ width: 25 }} />} // This will create a 25px gap between items
            />
          </View>
        </>
      )}
      {!processedRoom && !error && <Text>Chargement...</Text>}
      <Button href="/rooms" block>
        Retour à l'accueil
      </Button>
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
    overflowX: "scroll",
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
  avatars: {
    width: 90,
    maxWidth: 200,
    alignItems: "center",
    gap: 4,
    marginVertical: 20,
  },
});

export default RoomHistory;
