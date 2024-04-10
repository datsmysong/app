export default function getSoundCloudWidgetHtml() {
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

              let [title, artistsName, albumName] = [
                currentSound.publisher_metadata.release_title,
                currentSound.publisher_metadata.artist,
                currentSound.publisher_metadata.album_title
              ];
              if (currentSound.publisher_metadata.release_title === undefined){
                title = currentSound.title.split(" - ")[1];
                artistsName = currentSound.title.split(" - ")[0];
                albumName = currentSound.title;
              }
      
              const artworkUrl = currentSound.artwork_url ?? "https://unsplash.it/128/128";

              const playingMusic = {
                url: currentSound.permalink_url,
                title,
                duration: currentSound.duration,
                artistsName,
                albumName,
                imgUrl: artworkUrl.replace("large", "t500x500"),
                currentTime: position,
                isPlaying: isCurrentlyPlaying,
              };

              resolve(playingMusic);
            });
          });

          const response = {
            data: playingMusic,
            error: null,
          }

          window.postMessage(
            {
              command: "currentMusic",
              data: response,
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
