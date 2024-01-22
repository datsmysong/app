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
    day: Math.floor(ms / 86400000),
    hour: Math.floor(ms / 3600000) % 24,
    minute: Math.floor(ms / 60000) % 60,
    second: Math.floor(ms / 1000) % 60,
    millisecond: Math.floor(ms) % 1000,
  };
  return Object.entries(time)
    .filter((val) => val[1] !== 0)
    .map(([key, val]) => `${val} ${key}${val !== 1 ? "s" : ""}`)
    .join(", ");
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

function getParticipants(roomUsers: RoomUser[]): Participant[] {
  const arrayRoomUsers = Array.isArray(roomUsers) ? roomUsers : [roomUsers];

  return arrayRoomUsers.map((participant) => {
    return {
      profile: {
        nickname: "John Doe",
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
    month: "narrow",
    day: "numeric",
  });

  const duration = Intl.DateTimeFormat("fr-FR", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(roomEndingDate.getTime() - roomCreationData.getTime());

  const streamingService = room.streaming_services;
  const playedSongs = usePlayedSongs(room.room_history, user);
  const averageSongDuration = formatDuration(
    playedSongs.reduce((acc, song) => acc + song.duration, 0) /
      playedSongs.length
  );
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

  const participants = getParticipants(room.room_users);

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
    .select("*, room_users(*), room_history(*), streaming_services(*)")
    .eq("id", id)
    .single();
}
