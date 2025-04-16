import { QueryData, User } from "@supabase/supabase-js";
import { JSONTrack, PlayedJSONTrack } from "commons/backend-types";
import { Participant, ProcessedRoom } from "commons/room-types";
import { FastifyReply, FastifyRequest } from "fastify";
import { getMusicPlatform } from "../RoomStorage";
import createClient from "../lib/supabase";
import MusicPlatform from "../musicplatform/MusicPlatform";
import { adminSupabase } from "../server";

export interface QueryParams {
  id: string;
}

type ReturnedRoomData = QueryData<ReturnType<typeof query>>[0];

/**
 * TODO: Fetch actual like status from all platforms the user has connected to his account
 * @param musicPlatform The music platform the song is from
 * @param songId The song id
 * @param user The user
 * @returns true if the user has liked the song on at least one platform he has connected to his account, false otherwise
 */
async function isLiked(
  musicPlatform: MusicPlatform,
  songId: string,
  user: User
): Promise<boolean> {
  // Avoid eslint warning
  return false && musicPlatform && songId && user;
}

async function getSongMetadata(
  musicPlatform: MusicPlatform,
  songId: string
): Promise<JSONTrack | null> {
  const data = await musicPlatform.getJsonTrack(songId);
  return data;
}

/**
 * This method returns the played songs of a room with additional information based on the user (like status)
 * @param room
 * @param user
 * @returns
 */
const getPlayedSongsForUser = async (
  room: ReturnedRoomData,
  user: User
): Promise<Array<PlayedJSONTrack>> => {
  if (room.streaming_services === null) return [];

  const musicPlatform = getMusicPlatform(room.streaming_services?.service_id);
  if (!musicPlatform) return [];

  const playedSongs = await getPlayedSongs(room);

  const promises = playedSongs
    .map(async (song) => {
      if (!song) return null;

      const songId = song.id;
      const liked = await isLiked(musicPlatform, songId, user);

      return {
        ...song,
        liked,
      };
    })
    .filter((song) => song !== null) as Array<Promise<PlayedJSONTrack>>;

  return Promise.all(promises);
};

/**
 * This method returns the played songs of a room
 * @param room The room
 * @returns The played songs of the room
 */
const getPlayedSongs = async (
  room: ReturnedRoomData
): Promise<Array<PlayedJSONTrack>> => {
  if (room.streaming_services === null) return [];
  const musicPlatform = getMusicPlatform(room.streaming_services?.service_id);
  if (!musicPlatform) return [];

  const promises = room.room_history
    .map(async (song, index) => {
      const songId = song.music_id;
      const metadata = await getSongMetadata(musicPlatform, songId);

      if (!metadata) return null;
      if (!song.profile_id) return null;

      return {
        ...metadata,
        position: index + 1,
        addedBy: song.profile_id,
      };
    })
    .filter((song) => song !== null) as Array<Promise<PlayedJSONTrack>>;

  return await Promise.all(promises);
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
const useProcessRoom = async (
  room: ReturnedRoomData,
  user: User
): Promise<ProcessedRoom | null> => {
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
  const playedSongs = (await getPlayedSongsForUser(room, user)).filter(
    (song) => song !== null
  );

  let averageSongDuration = 0;
  if (playedSongs.length >= 1) {
    averageSongDuration =
      playedSongs.reduce((acc, song) => acc + song.duration, 0) /
      playedSongs.length;
  }

  const genresPlayCount = playedSongs
    .map((song) => song.genres)
    .reduce((acc, genres) => {
      genres.forEach((genre) => {
        acc[genre] = acc[genre] ? acc[genre] + 1 : 1;
      });
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
    { genre: "Aucune musique", count: 0 }
  ).genre;

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

  const processedRoomData = await useProcessRoom(data, user);
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
    )
    .order("position", {
      referencedTable: "room_history",
    });
