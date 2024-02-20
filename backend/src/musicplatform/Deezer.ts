/* eslint-disable @typescript-eslint/no-unused-vars */
import { JSONTrack } from "commons/Backend-types";
import MusicPlatform from "./MusicPlatform";
import Remote from "./remotes/Remote";
import Room from "../socketio/Room";

export default class Deezer extends MusicPlatform {
  async getRemote(
    _room: Room,
    _musicPlatform: MusicPlatform
  ): Promise<Remote | null> {
    return null;
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

  searchTrack(_text: string): Promise<JSONTrack[]> {
    return Promise.resolve([]);
  }

  toJSON(rawTracks: never): JSONTrack {
    throw new Error("Deezer.toJSON()");
  }
}
