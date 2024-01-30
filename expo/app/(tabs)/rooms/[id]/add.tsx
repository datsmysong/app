import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import Button from "../../../../components/Button";
import CustomTextInput from "../../../../components/CustomTextInput";
import HView from "../../../../components/HView";
import SocketIo from "../../../../lib/socketio";

export default function AddTrack() {
  const { id } = useLocalSearchParams();

  const [value, setValue] = useState("");

  const addMusic = () => {
    SocketIo.getInstance()
      .getSocket(`/room/${id}`)
      .emit("queue:add", new URL(value).toString());

    router.back();
  };

  return (
    <HView>
      <CustomTextInput
        placeholder="URL Spotify"
        onChangeText={setValue}
        style={{ flexShrink: 0, flexGrow: 1, minWidth: 0, flexBasis: 0 }}
      />
      <Button onPress={addMusic}>Ajouter</Button>
    </HView>
  );
}
