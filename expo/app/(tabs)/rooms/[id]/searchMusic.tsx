import { JSONTrack } from "commons/backend-types";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, ScrollView } from "react-native";

import CustomTextInput from "../../../../components/CustomTextInput";
import Library from "../../../../components/room/Library";
import SearchedTrackItem from "../../../../components/room/SearchedTrackItem";
import SocketIo from "../../../../lib/socketio";
import { useDebounce } from "../../../../lib/useDebounce";

const mockTracks: JSONTrack[] = [
  {
    title: "Le titre",
    artistsName: "Les artistes",
    albumName: "L'album",
    imgUrl: "https://i.scdn.co/image/ab67616d00001e02fea24c51add2ba6e1f4af25a",
    url: "http1s",
    duration: 120,
  },
  {
    title: "Le titre",
    artistsName: "Les artistes",
    albumName: "L'album",
    imgUrl: "https://i.scdn.co/image/ab67616d00001e02fea24c51add2ba6e1f4af25a",
    url: "http2s",
    duration: 120,
  },
  {
    title: "Le titre",
    artistsName: "Les artistes",
    albumName: "L'album",
    imgUrl: "https://i.scdn.co/image/ab67616d00001e02fea24c51add2ba6e1f4af25a",
    url: "http3s",
    duration: 120,
  },
  {
    title: "Le titre",
    artistsName: "Les artistes",
    albumName: "L'album",
    imgUrl: "https://i.scdn.co/image/ab67616d00001e02fea24c51add2ba6e1f4af25a",
    url: "http4s",
    duration: 120,
  },
];

export default function AddTrack() {
  const { id } = useLocalSearchParams() as { id: string };

  const [value, setValue] = useState("");
  const [result, setResult] = useState<JSONTrack[]>([]);

  const debouncedSearchMusic = useDebounce(value, 1000);

  useEffect(() => {
    if (debouncedSearchMusic) searchMusic();
  }, [debouncedSearchMusic]);

  const addMusic = (value: string) => {
    SocketIo.getInstance()
      .getSocket(`/room/${id}`)
      .emit("queue:add", new URL(value).toString());

    router.back();
  };

  const searchMusic = () => {
    console.log("Seach ", value);
    setResult(mockTracks);

    // SocketIo.getInstance()
    //   .getSocket(`/room/${id}`)
    //   .emit("utils:search", value, (result: JSONTrack[]) => setResult(result));
  };

  return (
    <ScrollView
      style={{
        paddingHorizontal: 24,
        paddingTop: 24,
      }}
    >
      <CustomTextInput
        onChangeText={setValue}
        placeholder="Rechercher"
        onSubmitEditing={searchMusic}
        style={{ marginBottom: 24 }}
      />
      {value ? (
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
      ) : (
        <Library />
      )}
    </ScrollView>
  );
}
