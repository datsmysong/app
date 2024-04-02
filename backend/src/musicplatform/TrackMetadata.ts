import { JSONTrack } from "commons/backend-types";
import MusicPlatform from "./MusicPlatform";

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
    try {
      return await this.platform.getJsonTrack(this.id);
    } catch (err) {
      console.error(`Failed to fetch data for track ${this.id}`);
      return null;
    }
  }
}
