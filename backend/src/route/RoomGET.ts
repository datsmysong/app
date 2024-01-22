import { User } from "@supabase/supabase-js";
import { RoomHistory, RoomUser } from "commons/database-types-utils";
import { Participant, ProcessedRoom } from "commons/room-types";
import { FastifyReply, FastifyRequest } from "fastify";
import createClient from "../lib/supabase";

export interface QueryParams {
  id: string;
}
/*
 * This function is a workaround for the lack of support for the Intl.DurationFormat API in Expo
 * See https://www.30secondsofcode.org/js/s/format-duration/
 */
const formatDuration = (ms: number) => {
  if (ms < 0) ms = -ms;
  const time = {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60,
    ms: Math.floor(ms) % 1000,
  };
  return Object.entries(time)
    .filter((val) => val[1] !== 0)
    .map(([key, val]) => `${val}${key}`)
    .join(" ");
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isLiked(song: RoomHistory, user: User): boolean {
  return false;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getSongMetadata(song: RoomHistory) {
  return {
    name: "In The Name Of Love",
    artist: "Martin Garrix, Bebe Rexha",
    genre: "Rock",
    duration: 361,
  };
}

const usePlayedSongs = (roomHistory: RoomHistory[], user: User) => {
  return roomHistory.map((song) => {
    const liked = isLiked(song, user);
    const metadata = getSongMetadata(song);

    return {
      name: metadata.name,
      artist: metadata.artist,
      position: song.position,
      genre: metadata.genre,
      duration: metadata.duration,
      liked: liked,
    };
  });
};

type RoomUserWithProfile = RoomUser & {
  profile: {
    id: string;
    nickname: string;
    created_at: string;
    user_profile?: {
      user_profile_id: string;
      username: string;
      avatar: string;
      account_id: string;
    };
  };
};

function getParticipants(roomUsers: RoomUserWithProfile[]): Participant[] {
  const arrayRoomUsers = Array.isArray(roomUsers) ? roomUsers : [roomUsers];

  return arrayRoomUsers.map((participant) => {
    if (participant.profile.user_profile) {
      return {
        profile: {
          id: participant.profile.id,
          nickname: participant.profile.nickname,
          created_at: participant.profile.created_at,
          ...participant.profile.user_profile,
        },
        joinedAt: participant.joined_at,
        roomId: participant.room_id,
        banned: participant.banned,
      };
    }

    return {
      profile: {
        nickname: participant.profile.nickname,
        id: participant.profile_id,
        created_at: new Date().toISOString(),
      },
      joinedAt: participant.joined_at,
      roomId: participant.room_id,
      banned: participant.banned,
    };
  });
}

const useProcessRoom = (
  room: Awaited<ReturnType<typeof fetchRoomData>>["data"],
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
  const playedSongs = usePlayedSongs(room.room_history, user);

  let averageSongDuration = "0s";
  if (playedSongs.length >= 1) {
    averageSongDuration = formatDuration(
      (playedSongs.reduce((acc, song) => acc + song.duration, 0) /
        playedSongs.length) *
        1000
    );
  }

  const genresPlayCount = playedSongs
    .map((song) => song.genre)
    .reduce((acc, genre) => {
      acc[genre] = acc[genre] ? acc[genre] + 1 : 1;
      return acc;
    }, {} as Record<string, number>);
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

  const filteredUsers = roomUsers
    .filter((roomUser) => roomUser.profile !== null)
    .map((roomUser) => {
      return {
        ...roomUser,
        profile: {
          ...roomUser.profile,
          user_profile: roomUser.profile?.user_profile || undefined,
        },
      };
    }) as RoomUserWithProfile[];

  const participants = getParticipants(filteredUsers);

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
  return await supabase
    .from("rooms")
    .select(
      "*, room_users(*, profile(*, user_profile(*))), room_history(*), streaming_services(*)"
    )
    .eq("id", id)
    .single();
}
