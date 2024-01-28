import Room from "./room";
import { adminSupabase } from "./server";

export default class RoomStorage {
  private static singleton: RoomStorage;
  private readonly data: Map<string, Room>;

  private constructor() {
    this.data = new Map();
  }

  static getRoomStorage(): RoomStorage {
    if (this.singleton === undefined) {
      this.singleton = new RoomStorage();
    }
    return this.singleton;
  }

  async roomFromUuid(rawUuid: string): Promise<Room | null> {
    const { data: remoteRoom } = await adminSupabase
      .from("rooms")
      .select("*")
      .eq("id", rawUuid)
      .eq("is_active", true)
      .single();

    if (remoteRoom === null) {
      return null;
    }

    return Room.getOrCreate(this, remoteRoom.id);
  }

  async roomFromCode(code: string): Promise<Room | null> {
    const { data: remoteRoom } = await adminSupabase
      .from("rooms")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .single();

    if (remoteRoom === null) {
      return null;
    }

    return Room.getOrCreate(this, remoteRoom.id);
  }

  addRoom(room: Room) {
    this.data.set(room.uuid, room);
  }

  removeRoomByUuid(uuid: string) {
    this.data.delete(uuid);
  }

  removeRoom(room: Room) {
    this.data.delete(room.uuid);
  }

  getRoom(activeRoomId: string): Room | null {
    return this.data.get(activeRoomId) ?? null;
  }
}
