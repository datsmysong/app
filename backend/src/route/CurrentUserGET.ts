import { FastifyReply, FastifyRequest } from "fastify";
import createClient from "../lib/supabase";
import { adminSupabase } from "../server";

export default async function CurrentUserGET(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const supabase = createClient({ request, response });
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return { code: 401, message: "User not authenticated" };
  }
  const userId =
    (await getUserProfileIdFromAccountId(user.data.user.id)) || null;

  if (userId) {
    response.code(200).send({ userId: userId });
  } else {
    response.code(404).send({ message: "User profile not found" });
  }
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
