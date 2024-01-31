import { FastifyReply, FastifyRequest } from "fastify";
import RoomStorage from "../RoomStorage";
import Room from "../socketio/Room";

export interface QueryParams {
  id: string;
}

export default async function RoomIdGET(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { id: activeRoomId } = req.params as QueryParams;

  const roomStorage = RoomStorage.getRoomStorage();

  const room = roomStorage.getRoom(activeRoomId);
  if (room === null) {
    reply.code(404);
  }
  return reply.send(Room.toJSON(room));
}
