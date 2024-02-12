import { MaterialIcons } from "@expo/vector-icons";
import { RoomJSON } from "commons/Backend-types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Platform, StyleSheet } from "react-native";
import Dialog from "react-native-dialog";
import { Socket } from "socket.io-client";

import Alert from "./Alert";
import Button from "./Button";
import { Text, View } from "./Themed";
import RoomPlayer from "./player/RoomPlayer";
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
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const userProfile = useUserProfile();

  const url: URL = new URL("/room/" + room.id, getApiUrl());
  const isOnMobile = Platform.OS !== "web";

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

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("queue:update", (data: RoomJSON) => setLiveRoom(data));
    socket.on("room:end", () => {
      router.replace("/rooms");
      Alert.alert("Cette salle d'écoute vient d'être supprimée");
    });
  }, [socket]);

  const leaveRoom = () => {
    setShowDialog(false);
    Alert.alert("Vous avez quitté la salle :p");
  };

  return (
    <>
      {room && liveRoom && socket && (
        <>
          <View style={headerStyles.headerContainer}>
            <View style={headerStyles.titleContainer}>
              <Text style={headerStyles.headerTitle}>Salle "{room.name}"</Text>
              <MaterialIcons
                name="meeting-room"
                size={28}
                color="black"
                onPress={() => setShowDialog(true)}
              />
            </View>
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
          {isOnMobile && (
            <Dialog.Container visible={showDialog}>
              <Dialog.Title>Quitter la salle</Dialog.Title>
              <Dialog.Description>
                Voulez-vous vraiment quitter la salle d'écoute ?
              </Dialog.Description>
              <Dialog.Button label="Non" onPress={() => setShowDialog(false)} />
              <Dialog.Button label="Oui" onPress={leaveRoom} />
            </Dialog.Container>
          )}
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
