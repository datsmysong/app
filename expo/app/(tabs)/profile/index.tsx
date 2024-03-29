import { Profile } from "commons/database-types-utils";
import User from "phosphor-react-native/src/icons/User";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import Button from "../../../components/Button";
import { Text } from "../../../components/Themed";
import Avatar from "../../../components/profile/Avatar";
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
