import { FastifyReply, FastifyRequest } from "fastify";
import { getUserFromRequest, unauthorizedResponse } from "../lib/auth-utils";
import { adminSupabase } from "../server";
import RoomStorage from "../RoomStorage";

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

  const room = RoomStorage.getRoomStorage().getRoom(roomUuid);
  if (!room) return reply.code(404).send("room not found");

  const inserts = await Promise.all(
    room.getHistory().map(async (track, position) => {
      return {
        room_id: roomUuid,
        music_id: track.url,
        profile_id: track.addedBy,
        position: position + 1,
      };
    })
  );

  await adminSupabase.from("room_history").insert(inserts);

  RoomStorage.getRoomStorage().removeRoomByUuid(queryRoom.id);

  const { error: updatedValueError } = await adminSupabase
    .from("rooms")
    .update({
      code: null,
      is_active: false,
      ended_at: new Date().toISOString(),
    })
    .eq("id", roomUuid);

  if (updatedValueError)
    return reply.code(404).send("error during update room database");

  await req.server.ready();
  const sockets = req.server.io.of(`/room/${roomUuid}`).sockets;
  sockets.forEach((socket) => {
    socket.emit("room:end");
  });
  req.server.io.of(`/room/${roomUuid}`).disconnectSockets();

  return reply.code(200).send();
}
