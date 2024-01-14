import {randomUUID} from "node:crypto";
import MusicStorage from "./MusicStorage";
import {JSONTrack} from "./musicplatform/MusicPlatform";
import Spotify from "./musicplatform/Spotify";
import TrackFabrique from "./musicplatform/TrackFabrique";

interface QueueJSON {
    current_active_room: string,
    tracks: JSONTrack[]
}

interface Error {
    error: {message: string}
}

export default class Queue {
    public readonly uuid: string;
    private readonly tracks: Set<JSONTrack>;
    private constructor() {
        this.uuid = randomUUID()
        this.tracks = new Set()
    }

    static newQueue(musicStorage: MusicStorage): Queue {
        let queue = new Queue();
        musicStorage.add_queue(queue);
        return queue;
    }

    async add(raw_url: string | URL) {
        // let track = new URL(raw_url).toString();
        let track_metadata = new TrackFabrique(new Spotify()/*, new SoundCloud(), new AppleMusic()*/).fromUrl(new URL(raw_url));
        let track = await track_metadata?.toJSON();
        if (track !== undefined)
            this.tracks.add(track);
    }

    remove(raw_url: string | URL) {
        let track;
        for (track of this.tracks) {
            if (track.url === new URL(raw_url)) {
                break;
            }
        }
        if (track !== undefined)
            return this.tracks.delete(track)
        return false
    }

    get_tracks_string(): string[] {
        return [...JSON.stringify(this.tracks)]
    }

    get_tracks(): JSONTrack[] {
        return [...this.tracks]
    }

    static toJSON(queue: Queue | null | undefined): QueueJSON | Error {
        if (queue instanceof Queue) {
            return {current_active_room: queue.uuid, tracks: queue.get_tracks()}
        } else {
            return {error: {message: "the given id is not active room"}}
        }
    }
}