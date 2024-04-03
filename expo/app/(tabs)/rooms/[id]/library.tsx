import FontAwesome from "@expo/vector-icons/FontAwesome";
import { JSONTrack, Playlist } from "commons/backend-types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";

import { useWebSocket } from "./_layout";
import { Text, View } from "../../../../components/Tamed";
import SearchedTrackItem from "../../../../components/room/SearchedTrackItem";
import { useSupabaseUserHook } from "../../../../lib/useSupabaseUser";

export default function Library() {
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
    <FlatList
      data={playlists}
      renderItem={({ item }) => <Item playlist={item} />}
    />
  );
}

function Item(props: { playlist: Playlist }) {
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
        <FontAwesome
          name={`arrow-${showTracks ? "down" : "up"}`}
          style={styles.playlistHeaderInner}
        />
        <Text style={styles.playlistHeaderInner}>{playlist.name}</Text>
      </Pressable>
      {showTracks && (
        <FlatList
          data={tracks}
          renderItem={({ item }) => {
            return (
              <View style={{ paddingLeft: 50 }}>
                <SearchedTrackItem
                  track={item}
                  handleAddMusic={() => {
                    socket?.emit("queue:add", new URL(item.url).toString());

                    router.back();
                    router.back();
                  }}
                />
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  playlistHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  playlistHeaderInner: {
    fontFamily: "Outfit-Bold",
    paddingLeft: 10,
    fontSize: 15,
  },
});
