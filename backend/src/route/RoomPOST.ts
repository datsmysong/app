import { FastifyReply, FastifyRequest } from "fastify";
import { createRoom } from "../room";

interface BodyParams {
  name: string;
  code: string;
  service: string;
  voteSkipping: boolean;
  voteSkippingNeeded: number;
  maxMusicPerUser: number;
  maxMusicPerUserDuration: number;
}

export default function RoomPOST(req: FastifyRequest, reply: FastifyReply) {
  const name = (req.body as BodyParams).name;
  const code = (req.body as BodyParams).code;
  const voteSkipping = (req.body as BodyParams).voteSkipping;
  const voteSkippingNeeded = (req.body as BodyParams).voteSkippingNeeded;
  const maxMusicPerUser = (req.body as BodyParams).maxMusicPerUser;
  const maxMusicPerUserDuration = (req.body as BodyParams)
    .maxMusicPerUserDuration;
  const serviceName = (req.body as BodyParams).service;

  createRoom(
    name,
    code,
    voteSkipping,
    voteSkippingNeeded,
    maxMusicPerUser,
    maxMusicPerUserDuration,
    serviceName,
  ).then(() => {
    reply.send({ message: "Room created" });
  });
}
