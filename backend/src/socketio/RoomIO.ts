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

    // Fetch participant of room at every connection for now
    room?.updateParticipant();

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
      sendQueueUpdated();
    });

    // We should check the origin of the request to prevent anyone that isn't the host from removing anything
    socket.on("queue:remove", async (index: number) => {
      if (Number.isSafeInteger(index)) {
        if (index >= 0 && index < room.size()) {
          await room.removeWithIndex(index);
        }
      }
      sendQueueUpdated();
    });

    socket.on("queue:removeLink", async (link) => {
      await room.removeWithLink(link);
      sendQueueUpdated();
    });

    socket.on("queue:voteSkip", async (index, userId) => {
      const addedVote = room.addVoteSkip(index, userId); // all user are not notified of the vote skip
      if (!addedVote) return;

      const skipped = await room.verifyVoteSkip(index);
      if (skipped === "queueTrackSkiped") sendQueueUpdated();
      if (skipped === "actualTrackSkiped") {
        const remote = room.getRemote();
        if (!remote) return;
        updatePlaybackState(socket, remote);
      }
    });

    const sendQueueUpdated = () => {
      roomSocket.emit("queue:update", Room.toJSON(room));
    };

    socket.on("player:playTrack", async (trackId) => {
      const remote = room.getRemote();
      if (remote === null) return;

      const response = await remote.playTrack(trackId);
      socket.emit("player:playTrack", response);

      if (!response.error) await updatePlaybackState(socket, remote);
    });

    socket.on("player:pause", async () => {
      const remote = room.getRemote();
      if (remote === null) return;

      const response = await remote.pause();
      socket.emit("player:pause", response);

      if (!response.error) await updatePlaybackState(socket, remote);
    });

    socket.on("player:play", async () => {
      const remote = room.getRemote();
      if (remote === null) return;

      const response = await remote.play();
      if (!response.error) await updatePlaybackState(socket, remote);

      socket.emit("player:play", response);
    });

    socket.on("player:skip", async () => {
      const remote = room.getRemote();
      if (remote === null) return;

      const response = await remote.next();
      socket.emit("player:skip", response);

      if (!response.error) await updatePlaybackState(socket, remote);
    });

    socket.on("player:previous", async () => {
      const remote = room.getRemote();
      if (remote === null) return;

      const response = await remote.previous();
      socket.emit("player:previous", response);

      if (!response.error) await updatePlaybackState(socket, remote);
    });

    socket.on("player:setVolume", async (volume) => {
      const remote = room.getRemote();
      if (remote === null) return;

      const response = await remote.setVolume(volume);
      socket.emit("player:setVolume", response);
    });

    socket.on("player:seekTo", async (position) => {
      const remote = room.getRemote();
      if (remote === null) return;

      const response = await remote.seekTo(position);
      socket.emit("player:seekTo", response);

      if (!response.error) await updatePlaybackState(socket, remote);
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
