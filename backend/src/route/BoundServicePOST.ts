import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "../server";

interface BodyParams {
  accessToken: string;
  refreshToken: string;
  serviceId: string;
  userProfileId: string;
}

export default async function BoundServicePOST(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const { accessToken, refreshToken, serviceId, userProfileId } =
    request.body as BodyParams;

  const providerTokenEnd = new Date();
  providerTokenEnd.setHours(providerTokenEnd.getHours() + 1);
  const timestampZProviderTokenEnd = providerTokenEnd.toISOString();

  adminSupabase
    .from("bound_services")
    .upsert([
      {
        access_token: accessToken,
        refresh_token: refreshToken,
        service_id: serviceId,
        user_profile_id: userProfileId,
        expires_in: timestampZProviderTokenEnd,
      },
    ])
    .then((res) => {
      if (res.error) {
        return { code: res.status, error: res.error };
      } else {
        return response.send(res.data);
      }
    });
}
