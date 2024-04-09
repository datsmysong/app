import { PostgrestError } from "@supabase/supabase-js";
import { Room, RoomUser, UserProfile } from "commons/database-types-utils";

import { supabase } from "./supabase";

/**
 * Joins a room by inserting the user's profile into the room_users table.
 * If the user is already a participant, it will act like he joined the room.
 */
export async function joinRoom(
  roomId: string,
  userProfile: UserProfile | null,
  isParticipant?: boolean
): Promise<{ error: string | PostgrestError | null }> {
  if (!userProfile) return { error: "Unauthorized" };

  if (isParticipant) return { error: null };

  const { error: roomUsersError } = await supabase.from("room_users").upsert({
    room_id: roomId,
    profile_id: userProfile.user_profile_id,
    has_left: false,
  });

  return { error: roomUsersError };
}

export async function getParticipant(
  roomId: string,
  userProfile: UserProfile | null
): Promise<{ data: RoomUser[] | null }> {
  if (!userProfile) return { data: null };

  const { data: participant } = await supabase
    .from("room_users")
    .select("*")
    .eq("profile_id", userProfile.user_profile_id)
    .eq("room_id", roomId)
    .eq("has_left", false);

  return { data: participant };
}

export async function getRoomId(
  roomCode: string
): Promise<{ data: string | null; error: PostgrestError | null }> {
  const { data: room, error: roomsError } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", roomCode)
    .eq("is_active", true)
    .single();

  if (roomsError) return { data: null, error: roomsError };
  return { data: room.id, error: null };
}
