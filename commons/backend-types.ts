export interface JSONTrack {
  url: string;
  title: string;
  duration: number;
  artistsName: string;
  albumName: string;
  imgUrl: string;
  /** An array of all genres of this song */
  genres: string[];
  id: string;
}

export interface RoomJSONTrack extends JSONTrack {
  /**
   * The user id of the user who added the track to the queue
   */
  addedBy: string;
  votes: string[]; // array of user ids
}

export interface PlayingJSONTrack extends RoomJSONTrack {
  currentTime: number;
  isPlaying: boolean;
  updated_at: number;
}

export interface PlayedJSONTrack extends RoomJSONTrack {
  position: number;
}

export interface RoomJSON {
  currentlyPlaying: PlayingJSONTrack | null;
  currentActiveRoom: string;
  queue: RoomJSONTrack[];
  voteSkipActualTrack: string[];
}

export interface Playlist {
  name: string;
  playlistId: string;
}
