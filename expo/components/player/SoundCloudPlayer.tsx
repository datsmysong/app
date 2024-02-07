import { PlayingJSONTrack } from "commons/backend-types";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Platform, StyleSheet } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

import { AudioRemote } from "../../lib/audioRemote";
import getSoundCloudWidgetHtml from "../../lib/soundcloud-widget-html";

const SoundCloudPlayer = forwardRef<
  AudioRemote,
  React.ComponentProps<typeof WebView>
>((props, ref) => {
  const sendMessage = (message: object) => {
    if (Platform.OS !== "web") {
      webViewRef.current?.postMessage(JSON.stringify(message));
    } else {
      iframeRef.current?.contentWindow?.postMessage(message, "*");
    }
  };

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
    playTrack,
    play,
    pause,
    setVolume,
    seekTo,
    getPlaybackState,
    getQueue: async () => {
      return [];
    },
    next,
    previous,
  }));

  const playTrack = async (url: string) => {
    const command = {
      command: "playMusic",
      data: {
        options: {
          auto_play: true,
          show_artwork: false,
        },
        url,
      },
    };
    sendMessage(command);

    return {};
  };

  const play = async () => {
    const command = {
      command: "play",
    };
    sendMessage(command);
  };

  const pause = async () => {
    const command = {
      command: "pause",
    };
    sendMessage(command);
  };

  const setVolume = async (volume: number) => {
    const command = {
      command: "setVolume",
      data: {
        volume,
      },
    };
    sendMessage(command);
  };

  const seekTo = async (position: number) => {
    const command = {
      command: "seekTo",
      data: {
        position,
      },
    };
    sendMessage(command);
  };

  const [resolveCurrentState, setResolveCurrentState] = useState<() => void>();

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    const { data } = JSON.parse(event.nativeEvent.data);
    if (data.command === "currentMusic") {
      if (resolveCurrentState) {
        resolveCurrentState();
        setResolveCurrentState(undefined);
      }
    }
  };

  const resolveCurrentStateRef = useRef<(data: any) => void>();

  useEffect(() => {
    resolveCurrentStateRef.current = resolveCurrentState;
  }, [resolveCurrentState]);

  const handleIframeMessage = (event: Event) => {
    //if (!(event instanceof MessageEvent)) return;

    const { data } = event as MessageEvent;

    if (data.command === "currentMusic") {
      if (resolveCurrentStateRef.current) {
        resolveCurrentStateRef.current(data.data);
        setResolveCurrentState(undefined);
      }
    }
  };

  const getPlaybackState = (): Promise<PlayingJSONTrack> => {
    return new Promise((resolve) => {
      setResolveCurrentState(() => resolve);
      const command = {
        command: "fetchCurrent",
      };
      sendMessage(command);
    });
  };
  const next = async () => {};

  const previous = async () => {};

  const html = getSoundCloudWidgetHtml();

  return Platform.OS === "web" ? (
    <iframe ref={iframeRef} srcDoc={html} style={styles.hidden} />
  ) : (
    <WebView
      javaScriptEnabled
      domStorageEnabled
      ref={webViewRef}
      originWhitelist={["*"]}
      source={{ html }}
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
