import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "../server";

interface QueryParams {
  id: string;
}

export default async function RoomConfigurationGET(
  req: FastifyRequest,
  res: FastifyReply
) {
  const { id } = req.params as QueryParams;

  const { error, status, data } = await adminSupabase
    .from("room_configurations")
    .select("*")
    .eq("id", id)
    .single();

  return res.code(status).send(error || data);
}
