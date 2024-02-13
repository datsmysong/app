import { SimplifiedArtist, SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { JSONTrack, PlayingJSONTrack } from "commons/backend-types";
import { adminSupabase } from "../../server";
import MusicPlatform from "../MusicPlatform";
import Remote from "./Remote";
import Room from "../../socketio/Room";
import { Response } from "commons/socket.io-types";

export default class SpotifyRemote extends Remote {
  spotifyClient: SpotifyApi;
  musicPlatform: MusicPlatform;

  protected constructor(
    spotifyClient: SpotifyApi,
    musicPlatform: MusicPlatform
  ) {
    super();
    this.spotifyClient = spotifyClient;
    this.musicPlatform = musicPlatform;
  }

  static async createRemote(
    room: Room,
    musicPlatform: MusicPlatform
  ): Promise<SpotifyRemote | null> {
    const { data, error } = await adminSupabase
      .from("rooms")
      .select("*, user_profile(*, bound_services(*))")
      .eq("id", room.uuid)
      .single();

    if (
      error ||
      !data ||
      !data.user_profile ||
      !data.user_profile.bound_services
    )
      return null;

    const { access_token, expires_in, refresh_token } =
      data.user_profile.bound_services[0];

    if (!access_token || !expires_in || !refresh_token) return null;

    const expiresIn = parseInt(expires_in);

    const spotifyClient = SpotifyApi.withAccessToken(
      process.env.SPOTIFY_CLIENT_ID as string,
      {
        access_token,
        refresh_token,
        expires_in: expiresIn,
        token_type: "Bearer",
      }
    );
    return new SpotifyRemote(spotifyClient, musicPlatform);
  }

  async getPlaybackState(): Promise<Response<PlayingJSONTrack | null>> {
    const spotifyPlaybackState =
      await this.spotifyClient.player.getPlaybackState();

    if (!spotifyPlaybackState || spotifyPlaybackState.item.type === "episode")
      return { data: null, error: "No track is currently playing" };

    const playbackState = {
      ...spotifyPlaybackState,
      item: spotifyPlaybackState.item as Track,
    };

    const artistsName = extractArtistsName(playbackState.item.album.artists);

    return {
      data: {
        isPlaying: playbackState.is_playing,
        albumName: playbackState.item.album.name,
        artistsName: artistsName,
        currentTime: playbackState.progress_ms,
        duration: playbackState.item.duration_ms,
        imgUrl: playbackState.item.album.images[0].url,
        title: playbackState.item.name,
        url: playbackState.item.external_urls.spotify,
        updated_at: Date.now(),
      },
      error: null,
    };
  }

  async getQueue(): Promise<Response<JSONTrack[]>> {
    const spotifyQueue = await this.spotifyClient.player.getUsersQueue();

    const queue = spotifyQueue.queue
      .filter((item) => item.type === "track")
      .map((item) => item as Track)
      .map((item) => {
        return {
          title: item.name,
          albumName: item.album.name,
          artistsName: extractArtistsName(item.album.artists),
          duration: item.duration_ms,
          imgUrl: item.album.images[0].url,
          url: item.external_urls.spotify,
        };
      });

    return { data: queue, error: null };
  }

  async playTrack(trackId: string): Promise<Response<void>> {
    const state = await this.spotifyClient.player.getPlaybackState();

    if (!state || !state.device.id) {
      return { data: null, error: "No device found" };
    }

    await this.spotifyClient.player.startResumePlayback(
      state.device.id,
      undefined,
      [`${trackId}`]
    );

    return { data: undefined, error: null };
  }

  async setVolume(volume: number): Promise<Response<void>> {
    await this.spotifyClient.player.setPlaybackVolume(volume);
    return { data: undefined, error: null };
  }

  async seekTo(position: number): Promise<Response<void>> {
    await this.spotifyClient.player.seekToPosition(position);
    return { data: undefined, error: null };
  }

  async play(): Promise<Response<void>> {
    const state = await this.spotifyClient.player.getPlaybackState();
    if (!state || !state.device.id) {
      return { data: null, error: "No device found" };
    }

    await this.spotifyClient.player.startResumePlayback(state.device.id);
    return { data: undefined, error: null };
  }

  async pause(): Promise<Response<void>> {
    const state = await this.spotifyClient.player.getPlaybackState();
    if (!state || !state.device.id) {
      return { data: null, error: "No device found" };
    }

    await this.spotifyClient.player.pausePlayback(state.device.id);
    return { data: undefined, error: null };
  }

  async previous(): Promise<Response<void>> {
    const state = await this.spotifyClient.player.getPlaybackState();
    if (!state || !state.device.id) {
      return { data: null, error: "No device found" };
    }

    await this.spotifyClient.player.skipToPrevious(state.device.id);
    return { data: undefined, error: null };
  }

  async next(): Promise<Response<void>> {
    const state = await this.spotifyClient.player.getPlaybackState();
    if (!state || !state.device.id) {
      return { data: null, error: "No device found" };
    }

    await this.spotifyClient.player.skipToNext(state.device.id);
    return { data: undefined, error: null };
  }

  async addToQueue(trackId: string): Promise<Response<void>> {
    await this.spotifyClient.player.addItemToPlaybackQueue(trackId);
    return { data: undefined, error: null };
  }
}

const extractArtistsName = (artists: SimplifiedArtist[]) => {
  return artists.reduce(
    (acc, current) => (acc ? `${acc}, ` : "") + current.name,
    ""
  );
};
