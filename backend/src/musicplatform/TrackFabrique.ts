import Track from "./Track";
import MusicPlatform from "./MusicPlatform";
import MusicStorage from "../MusicStorage";

export default class TrackFabrique {
  private readonly musicPlatformsList: Map<Function, MusicPlatform>

  constructor() {
    this.musicPlatformsList = new Map<Function, MusicPlatform>();
  }

  register(newPlatform: MusicPlatform): boolean {
    if (Array.from(this.musicPlatformsList.keys()).includes(newPlatform.getClass())) {
      return false
    }
    this.musicPlatformsList.set(newPlatform.getClass(), newPlatform)
    return true;
  }

  fromUrl(url: URL): Track | undefined {
    for (let [_, musicPlatform] of this.musicPlatformsList) {
      let trackId = musicPlatform.trackIdFromUrl(url);
      if (trackId) {
        return new Track(musicPlatform, {id: trackId})
      }
    }
  }
}


// // DEBUG
// let track = new TrackFabrique(new Spotify()).fromUrl(new URL("https://open.spotify.com/intl-fr/track/4OUTQBwLBaTIUcgdI5PPt7?si=3aac1a9bcf3d4eac"));
// // track.getData().then(console.log)
// track.getData().then(d => {
//     d.duration = Math.round(d.durationMs / 60) / 1000;
//     let durationRawObj: date = new_date(d_durationMs);
//     d.durationObj = {hours: durationRawObj.getUTCHours(), minutes: durationRawObj.getUTCMinutes(), seconds: durationRawObj.getUTCSeconds()};
//
//     return d;
// }).then(console.log)