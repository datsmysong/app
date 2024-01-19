export default function useSoundCloudWidgetHtml() {
  return `
  <html>
  <head>
    <script src="https://w.soundcloud.com/player/api.js"></script>
    <script>
      const isPlaying = async () => {
        const widget = SC.Widget(document.querySelector('iframe'));
        return await new Promise((resolve, reject) => {
          widget.isPaused((isPaused) => {
            resolve(!isPaused);
          });
        });
      }
    
      // Fetch the current position in the music
      async function getPosition() {
        const widget = SC.Widget(document.querySelector('iframe'));
        return await new Promise((resolve, reject) => {
          widget.getPosition((position) => {
            resolve(position);
          });
        });
      }
      window.onmessage = async function(event) {
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
        } else if (eventName === "fetchCurrent") {
          const isCurrentlyPlaying = await isPlaying();
          const position = await getPosition();
          const widget = SC.Widget(document.querySelector('iframe'));
          
          const playingMusic = await new Promise((resolve, reject) => {
            widget.getCurrentSound((currentSound) => {
              if (!currentSound) return resolve(null);
      
              const playingMusic = {
                currentMusic: {
                  title: currentSound.publisher_metadata.release_title,
                  artwork: currentSound.artwork_url.replace("large", "t500x500"),
                  artists: currentSound.publisher_metadata.artist,
                  durationMs: currentSound.duration,
                },
                progressMs: position,
                isPlaying: isCurrentlyPlaying,
                volume: 100,
              };
      
              resolve(playingMusic);
            });
          });

          window.postMessage(
            {
              command: "currentMusic",
              data: {
                playingMusic,
              },
            },
            "*"
          );
        }
      }
    </script>
  </head>
  <body>
    <iframe src="https://w.soundcloud.com/player/?url=https://api.soundcloud.com/" scrolling="no" allow="autoplay"></iframe>
  </body>
  </html>
`;
}
