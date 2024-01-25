import { PostgrestError } from "@supabase/supabase-js";
import { RoomUser, UserProfile } from "commons/database-types-utils";

import { supabase } from "./supabase";

type JoinRoomFunction = (
  roomId: string,
  userProfile: UserProfile | null,
  isParticipant?: boolean
) => Promise<{ error: string | PostgrestError | null }>;

type GetParticipantFunction = (
  roomId: string,
  userProfile: UserProfile | null
) => Promise<{
  data: RoomUser[] | null;
}>;

type GetRoomIdFunction = (
  roomCode: string
) => Promise<{ data: string | null; error: PostgrestError | null }>;

/**
 * Joins a room by inserting the user's profile into the room_users table.
 * If the user is already a participant, it will act like he joined the room.
 */
export const joinRoom: JoinRoomFunction = async (
  roomId: string,
  userProfile: UserProfile | null,
  isParticipant?: boolean
) => {
  if (!userProfile) return { error: "Unauthorized" };

  if (isParticipant) return { error: null };

  const { error: roomUsersError } = await supabase.from("room_users").insert({
    room_id: roomId,
    profile_id: userProfile.user_profile_id,
  });

  return { error: roomUsersError };
};

export const getParticipant: GetParticipantFunction = async (
  roomId: string,
  userProfile: UserProfile | null
) => {
  if (!userProfile) return { data: null };

  const { data: participant } = await supabase
    .from("room_users")
    .select("*")
    .eq("profile_id", userProfile.user_profile_id)
    .eq("room_id", roomId);

  return { data: participant };
};

export const getRoomId: GetRoomIdFunction = async (roomCode: string) => {
  const { data: room, error: activeRoomsError } = await supabase
    .from("active_rooms")
    .select("*")
    .eq("code", roomCode)
    .single();

  if (activeRoomsError) return { data: null, error: activeRoomsError };
  return { data: room.id, error: null };
};
