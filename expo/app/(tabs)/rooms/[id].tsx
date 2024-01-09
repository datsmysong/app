import { useLocalSearchParams } from "expo-router";
import ActiveRoomView from "../../../components/ActiveRoomView";
import { Text } from "../../../components/Tamed";
import { isActiveRoom, isRoom } from "../../../lib/types";
import useRoom from "../../../lib/useRoom";

export default function RoomView() {
  const search = useLocalSearchParams();
  const roomId = search.id as string;
  const room = useRoom(roomId);

  if (isActiveRoom(room)) {
    return <ActiveRoomView roomId={room.id} />;
  } else if (isRoom(room)) {
    //return <RoomHistory room={room} />;
    return <Text>TODO</Text>
  }
}
