import { JSONTrack, PlayingJSONTrack } from "commons/backend-types";
import { Socket } from "socket.io";
import MusicPlatform from "../MusicPlatform";
import Remote from "./Remote";

export default class SoundCloudRemote extends Remote {
  hostSocket: Socket;
  musicPlatform: MusicPlatform;

  protected constructor(socket: Socket, musicPlatform: MusicPlatform) {
    super();
    this.hostSocket = socket;
    this.musicPlatform = musicPlatform;
  }

  static async createRemote(
    musicPlatform: MusicPlatform,
    hostSocket: Socket | null
  ): Promise<SoundCloudRemote | null> {
    if (hostSocket === null) return null;

    return new SoundCloudRemote(hostSocket, musicPlatform);
  }

  getPlaybackState(): Promise<PlayingJSONTrack | null> {
    this.hostSocket.emit("player:getPlaybackState");
    return new Promise((resolve) => {
      this.hostSocket.on(
        "player:getPlaybackState",
        (state: PlayingJSONTrack | null) => {
          resolve(state);
        }
      );
    });
  }

  getQueue(): Promise<JSONTrack[]> {
    return new Promise((resolve) => {
      resolve([]);
    });
  }

  playTrack(trackId: string): Promise<{ error?: string | undefined }> {
    this.hostSocket.emit("player:playTrack", trackId);

    return new Promise((resolve) => {
      this.hostSocket.on("player:playTrack", (error: string | undefined) => {
        if (error) {
          resolve({ error });
        } else {
          resolve({});
        }
      });
    });
  }

  setVolume(volume: number): Promise<void> {
    this.hostSocket.emit("player:setVolume", {
      volume,
    });

    return new Promise((resolve) => {
      this.hostSocket.on("player:setVolume", () => {
        resolve();
      });
    });
  }

  seekTo(position: number): Promise<void> {
    this.hostSocket.emit("player:seekTo", {
      position,
    });

    return new Promise((resolve) => {
      this.hostSocket.on("player:seekTo", () => {
        resolve();
      });
    });
  }

  play(): Promise<void> {
    this.hostSocket.emit("player:play");

    return new Promise((resolve) => {
      this.hostSocket.on("player:play", () => {
        resolve();
      });
    });
  }

  pause(): Promise<void> {
    this.hostSocket.emit("player:pause");

    return new Promise((resolve) => {
      this.hostSocket.on("player:pause", () => {
        resolve();
      });
    });
  }

  previous(): Promise<void> {
    this.hostSocket.emit("player:previous");

    return new Promise((resolve) => {
      this.hostSocket.on("player:previous", () => {
        resolve();
      });
    });
  }

  next(): Promise<void> {
    this.hostSocket.emit("player:next");

    return new Promise((resolve) => {
      this.hostSocket.on("player:next", () => {
        resolve();
      });
    });
  }
}
