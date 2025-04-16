import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "../server";

interface BodyParams {
  voteSkipping: boolean;
  voteSkippingPercentage: number;
  maxMusicPerUser: number;
  maxMusicDuration: number;
}

export interface QueryParams {
  id: string;
}

export default async function RoomConfigurationUpdatePOST(
  req: FastifyRequest,
  res: FastifyReply
) {
  const bodyParams = req.body as BodyParams;
  const {
    voteSkipping,
    voteSkippingPercentage,
    maxMusicPerUser,
    maxMusicDuration,
  } = bodyParams;

  const { id } = req.params as QueryParams;

  const { error, status } = await adminSupabase
    .from("room_configurations")
    .update({
      vote_skipping: voteSkipping,
      vote_skipping_needed_percentage: voteSkippingPercentage,
      max_music_count_in_queue_per_participant: maxMusicPerUser,
      max_music_duration: maxMusicDuration,
    })
    .eq("id", id);

  return res.code(status).send(error || "room configuration updated");
}
