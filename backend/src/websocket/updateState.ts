// 1. Check that the client is the host
// 2. Update the playback state of the room
// 3. Send a "stateUpdated" message to all clients in the room
import { Server, Socket } from "socket.io";

let roomPlaybackState = {};

// 1. Check that the client is the host
const updateState =
  (io: Server, socket: Socket) => async (message: any, done: any) => {
    if (socket.id !== message.hostId) {
      return;
    }

    // 2. Update the playback state of the room
    roomPlaybackState = message.state;

    // 3. Send a "stateUpdated" message to all clients in the room
    io.to(message.roomId).emit("stateUpdated", message.state);
  };
export default updateState;
