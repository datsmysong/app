import { getCurrentUser, unauthorizedResponse } from "./lib/auth-utils";
import { JSONTrack, RoomJSON } from "commons/backend-types";
import { FastifyReply, FastifyRequest } from "fastify";
import RoomStorage from "./RoomStorage";
import MusicPlatform from "./musicplatform/MusicPlatform";
import TrackFactory from "./musicplatform/TrackFactory";
import { adminSupabase } from "./server";

interface Error {
  error: { message: string };
}

export async function createRoom(
  name: string,
  code: string,
  voteSkipping: boolean,
  voteSkippingNeeded: number,
  maxMusicPerUser: number,
  maxMusicPerUserDuration: number,
  serviceId: string,
  rep: FastifyReply,
  req: FastifyRequest
) {
  const supabase = adminSupabase;

  const hostUserProfileId = await getCurrentUser(req, rep);

  if (!hostUserProfileId) return unauthorizedResponse(rep);

  const roomConfigRes = await supabase
    .from("room_configurations")
    .insert({
      vote_skipping: voteSkipping,
      vote_skipping_needed_percentage: voteSkippingNeeded,
      max_music_count_in_queue_per_participant: maxMusicPerUser,
      max_music_duration: maxMusicPerUserDuration,
    })
    .select("id")
    .single();

  // If we didn't manage to create the room configuration
  if (roomConfigRes.error)
    return rep.code(roomConfigRes.status).send(roomConfigRes.error);

  const configurationId = roomConfigRes.data.id;

  const { error, data, status } = await supabase
    .from("rooms")
    .insert({
      name: name,
      code: code,
      configuration_id: configurationId,
      host_user_profile_id: hostUserProfileId,
      service_id: serviceId,
    })
    .select("id")
    .single();

  // If we didn't manage to create the room
  if (error || !data) return rep.code(status).send(error);

  const { error: roomUserError } = await supabase.from("room_users").insert({
    room_id: data.id,
    profile_id: hostUserProfileId,
  });

  // If we didn't manage to add the host to the participants
  if (error) return rep.code(500).send(roomUserError);

  const response = {
    error: null,
    data: {
      room_id: data.id,
    },
  };

  // If we managed to create the room
  return rep.code(201).send(response);
}

export function endRoom(roomId: string) {
  // TODO: Properly end room
  // This will set the join code of this room to null, and set is_active to false
}

export default class Room {
  public readonly uuid: string;
  private readonly queue: JSONTrack[];
  private readonly trackFactory: TrackFactory;
  private readonly streamingService: MusicPlatform;

  private constructor(uuid: string, streamingService: MusicPlatform) {
    this.uuid = uuid;
    this.queue = [];
    this.streamingService = streamingService;

    this.trackFactory = new TrackFactory();
    this.trackFactory.register(this.streamingService);
  }

  static getOrCreate(
    roomStorage: RoomStorage,
    uuid: string,
    streamingService: MusicPlatform
  ): Room {
    let room = roomStorage.getRoom(uuid);

    if (room === null) {
      room = new Room(uuid, streamingService);
      roomStorage.addRoom(room);
    }

    return room;
  }

  static toJSON(room: Room | null | undefined): RoomJSON | Error {
    if (room instanceof Room) {
      return {
        currentActiveRoom: room.uuid,
        queue: room.getQueue(),
        currentlyPlaying: null,
      };
    } else {
      return { error: { message: "the given id is not active room" } };
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

  getQueue(): JSONTrack[] {
    return [...this.queue];
  }

  getStreamingService(): MusicPlatform {
    return this.streamingService;
  }

  size(): number {
    return this.queue.length;
  }
}
