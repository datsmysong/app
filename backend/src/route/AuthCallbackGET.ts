import { FastifyRequest, FastifyReply } from "fastify";
import createClient from "../lib/supabase";
import { adminSupabase } from "../server";
import { Database } from "../types/dbTypes";

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
  let needInsertBoundService = false;
  if (!code) response.code(400).send({ error: "Missing code" });

  const { data } = await supabase.auth.exchangeCodeForSession(code);
  if (!data.session)
    return response.code(400).send({ error: "Missing session" });

  const providerToken = data.session.provider_token;
  const providerRefreshToken = data.session.provider_refresh_token;
  let user_profile_id;
  const user = await adminSupabase
    .from("user_profile")
    .select("*")
    .eq("account_id", data.user.id)
    .single();
  if (!user.error) {
    // Already account
    user_profile_id = user.data.user_profile_id;
    if (!needInsertBoundService) {
      const serviceAlreadyBound = await adminSupabase
        .from("bound_services")
        .select("*")
        .eq("user_profile_id", user_profile_id)
        .eq("service_id", StreamingService.Spotify);
      if (serviceAlreadyBound.error) {
        console.error("error fetch", serviceAlreadyBound.error);
        return response.code(500).send({ error: serviceAlreadyBound.error });
      }
      if (serviceAlreadyBound.data.length == 0) needInsertBoundService = true;
    }
  } else {
    // New account
    try {
      user_profile_id = await createAccount({
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
  const timestmap = data.session.expires_at;
  // add time zone to timestamp
  if (!timestmap) throw new Error("Missing timestamp");
  const date = new Date(timestmap);
  if (needInsertBoundService) {
    // account not already bound to spotify
    request.log.info("New bound_service", data.user.id);
    const service: Database["public"]["Tables"]["bound_services"]["Row"] = {
      access_token: providerToken ?? null,
      refresh_token: providerRefreshToken ?? null,
      expires_in: date.toISOString(),
      user_profile_id: user_profile_id,
      service_id: StreamingService.Spotify,
    };
    const { error } = await adminSupabase
      .from("bound_services")
      .insert(service);
    if (error) {
      console.error("impossible to insert into bound_services", error);
      console.log("Objet", service);
      response.code(500).send({ error: "Impossible to bound this from " });
    }
  } else {
    // update with new token
    const { error } = await adminSupabase
      .from("bound_services")
      .update({
        access_token: providerToken ?? null,
        refresh_token: providerRefreshToken ?? null,
        expires_in: date.toISOString(),
      })
      .eq("user_profile_id", user_profile_id)
      .eq("service_id", "a2d17b25-d87e-42af-9e79-fd4df6b59222");
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
