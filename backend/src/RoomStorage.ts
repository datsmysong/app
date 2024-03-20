import { Socket } from "socket.io";
import Deezer from "./musicplatform/Deezer";
import MusicPlatform from "./musicplatform/MusicPlatform";
import SoundCloud from "./musicplatform/SoundCloud";
import Spotify from "./musicplatform/Spotify";
import { adminSupabase } from "./server";
import Room from "./socketio/Room";
import { RoomWithForeignTable } from "./socketio/RoomDatabase";
import { Response } from "commons/socket.io-types";

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

  async roomFromUuid(
    rawUuid: string,
    hostSocket: Socket | null
  ): Promise<Response<Room>> {
    const { data: remoteRoom } = await adminSupabase
      .from("rooms")
      .select("*, streaming_services(*), room_configurations(*)")
      .eq("id", rawUuid)
      .eq("is_active", true)
      .single();

    if (!remoteRoom)
      return {
        data: null,
        error: "Room not found",
      };

    const parseRemote = parseRemoteRoom(remoteRoom);
    if (!parseRemote)
      return {
        data: null,
        error: "Error parsing remote room",
      };
    const { musicPlatform, roomWithConfig } = parseRemote;

    return Room.getOrCreate(
      this,
      remoteRoom.id,
      musicPlatform,
      hostSocket,
      roomWithConfig
    );
  }

  async roomFromCode(
    code: string,
    hostSocket: Socket
  ): Promise<Response<Room>> {
    const { data: remoteRoom } = await adminSupabase
      .from("rooms")
      .select("*, streaming_services(*), room_configurations(*)")
      .eq("code", code)
      .eq("is_active", true)
      .single();

    if (!remoteRoom)
      return {
        data: null,
        error: "Room not found",
      };

    const parseRemote = parseRemoteRoom(remoteRoom);
    if (!parseRemote)
      return {
        data: null,
        error: "Error parsing remote room",
      };
    const { musicPlatform, roomWithConfig } = parseRemote;

    return Room.getOrCreate(
      this,
      remoteRoom.id,
      musicPlatform,
      hostSocket,
      roomWithConfig
    );
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

const parseRemoteRoom = (remoteRoom: RoomWithForeignTable | null) => {
  if (remoteRoom === null || !remoteRoom.streaming_services) {
    return null;
  }
  const { streaming_services: streamingService, ...roomWithConfig } =
    remoteRoom;

  const musicPlatform = getMusicPlatform(streamingService?.service_id);

  if (!musicPlatform || !roomWithConfig) {
    return null;
  }

  return {
    musicPlatform,
    roomWithConfig,
  };
};
