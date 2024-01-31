import { Socket } from "socket.io";
import RoomStorage from "../RoomStorage";
import Room from "../room";

export default function RoomIO(
  socket: Socket /*, next: (err?: ExtendedError) => void*/
) {
  const roomSocket = socket.nsp;
  /*regex uuid [0-9a-f]{8}-([0-9a-f]{4}){3}-[0-9a-f]{12}*/
  const pattern = /^\/room\/(.*)$/;
  console.log(roomSocket.name);

  // if (!pattern.test(namespace.name)) {
  //     //next()
  //     socket.disconnect()
  //     return
  // }

  // remove first element which contains the whole tested string, then get the first group (surround with parenthesis)

  const rawUrlMatchGroups = pattern.exec(roomSocket.name);
  if (rawUrlMatchGroups === null) {
    socket.disconnect();
    return;
  }
  const activeRoomId = rawUrlMatchGroups.slice(1)[0];

  (async () => {
    const room = await RoomStorage.getRoomStorage().roomFromUuid(activeRoomId);
    if (room === null) {
      socket.disconnect();
      return;
    }

    /**
     * TODO
     *
     * Instead of sending the whole state, we should only send the actions taken by other users
     * so that the client can update its state accordingly
     */

    socket.emit("queue:update", Room.toJSON(room));

    socket.on("queue:add", async (params: string) => {
      await room.add(params);
      roomSocket.emit("queue:update", Room.toJSON(room));
    });
    socket.on("queue:remove", async (params: string) => {
      const number = Number.parseInt(params);
      if (Number.isSafeInteger(number)) {
        if (number >= 0 && number < room.size()) {
          await room.removeWithIndex(number);
        }
      } else {
        await room.removeWithLink(params);
      }
      roomSocket.emit("queue:update", Room.toJSON(room));
    });
    socket.on("queue:removeLink", async (params: string) => {
      await room.removeWithLink(params);
      roomSocket.emit("queue:update", Room.toJSON(room));
    });
  })();
}
