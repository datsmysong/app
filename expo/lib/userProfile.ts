import Alert from "../components/Alert";
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

export const verifyUsername = async () => {
  const user = await useSupabaseUser();
  if (!user?.id) return;
  const { data, error } = await supabase
    .from("user_profile")
    .select("username")
    .eq("account_id", user?.id)
    .single();
  if (error) {
    Alert.alert("Erreur, Une erreur est survenue");
    return;
  }
  return data.username;
};
