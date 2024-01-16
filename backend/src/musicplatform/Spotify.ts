import MusicPlatform, {JSONTrack} from "./MusicPlatform";

namespace SpotifyApi {
    export interface Track {
        album: Album;
        artists: Artist[];
        available_markets: string[];
        disc_number: number;
        duration_ms: number;
        explicit: boolean;
        external_ids: ExternalIDS;
        external_urls: ExternalUrls;
        href: string;
        id: string;
        is_local: boolean;
        name: string;
        popularity: number;
        preview_url: string;
        track_number: number;
        type: string;
        uri: string;
    }

    export interface Album {
        album_type: string;
        artists: Artist[];
        available_markets: string[];
        external_urls: ExternalUrls;
        href: string;
        id: string;
        images: Image[];
        name: string;
        release_date: Date;
        release_date_precision: string;
        total_tracks: number;
        type: string;
        uri: string;
    }

    export interface Artist {
        external_urls: ExternalUrls;
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
    }

    export interface ExternalUrls {
        spotify: string;
    }

    export interface Image {
        height: number;
        url: string;
        width: number;
    }

    export interface ExternalIDS {
        isrc: string;
    }
}

interface SpotifyToken {
    "access_token": string,
    "token_type": string,
    "expires_in": string
}

export default class Spotify extends MusicPlatform {
    constructor() {
        super(/^https?:\/\/open\.spotify\.com\/(?:.*\/)?track\/([a-zA-Z0-9]*)(?:\?.*)?$/i);
    }

    async getAuthOptionsFetch(init?: RequestInit): Promise<RequestInit> {

        let body = new URLSearchParams({
            grant_type: "client_credentials",
            client_id: "d4ea0d1deac542c69fca5816009152ba",
            client_secret: "171703fb8b454ee684fefd69508de931"
        });

        const res = await fetch("https://accounts.spotify.com/api/token", {method: "POST", body: body});
        const data = await res.json() as SpotifyToken;
        let result = {
            headers: {
                Authorization: `${data.token_type} ${data.access_token}`
            }
        };
        return Object.assign(result, init);
    }

    async getJsonTrack(id: string): Promise<JSONTrack> {
        let data = await fetch(new URL(id, "https://api.spotify.com/v1/tracks/"), await this.getAuthOptionsFetch())
            .then(res => res.json()) as SpotifyApi.Track;

        return {
            url: new URL(data.external_urls.spotify),
            title: data.name,
            duration: data.duration_ms,
            artistName: data.artists[0].name,
            albumName: data.album.name,
            imgUrl: new URL(data.album.images[0].url).toJSON()
        }

    }
}