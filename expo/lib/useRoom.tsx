import { QueryData } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { supabase } from "./supabase";

const fetchData = supabase.from("rooms").select("*, streaming_services(*)");
export type ActiveRoom = QueryData<typeof fetchData>[0];

export default function useRoom(roomId: string) {
  const [room, setRoom] = useState<ActiveRoom | null>(null);

  /** This is temporary, since the query is duplicated */
  const conditionalFetchData = supabase
    .from("rooms")
    .select("*, streaming_services(*)");

  useEffect(() => {
    async function fetchRoom() {
      const { data } = await conditionalFetchData.eq("id", roomId).single();
      setRoom(data);
    }
    fetchRoom();
  }, [roomId]);

  return room;
}
