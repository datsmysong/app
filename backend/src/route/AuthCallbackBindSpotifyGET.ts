import { PostgrestError } from "@supabase/supabase-js";
import { BoundService } from "commons/database-types-utils";
import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "../server";
import { StreamingService } from "./AuthCallbackGET";
import { getCurrentUser } from "../lib/auth-utils";
import { getApiUrl } from "../lib/apiUrl";

export default async function AuthCallbackBindSpotifyGET(
  request: FastifyRequest,
  response: FastifyReply
) {
  const directUri = request.hostname;
  const baseUrl = getApiUrl(directUri);

  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl)
    return response.code(400).send({ error: "Missing SUPABASE_URL" });
  const supabaseId = supabaseUrl.split(".")[0].split("//")[1];

  if (!request.cookies["sb-" + supabaseId + "-auth-token-code-verifier"]) {
    return response
      .code(400)
      .send({ error: "Missing cookie auth-token-code-verifier " });
  }
  const code = (
    request.query as {
      code: string;
    }
  ).code;

  const spotifyClientId = process.env.SPOTIFY_CLIENT_ID || "";
  const redirectUri = baseUrl + "/auth/callback/bind/spotify";
  const codeVerifier =
    request.cookies["sb-" + supabaseId + "-auth-token-code-verifier"] || "";

  const bodyParams = new URLSearchParams();
  bodyParams.append("client_id", spotifyClientId);
  bodyParams.append("grant_type", "authorization_code");
  bodyParams.append("code", code);
  bodyParams.append("redirect_uri", redirectUri);
  bodyParams.append("code_verifier", codeVerifier);

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      accept: "application/json; charset=utf-8",
    },
    body: bodyParams,
  });

  if (!tokenRes.ok) {
    return response.code(400).send({
      error:
        "Error while fetching token, status : " +
        tokenRes.status +
        " " +
        tokenRes.statusText,
    });
  }

  const token = await tokenRes.json();

  const accessToken = token.access_token;
  const refreshToken = token.refresh_token;

  if (!accessToken || !refreshToken) {
    return response.code(400).send({
      error:
        "Missing access token or refresh token, status : " +
        tokenRes.status +
        " " +
        tokenRes.statusText,
    });
  }

  const providerTokenEnd = new Date();
  providerTokenEnd.setHours(providerTokenEnd.getHours() + 1);
  const timestampZProviderTokenEnd = providerTokenEnd.toISOString();

  const userProfileId = await getCurrentUser(request, response);

  const error = await upsertService({
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: timestampZProviderTokenEnd,
    user_profile_id: userProfileId,
    service_id: StreamingService.Spotify.id,
  });

  if (error) {
    request.log.error("Upsert impossible, ", error);
    return response.code(500).send({ error: "Server error." + error.message });
  }
  return response.type("text/html").send("<script>window.close();</script>");
}

const upsertService = async (
  service: BoundService
): Promise<PostgrestError | null> => {
  const { error } = await adminSupabase.from("bound_services").upsert(service);
  return error;
};
