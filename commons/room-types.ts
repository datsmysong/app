import { Profile, StreamingService, UserProfile } from "./database-types-utils";

export type InactiveRoomMusic = {
  name: string;
  artist: string;
  position: number;
  genre: string;
  liked: boolean;
};

export type Participant = {
  profile: UserProfile | Profile;
  joinedAt: string;
  roomId: string;
  banned: boolean;
};

export type ProcessedRoom = {
  name: string;
  participants: Participant[];
  duration: string;
  playedSongs: InactiveRoomMusic[];
  mostPlayedGenre: string;
  streamingService: StreamingService;
  averageSongDuration: string;
  createdAt: string;
};
