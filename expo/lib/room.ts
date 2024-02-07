import { supabase } from "./supabase";

export const getRoom = async (id: string) => {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    return null;
  }
  return data;
};
