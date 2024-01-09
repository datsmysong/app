import { FastifyRequest, FastifyReply } from "fastify";
import createClient from "../lib/supabase";
import { adminSupabase } from "../server";

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
  if (!code) response.code(400).send({ error: "Missing code" });

  const { data } = await supabase.auth.exchangeCodeForSession(code);
  if (!data.session)
    return response.code(400).send({ error: "Missing session" });
  // console.log("SESSION", data);
  console.log("SESSION", data.session);

  const providerToken = data.session.provider_token;
  const providerRefreshToken = data.session.provider_refresh_token;
  const alreadyService = await adminSupabase
    .from("bound_services")
    .select("*")
    .eq("user_profile_id", data.user.id)
    .eq("service_id", "a2d17b25-d87e-42af-9e79-fd4df6b59222");
  if (alreadyService.error) {
    console.error("error fetch", alreadyService.error);
    return response.code(500).send({ error: alreadyService.error });
  }
  console.log("bound_services", alreadyService);

  if (alreadyService.data.length == 0) {
    console.log("try insert");
    request.log.info("New bound_service", data.user.id);
    const { error } = await adminSupabase.from("bound_services").insert({
      access_token: providerToken,
      refresh_token: providerRefreshToken,
      expires_in: data.session.expires_at,
      user_profile_id: data.user.id,
      //! TODO: This is hardcoded for now, but should be dynamic (only Spotify for now)
      service_id: "a2d17b25-d87e-42af-9e79-fd4df6b59222",
    });
    if (error) {
      console.error("impossible to insert into bound_services", error);
      console.log("Objet", {
        access_token: providerToken,
        refresh_token: providerRefreshToken,
        expires_in: data.session.expires_at,
        user_profile_id: data.user.id,
      });

      request.log.error("impossible to insert into bound_services", error);
      return response.code(500).send({ error });
    }
  }
  const refresh_token = data.session.refresh_token;
  response.redirect("http://localhost:8081#refresh_token=" + refresh_token);
}
