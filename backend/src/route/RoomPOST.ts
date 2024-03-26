import { FastifyReply, FastifyRequest } from "fastify";
import { createRoom } from "../room";

interface BodyParams {
  name: string;
  code: string;
  service: string;
  voteSkipping: boolean;
  voteSkippingNeeded: number;
  maxMusicPerUser: number;
  maxMusicDuration: number;
}

function extractFromRequest(req: FastifyRequest): BodyParams {
  const bodyParams = req.body as BodyParams;
  const name = bodyParams.name;
  const code = bodyParams.code;
  const voteSkipping = bodyParams.voteSkipping;
  const voteSkippingNeeded = bodyParams.voteSkippingNeeded;
  const maxMusicPerUser = bodyParams.maxMusicPerUser;
  const maxMusicDuration = bodyParams.maxMusicDuration;
  const serviceId = bodyParams.service;
  return {
    name,
    code,
    voteSkipping,
    voteSkippingNeeded,
    maxMusicPerUser,
    maxMusicDuration,
    service: serviceId,
  };
}

export default async function RoomPOST(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const roomOptions = extractFromRequest(req);

  await createRoom(
    roomOptions.name,
    roomOptions.code,
    roomOptions.voteSkipping,
    roomOptions.voteSkippingNeeded,
    roomOptions.maxMusicPerUser,
    roomOptions.maxMusicDuration,
    roomOptions.service,
    reply,
    req
  );
}
