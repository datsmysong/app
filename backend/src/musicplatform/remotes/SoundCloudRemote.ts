import { JSONTrack, PlayingJSONTrack } from "commons/backend-types";
import MusicPlatform from "../MusicPlatform";
import Remote from "./Remote";
import Room from "../../socketio/Room";
import { Response } from "commons/socket.io-types";

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

  async getPlaybackState(): Promise<PlayingJSONTrack | null> {
    const hostSocket = await this.getHostSocket();
    if (!hostSocket) {
      return null;
    }

    hostSocket.emit("player:getPlaybackState");
    return new Promise((resolve) => {
      hostSocket.on(
        "player:getPlaybackState",
        (state: PlayingJSONTrack | null) => {
          resolve(state);
        }
      );
    });
  }

  async getQueue(): Promise<JSONTrack[]> {
    return [];
  }

  async playTrack(trackId: string): Promise<{ error?: string | undefined }> {
    const hostSocket = await this.getHostSocket();
    if (!hostSocket) {
      return { error: "Host socket not available" };
    }

    hostSocket.emit("player:playTrack", trackId);

    return new Promise((resolve) => {
      hostSocket.on("player:playTrack", (error: string | undefined) => {
        if (error) {
          resolve({ error });
        } else {
          resolve({});
        }
      });
    });
  }

  async setVolume(volume: number): Promise<void> {
    const hostSocket = await this.getHostSocket();
    if (!hostSocket) {
      return;
    }

    hostSocket.emit("player:setVolume", {
      volume,
    });

    return new Promise((resolve) => {
      hostSocket.on("player:setVolume", () => {
        resolve();
      });
    });
  }

  async seekTo(position: number): Promise<void> {
    const hostSocket = await this.getHostSocket();
    if (!hostSocket) {
      return;
    }

    hostSocket.emit("player:seekTo", {
      position,
    });

    return new Promise((resolve) => {
      hostSocket.on("player:seekTo", () => {
        resolve();
      });
    });
  }

  async play(): Promise<void> {
    const hostSocket = await this.getHostSocket();
    if (!hostSocket) {
      return;
    }

    hostSocket.emit("player:play");

    return new Promise((resolve) => {
      hostSocket.on("player:play", () => {
        resolve();
      });
    });
  }

  async pause(): Promise<void> {
    const hostSocket = await this.getHostSocket();
    if (!hostSocket) {
      return;
    }

    hostSocket.emit("player:pause");

    return new Promise((resolve) => {
      hostSocket.on("player:pause", () => {
        resolve();
      });
    });
  }

  async previous(): Promise<void> {
    const hostSocket = await this.getHostSocket();
    if (!hostSocket) {
      return;
    }

    hostSocket.emit("player:previous");

    return new Promise((resolve) => {
      hostSocket.on("player:previous", () => {
        resolve();
      });
    });
  }

  async next(): Promise<void> {
    const hostSocket = await this.getHostSocket();
    if (!hostSocket) {
      return;
    }

    hostSocket.emit("player:next");

    return new Promise((resolve) => {
      hostSocket.on("player:next", () => {
        resolve();
      });
    });
  }
}
