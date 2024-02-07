import { JSONTrack, RoomJSON } from "commons/backend-types";
import { Socket } from "socket.io";
import RoomStorage from "../RoomStorage";
import MusicPlatform from "../musicplatform/MusicPlatform";
import TrackFactory from "../musicplatform/TrackFactory";
import Remote from "../musicplatform/remotes/Remote";
import { RoomWithConfigDatabase } from "./RoomDatabase";
import { adminSupabase } from "../server";

export default class Room {
  public readonly uuid: string;
  private readonly queue: JSONTrack[];
  private readonly trackFactory: TrackFactory;
  private readonly streamingService: MusicPlatform;
  private readonly room: RoomWithConfigDatabase;
  private remote: Remote | null = null;
  private hostSocket: Socket | null;
  private counterSkipActualTrack: string[] = [];

  private constructor(
    uuid: string,
    streamingService: MusicPlatform,
    hostSocket: Socket | null,
    roomWithConfig: RoomWithConfigDatabase
  ) {
    this.uuid = uuid;
    this.queue = [];
    this.streamingService = streamingService;
    this.room = roomWithConfig;

    this.trackFactory = new TrackFactory();
    this.trackFactory.register(this.streamingService);
    this.hostSocket = hostSocket;
  }

  static async getOrCreate(
    roomStorage: RoomStorage,
    uuid: string,
    streamingService: MusicPlatform,
    hostSocket: Socket | null,
    roomWithConfig: RoomWithConfigDatabase
  ): Promise<Room> {
    let room = roomStorage.getRoom(uuid);

    if (room === null) {
      room = new Room(uuid, streamingService, hostSocket, roomWithConfig);
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

  getConfig() {
    return this.room.room_configurations;
  }

  skipActualTrack() {
    if (this.remote !== null) {
      this.remote.next();
    }
  }

  addVoteSkip(index: number, userId: string) {
    const track = this.queue[index];
    if (!track.votes) return;
    if (index === -1) {
      if (!this.counterSkipActualTrack.includes(userId)) {
        this.counterSkipActualTrack.push(userId);
        this.verifyVoteSkip(index);
        return;
      }
      this.counterSkipActualTrack = this.counterSkipActualTrack.filter(
        (value) => value !== userId
      );
      return;
    }
    if (index >= 0 && index < this.queue.length) {
      // If the user has already voted, we remove his vote
      if (track.votes.includes(userId)) {
        track.votes = track.votes.filter((value) => value !== userId);
        return;
      }
      track.votes.push(userId);
    }
  }

  async verifyVoteSkip(index: number) {
    const track = this.queue[index];
    const config = this.room.room_configurations;
    if (!track.votes || !config) return;

    const nbParticipant = await this.getParticipants();
    if (!nbParticipant) return;
    const voteRatePercentage = (track.votes.length / nbParticipant) * 100;
    console.log(
      "nbParticipant",
      nbParticipant,
      " verificatiron ",
      voteRatePercentage,
      " config ",
      config
    );

    if (voteRatePercentage >= config.vote_skipping_needed_percentage) {
      console.log("skip");
      // TODO
    }
  }

  async getParticipants() {
    const { count } = await adminSupabase
      .from("room_users")
      .select("profile_id", {
        count: "exact",
      })
      .eq("room_id", this.uuid);
    return count;
  }
}
