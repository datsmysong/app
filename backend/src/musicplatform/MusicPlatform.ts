export interface JSONTrack {
    url: URL,
    title: string,
    duration: Date,
    artist_name: string,
    album_name: string,
    imgUrl: URL
}

export default abstract class MusicPlatform {
    private readonly url_pattern: RegExp
    // private static singleton: any;
    private static readonly musicPlatformsList = new Map<string,MusicPlatform>();

    protected constructor(url_pattern: RegExp) {
        this.url_pattern = new RegExp(url_pattern, "i");
        // let checkRegex = /^\/(?:[^(]|[^\\]\\\(|[^\\]\(\?)*\([^?](?:[^(]|[^\\]\\\(|[^\\]\(\?)*\)(?:[^(]|[^\\]\\\(|[^\\]\(\?)*\/.*$/
        let resultRegex = new RegExp(this.url_pattern.toString()+"|").exec("")?.slice(1).length
        if (resultRegex !== 1) {
            throw new Error("il y a plusieurs groupe de capture\n" +
                "seul un groupe doit se trouver dans le pattern, et doit retourner l'identifiant unique de l'élément");
        }

        MusicPlatform.musicPlatformsList.set(MusicPlatform.constructor.name, this)
    }

    static getMusicPlatform(key: string): MusicPlatform | undefined {
        return this.musicPlatformsList.get(key);
    }

    track_id_from_url(url: URL): string|undefined {
        return this.getUrlPattern().exec(url.href)?.slice(1)[0];
    }

    getUrlPattern(): RegExp {
        return new RegExp(this.url_pattern);
    }

    abstract getJsonTrack(id: string): Promise<JSONTrack>;
}