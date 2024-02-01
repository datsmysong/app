import { JSONTrack } from "commons/Backend-types";
import { Socket } from "socket.io";
import Soundcloud, { SoundcloudTrackV2 } from "soundcloud.ts";
import MusicPlatform from "./MusicPlatform";
import Remote from "./remotes/Remote";
import SoundCloudRemote from "./remotes/SoundCloudRemote";
import Room from "../socketio/Room";

function extractFromTrack(track: SoundcloudTrackV2) {
  const artists = track.user.username;

  return {
    title: track.title,
    artists,
  };
}

export default class SoundCloud extends MusicPlatform {
  protected soundCloud: Soundcloud;

  constructor() {
    super(/https:\/\/soundcloud\.com\/(.+)/i);
    this.soundCloud = new Soundcloud({
      clientId: process.env.SOUNDCLOUD_CLIENT_ID ?? "",
      oauthToken: process.env.SOUNDCLOUD_CLIENT_SECRET ?? "",
    });
  }

  async getJsonTrack(id: string): Promise<JSONTrack | null> {
    const track = await this.soundCloud.tracks.getV2(id);

    const { title, artists } = extractFromTrack(track);

    return {
      url: track.permalink,
      title: title,
      duration: track.duration,
      albumName: track.title,
      artistsName: artists,
      imgUrl: track.artwork_url,
    };
  }

  isClientSide(): boolean {
    return true;
  }

  getRemote(
    room: Room,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    musicPlatform: MusicPlatform
  ): Promise<Remote | null> {
    return SoundCloudRemote.createRemote(this, room);
  }
}
