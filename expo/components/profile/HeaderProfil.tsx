import User from "phosphor-react-native/src/bold/User";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import Avatar from "./Avatar";
import { supabase } from "../../lib/supabase";
import { Profile } from "../../lib/types";
import { useSupabaseUserHook } from "../../lib/useSupabaseUser";
import { useUserProfile } from "../../lib/userProfile";
import Button from "../Button";
import { Text } from "../Themed";
import H1 from "../text/H1";

export const ProfileHeader = () => {
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

  return (
    <View
      style={{
        flexDirection: "column",
        backgroundColor: "#E6E6E6",
        flex: 1,
        paddingVertical: 18,
        rowGap: 18,
        paddingHorizontal: 38,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <H1>Profil</H1>
        <View>
          <Button
            href="/(tabs)/profile/account"
            size="small"
            prependIcon={<User />}
          >
            Gérer mon compte
          </Button>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          height: 50,
          alignItems: "center",
        }}
      >
        <View style={{ width: 40 }}>
          <Avatar
            id={userProfile ? userProfile.user_profile_id : ""}
            radius={90}
            noCaches
          />
        </View>
        <View style={profileStyles.personalityView}>
          <Text style={profileStyles.username}>
            {userProfile ? userProfile.username : "chargement"}
          </Text>
          <Text style={profileStyles.nickname}>@{profile?.nickname}</Text>
        </View>
      </View>
    </View>
  );
};

const profileStyles = StyleSheet.create({
  personalityView: {
    flexDirection: "column",
    marginHorizontal: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Outfit-Regular",
  },
  nickname: {
    fontSize: 14,
    fontFamily: "Outfit-Regular",
    color: "#B2B2B2",
  },
});
