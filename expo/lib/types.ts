export interface StreamingPlatform {
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

export type Artist = {
  name: string;
  id: string;
};

export type Music = {
  title: string;
  artwork: string;
  artists: Array<Artist>;
  duration_ms: number;
};

export type PlayingMusic = Music & {
  progress_ms: number;
  is_playing: boolean;
};

export type OrderedMusic = Music & {
  position: number;
};

export type Profile = {
  id: string;
  nickname: string;
}

export type UserProfile = Profile & {
  username: string;
  avatar: string | null;
  accountId: string;
}

export type ActiveRoom = {
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

export const isActiveRoom = (room: any): room is ActiveRoom => {
  return (
    room.id !== undefined &&
    room.name !== undefined &&
    room.createdAt !== undefined &&
    room.configuration !== undefined &&
    room.configuration.voteSkipping !== undefined &&
    room.configuration.voteSkippingNeededPercentage !== undefined &&
    room.configuration.maxMusicCountInQueuePerParticipant !== undefined &&
    room.configuration.maxMusicDuration !== undefined &&
    room.hostUserProfileId !== undefined &&
    room.queue !== undefined &&
    room.participants !== undefined
  )
}

export type Room = {
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

export const isRoom = (room: any): room is Room => {
  return (
    room.id !== undefined &&
    room.name !== undefined &&
    room.createdAt !== undefined &&
    room.endedAt !== undefined &&
    room.configuration !== undefined &&
    room.configuration.voteSkipping !== undefined &&
    room.configuration.voteSkippingNeededPercentage !== undefined &&
    room.configuration.maxMusicCountInQueuePerParticipant !== undefined &&
    room.configuration.maxMusicDuration !== undefined &&
    room.hostUserProfileId !== undefined &&
    room.history !== undefined &&
    room.participants !== undefined
  )
}