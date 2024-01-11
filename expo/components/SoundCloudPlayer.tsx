import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Platform, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { StreamingPlatformRemote } from "../lib/types";

type SoundCloudPlayerProps = {
  onReady: () => void;
};

const SoundCloudPlayer = forwardRef<StreamingPlatformRemote, SoundCloudPlayerProps>(
  ({ onReady }: SoundCloudPlayerProps, ref) => {
    useImperativeHandle(ref, () => ({
      playMusic,
      play,
      pause,
      setVolume,
      seekTo,
      fetchCurrent,
      fetchQueue,
      next,
      prev
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

    const fetchCurrent = async () => {
      return null;
    }

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const webViewRef = useRef<WebView>(null);

    useEffect(() => {
      if (Platform.OS !== "web") {
        // TODO
      } else {
        iframeRef.current?.addEventListener("load", () => {
          onReady();
        });
      }
    }, []);

    const html = `
    <html>
    <head>
      <script src="https://w.soundcloud.com/player/api.js"></script>
      <script>
        window.onmessage = function(event) {
          const eventName = event.data.command;
          if (eventName === 'playMusic') {
            const widget = SC.Widget(document.querySelector('iframe'));
            const { options, url } = event.data.data;
            widget.load(
              url,
              options,
            );
          } else if (eventName === 'play') {
            const widget = SC.Widget(document.querySelector('iframe'));
            widget.play();
          } else if (eventName === 'pause') {
            const widget = SC.Widget(document.querySelector('iframe'));
            widget.pause();
          } else if (eventName === 'setVolume') {
            const { volume } = event.data.data;
            const widget = SC.Widget(document.querySelector('iframe'));
            widget.setVolume(volume);
          } else if (eventName === 'seekTo') {
            const { position } = event.data.data;
            const widget = SC.Widget(document.querySelector('iframe'));
            widget.seekTo(position);
          }
        };
      </script>
    </head>
    <body>
      <iframe src="https://w.soundcloud.com/player/?url=https://api.soundcloud.com/" scrolling="no" allow="autoplay"></iframe>
    </body>
    </html>
  `;

    return Platform.OS == "web" ? (
      <iframe ref={iframeRef} srcDoc={html} style={styles.hidden}></iframe>
    ) : (
      <WebView
        javaScriptEnabled={true}
        domStorageEnabled={true}
        ref={webViewRef}
        source={{ html }}
        style={styles.hidden}
      />
    );
  }
);

export default SoundCloudPlayer;

const styles = StyleSheet.create({
  hidden: {
    display: "flex",
    width: 320,
    height: 200,
  },
});
