import MusicPlatform from "./MusicPlatform";
import { JSONTrack } from "commons/Backend-types";

export default class TrackMetadata {
  private readonly platform: MusicPlatform;
  private readonly id: string;

  public constructor(platform: MusicPlatform, id: string) {
    this.platform = platform;
    this.id = id;
  }

  static createFromURL(
    platform: MusicPlatform,
    url: URL
  ): TrackMetadata | null {
    const id = platform.trackIdFromUrl(url);

    if (!id) {
      return null;
    }

    return new TrackMetadata(platform, id);
  }

  async toJSON(): Promise<JSONTrack | null> {
    return await this.platform.getJsonTrack(this.id);
  }
}