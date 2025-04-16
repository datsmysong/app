import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "../server";
import { getCurrentUser } from "../lib/auth-utils";

export default async function BoundServicesGET(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = await getCurrentUser(request, reply);
  if (!userId) {
    return reply.code(400).send({ message: "Missing userId" });
  }

  const { data, status, error } = await adminSupabase
    .from("bound_services")
    .select("*")
    .eq("user_profile_id", userId);

  reply.code(status).send(error ?? data);
}
