import {randomUUID} from "node:crypto";
import MusicStorage from "./MusicStorage";
import {JSONTrack} from "./musicplatform/MusicPlatform";
import Spotify from "./musicplatform/Spotify";
import TrackFabrique from "./musicplatform/TrackFabrique";

interface QueueJSON {
  currentActiveRoom: string,
  tracks: JSONTrack[]
}

interface Error {
  error: { message: string }
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
    musicStorage.addQueue(queue);
    return queue;
  }

  static toJSON(queue: Queue | null | undefined): QueueJSON | Error {
    if (queue instanceof Queue) {
      return {currentActiveRoom: queue.uuid, tracks: queue.getTracks()}
    } else {
      return {error: {message: "the given id is not active room"}}
    }
  }

  async add(rawUrl: string | URL) {
    // let track = new URL(rawUrl).toString();
    let trackMetadata = new TrackFabrique();
    trackMetadata.register(new Spotify())/*, new SoundCloud(), new AppleMusic()*/;

    let track = await trackMetadata.fromUrl(new URL(rawUrl))?.toJSON();
    if (track !== undefined)
      this.tracks.add(track);
  }

  remove(rawUrl: string | URL) {
    let track;
    for (track of this.tracks) {
      // replace by TrackFabrique to improve this like add
      if (track.url === new URL(rawUrl).toString()) {
        break;
      }
    }
    if (track !== undefined)
      return this.tracks.delete(track)
    return false
  }

  getTracksString(): string[] {
    return [...JSON.stringify(this.tracks)]
  }

  getTracks(): JSONTrack[] {
    return [...this.tracks]
  }
}