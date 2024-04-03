import { Profile } from "commons/database-types-utils";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { Text } from "../../../components/Themed";
import { supabase } from "../../../lib/supabase";
import { useSupabaseUserHook } from "../../../lib/useSupabaseUser";
import { useUserProfile } from "../../../lib/userProfile";

export default function TabsProfile() {
  const user = useSupabaseUserHook();
  const userProfile = useUserProfile();
  const [profile, setProfile] = useState<Profile | null>();

  useEffect(() => {
    if (!user) return;
    if (!userProfile) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .eq("id", userProfile.user_profile_id)
        .single();
      if (error) {
        return setProfile(null);
      }
      setProfile(data);
    };
    fetchProfile();
  }, [user, userProfile]);

  if (!userProfile) return <Text>...</Text>;

  return (
    <View>
      <Text>John</Text>
    </View>
  );
}
