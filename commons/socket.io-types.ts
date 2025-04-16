import { JSONTrack, PlayingJSONTrack, RoomJSON } from "./backend-types";

export type Response<T> =
  | { data: T; error: null }
  | { data: null; error: string };

/**
 * Interface for events that are sent from the local player to the server.
 * These are requests that the local player makes to the server.
 */
export interface LocalPlayerServerToClientEvents {
  /** Request the current playback state */
  "player:playbackStateRequest": () => void;
  /** Request the current queue of the local player */
  "player:getQueueRequest": () => void;
  /** Request to play a specific track. */
  "player:playTrackRequest": (trackId: string) => void;
  /** Request to set the volume. */
  "player:setVolumeRequest": (volume: number) => void;
  /** Request to seek to a specific position in the track. */
  "player:seekToRequest": (position: number) => void;
  /** Request to play the current track. */
  "player:playRequest": () => void;
  /** Request to pause the current track. */
  "player:pauseRequest": () => void;
  /** Request to skip to the next track. */
  "player:skipRequest": () => void;
  /** Request to go to the previous track. */
  "player:previousRequest": () => void;
}

/**
 * Interface for events that are sent from the client to the local player.
 * These are responses to the requests that the local player made.
 */
export interface LocalPlayerClientToServerEvents {
  /** Response to the playback state request. */
  "player:playbackStateRequest": (
    response: Response<PlayingJSONTrack | null>
  ) => void;
  /** Response to the get queue request. */
  "player:getQueueRequest": (response: Response<void>) => void;
  /** Response to the play track request. */
  "player:playTrackRequest": (response: Response<void>) => void;
  /** Response to the set volume request. */
  "player:setVolumeRequest": (response: Response<void>) => void;
  /** Response to the seek to request. */
  "player:seekToRequest": (response: Response<void>) => void;
  /** Response to the play request. */
  "player:playRequest": (response: Response<void>) => void;
  /** Response to the pause request. */
  "player:pauseRequest": (response: Response<void>) => void;
  /** Response to the skip request. */
  "player:skipRequest": (response: Response<void>) => void;
  /** Response to the previous track request. */
  "player:previousRequest": (response: Response<void>) => void;
}

/**
 * Interface for events that are sent from the server to the client.
 * These are responses to client requests or updates.
 */
export interface ServerToClientEvents
  extends LocalPlayerServerToClientEvents,
    PlayerServerToClientEvents {
  /** Update the queue. */
  "queue:update": (room: RoomJSON | Error) => void;
  /** End the room. */
  "room:end": () => void;
  // error events are handled by the client in layout of rooms/[id]
  // it displays a error page with a button to go back to the home page
  "room:error": (error: string) => void;
}

/**
 * Interface for events that are sent from the client to the server.
 * These are requests that the client makes to the server.
 */
export interface ClientToServerEvents
  extends LocalPlayerClientToServerEvents,
    PlayerClientToServerEvents {
  /** Add a track to the queue. */
  "queue:add": (rawUrl: string, accountId: string) => void;
  /** Remove a track from the queue by its index. */
  "queue:remove": (index: number) => void;
  /** Remove a track from the queue by its link. */
  "queue:removeLink": (link: string) => void;
  // we found a better way to get the user id
  "queue:voteSkip": (index: number, userid: string) => void;
  /** Search for tracks. */
  "utils:search": (
    text: string,
    resultCallback: (args: JSONTrack[]) => void
  ) => void;
}

/**
 * Interface for events that are sent from the client to the server that are related to the player.
 * These are requests that the client makes to the server.
 */
interface PlayerClientToServerEvents {
  "player:playTrack": (trackId: string) => void;
  "player:pause": () => void;
  "player:play": () => void;
  "player:seekTo": (position: number) => void;
  "player:setVolume": (volume: number) => void;
  "player:skip": () => void;
  "player:previous": () => void;
}
/**
 * Interface for events that are sent from the server to the client that are related to the player.
 * These are responses to client requests or updates.
 */
interface PlayerServerToClientEvents {
  "player:playTrack": (response: Response<void>) => void;
  "player:pause": (response: Response<void>) => void;
  "player:play": (response: Response<void>) => void;
  "player:seekTo": (response: Response<void>) => void;
  "player:setVolume": (response: Response<void>) => void;
  "player:skip": (response: Response<void>) => void;
  "player:previous": (response: Response<void>) => void;
  "player:updatePlaybackState": (
    playbackState: Response<PlayingJSONTrack | null>
  ) => void;
}
