import { SimplifiedArtist, SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { JSONTrack, PlayingJSONTrack } from "commons/backend-types";
import { adminSupabase } from "../../server";
import MusicPlatform from "../MusicPlatform";
import Remote from "./Remote";
import Room from "../../socketio/Room";

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

    if (error) return null;
    if (data.user_profile?.bound_services === undefined) return null;
    if (data.user_profile?.bound_services.length === 0) return null;

    const { access_token, expires_in, refresh_token } =
      data.user_profile.bound_services[0];

    if (access_token === null || expires_in === null || refresh_token === null)
      return null;

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

  async getPlaybackState(): Promise<PlayingJSONTrack | null> {
    try {
      const spotifyPlaybackState =
        await this.spotifyClient.player.getPlaybackState();

      // If the item playing is an episode and not a music track, then we return null
      // Since we don't need support for those, for now, and they don't contain necessary information
      // such as the album name, artists name, etc.
      if (spotifyPlaybackState === null) return null;

      if (spotifyPlaybackState.item.type === "episode") return null;
      const playbackState = {
        ...spotifyPlaybackState,
        item: spotifyPlaybackState.item as Track,
      };

      const artistsName = extractArtistsName(playbackState.item.album.artists);

      return {
        isPlaying: playbackState.is_playing,
        albumName: playbackState.item.album.name,
        artistsName: artistsName,
        currentTime: playbackState.progress_ms,
        duration: playbackState.item.duration_ms,
        imgUrl: playbackState.item.album.images[0].url,
        title: playbackState.item.name,
        url: playbackState.item.external_urls.spotify,
      };
    } catch (e) {
      console.error("Impossible to get playback state");
      return null;
    }
  }

  async getQueue(): Promise<JSONTrack[]> {
    const spotifyQueue = await this.spotifyClient.player.getUsersQueue();

    return spotifyQueue.queue
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
  }

  async playTrack(trackId: string): Promise<{ error?: string }> {
    const state = await this.spotifyClient.player.getPlaybackState();

    if (!state || !state.device.id) {
      return { error: "No device found" };
    }

    await this.spotifyClient.player.startResumePlayback(
      state.device.id,
      undefined,
      [`${trackId}`]
    );

    return {};
  }

  async setVolume(volume: number): Promise<void> {
    await this.spotifyClient.player.setPlaybackVolume(volume);
  }

  async seekTo(position: number): Promise<void> {
    await this.spotifyClient.player.seekToPosition(position);
  }

  async play(): Promise<void> {
    const state = await this.spotifyClient.player.getPlaybackState();
    if (!state || !state.device.id) {
      return;
    }

    await this.spotifyClient.player.startResumePlayback(state.device.id);
  }

  async pause(): Promise<void> {
    const state = await this.spotifyClient.player.getPlaybackState();
    if (!state || !state.device.id) {
      return;
    }

    await this.spotifyClient.player.pausePlayback(state.device.id);
  }

  async previous(): Promise<void> {
    const state = await this.spotifyClient.player.getPlaybackState();
    if (!state || !state.device.id) {
      return;
    }

    await this.spotifyClient.player.skipToPrevious(state.device.id);
  }

  async next(): Promise<void> {
    const state = await this.spotifyClient.player.getPlaybackState();
    if (!state || !state.device.id) {
      return;
    }

    await this.spotifyClient.player.skipToNext(state.device.id);
  }
}

const extractArtistsName = (artists: SimplifiedArtist[]) => {
  return artists.reduce(
    (acc, current) => (acc ? `${acc}, ` : "") + current.name,
    ""
  );
};
