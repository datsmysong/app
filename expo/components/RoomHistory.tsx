import type { ProcessedRoom } from "commons/room-types";
import { useNavigation } from "expo-router";
import {
  Alarm,
  CalendarBlank,
  Cube,
  Heart,
  MusicNote,
  User,
} from "phosphor-react-native";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";

import InfoCard from "./InfoCard";
import InactiveMusic from "./Music";
import { Text, View } from "./Tamed";
import Avatar from "./profile/Avatar";
import Button from "./ui/Button";
import { H2 } from "./ui/typography/Titles";
import { getApiUrl } from "../lib/apiUrl";

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

  function formatDuration(averageSongDuration: number): string {
    // averageSongDuration is a number corresponding to the average number of milliseconds of a song
    // I need it formatted like so: "Mm Ss", like "3m 45s"
    const minutes = Math.floor(averageSongDuration / 60000);
    const seconds = Math.floor((averageSongDuration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  return (
    <ScrollView contentContainerStyle={styles.header}>
      {error && <Text>{error}</Text>}
      {processedRoom && (
        <>
          <View style={styles.infoCards}>
            <InfoCard
              content={processedRoom.createdAt}
              description="La date à laquelle s'est déroulée cette salle d'écoute"
              icon={<CalendarBlank />}
              title="Date"
            />
            <InfoCard
              content={processedRoom.duration}
              description="La durée de cette salle d'écoute"
              icon={<Alarm />}
              title="Durée"
            />
            <InfoCard
              content={processedRoom.participants.length + ""}
              description="Le nombre de participants à cette salle d'écoute"
              icon={<User />}
              title="Participants"
            />
          </View>
          <View>
            <View style={{ gap: 12 }}>
              <H2>
                Historique des musiques ({processedRoom.playedSongs.length + ""}
                )
              </H2>
              {processedRoom.playedSongs.map((song) => {
                return <InactiveMusic key={song.position} music={song} />;
              })}
            </View>
          </View>
          <View>
            <H2>Participants ({processedRoom.participants.length + ""})</H2>
            <FlatList
              data={processedRoom.participants}
              horizontal
              renderItem={({ item: participant }) => (
                <View style={styles.avatars}>
                  <Avatar
                    style={{ width: 80, height: 80 }}
                    id={participant.profile.userProfile?.user_profile_id}
                  />
                  <Text style={{ fontFamily: "Outfit-Medium", fontSize: 16 }}>
                    {participant.profile.nickname}
                  </Text>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={{ width: 24 }} />} // This will create a 24px gap between items
            />
          </View>
          <View style={{ gap: 12 }}>
            <H2>Le saviez vous ?</H2>
            <View style={{ gap: 12 }}>
              <InfoCard
                style={{ width: "100%" }}
                content={processedRoom.mostPlayedGenre}
                icon={<Heart />}
                description="Le genre de musique le plus jouée lors de cette salle d'écoute"
                title="Genre favori"
              />
              <InfoCard
                style={{ width: "100%" }}
                content={processedRoom.streamingService.service_name}
                icon={<Cube />}
                description={
                  processedRoom.streamingService.description ??
                  "Aucune description"
                }
                title="Intégration"
              />
              <InfoCard
                style={{ width: "100%" }}
                content={formatDuration(processedRoom.averageSongDuration)}
                icon={<MusicNote />}
                description="La durée moyenne d'une musique au sein de cette salle d'écoute"
                title="Durée moyenne d'une musique"
              />
            </View>
          </View>
        </>
      )}
      {!processedRoom && !error && <Text>Chargement...</Text>}
      <Button href="/rooms" block>
        Retour à l'accueil
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: "transparent",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    gap: 32,
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
  avatars: {
    width: 90,
    maxWidth: 200,
    alignItems: "center",
    gap: 4,
  },
});

export default RoomHistory;
