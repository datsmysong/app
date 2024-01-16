export interface JSONTrack {
  url: string,
  title: string,
  duration: number,
  artistName: string,
  albumName: string,
  imgUrl: string
}

export default abstract class MusicPlatform {
  // private static singleton: any;
  private static readonly musicPlatformsList = new Map<string, MusicPlatform>();
  private readonly urlPattern: RegExp

  protected constructor(urlPattern: RegExp) {
    this.urlPattern = new RegExp(urlPattern, "i");
    // let checkRegex = /^\/(?:[^(]|[^\\]\\\(|[^\\]\(\?)*\([^?](?:[^(]|[^\\]\\\(|[^\\]\(\?)*\)(?:[^(]|[^\\]\\\(|[^\\]\(\?)*\/.*$/
    let resultRegex = new RegExp(this.urlPattern.toString() + "|").exec("")?.slice(1).length
    if (resultRegex !== 1) {
      throw new Error("il y a plusieurs groupe de capture\n" +
        "seul un groupe doit se trouver dans le pattern, et doit retourner l'identifiant unique de l'élément");
    }

    MusicPlatform.musicPlatformsList.set(MusicPlatform.constructor.name, this)
  }

  static getMusicPlatform(key: string): MusicPlatform | undefined {
    return this.musicPlatformsList.get(key);
  }

  trackIdFromUrl(url: URL): string | undefined {
    return this.getUrlPattern().exec(url.href)?.slice(1)[0];
  }

  getUrlPattern(): RegExp {
    return new RegExp(this.urlPattern);
  }

  getClass(): Function {
    return this.constructor
  }

  abstract getJsonTrack(id: string): Promise<JSONTrack>;
}