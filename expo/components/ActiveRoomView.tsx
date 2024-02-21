import { MaterialIcons } from "@expo/vector-icons";
import { RoomJSON } from "commons/Backend-types";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import Alert from "./Alert";
import Button from "./Button";
import Confirm from "./Confirm";
import { Text, View } from "./Themed";
import RoomPlayer from "./player/RoomPlayer";
import TrackItem from "./room/TrackItem";
import { useWebSocket } from "../app/(tabs)/rooms/[id]/_layout";
import { getApiUrl } from "../lib/apiUrl";
import { getRoomHostedByUser } from "../lib/room-utils";
import { ActiveRoom } from "../lib/useRoom";
import { useUserProfile } from "../lib/userProfile";

export interface MusicRoomParams {
  id: string;
}

export const generatedInvitationLink = (
  currentUrl: string,
  roomCode: string
): string => {
  const production = process.env.NODE_ENV === "production";
  if (production) {
    return `https://datsmysong.app/join/${roomCode}`;
  } else {
    const mobile = Platform.OS === "ios" || Platform.OS === "android";
    if (mobile) {
      const baseUrl = "http://" + currentUrl.split("/").slice(2, 3).join("/");
      return `${baseUrl}/join/${roomCode}`;
    } else {
      const host = currentUrl.split("/").slice(0, 3).join("/");
      return `${host}/join/${roomCode}`;
    }
  }
};

type ActiveRoomViewProps = {
  room: ActiveRoom;
};

const ActiveRoomView: React.FC<ActiveRoomViewProps> = ({ room }) => {
  const [liveRoom, setLiveRoom] = useState<RoomJSON>();
  const [isHost, setIsHost] = useState<boolean>(false);

  const userProfile = useUserProfile();

  const socket = useWebSocket();

  const url: URL = new URL("/room/" + room.id, getApiUrl());

  const deleteRoom = async () => {
    const response = await fetch(url + "/end", { credentials: "include" });
    if (!response.ok && process.env.NODE_ENV !== "production") {
      Alert.alert(await response.text());
    }
  };

  useEffect(() => {
    if (!userProfile || !room) return;

    const fetchHost = async () => {
      const { data } = await getRoomHostedByUser(room.id, userProfile, true);
      setIsHost((data?.length ?? 0) > 0);
    };

    fetchHost();
  }, [userProfile, room]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("queue:get", (data: RoomJSON) => {
      setLiveRoom(data);
    });

    socket.on("queue:update", (data: RoomJSON) => {
      setLiveRoom(data);
    });
  }, [socket]);

  const showDialog = () => {
    if (isHost) {
      return Alert.alert(
        "Pour quitter une salle en tant qu'hôte, veuillez la supprimer."
      );
    }

    return Confirm.confirm(
      "Quitter la salle",
      "Voulez-vous vraiment quitter la salle d'écoute ?",
      leaveRoom
    );
  };

  const leaveRoom = async () => {
    if (!userProfile || !room) return;

    const response = await fetch(url + "/leave", { credentials: "include" });
    if (!response.ok) {
      return Alert.alert(await response.text());
    }

    if (!socket) return Alert.alert("Impossible de trouver le socket.");
    socket.disconnect();

    router.replace("/rooms");
  };

  return (
    <>
      <ScrollView>
        {room && socket && (
          <View style={[headerStyles.headerContainer, { flex: 1 }]}>
            <View style={headerStyles.titleContainer}>
              <Text style={headerStyles.headerTitle}>Salle "{room.name}"</Text>
              {isHost ? (
                <Link href={`/rooms/${room.id}/settings`} asChild>
                  <MaterialIcons
                    name="settings"
                    style={headerStyles.settingsIcon}
                    size={32}
                    color="black"
                  />
                </Link>
              ) : (
                <MaterialIcons
                  name="meeting-room"
                  size={28}
                  color="black"
                  onPress={showDialog}
                />
              )}
            </View>
            <View style={headerStyles.buttonContainer}>
              <Button block href={`/rooms/${room.id}/invite`}>
                Inviter des amis
              </Button>
            </View>
            <RoomPlayer socket={socket} room={room} />
            <Text style={styles.title}>
              File d'attente ({liveRoom?.queue.length ?? 0})
            </Text>
            {liveRoom === undefined ? (
              <Text>Chargement...</Text>
            ) : (
              <FlatList
                style={styles.list}
                data={liveRoom.queue}
                renderItem={({ item, index }) => (
                  <TrackItem
                    track={item}
                    index={index}
                    roomId={room.id}
                    isMenuDisabled={!isHost}
                  />
                )}
              />
            )}
            <Button
              onPress={deleteRoom}
              color="danger"
              block
              style={{ margin: 20, marginRight: 100 }}
            >
              Supprimer la salle
            </Button>
          </View>
        )}
      </ScrollView>
      <Button
        icon="add"
        href={`/rooms/${room.id}/add`}
        style={floatingStyle.container}
      >
        Ajouter une musique
      </Button>
    </>
  );
};

export default ActiveRoomView;

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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingsIcon: {
    display: "flex",
    width: 32,
    height: 32,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  titleLayout: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    flex: 1,
    flexDirection: "column",
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
