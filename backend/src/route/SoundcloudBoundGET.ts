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
  return await adminSupabase
    .from("user_profile")
    .select("user_profile_id")
    .eq("account_id", accId)
    .then((res) => {
      if (res.error) {
        return { code: res.status, message: res.error.message };
      } else {
        return res.data[0].user_profile_id;
      }
    });
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
  const serviceId = await getStreamingServiceIdByName("SoundCloud");

  let userProfileId: any = "";
  const user = await getUserFromRequest(request, response);
  if (!user.data.user) {
    return { code: 401, message: "User not authenticated" };
  }
  userProfileId =
    (await getUserProfileIdFromAccountId(user.data.user.id)) || null;

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
    return response.send({ code: 500, message: "Soundcloud not bound" });
  }
}
