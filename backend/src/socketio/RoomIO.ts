import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "commons/socket.io-types";
import { Socket } from "socket.io";
import RoomStorage from "../RoomStorage";
import Room from "./Room";

const roomStorage = RoomStorage.getRoomStorage();

export default function RoomIO(
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents
  > /*, next: (err?: ExtendedError) => void*/
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
  // TODO: Actually check if the connecting socket is the host
  const isHostSocket = true;

  async function registerHandlers() {
    const hostSocket = isHostSocket ? socket : null;
    const room = await roomStorage.roomFromUuid(activeRoomId, hostSocket);

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

    // We should check the origin of the request to prevent anyone that isn't the host from removing anything
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

    socket.on("queue:removeLink", async (link) => {
      await room.removeWithLink(link);
      roomSocket.emit("queue:update", Room.toJSON(room));
    });

    socket.on("player:playTrack", async (trackId) => {
      const remote = room.getRemote();
      if (remote === null) return;

      remote.playTrack(trackId);
    });

    socket.on("player:getQueue", async () => {
      const remote = room.getRemote();
      if (remote === null) return;

      const queue = await remote.getQueue();
      socket.emit("player:getQueue", queue);
    });

    socket.on("player:pause", async () => {
      const remote = room.getRemote();
      if (remote === null) return;

      remote.pause();
    });

    socket.on("player:play", async () => {
      const remote = room.getRemote();
      if (remote === null) return;

      remote.play();
    });

    socket.on("player:skip", async () => {
      const remote = room.getRemote();
      if (remote === null) return;

      remote.next();
    });

    socket.on("player:previous", async () => {
      const remote = room.getRemote();
      if (remote === null) return;

      remote.previous();
    });

    socket.on("player:setVolume", async (volume) => {
      const remote = room.getRemote();
      if (remote === null) return;

      remote.setVolume(volume);
    });

    socket.on("player:seekTo", async (position) => {
      const remote = room.getRemote();
      if (remote === null) return;

      remote.seekTo(position);
    });

    /**
     * When we receive the new playback state, we send it to all clients
     */
    socket.on("player:updatePlaybackState", async (playbackState) => {
      socket.nsp.emit("player:updatePlaybackState", playbackState);
    });
  }

  registerHandlers();
}
