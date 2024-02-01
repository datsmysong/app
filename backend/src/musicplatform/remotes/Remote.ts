import { JSONTrack, PlayingJSONTrack } from "commons/backend-types";

export default abstract class Remote {
  abstract getPlaybackState(): Promise<PlayingJSONTrack | null>;
  abstract getQueue(): Promise<JSONTrack[]>;
  abstract playTrack(trackId: string): Promise<{ error?: string }>;
  abstract setVolume(volume: number): Promise<void>;
  abstract seekTo(position: number): Promise<void>;
  abstract play(): Promise<void>;
  abstract pause(): Promise<void>;
  abstract previous(): Promise<void>;
  abstract next(): Promise<void>;
}
