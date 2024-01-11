import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Image } from "expo-image";
import { Text, View } from "./Tamed";
import { Button } from "react-native";
import { PlayingMusic, StreamingPlatformRemote } from "../lib/types";
import { SoundCloud } from "../utils/soundcloud";
import SoundCloudPlayer from "./SoundCloudPlayer";

type PlayerProps = {
  music: PlayingMusic | null;
  api: StreamingPlatformRemote;
};

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const Player = forwardRef<StreamingPlatformRemote, PlayerProps>(({ music, api }, ref) => {
  const soundCloudRef: React.RefObject<StreamingPlatformRemote> = useRef(null);

  useImperativeHandle(ref, () => ({
    ...api,
  }));

  useEffect(() => {
    if (soundCloudRef.current) {
      soundCloudRef.current.play();
    }
  }, [soundCloudRef.current]);

  const [isSoundCloudReady, setIsSoundCloudReady] = useState(false);
  const [progress, setProgress] = useState(music?.progress_ms ?? 0);
  const [isPlaying, setIsPlaying] = useState(music?.is_playing ?? false);

  // Synchronize progress and isPlaying with the music prop
  useEffect(() => {
    setProgress(music?.progress_ms ?? 0);
    setIsPlaying(music?.is_playing ?? false);
  }, [music]);

  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    isPlaying ? api.pause() : api.play();
    setIsPlaying(!isPlaying);
  };

  const handlePreviousTrack = () => {
    api.prev();
  };

  const handleNextTrack = () => {
    api.next();
  };

  return (
    <View className="flex items-center space-x-4">
      {api instanceof SoundCloud && (
        <SoundCloudPlayer
          ref={soundCloudRef}
          onReady={() => setIsSoundCloudReady(true)}
        />
      )}
      {music && (
        <>
          <Image
            source={music.artwork}
            placeholder={blurhash}
            alt={music.title}
            className="w-32 h-32"
          />
          <View>
            <Text className="text-lg font-semibold">{music.title}</Text>
            <View className="flex items-center">
              {music.artists.map((artist, index) => (
                <React.Fragment key={artist.id}>
                  <Text>{artist.name}</Text>
                  {index !== music.artists.length - 1 && <Text>,</Text>}
                </React.Fragment>
              ))}
            </View>
            <View className="flex items-center space-x-2">
              <Text>{formatDuration(progress)}</Text>
              <View className="flex-grow h-2 bg-gray-200 rounded-full">
                <View
                  className="h-full bg-black rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(progress / music.duration_ms) * 100}%` }}
                ></View>
              </View>
              <Text>{formatDuration(music.duration_ms)}</Text>
            </View>
            <View className="flex items-center space-x-2">
              <Button onPress={handlePreviousTrack} title="Previous" />
              <Button
                onPress={handlePlayPause}
                title={isPlaying ? "Pause" : "Play"}
              />
              <Button onPress={handleNextTrack} title="Next" />
            </View>
          </View>
        </>
      )}
      {!music && <Text>Nothing is playing, start a song</Text>}
    </View>
  );
});

export default Player;
