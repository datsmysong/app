import { JSONTrack, RoomJSON } from "commons/backend-types";
import { Socket } from "socket.io";
import RoomStorage from "../RoomStorage";
import MusicPlatform from "../musicplatform/MusicPlatform";
import TrackFactory from "../musicplatform/TrackFactory";
import Remote from "../musicplatform/remotes/Remote";

export default class Room {
  public readonly uuid: string;
  private readonly queue: JSONTrack[];
  private readonly trackFactory: TrackFactory;
  private readonly streamingService: MusicPlatform;
  private remote: Remote | null = null;
  private hostSocket: Socket | null;

  private constructor(
    uuid: string,
    streamingService: MusicPlatform,
    hostSocket: Socket | null
  ) {
    this.uuid = uuid;
    this.queue = [];
    this.streamingService = streamingService;

    this.trackFactory = new TrackFactory();
    this.trackFactory.register(this.streamingService);
    this.hostSocket = hostSocket;
  }

  static async getOrCreate(
    roomStorage: RoomStorage,
    uuid: string,
    streamingService: MusicPlatform,
    hostSocket: Socket | null
  ): Promise<Room> {
    let room = roomStorage.getRoom(uuid);

    if (room === null) {
      room = new Room(uuid, streamingService, hostSocket);
      const remote = await streamingService.getRemote(room, streamingService);
      room.setRemote(remote);
      roomStorage.addRoom(room);
    } else {
      room.setHostSocket(hostSocket);
    }

    return room;
  }
  setRemote(remote: Remote | null) {
    this.remote = remote;
  }

  setHostSocket(hostSocket: Socket | null) {
    this.hostSocket = hostSocket;
  }

  static toJSON(room: Room | null | undefined): RoomJSON | Error {
    if (room instanceof Room) {
      return {
        currentActiveRoom: room.uuid,
        queue: room.getQueue(),
        currentlyPlaying: null,
      };
    } else {
      return {
        name: "Unknown room",
        message: "the given id is not active room",
      };
    }
  }

  async add(rawUrl: string) {
    const trackMetadata = this.trackFactory.fromUrl(rawUrl);
    if (trackMetadata !== null) {
      const track = await trackMetadata.toJSON();
      if (track !== null) {
        if (!this.queue.map((value) => value.url).includes(track.url)) {
          this.queue.push(track);
          return true;
        }
      }
    }
    return false;
  }

  async removeWithLink(rawUrl: string) {
    // try to get the uniform URL of track from lambda url
    let trackURL = null;
    const trackMetadata = this.trackFactory.fromUrl(rawUrl);
    if (trackMetadata !== null) {
      const track = await trackMetadata.toJSON();
      if (track !== null) {
        trackURL = new URL(track.url).toString();
      }
    }

    let track;
    for (track of this.queue) {
      if (trackURL !== null) {
        if (track.url === trackURL) {
          return await this.removeWithIndex(this.queue.indexOf(track));
        }
      }
    }
    return false;
  }

  async removeWithIndex(index: number) {
    return this.queue.splice(index, 1).length !== 0;
  }

  getHostSocket(): Socket | null {
    return this.hostSocket;
  }

  getQueue(): JSONTrack[] {
    return [...this.queue];
  }

  getRemote(): Remote | null {
    return this.remote;
  }

  getStreamingService(): MusicPlatform {
    return this.streamingService;
  }

  size(): number {
    return this.queue.length;
  }
}