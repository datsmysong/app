// TODO: Implement the handler
// When the client sends a "updateState" message, the handler should call the updateState function

import { Server, Socket } from "socket.io";
import updateState from "./updateState";

export default function registerHandlers(io: Server, socket: Socket) {
  socket.on("stateUpdated", updateState(io, socket));
}