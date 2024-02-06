import { QueryData } from "@supabase/supabase-js";
import { adminSupabase } from "../server";

const queryWithConfig = adminSupabase
  .from("rooms")
  .select("*, room_configurations(*)");
export type RoomWithConfigDatabase = QueryData<typeof queryWithConfig>[0];

const queryInnerForeignTable = adminSupabase
  .from("rooms")
  .select("*, streaming_services(*), room_configurations(*)");
export type RoomWithForeignTable = QueryData<typeof queryInnerForeignTable>[0];
