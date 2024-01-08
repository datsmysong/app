import { useLocalSearchParams } from "expo-router";
import ActiveRoom from "../../../components/ActiveRoom";
import useRoom from "../../../lib/useRoom";

export default function Room() {
  const search = useLocalSearchParams();
  const roomId = search.id as string;
  const room = useRoom(roomId);

  if (room instanceof ActiveRoom) {
    return <ActiveRoom roomId={room.id} />;
  }
}
