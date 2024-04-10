import React, { useEffect, useState } from "react";
import { FlatList, Pressable } from "react-native";

import { useWebSocket } from "./_layout";
import { Text } from "../../../../components/Tamed";

export default function Playlist(props: { playlistId: string }) {
  const [tracks, setTracks] = useState([]);

  const socket = useWebSocket();
  useEffect(() => {
    socket?.emit("user:playlists", props.playlistId, setTracks);
  }, [socket]);

  return (
    <FlatList
      data={tracks}
      renderItem={({ item }) => (
        <Pressable onPress={() => alert(item)}>
          <Text>{item}</Text>
        </Pressable>
      )}
    />
  );
}
