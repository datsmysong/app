/* eslint-disable @typescript-eslint/no-unused-vars */
import { JSONTrack } from "commons/backend-types";
import MusicPlatform from "./MusicPlatform";
import { Remote } from "./remotes/Remote";
import Room from "../socketio/Room";
import { Response } from "commons/socket.io-types";

export default class Deezer extends MusicPlatform {
  async getRemote(
    room: Room,
    musicPlatform: MusicPlatform
  ): Promise<Response<Remote>> {
    return {
      data: null,
      error: "Deezer is not implemented",
    };
  }

  constructor() {
    super(/https:\/\/deezer\.com\/(.+)/i);
  }

  async getJsonTrack(id: string): Promise<JSONTrack | null> {
    // TODO: Implement Deezer
    return null;
  }

  isClientSide(): boolean {
    return false;
  }

  searchTrack(text: string): Promise<JSONTrack[]> {
    return Promise.resolve([]);
  }

  toJSON(rawTracks: never): JSONTrack {
    throw new Error("Deezer.toJSON()");
  }
}
