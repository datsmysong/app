/* eslint-disable @typescript-eslint/no-unused-vars */
import { JSONTrack } from "commons/Backend-types";
import MusicPlatform from "./MusicPlatform";
import Remote from "./remotes/Remote";
import Room from "../socketio/Room";

export default class Deezer extends MusicPlatform {
  async getRemote(
    room: Room,
    musicPlatform: MusicPlatform
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
}