import { QueryData, User } from "@supabase/supabase-js";
import {
  Profile,
  RoomHistory,
  UserProfile,
} from "commons/database-types-utils";
import {
  InactiveRoomMusic,
  MusicMetadata,
  Participant,
  ProcessedRoom,
} from "commons/room-types";
import { FastifyReply, FastifyRequest } from "fastify";
import createClient from "../lib/supabase";
import { adminSupabase } from "../server";

export interface QueryParams {
  id: string;
}

type ReturnedRoomData = QueryData<ReturnType<typeof query>>[0];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isLiked(song: RoomHistory, user: User): boolean {
  return false;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getSongMetadata(song: RoomHistory): MusicMetadata {
  return {
    name: "In The Name Of Love",
    artist: "Martin Garrix, Bebe Rexha",
    genre: "Rock",
    duration: 361,
    artwork: "https://unsplash.it/300/300",
  };
}

const usePlayedSongs = (
  room: ReturnedRoomData,
  user: User
): (InactiveRoomMusic | null)[] => {
  return room.room_history.map((song) => {
    const liked = isLiked(song, user);
    const metadata = getSongMetadata(song);

    /**
     * This is ugly as hell, but Supabase is lying about its types...
     * song.profile and room.room_users are typed as arrays, but they can be
     * single elements instead
     */
    const songProfile = song.profile as unknown as Profile & {
      userProfile: UserProfile | null;
    };
    const roomUsers = Array.isArray(room.room_users)
      ? room.room_users
      : [room.room_users];

    const profileId = songProfile.id;
    const addedBy = roomUsers.find(
      (roomUser) => roomUser.profile_id === profileId
    );
    if (!addedBy || !addedBy.profile) return null;

    return {
      name: metadata.name,
      artist: metadata.artist,
      position: song.position,
      genre: metadata.genre,
      duration: metadata.duration,
      liked: liked,
      artwork: metadata.artwork,
      addedBy: {
        banned: addedBy.banned,
        joinedAt: addedBy.joined_at,
        profile: addedBy.profile,
        roomId: addedBy.room_id,
      },
    };
  });
};

function getParticipants(
  roomUsers: ReturnedRoomData["room_users"]
): (Participant | null)[] {
  const arrayRoomUsers = Array.isArray(roomUsers) ? roomUsers : [roomUsers];

  return arrayRoomUsers.map((participant) => {
    const participantProfile = participant.profile;
    if (!participantProfile) return null;

    if (participantProfile.user_profile) {
      return {
        profile: {
          id: participantProfile.id,
          nickname: participantProfile.nickname,
          created_at: participantProfile.created_at,
          userProfile: participantProfile.user_profile,
        },
        joinedAt: participant.joined_at,
        roomId: participant.room_id,
        banned: participant.banned,
      };
    }

    return {
      profile: {
        nickname: participantProfile.nickname,
        id: participantProfile.id,
        created_at: new Date().toISOString(),
      },
      joinedAt: participant.joined_at,
      roomId: participant.room_id,
      banned: participant.banned,
    };
  });
}
const useProcessRoom = (
  room: ReturnedRoomData,
  user: User
): ProcessedRoom | null => {
  if (!room) return null;
  if (!room.streaming_services) return null;

  const roomCreationData = new Date(room.created_at);
  const roomEndingDate = new Date(room.ended_at ?? new Date());
  const { name } = room;

  const createdAt = roomCreationData.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const duration = Intl.DateTimeFormat("fr-FR", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(roomEndingDate.getTime() - roomCreationData.getTime());

  const streamingService = room.streaming_services;
  const playedSongs = usePlayedSongs(room, user).filter(
    (song) => song !== null
  ) as InactiveRoomMusic[];

  let averageSongDuration = "0s";
  if (playedSongs.length >= 1) {
    averageSongDuration = (
      (playedSongs.reduce((acc, song) => acc + song.duration, 0) /
        playedSongs.length) *
      1000
    ).toString();
  }

  const genresPlayCount = playedSongs
    .map((song) => song.genre)
    .reduce(
      (acc, genre) => {
        acc[genre] = acc[genre] ? acc[genre] + 1 : 1;
        return acc;
      },
      {} as Record<string, number>
    );
  const mostPlayedGenre = Object.entries(genresPlayCount).reduce(
    (acc, [genre, count]) => {
      if (count > acc.count) {
        acc.genre = genre;
        acc.count = count;
      }
      return acc;
    },
    { genre: "", count: 0 }
  ).genre;

  console.log(room.room_users);

  const roomUsers = Array.isArray(room.room_users)
    ? room.room_users
    : [room.room_users];

  const filteredUsers = roomUsers.filter(
    (roomUser) => roomUser.profile !== null
  );

  const participants = getParticipants(filteredUsers).filter(
    (participant) => participant !== null
  ) as Participant[];

  return {
    name,
    createdAt,
    streamingService,
    duration,
    playedSongs,
    averageSongDuration,
    mostPlayedGenre,
    participants,
  };
};

export default async function RoomGET(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const id = (req.params as QueryParams).id;
  if (!id) {
    reply.code(400).send({ error: "Missing id" });
  }
  const supabase = createClient({
    request: req,
    response: reply,
  });
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError) {
    reply.code(401).send({ error: sessionError });
    return;
  }
  if (sessionData.session === null) {
    reply.code(401).send({ error: "No session" });
    return;
  }

  const user = sessionData.session.user;

  const { data, error } = await fetchRoomData(supabase, id);

  if (error) {
    reply.code(500).send({ error });
    return;
  }

  const processedRoomData = useProcessRoom(data, user);
  reply.code(200).send(processedRoomData);
}

async function fetchRoomData(
  supabase: ReturnType<typeof createClient>,
  id: string
) {
  return await query().eq("id", id).single();
}

const query = () =>
  adminSupabase
    .from("rooms")
    .select(
      "*, room_users(*, profile(*, user_profile(*))), room_history(*, profile(*, user_profile(*))), streaming_services(*)"
    );
