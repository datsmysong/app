import MusicPlatform from "./MusicPlatform";
import { spotify } from "../server";
import { JSONTrack } from "commons/Backend-types";
export default class Spotify extends MusicPlatform {
  constructor() {
    super(
      /^https?:\/\/open\.spotify\.com\/(?:.*\/)?track\/([a-zA-Z0-9]*)(?:\?.*)?$/i
    );
  }

  async getJsonTrack(id: string): Promise<JSONTrack> {
    const data = await spotify.tracks.get(id);

    return {
      url: new URL(data.external_urls.spotify).toString(),
      title: data.name,
      duration: data.duration_ms,
      artistsName: data.artists.reduce(
        (acc, current) => (acc ? `${acc}, ` : "") + current.name,
        ""
      ),
      albumName: data.album.name,
      imgUrl: new URL(data.album.images[0].url).toString(),
    };
  }
}
