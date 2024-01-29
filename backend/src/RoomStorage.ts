import Deezer from "./musicplatform/Deezer";
import MusicPlatform from "./musicplatform/MusicPlatform";
import SoundCloud from "./musicplatform/SoundCloud";
import Spotify from "./musicplatform/Spotify";
import Room from "./room";
import { adminSupabase } from "./server";
/* import SoundCloud from "./musicplatform/SoundCloud";
import Deezer from "./musicplatform/Deezer";
 */
const STREAMING_SERVICES = {
  Spotify: "a2d17b25-d87e-42af-9e79-fd4df6b59222",
  SoundCloud: "c99631a2-f06c-4076-80c2-13428944c3a8",
  Deezer: "4f619f5d-4028-4724-87c4-f440df4659fe",
};

function getMusicPlatform(serviceId: string): MusicPlatform | null {
  switch (serviceId) {
    case STREAMING_SERVICES["Spotify"]:
      return new Spotify();
    case STREAMING_SERVICES["SoundCloud"]:
      return new SoundCloud();
    case STREAMING_SERVICES["Deezer"]:
      return new Deezer();
  }

  return null;
}

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
      .select("*, streaming_services(*)")
      .eq("id", rawUuid)
      .eq("is_active", true)
      .single();

    const streamingService = remoteRoom?.streaming_services;

    if (remoteRoom === null || !streamingService) {
      return null;
    }

    const musicPlatform = getMusicPlatform(streamingService?.service_id);

    if (!musicPlatform) {
      return null;
    }

    return Room.getOrCreate(this, remoteRoom.id, musicPlatform);
  }

  async roomFromCode(code: string): Promise<Room | null> {
    const { data: remoteRoom } = await adminSupabase
      .from("rooms")
      .select("*, streaming_services(*)")
      .eq("code", code)
      .eq("is_active", true)
      .single();

    const streamingService = remoteRoom?.streaming_services;

    if (remoteRoom === null || !streamingService) {
      return null;
    }

    const musicPlatform = getMusicPlatform(streamingService?.service_id);

    if (!musicPlatform) {
      return null;
    }

    if (remoteRoom === null) {
      return null;
    }

    return Room.getOrCreate(this, remoteRoom.id, musicPlatform);
  }

  async getRooms(): Promise<Room[]> {
    return [...this.data.values()];
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
