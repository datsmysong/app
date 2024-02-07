import { JSONTrack, PlayingJSONTrack } from "commons/backend-types";
import MusicPlatform from "../MusicPlatform";
import Remote from "./Remote";
import { Response } from "commons/socket.io-types";
import Room from "../../socketio/Room";

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
  ): Promise<SoundCloudRemote | null> {
    return new SoundCloudRemote(room, musicPlatform);
  }

  getHostSocket(): (typeof this.room)["hostSocket"] {
    return this.room.getHostSocket();
  }

  async emitAndListen<T>(event: string, data?: unknown): Promise<Response<T>> {
    const hostSocket = this.getHostSocket();
    if (!hostSocket) {
      return { data: null, error: "Host socket not available" };
    }

    return new Promise((resolve) => {
      const listener = (response: T | Error) => {
        hostSocket.off(event, listener);
        if (response instanceof Error) {
          resolve({ data: null, error: response.message });
        } else {
          resolve({ data: response, error: null });
        }
      };

      hostSocket.on(event, listener);
      hostSocket.emit(event, data);
    });
  }

  async getPlaybackState(): Promise<Response<PlayingJSONTrack | null>> {
    return this.emitAndListen<PlayingJSONTrack | null>(
      "player:getPlaybackState"
    );
  }

  async getQueue(): Promise<Response<JSONTrack[]>> {
    return this.emitAndListen<JSONTrack[]>("player:getQueue");
  }

  async playTrack(trackId: string): Promise<Response<void>> {
    return this.emitAndListen<void>("player:playTrack", trackId);
  }

  async setVolume(volume: number): Promise<Response<void>> {
    return this.emitAndListen<void>("player:setVolume", { volume });
  }

  async seekTo(position: number): Promise<Response<void>> {
    return this.emitAndListen<void>("player:seekTo", { position });
  }

  async play(): Promise<Response<void>> {
    return this.emitAndListen<void>("player:play");
  }

  async pause(): Promise<Response<void>> {
    return this.emitAndListen<void>("player:pause");
  }

  async previous(): Promise<Response<void>> {
    return this.emitAndListen<void>("player:previous");
  }

  async next(): Promise<Response<void>> {
    return this.emitAndListen<void>("player:next");
  }
}
