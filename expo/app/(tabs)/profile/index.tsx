import React from "react";
import { StyleSheet } from "react-native";

import Button from "../../../components/Button";
import { View } from "../../../components/Tamed";
import { supabase } from "../../../lib/supabase";
import { useSupabaseUserHook } from "../../../lib/useSupabaseUser";

export default function TabsProfile() {
  const user = useSupabaseUserHook();

  return (
    <>
      {user && (
        <View style={styles.elements}>
          <Button prependIcon="details" href="/profile/integration">
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
