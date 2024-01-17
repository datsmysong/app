import { Server, Socket } from "socket.io";

const updateState =
  (io: Server, socket: Socket) => async (message: any, done: any) => {
    console.log("updateState", message);
    const playingMusic = message.data.playingMusic;
    
    socket.emit("stateUpdated", playingMusic);
  };
export default updateState;
