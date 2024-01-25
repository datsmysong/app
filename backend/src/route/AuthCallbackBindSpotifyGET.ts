import { PostgrestError } from "@supabase/supabase-js";
import { BoundService } from "commons/database-types-utils";
import { FastifyReply, FastifyRequest } from "fastify";
import createClient from "../lib/supabase";
import { adminSupabase } from "../server";
import { StreamingService } from "./AuthCallbackGET";
import { getCurrentUser } from "../lib/auth-utils";

export default async function AuthCallbackBindSpotifyGET(
  request: FastifyRequest,
  response: FastifyReply
) {
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

  // fetch to /api/token with code retrieved here

  const providerTokenEnd = new Date();
  providerTokenEnd.setHours(providerTokenEnd.getHours() + 1);
  const timestampZProviderTokenEnd = providerTokenEnd.toISOString();

  /* const error = await upsertService({
      access_token: providerToken,
      refresh_token: providerRefreshToken,
      expires_in: timestampZProviderTokenEnd,
      user_profile_id: userProfileId,
      service_id: StreamingService.Spotify.id,
    });

    if (error) {
      request.log.error("Upsert impossible, ", error);
      return response
        .code(500)
        .send({ error: "Server error." + error.message });
    }
  }

  const refresh_token = data.session.refresh_token;
  const redirectUrl = decodeURIComponent(request.url).split("redirect_url=")[1];

  // redirect user to the redirect url with the refresh token
  response.redirect(
    redirectUrl + "#refresh_token=" + encodeURIComponent(refresh_token)
  );*/
}

const upsertService = async (
  service: BoundService
): Promise<PostgrestError | null> => {
  const { error } = await adminSupabase.from("bound_services").upsert(service);
  return error;
};

const shouldStoreTokens = (providerName: string): boolean => {
  return Object.values(StreamingService).find(
    (service) => service.providerName === providerName
  );
};
