import { Text } from "react-native";
import { supabase } from "../../../lib/supabase";
import useSupabaseUser from "../../../lib/useSupabaseUser";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Button from "../../../components/Button";
import React from "react";
import { View } from "../../../components/Tamed";
import { Link } from "expo-router";

export default function TabsProfile() {
  const [user, setUser] = useState<User | null>();
  useEffect(() => {
    useSupabaseUser().then((res) => {
      setUser(res);
    });
  }, []);

  return (
    <>
      <Text>Profile</Text>
      {user && (
        <View>
          <Button prependIcon={"details"} href={"/profile/integration"}>
            Intégrations
          </Button>
          <Button prependIcon="logout" onPress={() => supabase.auth.signOut()}>
            Se déconnecter
          </Button>
        </View>
      )}
    </>
  );
}
