import { FastifyRequest, FastifyReply } from "fastify";
import createClient from "../lib/supabase";
import { adminSupabase } from "../server";
import { Database } from "../types/dbTypes";
import { PostgrestError } from "@supabase/supabase-js";

enum StreamingService {
  Spotify = "a2d17b25-d87e-42af-9e79-fd4df6b59222",
  SoundCloud = "c99631a2-f06c-4076-80c2-13428944c3a8",
}

export default async function AuthCallbackGET(
  request: FastifyRequest,
  response: FastifyReply
) {
  if (!request.cookies["sb-ckalsdcwrofxvgxslwiv-auth-token-code-verifier"]) {
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
  const providerToken = data.session.provider_token;
  const providerRefreshToken = data.session.provider_refresh_token;
  if (!providerToken || !providerRefreshToken)
    return response
      .code(400)
      .send({ error: "Missing provider token from Spotify" });

  // verify if user already have an user_profile (if new acc, create one)
  let userProfileId = await getUserProfile(data.user.id);

  let needInsertBoundService;
  if (userProfileId) {
    // Already account
    const { alreadyBound, error } = await alreadyBoundService({
      service: StreamingService.Spotify,
      user_profile_id: userProfileId,
    });
    if (error) {
      console.error("error fetch", error);
      return response.code(500).send({ error: error });
    }
    needInsertBoundService = !alreadyBound;
  } else {
    // New account
    try {
      userProfileId = await createAccount({
        full_name: data.user.user_metadata.full_name,
        account_id: data.user.id,
        username: null,
      });
      needInsertBoundService = true;
    } catch (e) {
      console.log("Error creating account", e);
      return response.code(500).send({ error: e });
    }
  }
  const providerTokenEnd = new Date();
  providerTokenEnd.setHours(providerTokenEnd.getHours() + 1);
  const timestampZProviderTokenEnd = providerTokenEnd.toISOString();

  if (needInsertBoundService) {
    const error = await insertService({
      access_token: providerToken,
      refresh_token: providerRefreshToken,
      expires_in: timestampZProviderTokenEnd,
      user_profile_id: userProfileId,
      service_id: StreamingService.Spotify,
    });
    if (error) {
      console.error("impossible to insert into bound_services", error);
      response.code(500).send({ error: "Impossible to bound this from " });
    }
  } else {
    const error = await updateService({
      accessToken: providerToken,
      expiresOn: timestampZProviderTokenEnd,
      refreshToken: providerRefreshToken,
      service: StreamingService.Spotify,
      userProfileId: userProfileId,
    });
    if (error) {
      console.error("impossible to update bound_services", error);
      response
        .code(500)
        .send({ error: "Impossible to update bounded service" });
    }
  }

  const refresh_token = data.session.refresh_token;
  const redirectUrl = decodeURIComponent(request.url).split("redirect_url=")[1];

  // redirect user to the redirect url with the refresh token
  response.redirect(
    redirectUrl + "#refresh_token=" + encodeURIComponent(refresh_token)
  );
}

const insertService = async (
  service: Database["public"]["Tables"]["bound_services"]["Row"]
) => {
  const { error } = await adminSupabase.from("bound_services").insert(service);
  return error;
};

const updateService = async ({
  userProfileId,
  accessToken,
  refreshToken,
  expiresOn,
  service,
}: {
  userProfileId: string;
  accessToken: string;
  refreshToken: string;
  expiresOn: string;
  service: StreamingService;
}) => {
  const { error } = await adminSupabase
    .from("bound_services")
    .update({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresOn,
    })
    .eq("user_profile_id", userProfileId)
    .eq("service_id", service);
  return error;
};

const getUserProfile = async (userId: string): Promise<string | null> => {
  const { data: userData } = await adminSupabase
    .from("user_profile")
    .select("*")
    .eq("account_id", userId)
    .single();
  return userData?.user_profile_id ?? null;
};

const alreadyBoundService = async ({
  service,
  user_profile_id,
}: {
  service: StreamingService;
  user_profile_id: string;
}): Promise<{ alreadyBound: boolean; error: PostgrestError | null }> => {
  const { data, error } = await adminSupabase
    .from("bound_services")
    .select("*")
    .eq("user_profile_id", user_profile_id)
    .eq("service_id", service);
  return {
    alreadyBound: data !== null && data.length > 0,
    error: error,
  };
};

const createAccount = async ({
  full_name,
  account_id,
  username,
}: {
  full_name: string;
  account_id: string;
  username: string | null;
}): Promise<string> => {
  const profile = await adminSupabase
    .from("profile")
    .insert({
      nickname: full_name,
    })
    .select("*")
    .single();
  console.log("PROFILE INSERTED, NOW INSERTING USER_PROFILE");

  const user_profile_id = profile.data?.id;

  if (!user_profile_id) throw new Error("Missing profile_id");

  const userprofile = await adminSupabase.from("user_profile").insert({
    account_id: account_id,
    user_profile_id: user_profile_id,
    username: username, // Add the missing 'username' property
  });
  console.log("USER PROFILE", userprofile);
  if (userprofile.error) throw new Error("Error inserting user profile");
  return user_profile_id;
};
