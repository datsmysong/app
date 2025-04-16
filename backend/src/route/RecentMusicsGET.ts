import { FastifyRequest, FastifyReply } from "fastify";
import createClient from "../lib/supabase";
import { getUserProfileFromRequest } from "../lib/auth-utils";
import { getMusicPlatform } from "../RoomStorage";
import { Response } from "commons/socket.io-types";
import { JSONTrack } from "commons/backend-types";

export default async function RecentMusicsGET(
  request: FastifyRequest,
  response: FastifyReply
) {
  const supabase = createClient({
    request,
    response,
  });

  const { data: user, error } = await supabase.auth.getUser();
  if (user == null || error != null) {
    return response.code(401).send("User not logged in");
  }

  const { data: userProfile, error: userError } =
    await getUserProfileFromRequest(user.user.id);
  if (userProfile == null || userError != null) {
    return response.code(500).send("User profile not found");
  }

  const { data: recentMusics, error: recentMusicsError } =
    await getRecentMusicsAddedBy(supabase, userProfile.user_profile_id);

  if (recentMusics == null || recentMusicsError != null) {
    return response.code(500).send("Error fetching recent musics");
  }

  console.log(`Found recent musics: ${JSON.stringify(recentMusics)}`);

  return response.code(200).send(recentMusics).type("application/json");
}

async function getRecentMusicsAddedBy(
  supabase: ReturnType<typeof createClient>,
  profileId: string
): Promise<Response<JSONTrack[]>> {
  const { data, error } = await supabase
    .from("room_history")
    .select("*, rooms(service_id)")
    .eq("profile_id", profileId)
    .order("added_at", { ascending: false })
    .limit(5);

  if (data == null || error != null) {
    return { data: null, error: error.message };
  }

  const tracksPromises = data.map(async (addedMusic) => {
    if (addedMusic.rooms == null) return null;
    if (addedMusic.rooms.service_id == null) return null;

    const musicPlatform = getMusicPlatform(addedMusic.rooms.service_id);
    console.log(`Found music platform: ${JSON.stringify(musicPlatform)}`);

    if (musicPlatform == null) return null;

    const jsonTrack = await musicPlatform.getJsonTrack(addedMusic.music_id);
    console.log(`Found track: ${JSON.stringify(jsonTrack)}`);

    return jsonTrack;
  });

  const tracks = await Promise.all(tracksPromises);
  const filteredTracks = tracks.filter((track) => track != null) as JSONTrack[];

  return { data: filteredTracks, error };
}
