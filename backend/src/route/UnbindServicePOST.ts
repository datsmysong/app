import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "../server";
import { getCurrentUser } from "../lib/auth-utils";

interface QueryParams {
  uuid: string;
}

export default async function UnbindServicePOST(
  request: FastifyRequest,
  response: FastifyReply
) {
  const { uuid: serviceId } = request.params as QueryParams;

  if (!serviceId) {
    response.status(400).send("serviceId is required");
    return;
  }
  const userId = await getCurrentUser(request, response);

  if (!userId) {
    response.status(400).send("User not connected");
    return;
  }

  const { data, status, error } = await adminSupabase
    .from("bound_services")
    .delete()
    .eq("user_profile_id", userId)
    .eq("service_id", serviceId)
    .single();

  response.code(status).send(error ?? data);
}
