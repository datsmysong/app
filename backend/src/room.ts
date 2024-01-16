import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "./server";
import createClient from "./lib/supabase";

export async function getUserFromRequest(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const supabase = createClient({ request, response });

  return await supabase.auth.getUser();
}

export async function getUserProfileIdFromAccountId(accId: string) {
  return await adminSupabase
    .from("user_profile")
    .select("user_profile_id")
    .eq("account_id", accId)
    .then((res) => {
      if (res.error) {
        return { code: res.status, message: res.error.message };
      } else {
        return res.data[0].user_profile_id;
      }
    });
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
  rep: FastifyReply,
) {
  let configurationId: string | null = null;
  let hostUserProfileId: any = null;

  const supabase = adminSupabase;

  const user = await getUserFromRequest(req, rep);
  if (!user.data.user) {
    return { code: 401, message: "User not authenticated" };
  }
  hostUserProfileId =
    (await getUserProfileIdFromAccountId(user.data.user.id)) || null;

  const roomConfigRes = await supabase
    .from("room_configurations")
    .insert([
      {
        vote_skipping: voteSkipping,
        vote_skipping_needed_percentage: voteSkippingNeeded,
        max_music_count_in_queue_per_participant: maxMusicPerUser,
        max_music_duration: maxMusicPerUserDuration,
      },
    ])
    .select("id");

  if (roomConfigRes.error) {
    return { code: roomConfigRes.status, message: roomConfigRes.error };
  } else {
    configurationId = roomConfigRes.data[0].id;
    console.log("Room configurations created");
  }

  const roomRes = await supabase
    .from("active_rooms")
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
    return { code: roomRes.status, message: roomRes.error };
  } else {
    return { code: roomRes.status, message: "Room created" };
  }
}

export function endRoom(roomId: string) {
  let room: any = null;
  const supabase = adminSupabase;

  supabase
    .from("active_rooms")
    .delete()
    .eq("id", roomId)
    .select("*")
    .then((res) => {
      if (res.error) {
        return res.error;
      } else {
        room = res.data[0];
        console.log("Room ended");
      }
    });

  supabase
    .from("rooms")
    .insert([
      {
        ...room,
        ended_at: new Date(),
      },
    ])
    .then((res) => {
      if (res.error) {
        return res.error;
      } else {
        console.log("Room added to rooms");
      }
    });
}
