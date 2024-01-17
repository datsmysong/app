import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "../server";

export default function StreamingServicesGET(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  adminSupabase
    .from("streaming_services")
    .select("*")
    .then((res) => {
      if (res.error) {
        reply.code(res.status).send(res.error);
      } else {
        reply.send(res.data);
      }
    });
}
