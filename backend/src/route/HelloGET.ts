import { FastifyRequest, FastifyReply } from "fastify";

export default function HelloGET(req: FastifyRequest, reply: FastifyReply) {
  reply.send({ hello: "world" });
}
