import {
  PlayingJSONTrack,
  RoomJSON,
  RoomJSONTrack,
} from "commons/backend-types";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "commons/socket.io-types";
import { Socket } from "socket.io";
import RoomStorage from "../RoomStorage";
import MusicPlatform from "../musicplatform/MusicPlatform";
import TrackFactory from "../musicplatform/TrackFactory";
import { QueueableRemote, Remote } from "../musicplatform/remotes/Remote";
import { adminSupabase } from "../server";
import { RoomWithConfigDatabase } from "./RoomDatabase";

export type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
import { Response } from "commons/socket.io-types";

export default class Room {
  public readonly uuid: string;

  private readonly history: RoomJSONTrack[];
  private readonly queue: RoomJSONTrack[];
  private readonly trackFactory: TrackFactory;
  private readonly streamingService: MusicPlatform;
  private readonly room: RoomWithConfigDatabase;
  private remote: Remote | null = null;
  private voteSkipActualTrack: string[] = [];
  private participants: string[] = [];
  private hostSocket: TypedSocket | null;
  private playbackState: PlayingJSONTrack | null = null;
  private previousPlaybackState: typeof this.playbackState = this.playbackState;

  private constructor(
    uuid: string,
    streamingService: MusicPlatform,
    hostSocket: Socket | null,
    roomWithConfig: RoomWithConfigDatabase
  ) {
    this.uuid = uuid;
    this.history = [];
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
    }

    if (hostSocket) {
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

  async add(rawUrl: string, accountId: string) {
    if (!this.remote) return;
    const trackMetadata = this.trackFactory.fromUrl(rawUrl);
    if (trackMetadata === null) return;

    const track = await trackMetadata.toJSON();
    if (track === null) return;

    // If the queue is currently empty and no track is playing, we can play the track immediately
    const { data: playbackState } = await this.remote.getPlaybackState();

    if (this.queue.map((value) => value.url).includes(track.url)) return;

    this.queue.push({
      ...track,
      addedBy: accountId,
      votes: [],
    });

    if (this.queue.length === 1 && playbackState === null) {
      const shiftedTrack = this.shiftQueue();
      if (!shiftedTrack) return;

      const response = await this.remote.playTrack(shiftedTrack.url);
      if (!response.error) await this.updatePlaybackState();
      return;
    }

    if (this.queue.length < 1) return;

    // For remote streaming services, we should add the track to the queue of the player
    if (!(this.remote instanceof QueueableRemote)) return;

    // Only add the track to the queue if it's the first track added to the queue
    // On QueuableRemotes, we only want the very next track to be in the queue, so that other tracks in the queue can be downvoted, without needing to remove the downvoted tracks from the QueuableRemote queue
    if (this.queue.length > 1) return;

    const queuableRemote = this.remote as QueueableRemote;
    queuableRemote.addToQueue(track.url);
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

  getQueue(): RoomJSONTrack[] {
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

  addToHistory(track: RoomJSONTrack) {
    this.history.push(track);
  }

  getHistory(): RoomJSONTrack[] {
    return this.history;
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

  setPlaybackState(newPlaybackState: typeof this.playbackState) {
    this.previousPlaybackState = this.playbackState;
    this.playbackState = newPlaybackState;
  }

  getPlaybackState(): typeof this.playbackState {
    return this.playbackState;
  }

  getPreviousPlaybackState(): typeof this.previousPlaybackState {
    return this.previousPlaybackState;
  }

  shiftQueue() {
    const result = this.queue.shift();
    this.hostSocket?.nsp.emit("queue:update", Room.toJSON(this));

    if (result) this.addToHistory(result);

    return result;
  }

  async updatePlaybackState() {
    if (this.remote === null) return;
    const playbackState = await this.remote.getPlaybackState();
    if (playbackState.data === null) return;

    this.setPlaybackState(playbackState.data);
    this.hostSocket?.nsp.emit("player:updatePlaybackState", playbackState);
  }
}
