import { JSONTrack, PlayingJSONTrack, RoomJSON } from "./backend-types";

export type Response<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export interface ServerToClientEvents {
  /**
   * Sends the current queue to the client
   * @param room The room object containing the queue
   */
  "queue:update": (room: RoomJSON | Error) => void;

  /**
   * Sends the current playback state to the client
   * @param playbackState The current playback state
   */
  "player:updatePlaybackState": (
    playbackState: Response<PlayingJSONTrack | null>
  ) => void;

  /**
   * Sends a request to the client to end the room
   */
  "room:end": () => void;

  /**
   * Sends the current queue to the client
   * This will be sent after the client requested the queue
   */
  "player:getQueue": (queue: Response<Array<JSONTrack>>) => void;

  /**
   * IMPORTANT
   * All following events will only be sent:
   *  - to the host
   *  - if the music player is local and therefore loaded on the host's device
   */

  /**
   * Requests the current playback state to the client
   */
  "player:getPlaybackState": () => void;

  /**
   * Sends a request to the client to play a track with the given id
   * @param trackId The id of the track to play (e.g. spotify:track:1234, https://soundcloud.com/12/34, etc.)
   */
  "player:playTrack": (trackId: string) => void;

  /**
   * Sends a request to the client to set the volume to the given value
   * @param volume The volume to set
   */
  "player:setVolume": (volume: number) => void;

  /**
   * Sends a request to the client to seek to the given position
   * @param position The position to seek to
   */
  "player:seekTo": (position: number) => void;

  /**
   * Sends a request to the client to play the current track
   */
  "player:play": () => void;

  /**
   * Sends a request to the client to pause the current track
   */
  "player:pause": () => void;

  /**
   * Sends a request to the client to skip the current track
   */
  "player:skip": () => void;

  /**
   * Sends a request to the client to play the previous track
   */
  "player:previous": () => void;
}

export interface ClientToServerEvents {
  /**
   * Sends a request to the server to add a track to the queue
   * @param rawUrl The url of the track to add
   */
  "queue:add": (rawUrl: string) => void;

  /**
   * Sends a request to the server to remove a track from the queue
   * @param index The index of the track to remove
   */
  "queue:remove": (index: number) => void;

  /**
   * Sends a request to the server to remove a track from the queue
   * @param link The link of the track to remove
   */
  "queue:removeLink": (link: string) => void;

  /**
   * We found a better way to get the user id
   * @param index index of the track to vote skip
   * @param userid identifier of the user who wants to vote skip
   */
  "queue:voteSkip": (index: number, userid: string) => void;

  /**
   * Sends a request to the server to start the playback of a track
   * @param trackId The id of the track to play (e.g. spotify:track:1234, https://soundcloud.com/12/34, etc.)
   */
  "player:playTrack": (trackId: string) => void;

  /**
   * Sends a request to the server to set the volume to the given value
   * @param volume
   */
  "player:setVolume": (volume: number) => void;

  /**
   * Sends a request to the server to seek to the given position
   * @param position
   */
  "player:seekTo": (position: number) => void;

  /**
   * Sends a request to the server to play the current track
   */
  "player:play": () => void;

  /**
   * Sends a request to the server to pause the current track
   */
  "player:pause": () => void;

  /**
   * Sends a request to the server to skip the current track
   */
  "player:skip": () => void;

  /**
   * Sends a request to the server to play the previous track
   */
  "player:previous": () => void;

  /**
   * Sends a request to the server to get the current queue
   */
  "player:getQueue": () => void;

  /**
   * Returns the current playback state to the server
   * Will only be sent:
   *  - by the host
   *  - if the music player is local and therefore loaded on the host's device
   * @param playbackState The current playback state
   */
  "player:updatePlaybackState": (
    playbackState: Response<PlayingJSONTrack | null>
  ) => void;

  /**
   * Sends a request to the server to get the current playback state
   */
  "player:getPlaybackState": () => void;
  "utils:search": (
    text: string,
    resultCallback: (args: JSONTrack[]) => void
  ) => void;
}
