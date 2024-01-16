import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "../server";
import { getUserFromRequest } from "../room";
interface BodyParams {
  accessToken: string;
  refreshToken: string;
  service: string;
  expires_in: string;
}

export default async function BoundServicePOST(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const { accessToken, refreshToken, service, expires_in } =
    request.body as BodyParams;
  if (!accessToken || !refreshToken || !service) {
    response.code(400).send({ error: "Missing code" });
  }
  let userProfileId = "";
  const user = await getUserFromRequest(request);
  if (!user) {
    response.code(500).send({ error: "User not found" });
  } else {
    if (user.data.user) userProfileId = user.data.user.id;
    else response.code(500).send({ error: "User not found" });
  }

  const expires_in_date = (Date.now() + parseInt(expires_in) * 1000).toString();

  adminSupabase
    .from("bound_services")
    .insert([
      {
        access_token: accessToken,
        refresh_token: refreshToken,
        service_id: service,
        user_profile_id: userProfileId,
        expires_in: expires_in_date,
      },
    ])
    .then((res) => {
      if (res.error) {
        response.code(500).send({ error: res.error });
      } else {
        response.send(res.data);
      }
    });
}
