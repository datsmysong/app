import { PostgrestError } from "@supabase/supabase-js";
import { UserProfile } from "commons/database-types-utils";

import { supabase } from "./supabase";

type JoinRoomFunction = (
  roomId: string,
  userProfile: UserProfile | null,
  isParticipant?: boolean
) => Promise<{ error: string } | { error: PostgrestError | null }>;

type GetParticipantFunction = (
  roomId: string,
  userProfile: UserProfile | null
) => Promise<{ error: string } | { error: PostgrestError | null }>;

export const joinRoom: JoinRoomFunction = async (
  roomId: string,
  userProfile: UserProfile | null,
  isParticipant?: boolean
) => {
  if (!userProfile) return { error: "Unauthorized" };
  if (!roomId) return { error: "Unknown room" };

  if (isParticipant) return { error: null };

  const { error: roomUsersError } = await supabase.from("room_users").insert({
    room_id: roomId,
    profile_id: userProfile.user_profile_id,
  });

  return { error: roomUsersError };
};
