import { Server, Socket } from "socket.io";

const updateState =
  (io: Server, socket: Socket) => async (message: any, done: any) => {
    const playingMusic = message.data.playingMusic;
    socket.emit("stateUpdated", playingMusic);
  };
export default updateState;
