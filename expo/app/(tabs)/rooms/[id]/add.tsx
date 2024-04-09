import { JSONTrack } from "commons/backend-types";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

import { useWebSocket } from "./_layout";
import Alert from "../../../../components/Alert";
import CustomTextInput from "../../../../components/CustomTextInput";
import { Text } from "../../../../components/Themed";
import Library from "../../../../components/room/Library";
import SearchedTrackItem from "../../../../components/room/SearchedTrackItem";
import { useDebounce } from "../../../../lib/useDebounce";
import { useUserProfile } from "../../../../lib/userProfile";

export default function AddTrack() {
  const { id } = useLocalSearchParams();
  const userProfile = useUserProfile();

  const [searchBar, setSearchBar] = useState("");
  const [result, setResult] = useState<JSONTrack[] | null>(null);
  const socket = useWebSocket();

  const debouncedSearchMusic = useDebounce(searchBar, 300);

  useEffect(() => {
    if (debouncedSearchMusic) searchMusic();
  }, [debouncedSearchMusic]);

  const addMusic = (url: string) => {
    if (!socket) return;
    if (!userProfile)
      return Alert.alert(
        "Les utilisateurs anonymes ne sont pas autorisés à accéder à cette fonctionnalité. Veuillez vous connecter."
      );
    try {
      socket.emit(
        "queue:add",
        new URL(url).toString(),
        userProfile.user_profile_id
      );
    } catch {
      setSearchBar("");
      setResult(null);
      Alert.alert("Erreur, impossible d'ajouter la musique");
    }
    if (router.canGoBack()) return router.back();
    const path = ("/(tabs)/rooms/" + id) as any;
    router.push(path);
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
