import {Socket} from "socket.io";
import Room from "../Room";
import MusicStorage from "../MusicStorage";

export default function RoomIO(socket: Socket/*, next: (err?: ExtendedError) => void*/) {
  let namespace = socket.nsp;
  /*regex uuid [0-9a-f]{8}-([0-9a-f]{4}){3}-[0-9a-f]{12}*/
  let pattern = /^\/room\/(.*)$/
  console.log(namespace.name)

  // if (!pattern.test(namespace.name)) {
  //     //next()
  //     socket.disconnect()
  //     return
  // }

  // remove first element which contains the whole tested string, then get the first group (surround with parenthesis)

  let rawUrlMatchGroups = pattern.exec(namespace.name);
  if (rawUrlMatchGroups === null) {
    socket.disconnect()
    return
  }
  let activeRoomId = rawUrlMatchGroups.slice(1)[0] as string

  let room = MusicStorage.getMusicStorage().getRoom(activeRoomId)
  if (room === null) {
    socket.disconnect()
    return;
  }

  socket.emit("queue:update"/*"playlist"*/, Room.toJSON(room));

  socket.onAny(async (event: string, urlRaw: string/*, callback: (arg0: any) => void*/) => {
    switch (event) {
      case "queue:add":
        await room?.add(urlRaw)
        break;
      case "queue:remove":
        room?.remove(urlRaw)
        break;
    }

    // TODO replace by callback and remove emit here : "Acknowledgements" CANCELED
    // TODO replace "socketio-client" by "playlist"

    // TODO ferbach : actionReducer pattern
    socket.nsp.emit("queue:update", Room.toJSON(room));
    // callback(Room.toJSON(room))
  })
}