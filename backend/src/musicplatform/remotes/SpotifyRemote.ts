import { SimplifiedArtist, SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import { PlayingJSONTrack } from "commons/backend-types";
import { adminSupabase } from "../../server";
import MusicPlatform from "../MusicPlatform";
import Remote from "./Remote";

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
    roomId: string,
    musicPlatform: MusicPlatform
  ): Promise<SpotifyRemote | null> {
    const { data, error } = await adminSupabase
      .from("rooms")
      .select("*, user_profile(*, bound_services(*))")
      .eq("user_profile.bound_services.service_name", "Spotify")
      .eq("id", roomId)
      .single();

    if (error) return null;
    if (data.user_profile?.bound_services === undefined) return null;
    if (!data.user_profile?.bound_services[0]) return null;

    const { access_token, expires_in, refresh_token } =
      data.user_profile?.bound_services[0];

    const spotifyClient = SpotifyApi.withAccessToken(
      process.env.SPOTIFY_CLIENT_ID as string,
      {
        access_token,
        refresh_token,
        expires_in,
        token_type: "Bearer",
      }
    );

    return new SpotifyRemote(spotifyClient, musicPlatform);
  }

  getMusicPlatform(): MusicPlatform {
    return this.musicPlatform;
  }

  async getPlaybackState(): Promise<PlayingJSONTrack | null> {
    const spotifyPlaybackState =
      await this.spotifyClient.player.getPlaybackState();

    // If the item playing is an episode and not a music track, then we return null
    // Since we don't need support for those, for now, and they don't contain necessary information
    // such as the album name, artists name, etc.

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
  }
}

const extractArtistsName = (artists: SimplifiedArtist[]) => {
  return artists.reduce(
    (acc, current) => (acc ? `${acc}, ` : "") + current.name,
    ""
  );
};
