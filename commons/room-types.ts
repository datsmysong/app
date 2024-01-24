import { Profile, StreamingService, UserProfile } from "./database-types-utils";

export type MusicMetadata = {
  name: string;
  artist: string;
  genre: string;
  artwork: string;
  duration: number;
};

export type InactiveRoomMusic = MusicMetadata & {
  position: number;
  liked: boolean;
  addedBy: Participant;
};

export type Participant = {
  profile: Profile | (Profile & UserProfile);
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
