import { JSONTrack } from "commons/Backend-types";
import MusicPlatform from "./MusicPlatform";
import Remote from "./remotes/Remote";

export default class Deezer extends MusicPlatform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getRemote(roomId: string): Promise<Remote | null> {
    return null;
  }

  constructor() {
    super(/https:\/\/deezer\.com\/(.+)/i);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getJsonTrack(id: string): Promise<JSONTrack | null> {
    // TODO: Implement Deezer
    return null;
  }

  isClientSide(): boolean {
    return false;
  }
}
