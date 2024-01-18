import MusicPlatform, { JSONTrack } from "./MusicPlatform";
import { spotify } from "../server";

interface SpotifyToken {
  access_token: string;
  token_type: string;
  expires_in: string;
}

export default class Spotify extends MusicPlatform {
  constructor() {
    super(
      /^https?:\/\/open\.spotify\.com\/(?:.*\/)?track\/([a-zA-Z0-9]*)(?:\?.*)?$/i,
    );
  }

  async getJsonTrack(id: string): Promise<JSONTrack> {
    let data = await spotify.tracks.get(id);

    return {
      url: new URL(data.external_urls.spotify).toString(),
      title: data.name,
      duration: data.duration_ms,
      artistName: data.artists[0].name,
      albumName: data.album.name,
      imgUrl: new URL(data.album.images[0].url).toString(),
    };
  }
}
