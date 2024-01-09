import { FastifyRequest, FastifyReply } from "fastify";
import createClient from "../lib/supabase";
import { adminSupabase } from "../server";
import { Database } from "../types/dbTypes";

export default async function AuthCallbackGET(
  request: FastifyRequest,
  response: FastifyReply
) {
  const supabase = createClient({
    request,
    response,
  });
  const code = (
    request.query as {
      code: string;
    }
  ).code;
  let needInsert = false;
  if (!code) response.code(400).send({ error: "Missing code" });

  const { data } = await supabase.auth.exchangeCodeForSession(code);
  if (!data.session)
    return response.code(400).send({ error: "Missing session" });
  // console.log("SESSION", data);
  console.log("SESSION", data.session);

  const providerToken = data.session.provider_token;
  const providerRefreshToken = data.session.provider_refresh_token;

  let user_profile_id;
  const user = await adminSupabase
    .from("user_profile")
    .select("*")
    .eq("account_id", data.user.id)
    .single();
  if (!user.error) {
    console.log("Auth: already account", user.data);

    user_profile_id = user.data.user_profile_id;
  } else {
    console.log("Auth: new account");

    request.log.info("New user", data.user.id);
    const profile = await adminSupabase
      .from("profile")
      .insert({
        nickname: data.user.user_metadata.full_name,
      })
      .select("*")
      .single();
    console.log("PROFILE INSERTED, NOW INSERTING USER_PROFILE");

    if (!data) throw new Error("Missing data");
    user_profile_id = profile.data?.id;

    if (!user_profile_id) throw new Error("Missing profile_id");

    const userprofile = await adminSupabase.from("user_profile").insert({
      account_id: data.user.id,
      user_profile_id: user_profile_id,
      username: null, // Add the missing 'username' property
    });
    console.log("USER PROFILE", userprofile);
    if (userprofile.error) throw new Error("Error inserting user profile");

    needInsert = true;
  }
  // if not an new user, check if the user is already bound to spotify
  if (!needInsert) {
    const alreadyService = await adminSupabase
      .from("bound_services")
      .select("*")
      .eq("user_profile_id", user_profile_id)
      .eq("service_id", "a2d17b25-d87e-42af-9e79-fd4df6b59222");
    if (alreadyService.error) {
      console.error("error fetch", alreadyService.error);
      return response.code(500).send({ error: alreadyService.error });
    }
    console.log("bound_services", alreadyService);

    if (alreadyService.data.length == 0) needInsert = true;
  }
  // account not already bound to spotify
  if (needInsert) {
    request.log.info("New bound_service", data.user.id);
    const timestmap = data.session.expires_at;
    // add time zone to timestamp
    if (!timestmap) throw new Error("Missing timestamp");
    const date = new Date(timestmap);
    //! TODO: This is hardcoded for now, but should be dynamic (only Spotify for now)
    const service: Database["public"]["Tables"]["bound_services"]["Row"] = {
      access_token: providerToken ?? null,
      refresh_token: providerRefreshToken ?? null,
      expires_in: date.toISOString(),
      user_profile_id: user_profile_id,
      service_id: "a2d17b25-d87e-42af-9e79-fd4df6b59222",
    };
    const { error } = await adminSupabase
      .from("bound_services")
      .insert(service);
    if (error) {
      console.error("impossible to insert into bound_services", error);
      console.log("Objet", service);
      response.code(500).send({ error: "Impossible to bound this from " });
    }
  }
  const refresh_token = data.session.refresh_token;
  response.redirect("http://localhost:8081#refresh_token=" + refresh_token);
}
