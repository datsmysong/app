import { PostgrestError, QueryData, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { supabase } from "./supabase";
import { useSupabaseUserHook } from "./useSupabaseUser";

const userProfileQuery = supabase
  .from("user_profile")
  .select("*, profile(*)")
  .single();

type UserProfileQueryResponse = QueryData<typeof userProfileQuery>;

export const getUserProfile = async (id: string) => {
  const { data, error } = await supabase
    .from("user_profile")
    .select("*, profile(*)")
    .eq("account_id", id)
    .single();
  if (error) {
    return null;
  }
  return data;
};

export const getUserProfileFromUserProfileId = async (id: string) => {
  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("user_profile_id", id)
    .single();
  if (error) {
    return null;
  }
  return data;
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfileQueryResponse | null>();
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

const fullProfileRequest = supabase
  .from("user_profile")
  .select("*, profile(*)")
  .single();

type FullProfile = QueryData<typeof fullProfileRequest>;

export function useUserFullProfile() {
  const [profile, setProfile] = useState<FullProfile | null>();
  const user = useSupabaseUserHook();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return setProfile(null);

      const { data, error } = await supabase
        .from("user_profile")
        .select("*, profile(*)")
        .eq("account_id", user.id)
        .single();

      if (error) {
        return setProfile(null);
      }

      setProfile(data);
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
