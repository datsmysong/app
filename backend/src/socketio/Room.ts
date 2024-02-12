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
  private participants: string[] = [];

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

  /**
   *
   * @param index index of music (-1 for actual)
   * @param userId voter id
   * @returns true if added a vote
   */
  addVoteSkip(index: number, userId: string) {
    if (index === -1) {
      // Actual music
      if (!this.counterSkipActualTrack.includes(userId)) {
        this.counterSkipActualTrack.push(userId);
        return true;
      }
      this.counterSkipActualTrack = this.counterSkipActualTrack.filter(
        (value) => value !== userId
      );
      return false;
    }
    if (index < 0 || index >= this.queue.length) return false;

    const track = this.queue[index];
    if (!track.votes) return false;
    // If the user has already voted, we remove his vote
    if (track.votes.includes(userId)) {
      track.votes = track.votes.filter((value) => value !== userId);
      return false;
    }

    track.votes.push(userId);
    return true;
  }

  async verifyVoteSkip(
    index: number
  ): Promise<"actualTrackSkiped" | "queueTrackSkiped" | undefined> {
    const voteTrack = this.getVoteTrack(index);
    const config = this.room.room_configurations;

    if (!voteTrack || !config) return;

    const nbParticipant = this.participants.length;
    const voteRatePercentage = (voteTrack.length / nbParticipant) * 100;

    if (voteRatePercentage >= config.vote_skipping_needed_percentage) {
      console.log("skip");
      if (index === -1) {
        this.skipActualTrack();
        return "actualTrackSkiped";
      }
      this.removeWithIndex(index);
      return "queueTrackSkiped";
    }
    return;
  }

  getVoteTrack(index: number): string[] | undefined {
    if (index === -1) {
      return this.counterSkipActualTrack;
    }
    return this.queue[index].votes;
  }

  async updateParticipant() {
    const { data } = await adminSupabase
      .from("room_users")
      .select("profile_id")
      .eq("room_id", this.uuid);
    if (!data) return;
    this.participants = data.map((value) => value.profile_id);
  }
}
