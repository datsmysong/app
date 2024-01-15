import Track from "./Track";
import MusicPlatform from "./MusicPlatform";

export default class TrackFabrique {
    private readonly musicPlatformsList: MusicPlatform[]

    constructor(...musicPlatformList: MusicPlatform[]) {
        this.musicPlatformsList = musicPlatformList
    }
    fromUrl(url: URL): Track | undefined {
        for (let musicPlatform of this.musicPlatformsList) {
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
