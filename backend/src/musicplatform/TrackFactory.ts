import TrackMetadata from "./TrackMetadata";
import MusicPlatform from "./MusicPlatform";

export default class TrackFactory {
  private readonly musicPlatformsList: Map<Function, MusicPlatform>;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/ban-types
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

  fromUrl(url: URL): TrackMetadata | null {
    for (const musicPlatform of this.musicPlatformsList.values()) {
      const trackId = musicPlatform.trackIdFromUrl(url);
      if (trackId) {
        const { data: track, error } = TrackMetadata.newTrackMetadata(musicPlatform, { id: trackId });
        if (!error) {
          return track;
        }
      }
    }
    return null;
  }
}
