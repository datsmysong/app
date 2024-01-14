import Track from "./Track";
import MusicPlatform from "./MusicPlatform";

export default class TrackFabrique {
    private musicplatforms_list: MusicPlatform[]

    constructor(...musicplatform_list: MusicPlatform[]) {
        this.musicplatforms_list = musicplatform_list
    }
    fromUrl(url: URL): Track | undefined {
        for (let musicPlatform of this.musicplatforms_list) {
            let track_id = musicPlatform.track_id_from_url(url);
            if (track_id ) {
                return new Track(musicPlatform, {id: track_id})
            }
        }
    }
}


// // DEBUG
// let track = new TrackFabrique(new Spotify()).fromUrl(new URL("https://open.spotify.com/intl-fr/track/4OUTQBwLBaTIUcgdI5PPt7?si=3aac1a9bcf3d4eac"));
// // track.getData().then(console.log)
// track.getData().then(d => {
//     d.duration = Math.round(d.duration_ms / 60) / 1000;
//     let duration_raw_obj: Date = new Date(d.duration_ms);
//     d.duration_obj = {hours: duration_raw_obj.getUTCHours(), minutes: duration_raw_obj.getUTCMinutes(), seconds: duration_raw_obj.getUTCSeconds()};
//
//     return d;
// }).then(console.log)
