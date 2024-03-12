import { JSONTrack } from "commons/backend-types";
import { ErrorBoundaryProps, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

import { useWebSocket } from "./_layout";
import Alert from "../../../../components/Alert";
import Button from "../../../../components/Button";
import CustomTextInput from "../../../../components/CustomTextInput";
import { Text } from "../../../../components/Themed";
import Library from "../../../../components/room/Library";
import SearchedTrackItem from "../../../../components/room/SearchedTrackItem";
import { useDebounce } from "../../../../lib/useDebounce";

export default function AddTrack() {
  const { id } = useLocalSearchParams();

  const [searchBar, setSearchBar] = useState("");
  const [result, setResult] = useState<JSONTrack[] | null>(null);
  const socket = useWebSocket();

  const debouncedSearchMusic = useDebounce(searchBar, 300);

  useEffect(() => {
    if (debouncedSearchMusic) searchMusic();
  }, [debouncedSearchMusic]);

  const addMusic = (value: string) => {
    if (!socket) return;
    try {
      socket.emit("queue:add", new URL(value).toString());
    } catch {
      setSearchBar("");
      setResult(null);
      Alert.alert("Erreur, impossible d'ajouter la musique");
    }
    if (router.canGoBack()) return router.back();
    const url = ("/(tabs)/rooms/" + id) as any;
    router.push(url);
  };

  const searchMusic = () => {
    setResult(null);
    if (!socket) return;
    socket.emit("utils:search", searchBar, (result: JSONTrack[]) => {
      setResult(result);
    });
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
        autofocus
      />
      {searchBar ? (
        result === null ? (
          <Text>Loading...</Text>
        ) : result.length === 0 ? (
          <Text>Aucun résultat</Text>
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
