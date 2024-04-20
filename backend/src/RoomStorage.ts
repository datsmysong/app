import { Socket } from "socket.io";
import Deezer from "./musicplatform/Deezer";
import MusicPlatform from "./musicplatform/MusicPlatform";
import SoundCloud from "./musicplatform/SoundCloud";
import Spotify from "./musicplatform/Spotify";
import { QueueableRemote } from "./musicplatform/remotes/Remote";
import { adminSupabase, server } from "./server";
import Room from "./socketio/Room";
import { RoomWithForeignTable } from "./socketio/RoomDatabase";
import { Response } from "commons/socket.io-types";

export const STREAMING_SERVICES = {
  Spotify: "a2d17b25-d87e-42af-9e79-fd4df6b59222",
  SoundCloud: "c99631a2-f06c-4076-80c2-13428944c3a8",
  Deezer: "4f619f5d-4028-4724-87c4-f440df4659fe",
};
const MUSIC_ENDING_SOON_DELAY = 10000;

export function getMusicPlatform(serviceId: string): MusicPlatform | null {
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
  private readonly startedTimer: Map<string, boolean>;

  private constructor() {
    this.data = new Map();
    this.startedTimer = new Map();
  }

  startTimer() {
    setInterval(async () => {
      const allRooms = await RoomStorage.getRoomStorage().getRooms();
      allRooms.forEach(async (room) => {
        const remote = room.getRemote();
        if (!remote) return;

        const lastKnownPlaybackState = room.getPlaybackState();
        // Avoid spamming REST APIs
        if (
          lastKnownPlaybackState !== null &&
          !room.getStreamingService().isClientSide()
        ) {
          if (Date.now() - lastKnownPlaybackState.updated_at < 5000) return;
        }

        // Fetching newest playback state and sending it to the room
        const newPlaybackStateResponse = await remote.getPlaybackState();
        server.io
          .of(`/room/${room.uuid}`)
          .emit("player:updatePlaybackState", newPlaybackStateResponse);

        const newPlaybackState = newPlaybackStateResponse.data;
        room.setPlaybackState(newPlaybackState);

        if (!newPlaybackState) {
          if (
            room.getQueue().length > 0 &&
            room.getStreamingService().isClientSide()
          ) {
            const nextTrack = room.shiftQueue();
            if (!nextTrack) return console.debug("No more tracks in the queue");
            return remote.playTrack(nextTrack.url);
          }

          return console.debug("No music is playing");
        }

        const remainingTime =
          newPlaybackState.duration - newPlaybackState.currentTime;
        const hasTriggeredEndingSoonValue = this.startedTimer.get(room.uuid);

        if (
          remainingTime < MUSIC_ENDING_SOON_DELAY &&
          !hasTriggeredEndingSoonValue &&
          !(remote instanceof QueueableRemote)
        ) {
          console.debug(
            `The track of the room ${room.uuid} is ending soon, and it doesn't support queueing`
          );
          this.startedTimer.set(room.uuid, true);

          setTimeout(() => {
            if (!newPlaybackStateResponse.data?.isPlaying)
              return console.debug("The track is not playing anymore");
            this.startedTimer.set(room.uuid, false);

            const nextTrack = room.shiftQueue();
            if (!nextTrack) return console.debug("No more tracks in the queue");

            remote.playTrack(nextTrack.url);
            console.debug(`The player will now play ${nextTrack.url}`);
          }, remainingTime);
        }

        const previousPlaybackState = room.getPreviousPlaybackState();

        // If the track has changed, we add the next track to the queue of the player
        if (newPlaybackState.url != previousPlaybackState?.url) {
          console.debug(`The track of room ${room.uuid} has changed`);

          if (remote instanceof QueueableRemote) {
            let nextTrack = room.getQueue().at(0);

            /* If the track that just started playing is the next track in the queue,
             * that means the streaming service has started playing it, most likely because
             * the previous track ended so we can remove it from the queue
             */
            if (nextTrack?.url === newPlaybackState.url) {
              room.shiftQueue();
              nextTrack = room.getQueue().at(0);
            }
            if (!nextTrack) return console.debug("No more tracks in the queue");

            remote.addToQueue(nextTrack.url);
            console.debug(`Just added ${nextTrack.url} to the queue`);
          }
        }
      });
    }, 1000);
  }

  static getRoomStorage(): RoomStorage {
    if (this.singleton === undefined) {
      this.singleton = new RoomStorage();
      this.singleton.startTimer();
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
