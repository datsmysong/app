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

  const { data } = await supabase
    .from("room_users")
    .select("*")
    .eq("room_id", roomId)
    .eq("profile_id", userProfile.user_profile_id)
    .eq("has_left", true);

  if ((data?.length ?? 0) > 0) {
    const { error: roomUsersError } = await supabase
      .from("room_users")
      .update({ has_left: false })
      .eq("room_id", roomId)
      .eq("profile_id", userProfile.user_profile_id);

    return { error: roomUsersError };
  }

  const { error: roomUsersError } = await supabase.from("room_users").insert({
    room_id: roomId,
    profile_id: userProfile.user_profile_id,
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

export async function getRoomHostedByUser(
  roomId: string,
  userProfile: UserProfile | null,
  isActive: boolean
): Promise<{ data: Room[] | null }> {
  if (!userProfile) return { data: null };

  const { data: room } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .eq("host_user_profile_id", userProfile.user_profile_id)
    .eq("is_active", isActive);

  if (!room) return { data: null };
  return { data: room };
}

export async function removeUserFromRoom(
  roomId: string,
  userProfile: UserProfile | null
): Promise<{ error: string | PostgrestError | null }> {
  if (!userProfile) return { error: "Unauthorized" };

  const { error: roomUsersError } = await supabase
    .from("room_users")
    .update({ has_left: true })
    .eq("room_id", roomId)
    .eq("profile_id", userProfile.user_profile_id);

  return { error: roomUsersError };
}
