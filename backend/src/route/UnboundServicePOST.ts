import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "../server";
import { getCurrentUser } from "../lib/auth-utils";

interface bodyParams {
  userId: string;
  serviceId: string;
}

export default async function UnboundServicePOST(
  request: FastifyRequest,
  response: FastifyReply
) {
  const bodyParams = request.body as bodyParams;

  const userId = bodyParams.userId;
  const serviceId = bodyParams.serviceId;

  if (!userId) {
    response.status(400).send("userId is required");
    return;
  }

  if (!serviceId) {
    response.status(400).send("serviceId is required");
    return;
  }
  const selfProfileId = await getCurrentUser(request, response);

  if (selfProfileId !== userId) {
    return response.code(401).send("Unauthorized");
  }

  const { data, status, error } = await adminSupabase
    .from("bound_services")
    .delete()
    .eq("user_profile_id", userId)
    .eq("service_id", serviceId)
    .single();

  response.code(status).send(error ?? data);
}
