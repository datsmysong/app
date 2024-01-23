import { FastifyReply, FastifyRequest } from "fastify";
import Room from "../room";
import RoomStorage from "../RoomStorage";

export interface QueryParams {
  id: string;
}

export default async function RoomIdGET(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { id: activeRoomId } = req.params as QueryParams;

  const roomStorage = RoomStorage.getRoomStorage();
  // TODO DEBUG
  console.log(RoomStorage.getRoomStorage());

  // TODO MOCK
  let mock;
  if (activeRoomId === "mock") {
    mock = Room.newRoom(roomStorage);

    await mock.add(
      "https://open.spotify.com/intl-fr/track/4OUTQBwLBaTIUcgdI5PPt7?si=3aac1a9bcf3d4eac"
    );
    await mock.add(
      "https://open.spotify.com/intl-fr/track/5b8HD1dJDuPawgS5FjSC2q?si=1c2499f5cb334ca9"
    );

    await mock.add(
      "https://open.spotify.com/intl-fr/track/42CJLS5WkK6jckfYvJ8ULb?si=22b524f4d60643ce"
    );
  }

  const room = mock === undefined ? roomStorage.getRoom(activeRoomId) : mock;
  if (room === null) {
    reply.code(404);
  }
  return reply.send(Room.toJSON(room));
}
