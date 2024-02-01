import { FastifyReply, FastifyRequest } from "fastify";
import { getUserFromRequest } from "../lib/auth-utils";
import { adminSupabase } from "../server";
import RoomStorage from "../RoomStorage";
import { unauthorizedResponse } from "../lib/auth-utils";

export default async function RoomEndGET(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { id: roomUuid } = (await req.params) as { id: string };
  const { data } = await getUserFromRequest(req, reply);

  if (!data.user) return unauthorizedResponse(reply);

  const { data: queryRoom, error: queryRoomError } = await adminSupabase
    .from("rooms")
    .select("*, user_profile(*)")
    .eq("id", roomUuid)
    .eq("is_active", true)
    .eq("user_profile.account_id", data.user.id)
    .single();

  if (queryRoomError) {
    return reply
      .code(404)
      .send("error during test if user is allowed to archive room");
  }

  RoomStorage.getRoomStorage().removeRoomByUuid(queryRoom.id);

  const { error: updatedValueError } = await adminSupabase
    .from("rooms")
    .update({
      code: null,
      is_active: false,
    })
    .eq("id", roomUuid);

  if (updatedValueError)
    return reply.code(404).send("error during update room database");

  await req.server.ready();
  req.server.io.of(`/room/${roomUuid}`).emit("queue:deleted");

  return reply.code(200);
}
