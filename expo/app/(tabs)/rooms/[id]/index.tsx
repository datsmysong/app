import { useLocalSearchParams } from "expo-router";

import ActiveRoomView from "../../../../components/ActiveRoomView";
import RoomHistory from "../../../../components/RoomHistory";
import { Text, View } from "../../../../components/Themed";
import useRoom from "../../../../lib/useRoom";

export default function RoomView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const room = useRoom(id);

  return (
    <View style={{ flex: 1, height: "100%" }}>
      {room && room.is_active && <ActiveRoomView room={room} />}
      {room && !room.is_active && <RoomHistory roomId={id} />}
      {!room && (
        <Text>
          Vous semblez perdu, la salle à laquelle vous essayez d'accéder
          n'existe pas, ou vous n'êtes pas autorisé à y accéder.
        </Text>
      )}
    </View>
  );
}
