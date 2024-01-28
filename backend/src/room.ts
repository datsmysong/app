import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "./server";
import createClient from "./lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";

export async function getUserFromRequest(
  request: FastifyRequest,
  response: FastifyReply
) {
  const supabase = createClient({ request, response });

  return await supabase.auth.getUser();
}

export async function getUserProfileIdFromAccountId(accId: string) {
  const { data, error } = await adminSupabase
    .from("user_profile")
    .select("user_profile_id")
    .eq("account_id", accId)
    .single();

  if (error) return { data: null, error };
  return { data: data.user_profile_id, error: null };
}

export async function createRoom(
  name: string,
  code: string,
  voteSkipping: boolean,
  voteSkippingNeeded: number,
  maxMusicPerUser: number,
  maxMusicPerUserDuration: number,
  serviceId: string,
  req: FastifyRequest,
  rep: FastifyReply
) {
  const supabase = adminSupabase;

  const user = await getUserFromRequest(req, rep);
  if (!user.data.user) {
    return rep.code(401).send("User not logged in");
  }
  const hostUserProfileId =
    (await getUserProfileIdFromAccountId(user.data.user.id)).data || null;

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

  if (roomConfigRes.error) {
    return rep.code(roomConfigRes.status).send(roomConfigRes.error);
  }
  const configurationId = roomConfigRes.data.id;

  const roomRes = await supabase
    .from("rooms")
    .insert([
      {
        name: name,
        code: code,
        configuration_id: configurationId,
        host_user_profile_id: hostUserProfileId,
        service_id: serviceId,
      },
    ])
    .select("id");

  if (roomRes.error) {
    return rep.code(roomRes.status).send(roomRes.error);
  } else {
    // TODO use roomid here (send)
    return rep.code(201).send("Room created");
  }
}

export function endRoom(roomId: string) {
  // TODO: Properly end room
  // This will set the join code of this room to null, and set is_active to false
}
