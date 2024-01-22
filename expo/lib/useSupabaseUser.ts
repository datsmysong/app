import { supabase } from "./supabase";

export default async function useSupabaseUser() {
  const { data, error } = await supabase.auth.getSession();
  if (!data.session || error) {
    return null;
  }
  const user = data.session.user;
  return user;
}
