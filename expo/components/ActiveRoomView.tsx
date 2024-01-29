import { RoomJSON } from "commons/Backend-types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Platform, StyleSheet } from "react-native";
import { Socket } from "socket.io-client";

import Alert from "./Alert";
import Button from "./Button";
import RoomPlayer from "./RoomPlayer";
import { Text, View } from "./Themed";
import TrackItem from "./room/TrackItem";
import { getApiUrl } from "../lib/apiUrl";
import { getRoomHostedByUser } from "../lib/room-utils";
import SocketIo from "../lib/socketio";
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
  const [socket, setSocket] = useState<Socket>();

  const userProfile = useUserProfile();

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
    const socketInstance = SocketIo.getInstance().getSocket(url.pathname);
    setSocket(socketInstance);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("queue:update", (data: RoomJSON) => setLiveRoom(data));
    socket.on("disconnect", () => {
      router.replace("/rooms");
      Alert.alert("Cette salle d'écoute vient d'être supprimée");
    });
  }, [socket]);

  return (
    <>
      {room && liveRoom && socket && (
        <>
          <View style={headerStyles.headerContainer}>
            <Text style={headerStyles.headerTitle}>Salle "{room.name}"</Text>
            <View style={headerStyles.buttonContainer}>
              <Button block href={`/rooms/${room.id}/invite`}>
                Inviter des amis
              </Button>
            </View>
            <RoomPlayer socket={socket} room={room} liveRoom={liveRoom} />
            <View style={styles.container}>
              <Text style={styles.title}>
                File d'attente ({liveRoom.queue.length})
              </Text>
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
            </View>
          </View>
          <Button
            onPress={deleteRoom}
            color="danger"
            block
            style={{ margin: 20, marginRight: 100 }}
          >
            Supprimer la salle
          </Button>
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
