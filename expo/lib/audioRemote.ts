import { JSONTrack, PlayingJSONTrack } from "commons/backend-types";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "commons/socket.io-types";
import { Socket } from "socket.io-client";

type Response<T> = { data: T; error: null } | { data: null; error: string };

export type LocalPlayerRemote = PlayerRemote & {
  getPlaybackState(): Promise<Response<PlayingJSONTrack | null>>;
  getQueue(): Promise<Response<JSONTrack[]>>;
};

export type PlayerRemote = {
  playTrack(trackId: string): Promise<Response<void>>;
  setVolume(volume: number): Promise<Response<void>>;
  seekTo(position: number): Promise<Response<void>>;
  play(): Promise<Response<void>>;
  pause(): Promise<Response<void>>;
  previous(): Promise<Response<void>>;
  next(): Promise<Response<void>>;
};

export default function buildAudioRemote(
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
): PlayerRemote {
  return {
    playTrack(trackId: string): Promise<Response<void>> {
      socket.emit("player:playTrack", trackId);

      return new Promise((resolve) => {
        socket.on("player:playTrack", (a) => {
          resolve(a);
        });
      });
    },

    setVolume(volume: number): Promise<Response<void>> {
      socket.emit("player:setVolume", volume);

      return new Promise((resolve) => {
        socket.on("player:setVolume", (response) => {
          resolve(response);
        });
      });
    },

    seekTo(position: number): Promise<Response<void>> {
      socket.emit("player:seekTo", position);

      return new Promise((resolve) => {
        socket.on("player:seekTo", (response) => {
          resolve(response);
        });
      });
    },

    play(): Promise<Response<void>> {
      socket.emit("player:play");

      return new Promise((resolve) => {
        socket.on("player:play", (response) => {
          resolve(response);
        });
      });
    },

    pause(): Promise<Response<void>> {
      socket.emit("player:pause");

      return new Promise((resolve) => {
        socket.on("player:pause", (response) => {
          resolve(response);
        });
      });
    },

    previous(): Promise<Response<void>> {
      socket.emit("player:previous");

      return new Promise((resolve) => {
        socket.on("player:previous", (response) => {
          resolve(response);
        });
      });
    },

    next(): Promise<Response<void>> {
      socket.emit("player:skip");

      return new Promise((resolve) => {
        socket.on("player:skip", (response) => {
          resolve(response);
        });
      });
    },
  };
}
