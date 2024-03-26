import { Artist, Track } from "@spotify/web-api-ts-sdk";
import { JSONTrack } from "commons/backend-types";
import { spotify } from "../server";
import MusicPlatform from "./MusicPlatform";
import { Remote } from "./remotes/Remote";
import SpotifyRemote from "./remotes/SpotifyRemote";
import Room from "../socketio/Room";
import { Response } from "commons/socket.io-types";

export default class Spotify extends MusicPlatform {
  constructor() {
    super(
      /^https?:\/\/open\.spotify\.com\/(?:.*\/)?track\/([a-zA-Z0-9]*)(?:\?.*)?$/i
    );
  }

  async getJsonTrack(id: string): Promise<JSONTrack | null> {
    let data;
    try {
      data = await spotify.tracks.get(id);
    } catch {
      return null;
    }

    return this.toJSON(data);
  }

  toJSON(data: Track): JSONTrack | null {
    const image = data.album.images.reduce((acc, current) => {
      return current.width < acc.width && current.width >= 46 ? current : acc;
    });

    try {
      const externalUrls = new URL(data.external_urls.spotify).toString();
      // Sometimes artwork is null, but we can return a track without artwork
      const imgUrl = image.url ? new URL(image.url).toString() : "";

      const genres = (data.artists.at(0) as Artist).genres;

      return {
        url: externalUrls,
        title: data.name,
        duration: data.duration_ms,
        artistsName: data.artists.reduce(
          (acc, current) => (acc ? `${acc}, ` : "") + current.name,
          ""
        ),
        albumName: data.album.name,
        imgUrl,
        genres: genres ? genres : [],
        id: data.uri,
      };
    } catch (e) {
      console.error("Impossible to convert Spotify track to JSONTrack ", e);
      return null;
    }
  }

  isClientSide(): boolean {
    return false;
  }

  async getRemote(
    room: Room,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    musicPlatform: MusicPlatform
  ): Promise<Response<Remote>> {
    return await SpotifyRemote.createRemote(room, this);
  }

  async searchTrack(text: string): Promise<JSONTrack[]> {
    try {
      const rawSearch = await spotify.search(text, ["track"]);
      return rawSearch.tracks.items
        .map((rawTracks) => this.toJSON(rawTracks))
        .filter((track) => track !== null) as JSONTrack[];
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
