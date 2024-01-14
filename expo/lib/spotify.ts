import {
  AccessToken,
  Queue,
  SpotifyApi,
  PlaybackState as SpotifyPlaybackState,
} from "@spotify/web-api-ts-sdk";
import { OrderedMusic, StreamingPlatformRemote, PlaybackState } from "./types";

const SPOTIFY_CLIENT_ID = "d4ea0d1deac542c69fca5816009152ba";
const SPOTIFY_CLIENT_SECRET = "171703fb8b454ee684fefd69508de931";
const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";
const SPOTIFY_SERVICE_ID = "a2d17b25-d87e-42af-9e79-fd4df6b59222";

const extractTokenFromDatabase = (userProfileId: string): AccessToken => {
  const supabase = useSupabase();
  const { data, error } = supabase
    .from("bound_services")
    .select("*")
    .eq("user_profile_id", userProfileId)
    .eq("service_id", SPOTIFY_SERVICE_ID)
    .single();

  return {
    access_token: data.access_token,
    expires_in: data.expires_in,
    refresh_token: data.refresh_token,
    token_type: "Bearer",
  };
};

export class Spotify implements StreamingPlatformRemote {
  name = "Spotify";
  imgUrl = "https://via.placeholder.com/256";
  sdk: SpotifyApi;

  constructor(userProfileId: string) {
    const accessToken: AccessToken = extractTokenFromDatabase(userProfileId);
    this.sdk = SpotifyApi.withAccessToken(SPOTIFY_CLIENT_ID, accessToken);
  }
  async playMusic(musicUri: string) {
    const state = await this.getCachedPlaybackState(10000);
    if (state === null || state.device.id === null) {
      alert("please start playing on a device first");
      return;
    }

    await this.sdk.player.startResumePlayback(state.device.id, undefined, [
      musicUri,
    ]);
    this.cachedPlaybackState = null;
  }

  async fetchQueue(): Promise<OrderedMusic[]> {
    const queue = await this.getCachedQueue(10000);
    if (queue === null) return [];

    return queue.queue.map((item, index) => ({
      title: item.name,
      artwork: item.album.images[0].url,
      artists: item.album.artists,
      duration_ms: item.duration_ms,
      position: index,
    }));
  }

  async fetchCurrent(): Promise<PlaybackState | null> {
    const state = await this.getCachedPlaybackState(10000);
    if (state === null) return null;

    return {
      currentMusic: {
        title: state.item.name,
        artwork: state.item.album.images[0].url,
        artists: state.item.album.artists,
        duration_ms: state.item.duration_ms,
      },
      progressMs: state.progress_ms,
      isPlaying: state.is_playing,
      volume: state.device.volume_percent ?? 0,
    };
  }

  private cachedQueue: Queue | null = null;
  private cachedPlaybackState: SpotifyPlaybackState | null = null;
  private playbackStateCacheTime: number = 0;
  private queueCacheTime: number = 0;

  private async getPlaybackState(): Promise<SpotifyPlaybackState | null> {
    return await this.sdk.player.getPlaybackState();
  }

  private async getCachedQueue(cacheDuration: number): Promise<Queue | null> {
    const currentTime = Date.now();
    if (this.cachedQueue && currentTime - this.queueCacheTime < cacheDuration) {
      return this.cachedQueue;
    }

    const queue = await this.sdk.player.getUsersQueue();
    if (queue !== null) {
      this.cachedQueue = queue;
      this.queueCacheTime = currentTime;
    }

    return queue;
  }

  private async getCachedPlaybackState(
    cacheDuration: number
  ): Promise<SpotifyPlaybackState | null> {
    const currentTime = Date.now();
    // If we have a cached state and it's not expired, return it
    if (
      this.cachedPlaybackState &&
      currentTime - this.playbackStateCacheTime < cacheDuration
    ) {
      // If we're not playing, return the cached state
      if (!this.cachedPlaybackState.is_playing) return this.cachedPlaybackState;

      // If we're playing, return a temporary mocked state
      const mockedProgress =
        this.cachedPlaybackState.progress_ms +
        (currentTime - this.playbackStateCacheTime);

      const temporaryMockedState = {
        ...this.cachedPlaybackState,
        progress_ms: Math.min(
          mockedProgress,
          this.cachedPlaybackState.item.duration_ms
        ),
      };

      return temporaryMockedState;
    }

    // If the cache is expired, fetch a new state
    const state = await this.getPlaybackState();
    if (state !== null) {
      this.cachedPlaybackState = state;
      this.playbackStateCacheTime = currentTime;
    }

    return state;
  }

  async pause(): Promise<void> {
    const state = await this.getCachedPlaybackState(10000);
    if (state === null || state.device.id === null) return;

    await this.sdk.player.pausePlayback(state?.device.id);
    this.cachedPlaybackState = null;
  }

  async play(): Promise<void> {
    const state = await this.getCachedPlaybackState(10000);
    if (state === null || state.device.id === null) return;

    await this.sdk.player.startResumePlayback(state?.device.id);
    this.cachedPlaybackState = null;
  }

  async next(): Promise<void> {
    const state = await this.getCachedPlaybackState(10000);
    if (state === null || state.device.id === null) return;

    await this.sdk.player.skipToNext(state?.device.id);
    this.cachedPlaybackState = null;
  }
  async prev(): Promise<void> {
    const state = await this.getCachedPlaybackState(10000);
    if (state === null || state.device.id === null) return;

    await this.sdk.player.skipToPrevious(state?.device.id);
    this.cachedPlaybackState = null;
  }
  async setVolume(volume: number): Promise<void> {
    await this.sdk.player.setPlaybackVolume(volume);
  }
  async seekTo(position: number): Promise<void> {
    const state = await this.getCachedPlaybackState(10000);
    if (state === null || state.device.id === null) return;

    await this.sdk.player.seekToPosition(position, state?.device.id);
    this.cachedPlaybackState = null;
  }
}
