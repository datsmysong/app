// Declare a global interface for the Window object (since SoundCloud Widget SDK is loaded in the window object)
declare global {
  interface Window {
    SC: any;
  }
}

const IFRAME_ID = "soundcloud-iframe";
const IFRAME_SRC =
  "https://w.soundcloud.com/player/?url=https://api.soundcloud.com/";

// SoundCloud class implements the StreamingPlatform interface
export class SoundCloud implements StreamingPlatform {
  name: string = "SoundCloud";
  imgUrl: string = "https://via.placeholder.com/256";
  sdk: any;

  constructor() {
    // Create an iframe element
    const iframe = document.createElement("iframe");
    iframe.setAttribute("width", "200px");
    iframe.setAttribute("height", "200px");
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("frameborder", "no");
    iframe.setAttribute("allow", "autoplay");
    iframe.setAttribute("src", IFRAME_SRC);
    iframe.setAttribute("id", IFRAME_ID);
    iframe.style.display = "none";

    // Remove the existing iframe if it exists
    const currentIframe = document.getElementById(IFRAME_ID);
    if (currentIframe) {
      currentIframe.remove();
      console.info("[SoundCloud] Removed existing widget");
    }

    // Append the new iframe to the body
    console.info("[SoundCloud] Integrating widget");
    document.body.appendChild(iframe);

    // Initialize the SoundCloud Widget SDK
    this.sdk = window.SC.Widget(iframe);
    console.info("[SoundCloud] Initialized Widget SDK");
  }

  // Play music using the provided music URI
  async playMusic(musicUri: string): Promise<void> {
    console.debug("[SoundCloud] Playing music", musicUri);

    try {
      this.sdk.load(musicUri, {
        show_artwork: false,
        auto_play: true,
      });
    } catch (error) {
      console.error("[SoundCloud] Error playing music", error);
    }
  }

  // Fetch the current queue
  async fetchQueue(): Promise<OrderedMusic[]> {
    console.debug("[SoundCloud] Fetching queue");
    return [];
  }

  // Checks if the music is currently playing
  private async isPlaying(): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      this.sdk.isPaused((isPaused: boolean) => {
        resolve(!isPaused);
      });
    });
  }

  // Fetch the current position in the music
  private async getPosition(): Promise<number> {
    return await new Promise((resolve, reject) => {
      this.sdk.getPosition((position: number) => {
        resolve(position);
      });
    });
  }

  // Fetch the currently playing music
  async fetchCurrent(): Promise<PlayingMusic | null> {
    console.debug("[SoundCloud] Fetching current music");
    const isPlaying = await this.isPlaying();
    const position = await this.getPosition();

    return await new Promise((resolve, reject) => {
      this.sdk.getCurrentSound((currentSound: any) => {
        console.debug("[SoundCloud] Current sound", currentSound);
        if (!currentSound) return resolve(null);

        const playingMusic = {
          title: currentSound.title.split(" - ")[1],
          artwork: currentSound.artwork_url.replace("large", "t500x500"),
          artists: currentSound.title
            .split(" - ")[0]
            .split(", ")
            .map((name: string) => ({
              name,
              id: name,
            })),
          duration_ms: currentSound.duration,
          progress_ms: position,
          is_playing: isPlaying,
        };
        console.debug("[SoundCloud] Parsed current music", playingMusic);

        resolve(playingMusic);
      });
    });
  }

  // Pause the music
  pause(): Promise<void> {
    console.debug("[SoundCloud] Pausing");

    return new Promise((resolve, reject) => {
      this.sdk.pause(resolve);
    });
  }

  // Resume the music
  play(): Promise<void> {
    console.debug("[SoundCloud] Playing");

    return new Promise((resolve, reject) => {
      this.sdk.play(resolve);
    });
  }

  // Skip to the next music
  async next(): Promise<void> {
    console.debug("[SoundCloud] Next");
    // do nothing
  }

  // Skip to the previous music
  async prev(): Promise<void> {
    console.debug("[SoundCloud] Prev");
    // do nothing
  }

  // Set the volume
  async setVolume(volume: number): Promise<void> {
    console.debug("[SoundCloud] Setting volume", volume);
    this.sdk.setVolume(volume);
  }

  // Seek to a position in the music
  async seek(position: number): Promise<void> {
    console.debug("[SoundCloud] Seeking to", position);
    this.sdk.seekTo(position);
  }
}
