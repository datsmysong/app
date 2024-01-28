import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

import Button from "../../../../components/Button";
import HView from "../../../../components/HView";
import { Text } from "../../../../components/Themed";
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
      <TextInput
        placeholder="URL Spotify"
        onChangeText={setValue}
        style={style.input}
      />
      <Button onPress={addMusic}>
        <Text style={style.text}>Ajouter</Text>
      </Button>
    </HView>
  );
}

const style = StyleSheet.create({
  input: {
    flexGrow: 1,
    padding: 20,
    borderRadius: 100,
    borderWidth: 1,
  },
  text: {
    color: "#FFF",
  },
});
