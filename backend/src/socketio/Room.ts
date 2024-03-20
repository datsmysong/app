import { JSONTrack, RoomJSON } from "commons/backend-types";
import { Socket } from "socket.io";
import RoomStorage from "../RoomStorage";
import MusicPlatform from "../musicplatform/MusicPlatform";
import TrackFactory from "../musicplatform/TrackFactory";
import Remote from "../musicplatform/remotes/Remote";
import { RoomWithConfigDatabase } from "./RoomDatabase";
import { adminSupabase } from "../server";
import { Response } from "commons/socket.io-types";

export default class Room {
  public readonly uuid: string;
  private readonly queue: JSONTrack[];
  private readonly trackFactory: TrackFactory;
  private readonly streamingService: MusicPlatform;
  private readonly room: RoomWithConfigDatabase;
  private remote: Remote | null = null;
  private hostSocket: Socket | null;
  private voteSkipActualTrack: string[] = [];
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
    this.updateParticipant();
  }

  static async getOrCreate(
    roomStorage: RoomStorage,
    uuid: string,
    streamingService: MusicPlatform,
    hostSocket: Socket | null,
    roomWithConfig: RoomWithConfigDatabase
  ): Promise<Response<Room>> {
    let room = roomStorage.getRoom(uuid);

    if (room === null) {
      room = new Room(uuid, streamingService, hostSocket, roomWithConfig);
      const { data: remote, error } = await streamingService.getRemote(
        room,
        streamingService
      );
      if (error) {
        return { data: null, error };
      }
      room.setRemote(remote);
      roomStorage.addRoom(room);
    } else {
      room.setHostSocket(hostSocket);
    }

    return { data: room, error: null };
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
        voteSkipActualTrack: room.voteSkipActualTrack,
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
    let trackURL: string | null = null;
    const trackMetadata = this.trackFactory.fromUrl(rawUrl);
    if (trackMetadata !== null) {
      const track = await trackMetadata.toJSON();
      if (track !== null) {
        trackURL = new URL(track.url).toString();
      }
    }

    if (!trackURL) return false;
    const trackIndex = this.queue.findIndex((track) => track.url === trackURL);
    if (trackIndex !== -1) {
      return await this.removeWithIndex(trackIndex);
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
   * Add a vote to skip a track
   * @param index index of music (-1 for actual playing track)
   * @param userId voter uuid (It should be the user uuid automatically retrieved from the token in the future)
   * @returns boolean : if the vote has been added or removed
   */
  addVoteSkip(index: number, userId: string) {
    // If the index is -1, we are voting to skip the actual track
    if (index === -1) {
      if (!this.voteSkipActualTrack.includes(userId)) {
        this.voteSkipActualTrack.push(userId);
        return true;
      }
      this.voteSkipActualTrack = this.voteSkipActualTrack.filter(
        (value) => value !== userId
      );
      return false;
    }
    // Range check of the index
    if (index < 0 || index >= this.queue.length) return false;

    const track = this.queue[index];
    if (!track.votes) return false;

    if (track.votes.includes(userId)) {
      track.votes = track.votes.filter((value) => value !== userId);
      return false;
    }
    track.votes.push(userId);
    return true;
  }

  /**
   * Verify if the track should be skiped and skip it if needed
   * @param index index of music (-1 for actual)
   * @returns  "actualTrackSkiped" | "queueTrackSkiped" | undefined if the track not skiped
   */
  async verifyVoteSkip(
    index: number
  ): Promise<"actualTrackSkiped" | "queueTrackSkiped" | undefined> {
    const voteTrack = this.getVoteTrack(index);
    const config = this.room.room_configurations;

    if (!voteTrack || !config) return;
    if (!config.vote_skipping) return;

    const nbParticipant = this.participants.length;
    const voteRatePercentage = (voteTrack.length / nbParticipant) * 100;

    if (voteRatePercentage < config.vote_skipping_needed_percentage) return;

    if (index === -1) {
      this.skipActualTrack();
      return "actualTrackSkiped";
    }
    this.removeWithIndex(index);
    return "queueTrackSkiped";
  }

  /**
   * Method to get the vote track of a specific track or the actual track
   * @param index  index of music (-1 for actual)
   * @returns uuid string of the voters
   */
  getVoteTrack(index: number): string[] | undefined {
    if (index === -1) {
      return this.voteSkipActualTrack;
    }
    return this.queue[index].votes;
  }

  /**
   * Fetch the participants of the room & update the participants list
   * @returns void
   */
  async updateParticipant() {
    const { data } = await adminSupabase
      .from("room_users")
      .select("profile_id")
      .eq("room_id", this.uuid);
    if (!data) return;
    this.participants = data.map((value) => value.profile_id);
  }
}
