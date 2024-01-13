import { supabase } from "./server";

export async function createRoom(
  name: string,
  code: string,
  voteSkipping: boolean,
  voteSkippingNeeded: number,
  maxMusicPerUser: number,
  maxMusicPerUserDuration: number,
  serviceId: string,
) {
  let configurationId: string | null = null;
  let hostUserProfileId: string | null = null;

  // TODO : review
  const userProfileRes = await supabase
    .from("user_profile")
    .select("user_profile_id");

  if (userProfileRes.error) {
    return { code: code, message: userProfileRes.error };
  } else {
    hostUserProfileId = userProfileRes.data[0].user_profile_id;
    console.log("Host user profile id retrieved");
  }

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
    return { code: code, message: roomConfigRes.error };
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
    return { code: code, message: roomRes.error };
  } else {
    return { code: code, message: "Room created" };
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
