import { JSONTrack, PlayingJSONTrack } from "commons/backend-types";
import { Response } from "commons/socket.io-types";

export abstract class Remote {
  abstract getPlaybackState(): Promise<Response<PlayingJSONTrack | null>>;
  abstract playTrack(trackId: string): Promise<Response<void>>;
  abstract setVolume(volume: number): Promise<Response<void>>;
  abstract seekTo(position: number): Promise<Response<void>>;
  abstract play(): Promise<Response<void>>;
  abstract pause(): Promise<Response<void>>;
  abstract previous(): Promise<Response<void>>;
  abstract next(): Promise<Response<void>>;
}

export abstract class QueueableRemote extends Remote {
  abstract addToQueue(trackId: string): Promise<Response<void>>;
  abstract getQueue(): Promise<Response<JSONTrack[]>>;
}
