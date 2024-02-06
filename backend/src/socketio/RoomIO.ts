import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "commons/socket.io-types";
import { Socket } from "socket.io";
import RoomStorage from "../RoomStorage";
import Remote from "../musicplatform/remotes/Remote";
import Room from "./Room";
import { JSONTrack } from "commons/backend-types";

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

  // if (!pattern.test(namespace.name)) {
  //     //next()
  //     socket.disconnect()
  //     return
  // }

  // remove a first element which contains the whole tested string, then get the first group (surround with parenthesis)

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
    roomSocket.emit("queue:update", Room.toJSON(room));

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

    socket.on("queue:voteSkip", async (id, userId) => {
      if (id === -1) {
        console.log("vote skip musique actuelle");
        return;
      }
      room.addVoteSkip(id, userId);
    });

    socket.on("player:playTrack", async (trackId) => {
      const remote = room.getRemote();
      if (remote === null) return;

      await remote.playTrack(trackId);
      await updatePlaybackState(socket, remote);
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

      await remote.pause();
      await updatePlaybackState(socket, remote);
    });

    socket.on("player:play", async () => {
      const remote = room.getRemote();
      if (remote === null) return;

      await remote.play();
      await updatePlaybackState(socket, remote);
    });

    socket.on("player:skip", async () => {
      const remote = room.getRemote();
      if (remote === null) return;

      await remote.next();
      await updatePlaybackState(socket, remote);
    });

    socket.on("player:previous", async () => {
      const remote = room.getRemote();
      if (remote === null) return;

      await remote.previous();
      await updatePlaybackState(socket, remote);
    });

    socket.on("player:setVolume", async (volume) => {
      const remote = room.getRemote();
      if (remote === null) return;

      remote.setVolume(volume);
    });

    socket.on("player:seekTo", async (position) => {
      const remote = room.getRemote();
      if (remote === null) return;

      await remote.seekTo(position);
      await updatePlaybackState(socket, remote);
    });

    /**
     * When we receive the new playback state, we send it to all clients
     */
    socket.on("player:updatePlaybackState", async (playbackState) => {
      socket.nsp.emit("player:updatePlaybackState", playbackState);
    });

    socket.on(
      "utils:search",
      async (input: string, resultCallback: (t: JSONTrack[]) => void) => {
        const data = await room.getStreamingService().searchTrack(input);

        resultCallback(data);
      }
    );
  }

  registerHandlers();
}

async function updatePlaybackState(socket: Socket, remote: Remote) {
  setTimeout(async () => {
    const playbackState = await remote.getPlaybackState();
    socket.nsp.emit("player:updatePlaybackState", playbackState);
  }, 100);
}
