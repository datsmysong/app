import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "../server";

export interface QueryParams {
  code: string;
}

export async function getStreamingServiceIdByName(serviceName: string) {
  return await adminSupabase
    .from("streaming_services")
    .select("service_id")
    .eq("service_name", serviceName)
    .then((res) => {
      if (res.error) {
        console.log({ code: res.status, message: res.error });
      } else {
        return res.data[0].service_id;
      }
    });
}

export default async function SoundcloudBoundGET(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const code = (request.query as QueryParams).code;
  if (!code) {
    response.code(400).send({ error: "Missing code" });
  }

  const bodyParams = new URLSearchParams();
  bodyParams.append("client_id", "7soDeFdgGCKJeOtiMTw7Xc0Qn6bFqRNx");
  bodyParams.append("client_secret", "PjMxuBxkoeYfJSSYrvFGSjthhValvcmu");
  bodyParams.append("grant_type", "authorization_code");
  bodyParams.append("redirect_uri", "http://localhost:3000");
  bodyParams.append("code", code);

  const token = await fetch("https://api.soundcloud.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      accept: "application/json; charset=utf-8",
    },
    body: bodyParams,
  });
  const json = await token.json();

  const accessToken = json.access_token;
  const refreshToken = json.refresh_token;
  const expires_in = json.expires_in;
  const serviceId = await getStreamingServiceIdByName("SoundCloud");
  await fetch("http://localhost:3000/soundcloud/bound", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken,
      refreshToken,
      service: serviceId,
      expires_in,
    }),
  });

  response.send({ code: 200, message: "Soundcloud bound" });
}
