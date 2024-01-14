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

const SoundCloudPlayer = forwardRef<
  StreamingPlatformRemote,
  SoundCloudPlayerProps
>((props, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (iframeRef.current) {
      window.addEventListener("message", handleIframeMessage);
      iframeRef.current.addEventListener("message", handleIframeMessage);
    }
    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener("message", handleIframeMessage);
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
    fetchQueue,
    next,
    prev,
  }));

  const playMusic = async (url: string) => {
    console.log("playMusic");

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

  const [resolveCurrentState, setResolveCurrentState] = useState<
    (() => void) | null
  >(null);

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    const { data } = JSON.parse(event.nativeEvent.data);
    if (data.command === "currentMusic") {
      if (resolveCurrentState) {
        resolveCurrentState();
        setResolveCurrentState(null);
      }
    }
  };

  const handleIframeMessage = (event: Event) => {
    if (!(event instanceof MessageEvent)) return;

    const { data } = event;

    if (data.command === "currentMusic") {
      if (resolveCurrentState) {
        resolveCurrentState();
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

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCurrent().then((currentState) => {
        const queue = fetchQueue();
        const stateAndQueue = {
          currentState,
          queue,
        };
        // Send stateAndQueue through socket.io websocket
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchQueue = async () => {
    return [];
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
