import { User } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

import { supabase } from "./supabase";

export default async function useSupabaseUser() {
  const { data, error } = await supabase.auth.getSession();
  if (!data.session || error) {
    return null;
  }
  const user = data.session.user;
  return user;
}

// create real hook
export function useSupabaseUserHook(): User | null | undefined {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  const prevUserRef = useRef<User | null | undefined>(undefined);

  useEffect(() => {
    prevUserRef.current = user;
  }, [user]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        if (
          prevUserRef.current === null ||
          JSON.stringify(currentUser) !== JSON.stringify(prevUserRef.current)
        )
          setUser(currentUser);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  return user;
}
