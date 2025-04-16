import { FastifyReply, FastifyRequest } from "fastify";
import { getCurrentUser } from "../lib/auth-utils";
import { adminSupabase } from "../server";
import { unauthorizedResponse } from "../lib/auth-utils";

export default async function RoomLeaveGET(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { id: roomId } = (await req.params) as { id: string };
  const userProfileId = await getCurrentUser(req, reply);

  if (!userProfileId) return unauthorizedResponse(reply);

  const { error: roomUsersError } = await adminSupabase
    .from("room_users")
    .update({ has_left: true })
    .eq("room_id", roomId)
    .eq("profile_id", userProfileId);

  if (roomUsersError)
    return reply.code(404).send("Couldn't make the user leave the room.");

  return reply.code(200).send();
}
