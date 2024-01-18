import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "../server";

interface bodyParams {
  userId: string;
  serviceId: string;
}

export default function UnboundServicePOST(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const userId = (request.body as bodyParams).userId;
  const serviceId = (request.body as bodyParams).serviceId;

  if (!userId) {
    response.status(400).send("userId is required");
    return;
  }

  if (!serviceId) {
    response.status(400).send("serviceId is required");
    return;
  }

  adminSupabase
    .from("bound_services")
    .delete()
    .eq("user_profile_id", userId)
    .eq("service_id", serviceId)
    .then((res) => {
      if (res.error) {
        response.code(res.status).send(res.error);
      } else {
        response.send(res.data);
      }
    });
}
