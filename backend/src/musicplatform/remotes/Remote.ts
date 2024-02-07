import { JSONTrack, PlayingJSONTrack } from "commons/backend-types";
import { Response } from "commons/socket.io-types";

export default abstract class Remote {
  abstract getPlaybackState(): Promise<Response<PlayingJSONTrack | null>>;
  abstract getQueue(): Promise<Response<JSONTrack[]>>;
  abstract playTrack(trackId: string): Promise<Response<void>>;
  abstract setVolume(volume: number): Promise<Response<void>>;
  abstract seekTo(position: number): Promise<Response<void>>;
  abstract play(): Promise<Response<void>>;
  abstract pause(): Promise<Response<void>>;
  abstract previous(): Promise<Response<void>>;
  abstract next(): Promise<Response<void>>;
}
