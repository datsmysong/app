import { FastifyReply, FastifyRequest } from "fastify";
import { adminSupabase } from "./server";
import createClient from "./lib/supabase";
import Spotify from "./musicplatform/Spotify";
import { randomUUID } from "node:crypto";
import RoomStorage from "./RoomStorage";
import TrackFactory from "./musicplatform/TrackFactory";
import { JSONTrack, RoomJSON } from "commons/Backend-types";

interface Error {
  error: { message: string };
}

export async function getUserFromRequest(
  request: FastifyRequest,
  response: FastifyReply
) {
  const supabase = createClient({ request, response });

  return await supabase.auth.getUser();
}

export async function getUserProfileIdFromAccountId(accId: string) {
  const { data, error } = await adminSupabase
    .from("user_profile")
    .select("user_profile_id")
    .eq("account_id", accId)
    .single();

  if (error) return { data: null, error };
  return { data: data.user_profile_id, error: null };
}

function unauthorizedResponse(response: FastifyReply) {
  return response.code(401).send("User not logged in");
}

export async function createRoom(
  name: string,
  code: string,
  voteSkipping: boolean,
  voteSkippingNeeded: number,
  maxMusicPerUser: number,
  maxMusicPerUserDuration: number,
  serviceId: string,
  req: FastifyRequest,
  rep: FastifyReply
) {
  const supabase = adminSupabase;
  const user = await getUserFromRequest(req, rep);

  // If the user is not logged in
  if (!user.data.user) return unauthorizedResponse(rep);

  // If we didn't manage to get the user profile id from the account id
  const { data: hostUserProfileId } = await getUserProfileIdFromAccountId(
    user.data.user.id
  );
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

  private constructor() {
    this.uuid = randomUUID();
    this.queue = [];

    this.trackFactory = new TrackFactory();
    this.trackFactory.register(
      new Spotify()
    ) /*, new SoundCloud(), new AppleMusic()*/;
  }

  static newRoom(roomStorage: RoomStorage): Room {
    const room = new Room();
    roomStorage.addRoom(room);
    return room;
  }

  static toJSON(room: Room | null | undefined): RoomJSON | Error {
    if (room instanceof Room) {
      return { currentActiveRoom: room.uuid, tracks: room.getQueue() };
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

  size(): number {
    return this.queue.length;
  }
}
