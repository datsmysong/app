import { Socket } from "socket.io";

const updateState = (socket: Socket) => async (message: any, done: any) => {
  const playingMusic = message.data.playingMusic;
  socket.nsp.emit("player:stateUpdated", playingMusic);
};
export default updateState;
