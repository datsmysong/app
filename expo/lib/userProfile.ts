import { supabase } from "./supabase";

export const getUserProfile = async (id: string) => {
  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("account_id", id)
    .single();
  if (error) {
    throw error;
  }
  return data;
};
