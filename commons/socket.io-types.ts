import { JSONTrack, PlayingJSONTrack, RoomJSON } from "./backend-types";

export type Response<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export interface ServerToClientEvents {
  "queue:update": (room: RoomJSON | Error) => void;
  "player:updatePlaybackState": (
    playbackState: PlayingJSONTrack | null
  ) => void;
  "player:getPlaybackState": () => void;
  "player:getQueue": (queue: JSONTrack[]) => void;
  "player:playTrack": (trackId: string) => void;
  "player:setVolume": (volume: number) => void;
  "player:seekTo": (position: number) => void;
  "player:play": () => void;
  "player:pause": () => void;
  "player:skip": () => void;
  "player:previous": () => void;
  "room:end": () => void;

  // error events are handled by the client in layout of rooms/[id]
  // it displays a error page with a button to go back to the home page
  "room:error": (error: string) => void;
}

export interface ClientToServerEvents {
  "queue:add": (rawUrl: string) => void;
  "queue:remove": (indexOrLink: string) => void;
  "queue:removeLink": (link: string) => void;
  "queue:voteSkip": (index: number, userid: string) => void; // we found a better way to get the user id
  "player:playTrack": (trackId: string) => void;
  "player:setVolume": (volume: number) => void;
  "player:seekTo": (position: number) => void;
  "player:play": () => void;
  "player:pause": () => void;
  "player:skip": () => void;
  "player:previous": () => void;
  "player:getQueue": () => void;
  "player:updatePlaybackState": (
    playbackState: PlayingJSONTrack | null
  ) => void;
  "player:getPlaybackState": () => void;
  "utils:search": (
    text: string,
    resultCallback: (args: JSONTrack[]) => void
  ) => void;
}
