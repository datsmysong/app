import { PlaybackState, Queue, SpotifyApi } from "@spotify/web-api-ts-sdk";

const SPOTIFY_CLIENT_ID = "d4ea0d1deac542c69fca5816009152ba";
const SPOTIFY_CLIENT_SECRET = "171703fb8b454ee684fefd69508de931";
const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

export class Spotify implements StreamingPlatform {
  name = "Spotify";
  imgUrl = "https://via.placeholder.com/256";
  sdk: SpotifyApi;

  constructor() {
    this.sdk = SpotifyApi.withUserAuthorization(
      SPOTIFY_CLIENT_ID,
      "http://localhost:3000",
      ["user-read-playback-state", "user-modify-playback-state"]
    );
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

  async fetchCurrent(): Promise<PlayingMusic | null> {
    const state = await this.getCachedPlaybackState(10000);
    if (state === null) return null;

    return {
      title: state.item.name,
      artwork: state.item.album.images[0].url,
      artists: state.item.album.artists,
      duration_ms: state.item.duration_ms,
      progress_ms: state.progress_ms,
      is_playing: state.is_playing,
    };
  }

  private cachedQueue: Queue | null = null;
  private cachedPlaybackState: PlaybackState | null = null;
  private playbackStateCacheTime: number = 0;
  private queueCacheTime: number = 0;

  private async getPlaybackState(): Promise<PlaybackState | null> {
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
  ): Promise<PlaybackState | null> {
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
  async seek(position: number): Promise<void> {
    const state = await this.getCachedPlaybackState(10000);
    if (state === null || state.device.id === null) return;

    await this.sdk.player.seekToPosition(position, state?.device.id);
    this.cachedPlaybackState = null;
  }
}
