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
  const voteSkipping = bodyParams.voteSkipping;
  const voteSkippingPercentage = bodyParams.voteSkippingPercentage;
  const maxMusicPerUser = bodyParams.maxMusicPerUser;
  const maxMusicDuration = bodyParams.maxMusicDuration;

  const { id } = req.params as QueryParams;

  const { error, status, data } = await adminSupabase
    .from("room_configurations")
    .update({
      vote_skipping: voteSkipping,
      vote_skipping_percentage: voteSkippingPercentage,
      max_music_per_user: maxMusicPerUser,
      max_music_duration: maxMusicDuration,
    })
    .eq("id", id);

  return res.code(status).send(error || data);
}
