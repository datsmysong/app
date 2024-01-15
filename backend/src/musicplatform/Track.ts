import MusicPlatform, {JSONTrack} from "./MusicPlatform";



export default class Track {
    private readonly platform: MusicPlatform;
    private readonly id: string;
    constructor(platform: MusicPlatform, query: { url?: string, id?: string }) {
        let {url, id} = query;
        if (typeof id !== "string") {
            if (typeof url !== "string")
                throw new Error("Donner au moins une url du morceau ou son identifiant auprès d'une plateforme donnée directement")
            id = platform.trackIdFromUrl(new URL(url))
        }

        this.platform = platform;
        if (typeof id !== "string" || id === "") {
            throw new Error("morceau inconnu")
        }
        this.id = id;
    }

    async toJSON(): Promise<JSONTrack> {
        return await this.platform.getJsonTrack(this.id)
    }
}