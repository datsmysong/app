import { JSONTrack } from "commons/backend-types";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

import { useWebSocket } from "./_layout";
import CustomTextInput from "../../../../components/CustomTextInput";
import { Text } from "../../../../components/Themed";
import Library from "../../../../components/room/Library";
import SearchedTrackItem from "../../../../components/room/SearchedTrackItem";
import SocketIo from "../../../../lib/socketio";
import { useDebounce } from "../../../../lib/useDebounce";

export default function AddTrack() {
  const { id } = useLocalSearchParams() as { id: string };

  const [searchBar, setSearchBar] = useState("");
  const [result, setResult] = useState<JSONTrack[]>([]);
  const socket = useWebSocket();

  const debouncedSearchMusic = useDebounce(searchBar, 300);

  useEffect(() => {
    if (debouncedSearchMusic) searchMusic();
  }, [debouncedSearchMusic]);

  // const socket = SocketIo.getInstance().getSocket(`/room/${id}`);

  const addMusic = (value: string) => {
    SocketIo.getInstance()
      .getSocket(`/room/${id}`)
      .emit("queue:add", new URL(value).toString());

    router.back();
  };

  const searchMusic = () => {
    if (!socket) return;
    socket.emit("utils:search", searchBar, (result: JSONTrack[]) =>
      setResult(result)
    );
  };

  return (
    <View
      style={{
        paddingHorizontal: 24,
        paddingTop: 24,
        flex: 1,
        flexDirection: "column",
      }}
    >
      <CustomTextInput
        onChangeText={setSearchBar}
        placeholder="Rechercher"
        onSubmitEditing={searchMusic}
        style={{ marginBottom: 24 }}
      />
      {searchBar ? (
        result.length === 0 ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={result}
            renderItem={({ item }) => (
              <SearchedTrackItem
                track={item}
                handleAddMusic={() => {
                  addMusic(item.url);
                }}
              />
            )}
            keyExtractor={(item) => item.url}
          />
        )
      ) : (
        <Library />
      )}
    </View>
  );
}
