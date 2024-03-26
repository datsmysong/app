export interface JSONTrack {
  url: string;
  title: string;
  duration: number;
  artistsName: string;
  albumName: string;
  imgUrl: string;
  votes?: string[]; // array of user ids
}

export interface PlayingJSONTrack extends JSONTrack {
  currentTime: number;
  isPlaying: boolean;
  updated_at: number;
}

export interface RoomJSON {
  currentlyPlaying: PlayingJSONTrack | null;
  currentActiveRoom: string;
  queue: JSONTrack[];
  voteSkipActualTrack: string[];
}
