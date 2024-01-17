import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Platform, StyleSheet } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { PlaybackState, StreamingPlatformRemote } from "../lib/types";
import useSoundCloudWidgetHtml from "../lib/useSoundCloudWidgetHtml";

type SoundCloudPlayerProps = {};
export interface SoundCloudPlayerRemote extends StreamingPlatformRemote {
  fetchCurrent: () => Promise<PlaybackState>;
}

export function isSoundCloudPlayerRemote(
  remote: any
): remote is SoundCloudPlayerRemote {
  return remote?.fetchCurrent !== undefined;
}

const SoundCloudPlayer = forwardRef<
  SoundCloudPlayerRemote,
  SoundCloudPlayerProps
>((props, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const contentWindow = iframeRef.current.contentWindow as Window;
      contentWindow.addEventListener("message", handleIframeMessage);
    }
    return () => {
      if (iframeRef.current) {
        const contentWindow = iframeRef.current.contentWindow as Window;
        contentWindow.removeEventListener("message", handleIframeMessage);
      }
    };
  }, [iframeRef.current]);

  useImperativeHandle(ref, () => ({
    playMusic,
    play,
    pause,
    setVolume,
    seekTo,
    fetchCurrent,
    next,
    prev,
  }));

  const playMusic = async (url: string) => {
    if (Platform.OS !== "web") {
      webViewRef.current?.postMessage("{command: 'playMusic'}");
    } else {
      iframeRef.current?.contentWindow?.postMessage(
        {
          command: "playMusic",
          data: {
            options: {
              auto_play: true,
              show_artwork: false,
            },
            url,
          },
        },
        "*"
      );
    }
  };

  const play = async () => {
    if (Platform.OS !== "web") {
      webViewRef.current?.postMessage("{command: 'play'}");
    } else {
      iframeRef.current?.contentWindow?.postMessage(
        {
          command: "play",
        },
        "*"
      );
    }
  };

  const pause = async () => {
    if (Platform.OS !== "web") {
      webViewRef.current?.postMessage("{command: 'pause'}");
    } else {
      iframeRef.current?.contentWindow?.postMessage(
        {
          command: "pause",
        },
        "*"
      );
    }
  };

  const setVolume = async (volume: number) => {
    if (Platform.OS !== "web") {
      webViewRef.current?.postMessage(
        `{command: 'setVolume', data: {volume: ${volume}}}`
      );
    } else {
      iframeRef.current?.contentWindow?.postMessage(
        {
          command: "setVolume",
          data: {
            volume,
          },
        },
        "*"
      );
    }
  };

  const seekTo = async (position: number) => {
    if (Platform.OS !== "web") {
      webViewRef.current?.postMessage(
        `{command: 'seekTo', data: {position: ${position}}}`
      );
    } else {
      iframeRef.current?.contentWindow?.postMessage(
        {
          command: "seekTo",
          data: {
            position,
          },
        },
        "*"
      );
    }
  };

  const [resolveCurrentState, setResolveCurrentState] = useState<null | (() => void)>(null);

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    const { data } = JSON.parse(event.nativeEvent.data);
    if (data.command === "currentMusic") {
      if (resolveCurrentState) {
        resolveCurrentState();
        setResolveCurrentState(null);
      }
    }
  };

  const resolveCurrentStateRef = useRef<null | ((data: any) => void)>(null);

  useEffect(() => {
    resolveCurrentStateRef.current = resolveCurrentState;
  }, [resolveCurrentState]);
  
  const handleIframeMessage = (event: Event) => {
    //if (!(event instanceof MessageEvent)) return;

    const { data } = event as MessageEvent;

    if (data.command === "currentMusic") {
      if (resolveCurrentStateRef.current) {
        resolveCurrentStateRef.current(data.data);
        setResolveCurrentState(null);
      }
    }
  };

  const fetchCurrent = (): Promise<PlaybackState> => {
    return new Promise((resolve) => {
      setResolveCurrentState(() => resolve);
      if (Platform.OS !== "web") {
        webViewRef.current?.postMessage(`{ command: 'fetchCurrent' }`);
      } else {
        iframeRef.current?.contentWindow?.postMessage(
          { command: "fetchCurrent" },
          "*"
        );
      }
    });
  };
  const next = async () => {};

  const prev = async () => {};

  const html = useSoundCloudWidgetHtml();

  return Platform.OS == "web" ? (
    <iframe ref={iframeRef} srcDoc={html} style={styles.hidden}></iframe>
  ) : (
    <WebView
      javaScriptEnabled={true}
      domStorageEnabled={true}
      ref={webViewRef}
      source={{ html }}
      style={styles.hidden}
      onMessage={handleWebViewMessage}
    />
  );
});

export default SoundCloudPlayer;

const styles = StyleSheet.create({
  hidden: {
    display: "none",
    width: 320,
    height: 200,
  },
});
