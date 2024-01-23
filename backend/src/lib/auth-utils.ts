import { adminSupabase } from "../server";
import { FastifyReply, FastifyRequest } from "fastify";
import createClient from "./supabase";

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

export async function getUserFromRequest(
  request: FastifyRequest,
  response: FastifyReply
) {
  const supabase = createClient({ request, response });

  return await supabase.auth.getUser();
}
