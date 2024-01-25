import { ActiveRoom } from "commons/database-types-utils";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import Alert from "../../../components/Alert";
import {Button} from "../../../components/Button";
import { supabase } from "../../../lib/supabase";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { JSONTrack, RoomJSON } from "commons/Backend-types";
import { Image } from "expo-image";
import { RoomJSON } from "commons/Backend-types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, ViewProps } from "react-native";

import { Text, View } from "../../../components/Themed";
import TrackItem from "../../../components/room/TrackItem";
import { getApiUrl } from "../../../lib/apiUrl";
import SocketIo from "../../../lib/socketio";

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
export default function musicRoom() {
  const { id } = useLocalSearchParams() as MusicRoomParams;
  const currentPageLink = Linking.useURL();

  const [room, setRoom] = useState<ActiveRoom>();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const [data, setData] = useState<RoomJSON>();

  const url: URL = new URL("/room/" + activeRoomId, getApiUrl());

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
  }, []);

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

    // unused for the moment
    // fetch(url)
    //     .then(res => res.json())
    //     .then((data: ActiveRoomSkeleton) => setData(data))

    SocketIo.getInstance()
      .getSocket(url.pathname)
      .on("queue:update", (data: RoomJSON) => setData(data));
  };

  const url: URL = new URL("/room/" + activeRoomId, ENDPOINT);

  return (
    <View style={headerStyles.headerContainer}>
      {room && (
        <View>
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
              File d'attente ({data?.tracks.length /* ?? 0*/})
            </Text>
            <FlatList
              style={styles.list}
              data={data?.tracks}
              renderItem={({ item, index }) => (
                <TrackItem track={item} index={index + 1} />
              )}
            />
          </View>
        </View>
      )}
    </View>
  );
}

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
