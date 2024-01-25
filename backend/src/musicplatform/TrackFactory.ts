import TrackMetadata from "./TrackMetadata";
import MusicPlatform from "./MusicPlatform";

export default class TrackFactory {
  private readonly musicPlatformsList: Map<Function, MusicPlatform>;

  constructor() {
    this.musicPlatformsList = new Map<Function, MusicPlatform>();
  }

  register(newPlatform: MusicPlatform): boolean {
    if (
      Array.from(this.musicPlatformsList.keys()).includes(
        newPlatform.getClass()
      )
    ) {
      return false;
    }
    this.musicPlatformsList.set(newPlatform.getClass(), newPlatform);
    return true;
  }

  fromUrl(rawUrl: string | URL): TrackMetadata | null {
    if (!URL.canParse(rawUrl)) {
      return null;
    }
    const url = new URL(rawUrl);
    for (const musicPlatform of this.musicPlatformsList.values()) {
      const trackId = musicPlatform.trackIdFromUrl(url);
      if (trackId) {
        return new TrackMetadata(musicPlatform, trackId);
      }
    }
    return null;
  }
}
