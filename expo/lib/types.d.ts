interface StreamingPlatform {
  name: String;
  imgUrl: String;

  playMusic: (musicUri: string) => Promise<void>;
  fetchCurrent: () => Promise<PlayingMusic | null>;
  fetchQueue: () => Promise<Array<OrderedMusic>>;
  pause: () => Promise<void>;
  play: () => Promise<void>;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  seek: (position: number) => Promise<void>;
}

type Artist = {
  name: string;
  id: string;
};

type Music = {
  title: string;
  artwork: string;
  artists: Array<Artist>;
  duration_ms: number;
};

type PlayingMusic = Music & {
  progress_ms: number;
  is_playing: boolean;
};

type OrderedMusic = Music & {
  position: number;
};

type Profile = {
  id: string;
  nickname: string;
}

type UserProfile = Profile & {
  username: string;
  avatar: string | null;
  accountId: string;
}

type ActiveRoom = {
  id: string;
  name: string;
  createdAt: Date;
  configuration: {
    voteSkipping: boolean;
    voteSkippingNeededPercentage: number;
    maxMusicCountInQueuePerParticipant: number;
    maxMusicDuration: number;
  };
  hostUserProfileId: string;
  queue: Array<OrderedMusic>;
  participants: Array<Profile | UserProfile>;
}

type Room = {
  id: string;
  name: string;
  createdAt: Date;
  endedAt: Date;
  configuration: {
    voteSkipping: boolean;
    voteSkippingNeededPercentage: number;
    maxMusicCountInQueuePerParticipant: number;
    maxMusicDuration: number;
  };
  hostUserProfileId: string;
  history: Array<OrderedMusic>;
  participants: Array<Profile | UserProfile>;
}