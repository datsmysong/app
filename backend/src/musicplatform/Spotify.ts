/* eslint-disable @typescript-eslint/no-unused-vars */
import { JSONTrack } from "commons/backend-types";
import { spotify } from "../server";
import MusicPlatform from "./MusicPlatform";
import Remote from "./remotes/Remote";
import SpotifyRemote from "./remotes/SpotifyRemote";
import Room from "../socketio/Room";
import { Track } from "@spotify/web-api-ts-sdk";

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

  toJSON(data: Track) {
    const image = data.album.images.reduce((acc, current) => {
      return current.width < acc.width && current.width >= 46 ? current : acc;
    });

    return {
      url: new URL(data.external_urls.spotify).toString(),
      title: data.name,
      duration: data.duration_ms,
      artistsName: data.artists.reduce(
        (acc, current) => (acc ? `${acc}, ` : "") + current.name,
        ""
      ),
      albumName: data.album.name,
      imgUrl: new URL(image.url).toString(),
    };
  }

  isClientSide(): boolean {
    return false;
  }

  async getRemote(
    room: Room,
    musicPlatform: MusicPlatform
  ): Promise<Remote | null> {
    return await SpotifyRemote.createRemote(room, this);
  }

  async searchTrack(text: string): Promise<JSONTrack[]> {
    const rawSearch = await spotify.search(text, ["track"]);

    return rawSearch.tracks.items.map((rawTracks) => this.toJSON(rawTracks));
  }
}
