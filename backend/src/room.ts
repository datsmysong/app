import { getCurrentUser, unauthorizedResponse } from "./lib/auth-utils";
import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "./server";

export async function createRoom(
  name: string,
  code: string,
  voteSkipping: boolean,
  voteSkippingNeeded: number,
  maxMusicPerUser: number,
  maxMusicPerUserDuration: number,
  serviceId: string,
  rep: FastifyReply,
  req: FastifyRequest
) {
  const supabase = adminSupabase;

  const hostUserProfileId = await getCurrentUser(req, rep);

  if (!hostUserProfileId) return unauthorizedResponse(rep);

  const roomConfigRes = await supabase
    .from("room_configurations")
    .insert({
      vote_skipping: voteSkipping,
      vote_skipping_needed_percentage: voteSkippingNeeded,
      max_music_count_in_queue_per_participant: maxMusicPerUser,
      max_music_duration: maxMusicPerUserDuration,
    })
    .select("id")
    .single();

  // If we didn't manage to create the room configuration
  if (roomConfigRes.error)
    return rep.code(roomConfigRes.status).send(roomConfigRes.error);

  const configurationId = roomConfigRes.data.id;

  const { error, data, status } = await supabase
    .from("rooms")
    .insert({
      name: name,
      code: code,
      configuration_id: configurationId,
      host_user_profile_id: hostUserProfileId,
      service_id: serviceId,
    })
    .select("id")
    .single();

  // If we didn't manage to create the room
  if (error || !data) return rep.code(status).send(error);

  const { error: roomUserError } = await supabase.from("room_users").insert({
    room_id: data.id,
    profile_id: hostUserProfileId,
  });

  // If we didn't manage to add the host to the participants
  if (error) return rep.code(500).send(roomUserError);

  const response = {
    error: null,
    data: {
      room_id: data.id,
    },
  };

  // If we managed to create the room
  return rep.code(201).send(response);
}
