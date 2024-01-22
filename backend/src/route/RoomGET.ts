import { FastifyReply, FastifyRequest } from "fastify";
import createClient from "../lib/supabase";

export interface QueryParams {
  id: string;
}

export default function RoomGET(req: FastifyRequest, reply: FastifyReply) {
  const id = (req.query as QueryParams).id;
  if (!id) {
    reply.code(400).send({ error: "Missing id" });
  }
  const supabase = createClient({
    request: req,
    response: reply,
  });
  supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .then((res) => {
      if (res.error) {
        reply.code(500).send({ error: res.error });
      } else {
        reply.send(res.data);
      }
    });
}
