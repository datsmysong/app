import { JSONTrack, PlayingJSONTrack } from "commons/backend-types";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "commons/socket.io-types";
import { Socket } from "socket.io-client";

export type AudioRemote = {
  getPlaybackState(): Promise<PlayingJSONTrack | null>;
  getQueue(): Promise<JSONTrack[]>;
  playTrack(trackId: string): Promise<{ error?: string }>;
  setVolume(volume: number): Promise<void>;
  seekTo(position: number): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  previous(): Promise<void>;
  next(): Promise<void>;
};

export default function buildAudioRemote(
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
): AudioRemote {
  return {
    getPlaybackState(): Promise<PlayingJSONTrack | null> {
      socket.emit("player:getPlaybackState");

      return new Promise((resolve) => {
        socket.on(
          "player:updatePlaybackState",
          (state: PlayingJSONTrack | null) => {
            resolve(state);
          }
        );
      });
    },
    getQueue(): Promise<JSONTrack[]> {
      socket.emit("player:getQueue");

      return new Promise((resolve) => {
        socket.on("player:getQueue", (queue: JSONTrack[]) => {
          resolve(queue);
        });
      });
    },

    playTrack(trackId: string): Promise<{ error?: string | undefined }> {
      socket.emit("player:playTrack", trackId);

      return new Promise((resolve) => {
        socket.on("player:playTrack", (error: string | undefined) => {
          if (error) {
            resolve({ error });
          } else {
            resolve({});
          }
        });
      });
    },

    setVolume(volume: number): Promise<void> {
      socket.emit("player:setVolume", volume);

      return new Promise((resolve) => {
        socket.on("player:setVolume", () => {
          resolve();
        });
      });
    },

    seekTo(position: number): Promise<void> {
      socket.emit("player:seekTo", position);

      return new Promise((resolve) => {
        socket.on("player:seekTo", () => {
          resolve();
        });
      });
    },

    play(): Promise<void> {
      socket.emit("player:play");

      return new Promise((resolve) => {
        socket.on("player:play", () => {
          resolve();
        });
      });
    },

    pause(): Promise<void> {
      socket.emit("player:pause");

      return new Promise((resolve) => {
        socket.on("player:pause", () => {
          resolve();
        });
      });
    },

    previous(): Promise<void> {
      socket.emit("player:previous");

      return new Promise((resolve) => {
        socket.on("player:previous", () => {
          resolve();
        });
      });
    },

    next(): Promise<void> {
      socket.emit("player:skip");

      return new Promise((resolve) => {
        socket.on("player:skip", () => {
          resolve();
        });
      });
    },
  };
}
