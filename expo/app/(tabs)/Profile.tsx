import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Text } from "react-native";

import Button from "../../components/Button";
import { supabase } from "../../lib/supabase";
import useSupabaseUser from "../../lib/useSupabaseUser";

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
        <Button prependIcon="logout" onPress={() => supabase.auth.signOut()}>
          Se déconnecter
        </Button>
      )}
    </>
  );
}
