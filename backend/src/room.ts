import { supabase } from "./server";
import { createClient } from "@supabase/supabase-js";

export async function getUserFromRequest(req: any) {
  if (!process.env.SUPABASE_URL) {
    throw new Error("Missing SUPABASE_URL environment variable");
  }

  const accesToken = req.cookies.accessToken;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabase = createClient(supabaseUrl, accesToken);

  return await supabase.auth.getUser();
}

export async function createRoom(
  name: string,
  code: string,
  voteSkipping: boolean,
  voteSkippingNeeded: number,
  maxMusicPerUser: number,
  maxMusicPerUserDuration: number,
  serviceId: string,
  req: any,
) {
  let configurationId: string | null = null;
  let hostUserProfileId: string | null = null;

  getUserFromRequest(req).then((user) => {
    if (user) {
      if (user.data.user) hostUserProfileId = user.data.user.id;
      else return { code: 500, message: "User not found" };
    } else {
      return { code: 500, message: "User not found" };
    }
  });

  // TODO : review
  /*
    const userProfileRes = await supabase
      .from("user_profile")
      .select("user_profile_id");
  
    if (userProfileRes.error) {
      return { code: code, message: userProfileRes.error };
    } else {
      hostUserProfileId = userProfileRes.data[0].user_profile_id;
      console.log("Host user profile id retrieved");
    }*/

  const roomConfigRes = await supabase
    .from("active_room_configurations")
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
  let createdAt: Date | null = null;
  let configurationId: string | null = null;
  let hostUserProfileId: string | null = null;

  supabase
    .from("active_rooms")
    .delete()
    .eq("id", roomId)
    .select("*")
    .then((res) => {
      if (res.error) {
        return res.error;
      } else {
        createdAt = res.data[0].created_at;
        configurationId = res.data[0].configuration_id;
        hostUserProfileId = res.data[0].host_user_profile_id;
        console.log("Room ended");
      }
    });

  supabase
    .from("rooms")
    .insert([
      {
        created_at: createdAt,
        configuration_id: configurationId,
        host_user_profile_id: hostUserProfileId,
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
