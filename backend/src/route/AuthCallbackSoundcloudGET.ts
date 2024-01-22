import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "../server";
import createClient from "../lib/supabase";

export interface QueryParams {
  code: string;
}

export async function getUserFromRequest(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const supabase = createClient({ request, response });

  return await supabase.auth.getUser();
}

export async function getUserProfileIdFromAccountId(accId: string) {
  const { data, error } = await adminSupabase
    .from("user_profile")
    .select("user_profile_id")
    .eq("account_id", accId)
    .single();

  if (error) return { data: null, error };
  return { data: data.user_profile_id, error: null };
}

export async function getStreamingServiceIdByName(serviceName: string) {
  const { data, error } = await adminSupabase
    .from("streaming_services")
    .select("service_id")
    .eq("service_name", serviceName)
    .single();

  if (error) return { data: null, error };
  return { data: data.service_id, error: null };
}

export default async function AuthCallbackSoundcloudGET(
  request: FastifyRequest,
  response: FastifyReply,
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
      "Missing SOUNDCLOUD_CLIENT_ID or SOUNDCLOUD_CLIENT_SECRET environment variable",
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
  const serviceIdRes = await getStreamingServiceIdByName("SoundCloud");
  if (serviceIdRes.error) return response.code(500).send(serviceIdRes.error);
  const serviceId = serviceIdRes.data;

  const user = await getUserFromRequest(request, response);
  if (!user.data.user) {
    return response.code(400).send("Missing user");
  }
  const userProfileIdRes = await getUserProfileIdFromAccountId(
    user.data.user.id,
  );
  if (userProfileIdRes.error)
    return response.code(500).send(userProfileIdRes.error);
  const userProfileId = userProfileIdRes.data;

  const res = await fetch("http://localhost:3000/bound", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: accessToken,
      refreshToken: refreshToken,
      serviceId: serviceId,
      userProfileId: userProfileId,
    }),
  });

  if (res.status === 200) {
    return response.type("text/html").send("<script>window.close();</script>");
  } else {
    return response.code(res.status).send(res.statusText);
  }
}
