import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "../server";

export default async function StreamingServicesGET(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const {
    data: streamingServices,
    status,
    error,
  } = await adminSupabase.from("streaming_services").select("*");

  // https://fastify.dev/docs/latest/Reference/Routes/#async-await
  return reply.code(status).send(error ?? streamingServices);
}
