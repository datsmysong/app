import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "../server";

interface QueryParams {
  userId: string;
}

export default async function BoundServicesGET(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = (request.query as QueryParams).userId;
  if (!userId) {
    return reply.code(400).send({ message: "Missing userId" });
  }

  const res = await adminSupabase
    .from("bound_services")
    .select("*")
    .eq("user_profile_id", userId);

  if (res.error) {
    return reply.code(res.status).send(res.error);
  } else {
    return reply.send(res.data);
  }
}
