import { JSONTrack, PlayingJSONTrack, RoomJSON } from "./backend-types";

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
}

export interface ClientToServerEvents {
  "queue:add": (rawUrl: string) => void;
  "queue:remove": (indexOrLink: string) => void;
  "queue:removeLink": (link: string) => void;
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
}
