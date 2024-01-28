import { Database } from "./database-types";
// prettier-ignore
export type BoundService = Database["public"]["Tables"]["bound_services"]["Row"];
// prettier-ignore
export type FriendList = Database["public"]["Tables"]["friends_list"]["Row"];
// prettier-ignore
export type FriendRequest = Database["public"]["Tables"]["friends_request"]["Row"];
// prettier-ignore
export type Profile = Database["public"]["Tables"]["profile"]["Row"];
// prettier-ignore
export type RoomConfiguration = Database["public"]["Tables"]["room_configurations"]["Row"];
// prettier-ignore
export type RoomHistory = Database["public"]["Tables"]["room_history"]["Row"];
// prettier-ignore
export type RoomUser = Database["public"]["Tables"]["room_users"]["Row"];
// prettier-ignore
export type Room = Database["public"]["Tables"]["rooms"]["Row"];
// prettier-ignore
export type StreamingService = Database["public"]["Tables"]["streaming_services"]["Row"];
// prettier-ignore
export type UserProfile = Database["public"]["Tables"]["user_profile"]["Row"];
