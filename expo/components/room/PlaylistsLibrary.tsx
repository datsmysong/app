import { JSONTrack, Playlist } from "commons/backend-types";
import { Image } from "expo-image";
import { router } from "expo-router";
import CaretRight from "phosphor-react-native/src/icons/CaretRight";
import { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet } from "react-native";

import { useWebSocket } from "../../app/(tabs)/rooms/[id]/_layout";
import { useSupabaseUserHook } from "../../lib/useSupabaseUser";
import { Text, View } from "../Tamed";
import SearchedTrackItem from "../room/SearchedTrackItem";

export default function PlaylistsLibrary() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const user = useSupabaseUserHook();
  const socket = useWebSocket();
  useEffect(() => {
    console.log(user);
    const spotifyUser = user?.identities?.filter(
      (ptf) => ptf.provider === "spotify"
    )[0];
    socket?.emit("user:playlists", spotifyUser?.id, setPlaylists);
  }, [socket, user]);

  return (
    <>
      <Text style={styles.title}>Mes playlists ({playlists.length})</Text>
      <FlatList
        data={playlists}
        renderItem={({ item }) => <PlaylistsItem playlist={item} />}
      />
    </>
  );
}

function PlaylistsItem(props: { playlist: Playlist }) {
  const playlist = props.playlist;

  const [showTracks, setShowTracks] = useState(false);
  const [tracks, setTracks] = useState<JSONTrack[]>([]);

  const socket = useWebSocket();

  useEffect(() => {
    if (showTracks)
      socket?.emit("user:playlistTrack", playlist.playlistId, setTracks);
  }, [socket, showTracks]);

  return (
    <View>
      <Pressable
        onPress={() => setShowTracks(!showTracks)}
        style={styles.playlistHeader}
      >
        <Image source={playlist.imageUrl} />
        <Text style={styles.playlistHeaderInner}>{playlist.name}</Text>
        <CaretRight
        //name={`caret-${showTracks ? "right" : "down"}`}
        //style={styles.playlistHeaderInner}
        />
      </Pressable>
      <Modal visible={showTracks} transparent>
        <PlaylistTracks tracks={tracks} />
      </Modal>
    </View>
  );
}

function PlaylistTracks(props: { tracks: JSONTrack[] }) {
  const socket = useWebSocket();

  return (
    <FlatList
      data={props.tracks}
      renderItem={({ item }) => {
        return (
          <View style={{ paddingLeft: 50 }}>
            <SearchedTrackItem
              track={item}
              handleAddMusic={() => {
                socket?.emit("queue:add", new URL(item.url).toString());

                router.back();
              }}
            />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  playlistHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  playlistHeaderInner: {
    fontFamily: "Outfit-Bold",
    paddingLeft: 10,
    fontSize: 15,
  },
  title: {
    color: "#000",
    fontFamily: "Outfit-Bold",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "700",
    letterSpacing: 0.48,
  },
});
