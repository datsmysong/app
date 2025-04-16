import { PostgrestError } from "@supabase/supabase-js";
import { BoundService } from "commons/database-types-utils";
import { FastifyReply, FastifyRequest } from "fastify";
import createClient from "../lib/supabase";
import { adminSupabase } from "../server";

export class StreamingService {
  static readonly Spotify = new StreamingService(
    "a2d17b25-d87e-42af-9e79-fd4df6b59222",
    "spotify"
  );
  static readonly SoundCloud = new StreamingService(
    "c99631a2-f06c-4076-80c2-13428944c3a8",
    "soundcloud"
  );

  private constructor(
    public readonly id: string,
    public readonly providerName: string
  ) {}
}

export default async function AuthCallbackGET(
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
  const supabase = createClient({
    request,
    response,
  });
  const code = (
    request.query as {
      code: string;
    }
  ).code;
  if (!code) response.code(400).send({ error: "Missing code" });

  const { data } = await supabase.auth.exchangeCodeForSession(code);
  if (!data.session)
    return response.code(400).send({ error: "Missing session" });
  const providerName = data.session.user.app_metadata.provider;
  if (!providerName)
    return response.code(400).send({ error: "Missing provider name" });

  // verify if user already have an user_profile (if new acc, create one)
  let userProfileId = await getUserProfile(data.user.id);

  if (!userProfileId) {
    // New account
    const { userProfileId: newUserProfileId, error } = await createAccount({
      displayName: data.user.user_metadata.full_name,
      accountId: data.user.id,
      username: null,
    });
    if (error || !newUserProfileId) {
      request.log.error("Impossible to create account: " + error);
      return response.code(500).send({ error: error });
    }
    userProfileId = newUserProfileId;
  }

  if (shouldStoreTokens(providerName)) {
    const providerToken = data.session.provider_token;
    const providerRefreshToken = data.session.provider_refresh_token;

    if (!providerToken || !providerRefreshToken)
      return response
        .code(400)
        .send({ error: "Missing provider token from " + providerName });
    const providerTokenEnd = new Date();
    providerTokenEnd.setHours(providerTokenEnd.getHours() + 1);
    const timestampZProviderTokenEnd = providerTokenEnd.toISOString();

    const error = await upsertService({
      access_token: providerToken,
      refresh_token: providerRefreshToken,
      expires_in: timestampZProviderTokenEnd,
      user_profile_id: userProfileId,
      service_id: StreamingService.Spotify.id,
    });

    if (error) {
      request.log.error("Upsert impossible, ", error);
      return response.code(500).send({ error: "Server error." });
    }
  }

  const { refresh_token, access_token } = data.session;
  const redirectUrl = decodeURIComponent(request.url).split("redirect_url=")[1];

  // redirect user to the redirect url with the refresh token
  return response.redirect(
    redirectUrl +
      "#tokens=" +
      encodeURIComponent(refresh_token) +
      ";" +
      encodeURIComponent(access_token)
  );
}

const getUserProfile = async (userId: string): Promise<string | null> => {
  const { data: userData } = await adminSupabase
    .from("user_profile")
    .select("*")
    .eq("account_id", userId)
    .single();
  return userData?.user_profile_id ?? null;
};

export const createAccount = async ({
  displayName,
  accountId,
  username,
}: {
  displayName: string;
  accountId: string;
  username: string | null;
}): Promise<{ userProfileId: string | null; error: PostgrestError | null }> => {
  const { data, error } = await adminSupabase
    .from("profile")
    .insert({
      nickname: displayName,
    })
    .select("*")
    .single();

  const user_profile_id = data?.id;

  if (!user_profile_id)
    return {
      userProfileId: null,
      error: error,
    };

  const { error: errorUserprofile } = await adminSupabase
    .from("user_profile")
    .insert({
      account_id: accountId,
      user_profile_id: user_profile_id,
      username: username, // Add the missing 'username' property
    });
  if (errorUserprofile)
    return {
      userProfileId: null,
      error: errorUserprofile,
    };
  return {
    userProfileId: user_profile_id,
    error: null,
  };
};

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
