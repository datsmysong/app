import { RoomJSON } from "commons/backend-types";
import { Room } from "commons/database-types-utils";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import Alert from "../../../../components/Alert";
import Button from "../../../../components/Button";
import { Text, View } from "../../../../components/Themed";
import TrackItem from "../../../../components/room/TrackItem";
import { getApiUrl } from "../../../../lib/apiUrl";
import { getHost } from "../../../../lib/room-utils";
import SocketIo from "../../../../lib/socketio";
import { supabase } from "../../../../lib/supabase";
import { useUserProfile } from "../../../../lib/userProfile";

// TODO socket io which refresh playlist on live
export default function MusicRoom() {
  const { id: roomId } = useLocalSearchParams<{ id: string }>();

  const [room, setRoom] = useState<Room>();
  const [queue, setQueue] = useState<RoomJSON>();
  const [isHost, setIsHost] = useState<boolean>(false);

  const userProfile = useUserProfile();

  const url: URL = new URL("/room/" + roomId, getApiUrl());

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .eq("is_active", true)
        .single();
      if (error) {
        router.replace("/rooms");
        Alert.alert(
          "Une erreur est survenue lors de la récupération de la salle"
        );
        return;
      }
      setRoom(data);
    };

    fetchData();

    const namespace = SocketIo.getInstance().getSocket(url.pathname);
    namespace.on("queue:update", (data: RoomJSON) => setQueue(data));
    namespace.on("disconnect", () => {
      router.replace("/rooms");
      Alert.alert("Cette salle d'écoute vient d'être supprimée");
    });
  }, []);

  const deleteRoom = async () => {
    const response = await fetch(url + "/end", { credentials: "include" });
    if (!response.ok && process.env.NODE_ENV !== "production") {
      Alert.alert(await response.text());
    }
  };
  useEffect(() => {
    if (!userProfile || !room) return;

    const fetchHost = async () => {
      const { data } = await getHost(roomId, userProfile, true);

      setIsHost((data?.length ?? 0) > 0);
    };

    fetchHost();
  }, [userProfile, roomId]);

  return (
    <>
      {room && (
        <>
          <View style={headerStyles.headerContainer}>
            <Text style={headerStyles.headerTitle}>Salle "{room.name}"</Text>
            <Button
              onPress={deleteRoom}
              color="danger"
              style={{ position: "absolute", right: 0, height: 50 }}
            >
              Supprimer la salle
            </Button>
            <View style={headerStyles.buttonContainer}>
              <Button block href={`/rooms/${roomId}/invite`}>
                Inviter des amis
              </Button>
            </View>
            <View style={styles.container}>
              <Text style={styles.title}>
                File d'attente ({queue?.tracks.length})
              </Text>
              <FlatList
                style={styles.list}
                data={queue?.tracks}
                renderItem={({ item, index }) => (
                  <TrackItem
                    track={item}
                    index={index}
                    roomId={roomId}
                    isMenuDisabled={!isHost}
                  />
                )}
              />
            </View>
          </View>
          <Button
            icon="add"
            href={`/rooms/${room.id}/add`}
            style={floatingStyle.container}
          >
            Ajouter une musique
          </Button>
        </>
      )}
    </>
  );
}

const floatingStyle = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    right: 24,
  },
  text: {
    color: "#FFF",
    fontFamily: "Outfit",
    fontSize: 50,
  },
});

const headerStyles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 14,
    gap: 10,
  },
  buttonContainer: {
    gap: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
  },
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  title: {
    color: "#000",
    fontFamily: "Outfit-Bold",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "700",
    letterSpacing: 0.48,
  },
  list: {
    marginVertical: 12,
  },
});
