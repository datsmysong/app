import { SimplifiedArtist, SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { JSONTrack, PlayingJSONTrack } from "commons/backend-types";
import { QueueableRemote, Remote } from "./Remote";
import Room from "../../socketio/Room";
import { Response } from "commons/socket.io-types";
import { STREAMING_SERVICES, getMusicPlatform } from "../../RoomStorage";
import { adminSupabase } from "../../server";
import MusicPlatform from "../MusicPlatform";
import Spotify from "../Spotify";

export default class SpotifyRemote extends QueueableRemote {
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
  ): Promise<Response<Remote>> {
    const { data, error } = await adminSupabase
      .from("rooms")
      .select("*, user_profile(*, bound_services(*))")
      .eq("id", room.uuid)
      .eq(
        "user_profile.bound_services.service_id",
        "a2d17b25-d87e-42af-9e79-fd4df6b59222"
      )
      .single();

    if (error)
      return {
        data: null,
        error: "Failed to fetch host's Spotify credentials",
      };
    if (
      data.user_profile?.bound_services === undefined ||
      data.user_profile?.bound_services.length === 0 ||
      !data.user_profile.bound_services[0].access_token ||
      !data.user_profile.bound_services[0].expires_in ||
      !data.user_profile.bound_services[0].refresh_token
    )
      return {
        data: null,
        error:
          "Couldn't find Spotify credentials. Please double check that your Spotify account is linked in your account settings under 'Integrations'",
      };

    const { access_token, expires_in, refresh_token } =
      data.user_profile.bound_services[0];

    const expiresIn = parseInt(expires_in);
    try {
      // TODO: https://github.com/spotify/spotify-web-api-ts-sdk/issues/79
      // Seems like the tokens aren't refreshed properly, this has been fixed in the GitHub repo but we're
      // awaiting a release of the library to update and fix the issue
      const spotifyClient = SpotifyApi.withAccessToken(
        process.env.SPOTIFY_CLIENT_ID as string,
        {
          access_token,
          refresh_token,
          expires_in: expiresIn,
          token_type: "Bearer",
        }
      );
      return {
        data: new SpotifyRemote(spotifyClient, musicPlatform),
        error: null,
      };
    } catch (e) {
      return {
        data: null,
        error:
          "Failed to authenticate to Spotify using saved credentials. Try disconnecting then reconnecting your Spotify account from your account 'Integrations' page",
      };
    }
  }

  async getPlaybackState(): Promise<Response<PlayingJSONTrack | null>> {
    return runSpotifyCallback(async () => {
      try {
        const spotifyPlaybackState =
          await this.spotifyClient.player.getPlaybackState();

        if (
          !spotifyPlaybackState ||
          spotifyPlaybackState.item.type === "episode"
        )
          return { data: null, error: "No track is currently playing" };

        const playbackState = {
          ...spotifyPlaybackState,
          item: spotifyPlaybackState.item as Track,
        };

        const artistsName = extractArtistsName(
          playbackState.item.album.artists
        );

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
            // TODO: Add the id of the user who added the track
            addedBy: "",
            genres: playbackState.item.album.genres,
            id: playbackState.item.uri,
            // TODO: Fetch the current votes for the current track
            votes: [],
          },
          error: null,
        };
      } catch (e) {
        return { data: null, error: "Failed to fetch current Playbackstate" };
      }
    });
  }

  async getQueue(): Promise<Response<JSONTrack[]>> {
    return runSpotifyCallback(async () => {
      const musicPlatform = getMusicPlatform(
        STREAMING_SERVICES.Spotify
      ) as Spotify;
      if (!musicPlatform)
        return { data: null, error: "Music platform not found" };

      const spotifyQueue = await this.spotifyClient.player.getUsersQueue();

      const queue = spotifyQueue.queue
        .filter((item) => item.type === "track")
        .map((item) => item as Track)
        .map((item) => musicPlatform.toJSON(item as never))
        .filter((item) => item !== null) as JSONTrack[];

      return { data: queue, error: null };
    });
  }

  async playTrack(trackId: string): Promise<Response<void>> {
    return runSpotifyCallback(async () => {
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
    });
  }

  async setVolume(volume: number): Promise<Response<void>> {
    return runSpotifyCallback(async () => {
      await this.spotifyClient.player.setPlaybackVolume(volume);
      return { data: undefined, error: null };
    });
  }

  async seekTo(position: number): Promise<Response<void>> {
    position = Math.floor(position);
    return runSpotifyCallback(async () => {
      await this.spotifyClient.player.seekToPosition(position);
      return { data: undefined, error: null };
    });
  }

  async play(): Promise<Response<void>> {
    return runSpotifyCallback(async () => {
      const state = await this.spotifyClient.player.getPlaybackState();
      if (!state || !state.device.id) {
        return { data: null, error: "No device found" };
      }

      await this.spotifyClient.player.startResumePlayback(state.device.id);
      return { data: undefined, error: null };
    });
  }

  async pause(): Promise<Response<void>> {
    return runSpotifyCallback(async () => {
      const state = await this.spotifyClient.player.getPlaybackState();
      if (!state || !state.device.id) {
        return { data: null, error: "No device found" };
      }

      await this.spotifyClient.player.pausePlayback(state.device.id);
      return { data: undefined, error: null };
    });
  }

  async previous(): Promise<Response<void>> {
    return runSpotifyCallback(async () => {
      const state = await this.spotifyClient.player.getPlaybackState();
      if (!state || !state.device.id) {
        return { data: null, error: "No device found" };
      }

      await this.spotifyClient.player.skipToPrevious(state.device.id);
      return { data: undefined, error: null };
    });
  }

  async next(): Promise<Response<void>> {
    return runSpotifyCallback(async () => {
      const state = await this.spotifyClient.player.getPlaybackState();
      if (!state || !state.device.id) {
        return { data: null, error: "No device found" };
      }

      await this.spotifyClient.player.skipToNext(state.device.id);
      return { data: undefined, error: null };
    });
  }

  async addToQueue(trackId: string): Promise<Response<void>> {
    return runSpotifyCallback(async () => {
      await this.spotifyClient.player.addItemToPlaybackQueue(trackId);
      return { data: undefined, error: null };
    });
  }
}

const extractArtistsName = (artists: SimplifiedArtist[]) => {
  return artists.reduce(
    (acc, current) => (acc ? `${acc}, ` : "") + current.name,
    ""
  );
};

function runSpotifyCallback<T>(
  callback: () => Promise<Response<T>>
): Promise<Response<T>> {
  return callback().catch((e: unknown) => {
    console.error(e);
    if (e instanceof Error) {
      return { data: null, error: e.message };
    }
    return { data: null, error: "An unknown error occurred" };
  });
}
