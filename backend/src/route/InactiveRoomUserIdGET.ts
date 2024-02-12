import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "../server";

export default async function InactiveRoomUserIdGET(
  request: FastifyRequest,
  response: FastifyReply
) {
  const { userId } = request.params as { userId: string };
  const { error, status, data } = await adminSupabase
    .from("room_users")
    .select("*, rooms(*)")
    .eq("profile_id", userId)
    .order("rooms(created_at)", { ascending: false })
    .limit(5);

  return response.status(status).send(error || data);
}
