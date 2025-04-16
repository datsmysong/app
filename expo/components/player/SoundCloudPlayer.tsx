import { PlayingJSONTrack } from "commons/backend-types";
import { Response } from "commons/socket.io-types";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Platform, StyleSheet } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

import { LocalPlayerRemote } from "../../lib/audioRemote";
import getSoundCloudWidgetHtml from "../../lib/soundcloud-widget-html";

const SoundCloudPlayer = forwardRef<
  LocalPlayerRemote,
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
      return { data: [], error: null };
    },
    next,
    previous,
  }));

  async function playTrack(url: string): Promise<Response<void>> {
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

    return { error: null, data: undefined };
  }

  async function play(): Promise<Response<void>> {
    const command = {
      command: "play",
    };
    sendMessage(command);

    return { error: null, data: undefined };
  }

  async function pause(): Promise<Response<void>> {
    const command = {
      command: "pause",
    };
    sendMessage(command);

    return { error: null, data: undefined };
  }

  async function setVolume(volume: number): Promise<Response<void>> {
    const command = {
      command: "setVolume",
      data: {
        volume,
      },
    };
    sendMessage(command);

    return { error: null, data: undefined };
  }

  async function seekTo(position: number): Promise<Response<void>> {
    const command = {
      command: "seekTo",
      data: {
        position,
      },
    };
    sendMessage(command);

    return { error: null, data: undefined };
  }

  const [resolveCurrentState, setResolveCurrentState] =
    useState<(data: Response<any>) => void>();

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    const { data } = JSON.parse(event.nativeEvent.data);
    if (data.command === "currentMusic") {
      const state = data.data as Response<PlayingJSONTrack | null>;
      if (resolveCurrentStateRef.current) {
        resolveCurrentStateRef.current(state);
        setResolveCurrentState(undefined);
      }
    }
  };

  const resolveCurrentStateRef = useRef<(data: Response<any>) => void>();

  useEffect(() => {
    resolveCurrentStateRef.current = resolveCurrentState;
  }, [resolveCurrentState]);

  const handleIframeMessage = (event: Event) => {
    //if (!(event instanceof MessageEvent)) return;

    const { data } = event as MessageEvent;

    if (data.command === "currentMusic") {
      const state = data.data as Response<PlayingJSONTrack | null>;
      if (resolveCurrentStateRef.current) {
        resolveCurrentStateRef.current(state);
        setResolveCurrentState(undefined);
      }
    }
  };

  async function getPlaybackState(): Promise<
    Response<PlayingJSONTrack | null>
  > {
    return new Promise<Response<PlayingJSONTrack | null>>((resolve) => {
      setResolveCurrentState(() => resolve);
      const command = {
        command: "fetchCurrent",
      };
      sendMessage(command);
    });
  }

  async function next(): Promise<Response<void>> {
    return { error: null, data: undefined };
  }

  async function previous(): Promise<Response<void>> {
    return { error: null, data: undefined };
  }

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
