import { RoomJSON } from "commons/backend-types";
import { Link, router } from "expo-router";
import DoorOpen from "phosphor-react-native/src/icons/DoorOpen";
import Gear from "phosphor-react-native/src/icons/Gear";
import Plus from "phosphor-react-native/src/icons/Plus";
import ThumbsDown from "phosphor-react-native/src/icons/ThumbsDown";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";

import Alert from "./Alert";
import Button from "./Button";
import Confirm from "./Confirm";
import { Text, View } from "./Themed";
import Warning from "./Warning";
import RoomPlayer from "./player/RoomPlayer";
import TrackItem from "./room/TrackItem";
import { useWebSocket } from "../app/(tabs)/rooms/[id]/_layout";
import { getApiUrl } from "../lib/apiUrl";
import { getRoomHostedByUser } from "../lib/room-utils";
import useNetworkStatus from "../lib/useNetworkStatus";
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
  const [voteSkipActualTrack, setVoteSkipActualTrack] =
    useState<boolean>(false);

  const userProfile = useUserProfile();

  const socket = useWebSocket();

  const url: URL = new URL("/room/" + room.id, getApiUrl());

  useEffect(() => {
    if (!userProfile || !room) return;

    const fetchHost = async () => {
      const { data } = await getRoomHostedByUser(room.id, userProfile, true);
      setIsHost((data?.length ?? 0) > 0);
    };

    fetchHost();
  }, [userProfile, room]);

  useEffect(() => {
    if (liveRoom && liveRoom.voteSkipActualTrack && userProfile) {
      setVoteSkipActualTrack(
        liveRoom.voteSkipActualTrack.includes(userProfile.user_profile_id)
      );
    }
  }, [liveRoom]);

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

  /**
   * Handle the dislike of a track
   * @param index -1 for actual track, otherwise the index of the track in the queue
   * @returns void
   */
  const handleDislike = (index: number) => {
    if (!socket || !userProfile) return;
    const userId = userProfile.user_profile_id;

    socket.emit("queue:voteSkip", index, userId);
    if (index === -1) {
      setVoteSkipActualTrack(!voteSkipActualTrack);
    }
  };

  const networkStatus = useNetworkStatus();

  return (
    <View
      style={{
        paddingVertical: 32,
        paddingHorizontal: 12,
        minHeight: "100%",
      }}
    >
      {!networkStatus && <Warning label="Réseau déconnecté" variant="error" />}

      {socket && !socket.connected && (
        <View
          style={{
            gap: 12,
            minHeight: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Connexion au serveur...</Text>
          <ActivityIndicator
            color="black"
            animating={!!networkStatus}
            size="large"
          />
        </View>
      )}
      {room && liveRoom && socket && socket.connected && (
        <>
          <View style={headerStyles.headerContainer}>
            <Text style={headerStyles.headerTitle}>"{room.name}"</Text>
            {isHost ? (
              <Link href={`/rooms/${room.id}/settings`}>
                <Gear size={32} color="black" />
              </Link>
            ) : (
              <Pressable onPress={showDialog} style={headerStyles.settingsIcon}>
                <DoorOpen size={28} color="black" />
              </Pressable>
            )}
            <View style={headerStyles.buttonContainer}>
              <Button block href={`/rooms/${room.id}/invite`}>
                Inviter des amis
              </Button>
            </View>
            <RoomPlayer socket={socket} room={room} />
            <Button
              onPress={() => {
                handleDislike(-1);
              }}
              prependIcon={<ThumbsDown />}
              size="small"
              type={voteSkipActualTrack ? "filled" : "outline"}
            >
              Voter pour passer
            </Button>
            <Text style={styles.title}>
              File d'attente ({liveRoom?.queue.length ?? 0})
            </Text>
            {liveRoom === undefined ? (
              <Text>Chargement...</Text>
            ) : (
              <FlatList
                style={styles.list}
                data={liveRoom.queue}
                keyExtractor={(item) => item.url}
                renderItem={({ item, index }) => (
                  <TrackItem
                    track={item}
                    index={index}
                    roomId={room.id}
                    isMenuDisabled={!isHost}
                    handleDislike={() => handleDislike(index)}
                    disliked={
                      (item.votes &&
                        item.votes.includes(
                          userProfile?.user_profile_id ?? ""
                        )) ||
                      false
                    }
                  />
                )}
              />
            )}
          </View>

          <Button
            icon={<Plus />}
            href={`/rooms/${room.id}/add`}
            style={floatingStyle.container}
          >
            Ajouter une musique
          </Button>
        </>
      )}
    </View>
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
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 10,
  },
  buttonContainer: {
    gap: 8,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 32,
    fontFamily: "Unbounded-Bold",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
    paddingVertical: 10,
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
