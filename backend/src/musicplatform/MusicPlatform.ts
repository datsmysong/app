import { JSONTrack } from "commons/backend-types";
import { Remote } from "./remotes/Remote";
import Room from "../socketio/Room";
import { Response } from "commons/socket.io-types";

export default abstract class MusicPlatform {
  private readonly urlPattern: RegExp;

  protected constructor(urlPattern: RegExp) {
    this.urlPattern = new RegExp(urlPattern, "i");
    // check if urlPattern have only one capture group (this must capture the id of a track)
    const resultRegex = getNbCapturingGroupRegex(this.urlPattern);
    if (resultRegex !== 1) {
      // TODO remove throw and make like TrackFactory (think to watch history of this file...)
      throw new Error(
        "il y a plusieurs groupe de capture\n" +
          "seul un groupe doit se trouver dans le pattern, et doit retourner l'identifiant unique de l'élément"
      );
    }
  }

  trackIdFromUrl(url: URL): string | undefined {
    return this.getUrlPattern().exec(url.href)?.slice(1)[0];
  }

  getUrlPattern(): RegExp {
    return new RegExp(this.urlPattern);
  }

  getClass() {
    return this.constructor;
  }

  abstract toJSON(rawTracks: never): JSONTrack | null;
  abstract getJsonTrack(id: string): Promise<JSONTrack | null>;
  abstract searchTrack(text: string): Promise<JSONTrack[]>;
  abstract isClientSide(): boolean;
  abstract getRemote(
    room: Room,
    musicPlatform: MusicPlatform
  ): Promise<Response<Remote>>;
}

function getNbCapturingGroupRegex(regex: RegExp) {
  return new RegExp(regex.toString() + "|").exec("")?.slice(1).length;
}
