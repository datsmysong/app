import { PlayedJSONTrack } from "./backend-types";
import { Profile, StreamingService, UserProfile } from "./database-types-utils";

export type Participant = {
  profile: Profile & {
    userProfile?: UserProfile;
  };
  joinedAt: string;
  roomId: string;
  banned: boolean;
};

export type ProcessedRoom = {
  name: string;
  participants: Participant[];
  duration: string;
  playedSongs: PlayedJSONTrack[];
  mostPlayedGenre: string;
  streamingService: StreamingService;
  averageSongDuration: number;
  createdAt: string;
};
