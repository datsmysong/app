import { JSONTrack } from "commons/Backend-types";
import MusicPlatform from "./MusicPlatform";

export default class Deezer extends MusicPlatform {
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
