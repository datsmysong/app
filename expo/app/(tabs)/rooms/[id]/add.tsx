import { JSONTrack } from "commons/backend-types";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";

import Button from "../../../../components/Button";
import CustomTextInput from "../../../../components/CustomTextInput";
import HView from "../../../../components/HView";
import { Text, View } from "../../../../components/Themed";
import TrackItem from "../../../../components/room/TrackItem";
import SocketIo from "../../../../lib/socketio";

export default function AddTrack() {
  const { id } = useLocalSearchParams() as { id: string };

  const [value, setValue] = useState("");
  const [result, setResult] = useState<JSONTrack[]>([]);

  const addMusic = () => {
    SocketIo.getInstance()
      .getSocket(`/room/${id}`)
      .emit("queue:add", new URL(value).toString());

    router.back();
  };

  const searchMusic = () => {
    const updateList = (result: JSONTrack[]) => {
      console.log(result);
      setResult(result);
    };

    SocketIo.getInstance()
      .getSocket(`/room/${id}`)
      .emit("utils:search", value, updateList);
  };

  return (
    <View>
      <HView>
        <CustomTextInput
          placeholder="Recherche"
          onChangeText={setValue}
          style={{ flexShrink: 0, flexGrow: 1, minWidth: 0, flexBasis: 0 }}
        />
        <Button onPress={addMusic}>Ajouter</Button>
        <Button onPress={searchMusic}>Chercher</Button>
      </HView>
      <FlatList
        data={result}
        renderItem={({ item, index }) => (
          <TrackItem track={item} index={index} roomId={id} isMenuDisabled />
        )}
      />
    </View>
  );
}
