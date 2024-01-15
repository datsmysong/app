import { FastifyReply, FastifyRequest } from "fastify";
import { createRoom } from "../room";
import * as repl from "repl";

interface BodyParams {
  name: string;
  code: string;
  service: string;
  voteSkipping: boolean;
  voteSkippingNeeded: number;
  maxMusicPerUser: number;
  maxMusicPerUserDuration: number;
}

function extractFromRequest(req: FastifyRequest) {
  const bodyParams = req.body as BodyParams;
  const name = bodyParams.name;
  const code = bodyParams.code;
  const voteSkipping = bodyParams.voteSkipping;
  const voteSkippingNeeded = bodyParams.voteSkippingNeeded;
  const maxMusicPerUser = bodyParams.maxMusicPerUser;
  const maxMusicPerUserDuration = bodyParams.maxMusicPerUserDuration;
  const serviceId = bodyParams.service;
  return {
    name,
    code,
    voteSkipping,
    voteSkippingNeeded,
    maxMusicPerUser,
    maxMusicPerUserDuration,
    serviceId: serviceId,
  };
}

export default async function RoomPOST(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const roomOptions = extractFromRequest(req);

  const creationResult = await createRoom(
    roomOptions.name,
    roomOptions.code,
    roomOptions.voteSkipping,
    roomOptions.voteSkippingNeeded,
    roomOptions.maxMusicPerUser,
    roomOptions.maxMusicPerUserDuration,
    roomOptions.serviceId,
    req,
  );

  reply.send(creationResult);
}
