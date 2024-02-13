import { FastifyReply, FastifyRequest } from "fastify";
import { getUserFromRequest } from "../lib/auth-utils";
import { adminSupabase } from "../server";
import { unauthorizedResponse } from "../lib/auth-utils";

export default async function RoomLeaveGET(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { id: roomId } = (await req.params) as { id: string };
  const { data } = await getUserFromRequest(req, reply);

  if (!data.user) return unauthorizedResponse(reply);

  const { error: roomUsersError } = await adminSupabase
    .from("room_users")
    .update({ has_left: true })
    .eq("room_id", roomId)
    .eq("profile_id", data.user);

  if (roomUsersError)
    return reply.code(404).send("Couldn't make the user leave the room.");

  await req.server.ready();

  const socket = req.server.io.of(`/room/${roomId}`).sockets.get(data.user.id);

  if (!socket) {
    return reply.code(404).send("Couldn't find the user's socket.");
  }

  socket.emit("room:leave");
  socket.disconnect();

  return reply.code(200);
}
