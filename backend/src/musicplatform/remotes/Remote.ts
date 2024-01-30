import { PlayingJSONTrack } from "commons/backend-types";

export default abstract class Remote {
  abstract getPlaybackState(): Promise<PlayingJSONTrack | null>;
  abstract play(): Promise<void>;
  abstract pause(): Promise<void>;
}
