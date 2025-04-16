import { useLocalSearchParams } from "expo-router";

import RoomHistory from "../../../../components/RoomHistory";
import { View } from "../../../../components/Themed";

export interface MusicRoomParams {
  id: string;
}

export default function History() {
  const { id } = useLocalSearchParams() as MusicRoomParams;

  return (
    <View>
      <RoomHistory roomId={id} />
    </View>
  );
}
