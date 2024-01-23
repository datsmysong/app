import MusicPlatform from "./MusicPlatform";
import { JSONTrack } from "commons/Backend-types";

export default class TrackMetadata {
  private readonly platform: MusicPlatform;
  private readonly id: string;

  private constructor(platform: MusicPlatform, id: string) {
    this.platform = platform;
    this.id = id;
  }

  static newTrackMetadata(platform: MusicPlatform, query: { url?: string; id?: string }): {data: TrackMetadata | null, error: Error | null} {
    const url = query.url;
    let id = query.id;
    if (typeof id !== "string") {
      if (typeof url !== "string")
        return {data: null, "error":
          new Error("Donner au moins une url du morceau ou son identifiant auprès d'une plateforme donnée directement")
        };
      id = platform.trackIdFromUrl(new URL(url));
    }

    if (typeof id !== "string" || id === "") {
      return {data: null, error: new Error("morceau inconnu")};
    }

    return { data: new TrackMetadata(platform, id), error: null };
  }

  async toJSON(): Promise<JSONTrack|null> {
    try {
      return await this.platform.getJsonTrack(this.id);
    } catch {
      return null;
    }
  }
}
