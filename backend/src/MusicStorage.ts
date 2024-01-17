import Room from "./Room";

export default class MusicStorage {
  private static singleton: MusicStorage;
  private readonly data: Map<string, Room>;

  private constructor() {
    this.data = new Map();
  }

  static getMusicStorage(): MusicStorage {
    if (this.singleton === undefined) {
      this.singleton = new MusicStorage();
    }
    return this.singleton;
  }

  addRoom(room: Room) {
    this.data.set(room.uuid, room);
  }

  removeRoomByUuid(uuid: string) {
    this.data.delete(uuid)
  }

  removeRoom(room: Room) {
    this.data.delete(room.uuid)
  }

  getRoom(activeRoomId: string): Room | null {
    return this.data.get(activeRoomId) ?? null
  }
}