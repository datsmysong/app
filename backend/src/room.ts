import { supabase } from "./server";

let roomId: string | null = null;
let roomQueue: string[] = [];

export async function createRoom(
  name: string,
  code: string,
  voteSkipping: boolean,
  voteSkippingNeeded: number,
  maxMusicPerUser: number,
  maxMusicPerUserDuration: number,
  serviceName: string,
) {
  let created_at = new Date();
  let configurationId: string | null = null;
  let hostUserProfileId: string | null = null;
  let streamingServicesId: string | null = null;

  const userProfileRes = await supabase
    .from("user_profile")
    .select("user_profile_id");

  if (userProfileRes.error) {
    console.error(userProfileRes.error);
  } else {
    hostUserProfileId = userProfileRes.data[0].user_profile_id;
    console.log("Host user profile id retrieved");
  }

  const streamingServicesRes = await supabase
    .from("streaming_services")
    .select("*")
    .eq("service_name", serviceName);

  if (streamingServicesRes.error) {
    console.error(streamingServicesRes.error);
  } else {
    streamingServicesId = streamingServicesRes.data[0].service_id;
    console.log("Streaming services id retrieved");
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
    console.error(roomConfigRes.error);
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
        created_at: created_at,
        configuration_id: configurationId,
        host_user_profile_id: hostUserProfileId,
        service_id: streamingServicesId,
      },
    ])
    .select("id");

  if (roomRes.error) {
    console.error(roomRes.error);
  } else {
    roomId = roomRes.data[0].id;
    console.log("Room created");
  }
}

export function endRoom(roomId: string) {
  let ended_at = new Date();
  let created_at: Date | null = null;
  let configurationId: string | null = null;
  let hostUserProfileId: string | null = null;

  supabase
    .from("active_rooms")
    .delete()
    .eq("id", roomId)
    .select("*")
    .then((res) => {
      if (res.error) {
        console.error(res.error);
      } else {
        created_at = res.data[0].created_at;
        configurationId = res.data[0].configuration_id;
        hostUserProfileId = res.data[0].host_user_profile_id;
        console.log("Room ended");
      }
    });

  supabase
    .from("rooms")
    .insert([
      {
        created_at: created_at,
        ended_at: ended_at,
        configuration_id: configurationId,
        host_user_profile_id: hostUserProfileId,
      },
    ])
    .then((res) => {
      if (res.error) {
        console.error(res.error);
      } else {
        console.log("Room added to rooms");
      }
    });
}

function addMusic(music: any) {
  roomQueue.push(music);
}

function removeMusic(music: any) {
  roomQueue.splice(roomQueue.indexOf(music), 1);
}
