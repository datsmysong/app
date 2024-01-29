export interface JSONTrack {
  url: string;
  title: string;
  duration: number;
  artistsName: string;
  albumName: string;
  imgUrl: string;
}

export interface PlayingJSONTrack extends JSONTrack {
  currentTime: number;
}

export interface RoomJSON {
  currentlyPlaying: PlayingJSONTrack | null;
  currentActiveRoom: string;
  queue: JSONTrack[];
}
