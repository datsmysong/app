import { FastifyReply, FastifyRequest } from "fastify";
import { StreamingService } from "./AuthCallbackGET";
import {
  getUserFromRequest,
  getUserProfileIdFromAccountId,
} from "../lib/auth-utils";
import BoundService from "../lib/bound-service";

export interface QueryParams {
  code: string;
}

export default async function AuthCallbackSoundcloudGET(
  request: FastifyRequest,
  response: FastifyReply
) {
  const code = (request.query as QueryParams).code;
  if (!code) {
    return response.code(400).send({ error: "Missing code" });
  }

  if (
    !process.env.SOUNDCLOUD_CLIENT_ID ||
    !process.env.SOUNDCLOUD_CLIENT_SECRET
  ) {
    throw new Error(
      "Missing SOUNDCLOUD_CLIENT_ID or SOUNDCLOUD_CLIENT_SECRET environment variable"
    );
  }

  const bodyParams = new URLSearchParams();
  bodyParams.append("client_id", process.env.SOUNDCLOUD_CLIENT_ID);
  bodyParams.append("client_secret", process.env.SOUNDCLOUD_CLIENT_SECRET);
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
  const serviceId = StreamingService.SoundCloud.id;

  const user = await getUserFromRequest(request, response);
  if (!user.data.user) {
    return response.code(400).send("Missing user");
  }
  const userProfileIdRes = await getUserProfileIdFromAccountId(
    user.data.user.id
  );
  if (userProfileIdRes.error)
    return response.code(500).send(userProfileIdRes.error);
  const userProfileId = userProfileIdRes.data;

  const boundServiceRes = await BoundService(
    accessToken,
    refreshToken,
    serviceId,
    userProfileId
  );

  if (boundServiceRes.error) {
    return response.code(500).send(boundServiceRes.error);
  } else {
    return response.type("text/html").send("<script>window.close();</script>");
  }
}