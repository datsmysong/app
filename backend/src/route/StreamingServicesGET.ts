import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "../server";

export default function StreamingServicesGET(
  req: FastifyRequest,
  reply: FastifyReply
) {
  adminSupabase
    .from("streaming_services")
    .select("*")
    .then((res) => {
      if (res.error) {
        reply.code(500).send({ error: res.error });
      } else {
        reply.send(res.data);
      }
    });
}
