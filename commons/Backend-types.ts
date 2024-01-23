export interface JSONTrack {
  url: string;
  title: string;
  duration: number;
  artistName: string;
  albumName: string;
  imgUrl: string;
}

export interface RoomJSON {
  currentActiveRoom: string;
  tracks: JSONTrack[];
}
