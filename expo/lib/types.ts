export interface StreamingPlatformRemote {
  playMusic: (musicUri: string) => Promise<void>;
  pause: () => Promise<void>;
  play: () => Promise<void>;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  seekTo: (position: number) => Promise<void>;
}

export type Artist = {
  name: string;
  id: string;
};

export type Music = {
  title: string;
  artwork: string;
  /* This could be an array of Artist, but due to SoundCloud's API only returning a formatted
   string, this has to be a string for now. */
  artists: string;
  durationMs: number;
};

export type OrderedMusic = Music & {
  position: number;
};

export type Profile = {
  id: string;
  nickname: string;
};

export type UserProfile = Profile & {
  username: string;
  avatar: string | null;
  accountId: string;
};

export type PlaybackState = {
  isPlaying: boolean;
  progressMs: number;
  volume: number;
  currentMusic: Music | null;
};
