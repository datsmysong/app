import { PlayingJSONTrack } from "commons/backend-types";
import {
  LocalPlayerServerToClientEvents,
  Response,
} from "commons/socket.io-types";
import Room from "../../socketio/Room";
import MusicPlatform from "../MusicPlatform";
import { Remote } from "./Remote";

export default class SoundCloudRemote extends Remote {
  room: Room;
  musicPlatform: MusicPlatform;

  protected constructor(room: Room, musicPlatform: MusicPlatform) {
    super();
    this.room = room;
    this.musicPlatform = musicPlatform;
  }

  static async createRemote(
    musicPlatform: MusicPlatform,
    room: Room
  ): Promise<Response<Remote>> {
    return { data: new SoundCloudRemote(room, musicPlatform), error: null };
  }

  getHostSocket(): (typeof this.room)["hostSocket"] {
    return this.room.getHostSocket();
  }

  async emitAndListen<T>(
    event: keyof LocalPlayerServerToClientEvents,
    data?: unknown
  ): Promise<Response<T>> {
    const hostSocket = this.getHostSocket();
    if (!hostSocket) {
      return { data: null, error: "Host socket not available" };
    }

    return new Promise((resolve) => {
      const listener = (response: unknown) => {
        hostSocket.off(event, listener);
        resolve(response as never);
      };

      hostSocket.on(event, listener);
      hostSocket.emit(event, data as never);
    });
  }

  async getPlaybackState(): Promise<Response<PlayingJSONTrack | null>> {
    return this.emitAndListen<PlayingJSONTrack | null>(
      "player:playbackStateRequest"
    );
  }

  async playTrack(trackId: string): Promise<Response<void>> {
    return this.emitAndListen<void>("player:playTrackRequest", trackId);
  }

  async setVolume(volume: number): Promise<Response<void>> {
    return this.emitAndListen<void>("player:setVolumeRequest", volume);
  }

  async seekTo(position: number): Promise<Response<void>> {
    return this.emitAndListen<void>("player:seekToRequest", position);
  }

  async play(): Promise<Response<void>> {
    return this.emitAndListen<void>("player:playRequest");
  }

  async pause(): Promise<Response<void>> {
    return this.emitAndListen<void>("player:pauseRequest");
  }

  async previous(): Promise<Response<void>> {
    return this.emitAndListen<void>("player:previousRequest");
  }

  async next(): Promise<Response<void>> {
    return this.emitAndListen<void>("player:skipRequest");
  }
}
