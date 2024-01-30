import { PostgrestError, User } from "@supabase/supabase-js";
import { UserProfile } from "commons/database-types-utils";
import { useEffect, useState } from "react";

import { supabase } from "./supabase";
import { useSupabaseUserHook } from "./useSupabaseUser";

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

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>();
  const user = useSupabaseUserHook();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return setProfile(null);

      const userProfile = await getUserProfile(user.id);
      setProfile(userProfile);
    };

    fetchProfile();
  }, [user]);

  return profile;
}

export const getUsernameFromUser = async (
  user: User
): Promise<{
  username: string | null;
  error: PostgrestError | null;
}> => {
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
      error,
    };
  }
  return {
    username: data?.username ?? null,
    error: null,
  };
};
