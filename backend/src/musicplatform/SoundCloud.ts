import { JSONTrack } from "commons/backend-types";
import Soundcloud, { SoundcloudTrackV2 } from "soundcloud.ts";
import Room from "../socketio/Room";
import MusicPlatform from "./MusicPlatform";
import { Remote } from "./remotes/Remote";
import SoundCloudRemote from "./remotes/SoundCloudRemote";
import { Response } from "commons/socket.io-types";

function extractFromTrack(track: SoundcloudTrackV2) {
  if (track.user == null) return { title: "", artists: "" };

  const artists = track.user.username;

  return {
    title: track.title,
    artists,
  };
}

export default class SoundCloud extends MusicPlatform {
  protected soundCloud: Soundcloud;

  constructor() {
    super(/(https?:\/\/soundcloud\.com\/[^?]+)(?:\?.*)?/i);
    this.soundCloud = new Soundcloud({
      clientId: process.env.SOUNDCLOUD_CLIENT_ID ?? "",
      oauthToken: process.env.SOUNDCLOUD_CLIENT_SECRET ?? "",
    });
  }

  async getJsonTrack(id: string): Promise<JSONTrack | null> {
    try {
      const track = await this.soundCloud.tracks.getAlt(id);
      return this.toJSON(track);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  isClientSide(): boolean {
    return true;
  }

  getRemote(
    room: Room,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    musicPlatform: MusicPlatform
  ): Promise<Response<Remote>> {
    return SoundCloudRemote.createRemote(this, room);
  }

  toJSON(track: SoundcloudTrackV2): JSONTrack {
    const { title, artists } = extractFromTrack(track);

    return {
      url: track.permalink_url,
      title: title,
      duration: track.duration,
      albumName: track.title,
      artistsName: artists,
      imgUrl: track.artwork_url,
      genres: track.genre ? [track.genre] : [],
      id: track.permalink_url,
    };
  }

  async searchTrack(text: string): Promise<JSONTrack[]> {
    // TODO keep only track available free (without paid)
    try {
      const rawData = await this.soundCloud.tracks.searchAlt(text); // await this.soundCloud.tracks.searchV2({ q: text });
      return rawData /*.collection*/
        .map((track) => this.toJSON(track));
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
