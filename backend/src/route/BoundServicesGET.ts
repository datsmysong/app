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

  try {
    const res = await adminSupabase
      .from("bound_services")
      .select("*")
      .eq("user_profile_id", userId);

    if (res.error) {
      return reply.code(res.status).send({ message: res.error.message });
    } else {
      console.log(res.data);
      return reply.send(res.data);
    }
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ message: "Internal server error" });
  }
}
