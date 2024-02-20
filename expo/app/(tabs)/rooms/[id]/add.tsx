import { JSONTrack } from "commons/backend-types";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList } from "react-native";

import Button from "../../../../components/Button";
import CustomTextInput from "../../../../components/CustomTextInput";
import HView from "../../../../components/HView";
import { View } from "../../../../components/Themed";
import TrackItem from "../../../../components/room/TrackItem";
import TrackItemAdd from "../../../../components/room/TrackItemAdd";
import SocketIo from "../../../../lib/socketio";

export default function AddTrack() {
  const { id } = useLocalSearchParams() as { id: string };

  const [value, setValue] = useState("");
  const [result, setResult] = useState<JSONTrack[]>([]);

  const socket = SocketIo.getInstance().getSocket(`/room/${id}`);

  const addMusic = (value: string) => {
    socket.emit("queue:add", new URL(value).toString());

    router.back();
  };

  const searchMusic = () => {
    const updateList = (result: JSONTrack[]) => {
      console.log(result);
      setResult(result);
    };

    socket.emit("utils:search", value, updateList);
  };

  return (
    <View>
      <HView>
        <CustomTextInput
          placeholder="Recherche"
          onChangeText={setValue}
          style={{ flexShrink: 0, flexGrow: 1, minWidth: 0, flexBasis: 0 }}
        />
        <Button onPress={() => addMusic(value)}>Ajouter</Button>
        <Button onPress={searchMusic}>Chercher</Button>
      </HView>
      <FlatList
        data={result}
        renderItem={({ item, index }) => (
          <TrackItemAdd
            track={item}
            index={index}
            roomId={id}
            action={addMusic}
          />
        )}
      />
    </View>
  );
}
