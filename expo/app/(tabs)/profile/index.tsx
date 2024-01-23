import { StyleSheet } from "react-native";
import { supabase } from "../../../lib/supabase";
import useSupabaseUser from "../../../lib/useSupabaseUser";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Button from "../../../components/Button";
import React from "react";
import { View, Text } from "../../../components/Tamed";

export default function TabsProfile() {
  const [user, setUser] = useState<User | null>();
  useEffect(() => {
    const fetchUser = async () => {
      const res = await useSupabaseUser();
      setUser(res);
    };

    fetchUser();
  }, []);

  return (
    <>
      {user && (
        <View style={styles.elements}>
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

const styles = StyleSheet.create({
  elements: {
    gap: 10,
  },
});
