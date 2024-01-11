import { useLocalSearchParams } from "expo-router";
import ActiveRoomView from "../../../components/ActiveRoomView";
import { isActiveRoom, isRoom } from "../../../lib/types";
import useRoom from "../../../lib/useRoom";
import { Text } from "react-native";
import { View } from "../../../components/Tamed";

export default function RoomView() {
  const search = useLocalSearchParams();
  const roomId = search.id as string;
  const room = useRoom(roomId);

  console.log("room", room);
  console.log("isActiveRoom(room)", isActiveRoom(room));
  console.log("isRoom(room)", isRoom(room));

  return (
    <View>
      {isActiveRoom(room) && <ActiveRoomView room={room} />}
      {isRoom(room) && <View></View>}
      {!room && (
        <Text>
          Vous semblez perdu, la salle à laquelle vous essayez d'accéder
          n'existe pas, ou vous n'êtes pas autorisé à y accéder.
        </Text>
      )}
    </View>
  );
}
