import { adminSupabase } from "../server";
import { FastifyReply, FastifyRequest } from "fastify";
import createClient from "./supabase";

export async function getUserProfileIdFromAccountId(accId: string) {
  const { data, error } = await getUserProfileFromRequest(accId);

  if (error) return { data: null, error };
  return { data: data.user_profile_id, error: null };
}

export async function getUserProfileFromRequest(accountId: string) {
  const { data, error } = await adminSupabase
    .from("user_profile")
    .select("*")
    .eq("account_id", accountId)
    .single();

  if (error) return { data: null, error };
  return { data, error: null };
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

export async function getUserFromRequest(
  request: FastifyRequest,
  response: FastifyReply
) {
  const supabase = createClient({ request, response });

  return await supabase.auth.getUser();
}

export async function getCurrentUser(
  request: FastifyRequest,
  response: FastifyReply
) {
  const user = await getUserFromRequest(request, response);
  if (!user.data.user) {
    return response.code(400).send("Missing user");
  }
  const userProfileIdRes = await getUserProfileIdFromAccountId(
    user.data.user.id
  );
  if (userProfileIdRes.error)
    return response.code(500).send(userProfileIdRes.error);
  return userProfileIdRes.data;
}

export function unauthorizedResponse(response: FastifyReply) {
  return response.code(401).send("User not logged in");
}
