import { PostgrestError } from "@supabase /supabase-js";
import { supabase } from "./supabase";
import useSupabaseUser from "./useSupabaseUser";

export const getUserProfile = async (id: string) => {
  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("account_id", id)
    .single();
  if (error) {
    return null;
  }
  return data;
};

export async function useUserProfile() {
  const user = await useSupabaseUser();
  if (!user) return null;
  const profile = await getUserProfile(user.id);
  return profile;
}

export const getUsernameFromUser = async (): Promise<{
  username: string | null;
  error: PostgrestError | null;
}> => {
  const user = await useSupabaseUser();
  if (!user?.id)
    return {
      username: null,
      error: null,
    };
  const { data, error } = await supabase
    .from("user_profile")
    .select("username")
    .eq("account_id", user?.id)
    .single();
  if (error) {
    return {
      username: null,
      error: error,
    };
  }
  return {
    username: data?.username ?? null,
    error: null,
  };
};
