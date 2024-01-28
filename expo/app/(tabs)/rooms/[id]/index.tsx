import { RoomJSON } from "commons/Backend-types";
import { ActiveRoom } from "commons/database-types-utils";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet } from "react-native";

import Alert from "../../../../components/Alert";
import Button from "../../../../components/Button";
import { Text, View } from "../../../../components/Themed";
import TrackItem from "../../../../components/room/TrackItem";
import { getApiUrl } from "../../../../lib/apiUrl";
import SocketIo from "../../../../lib/socketio";
import { supabase } from "../../../../lib/supabase";

// TODO delete soon
export interface MusicRoomParams {
  id: string;
}

const generatedInvitationLink = (currentUrl: string, roomCode: string) => {
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

// TODO socket io which refresh playlist on live
export default function MusicRoom() {
  const { id } = useLocalSearchParams() as MusicRoomParams;
  const currentPageLink = Linking.useURL();

  const [room, setRoom] = useState<ActiveRoom>();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const [queue, setQueue] = useState<RoomJSON>();

  const url: URL = new URL("/room/" + id, getApiUrl());

  const handleShare = async () => {
    if (!currentPageLink) {
      Alert.alert("Aucun lien n'a été retourné");
      return;
    }

    const roomCode = room?.code ?? "";
    const invitationLink = generatedInvitationLink(currentPageLink, roomCode);

    await Clipboard.setStringAsync(invitationLink);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();
      if (error) {
        Alert.alert(
          "Une erreur est survenue lors de la récupération de la salle"
        );
        return;
      }
      setRoom(data);
    };

    fetchData();

    // unused for the moment
    // fetch(url)
    //     .then(res => res.json())
    //     .then((data: ActiveRoomSkeleton) => setData(data))

    SocketIo.getInstance()
      .getSocket(url.pathname)
      .on("queue:update", (data: RoomJSON) => setQueue(data));
  }, []);

  return (
    <>
      {room && (
        <>
          <View style={headerStyles.headerContainer}>
            <Text style={headerStyles.title}>Salle "{room.name}"</Text>
            <View style={headerStyles.buttonContainer}>
              {isCopied ? (
                <Button block prependIcon="check" onPress={handleShare}>
                  Lien copié
                </Button>
              ) : (
                <Button block onPress={handleShare}>
                  Partager
                </Button>
              )}
            </View>
            <View style={styles.container}>
              <Text style={styles.title}>
                File d'attente ({queue?.tracks.length})
              </Text>
              <FlatList
                style={styles.list}
                data={queue?.tracks}
                renderItem={({ item, index }) => (
                  <TrackItem track={item} index={index + 1} />
                )}
              />
            </View>
          </View>
          <Link href={`/rooms/${room.id}/add`} asChild>
            <Pressable style={floatingStyle.container}>
              <Text style={floatingStyle.text}>+</Text>
            </Pressable>
          </Link>
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
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
});

const styles = StyleSheet.create({
  container: {
    // marginVertical: 32,
    // marginHorizontal: 20,
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
