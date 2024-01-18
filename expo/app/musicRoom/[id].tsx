import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from "react-native";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import SocketIo from "../../lib/socketio";
import { useLocalSearchParams } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface JSONTrack {
  url: string;
  title: string;
  duration: number;
  artistName: string;
  albumName: string;
  imgUrl: string;
}

export interface MusicRoomParams {
  id: string;
}

interface ActiveRoomSkeleton {
  currentActiveRoom: string;
  tracks: JSONTrack[];
}

// https://docs.expo.dev/guides/environment-variables/
const ENDPOINT = process.env.EXPO_PUBLIC_API_ENDPOINT;

if (!ENDPOINT) {
  throw new Error("le endpoint de l'API REST n'est pas défini");
}

// Horizontal View
const HView = (props: ViewProps) => {
  let { style, ...others } = props;
  return <View style={[style, { flexDirection: "row" }]} {...others}></View>;
};

const TrackItem = (prop: { track: JSONTrack; index: number }) => {
  const {
    title,
    artistName: artist,
    albumName: album,
    imgUrl: rawImageUrl,
  } = prop.track;
  let imageSrc = new URL(rawImageUrl).toString();
  // mock image
  let imageProfileSrc = new URL(
    "https://s3-alpha-sig.figma.com/img/942f/8c54/9dd5171d2934478c6b2e1f64eea7d81b?Expires=1706486400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QQWwtvI8wCX3aN6TZggpc-IcOeYA21PftgQkCXnuVhcMue0uffDuBhvHDIu9SSuWJYc9AGBj8L7RpwV6Yv1X7fD1A0rdOYwTpbZuP1FbYHWxFjD9uyYEo8CpOXJQEzOndM~jtj9pNysYNWzhfJ5LnX5grgKEoU1AnXR5SFu0AAfCiB4PrFYLpOlhKwMQsv7uPQA5ftH9YNYq4yzgVsSbZX69jHCTYhTO0XOwEtu6DKNOhTMzl9naajFenIAHChgKxqlDrF-UvXsVwh7dwq4-jYPlFxV8-6QB-o0ffog60CHpBsfLnYs-KgaAqeTleydiBKjtYOk1zKBp9uHAOcjOAg__",
  ).toString();

  return (
    <HView style={itemStyles.container}>
      <View style={itemStyles.imagesContainer}>
        <HView style={itemStyles.mainImageContainer}>
          <Image source={imageSrc} style={itemStyles.mainImage} />
        </HView>
        <HView style={itemStyles.profileImageContainer}>
          <Image source={imageProfileSrc} style={itemStyles.profileImage} />
        </HView>
      </View>
      <HView style={itemStyles.textOuterContainer}>
        <View style={itemStyles.textInnerContainer}>
          <HView style={itemStyles.trackNameContainer}>
            <Text style={[itemStyles.text, itemStyles.textTop]}>
              {prop.index}
            </Text>
            <Text style={[itemStyles.text, itemStyles.textTop, { width: 10 }]}>
              .
            </Text>
            <Text
              style={[
                itemStyles.text,
                itemStyles.textTop,
                { flexGrow: 1, flexShrink: 0, flexBasis: 0 },
              ]}
            >
              {title}
            </Text>
          </HView>
          <Text style={[itemStyles.text, itemStyles.textBottom]}>{artist}</Text>
        </View>
      </HView>
      <HView style={itemStyles.iconContainer}>
        <Pressable>
          <FontAwesome name="thumbs-o-down" />
        </Pressable>
      </HView>
      <HView style={itemStyles.iconContainer}>
        <Pressable>
          <FontAwesome name="ellipsis-v" />
        </Pressable>
      </HView>
    </HView>
  );
};

// TODO socket io which refresh playlist on live
export default function musicRoom() {
  // TODO In future, active room if will be retrieved from user data
  const { id: activeRoomId } = useLocalSearchParams() as MusicRoomParams;

  let url: URL = new URL("/room/" + activeRoomId, ENDPOINT);

  const [data, setData] = useState<ActiveRoomSkeleton>();

  useEffect(() => {
    // fetch(url)
    //     .then(res => res.json())
    //     .then((data: ActiveRoomSkeleton) => setData(data))

    SocketIo.getInstance()
      .getSocket(url.pathname)
      .on("queue:update", (data: ActiveRoomSkeleton) => setData(data));
  }, []);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Text style={[styles.title]}>
          File d'attente ({data?.tracks.length /* ?? 0*/})
        </Text>
        <FlatList
          data={data?.tracks}
          renderItem={({ item, index }) => (
            <TrackItem track={item} index={index + 1} />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "flex-start",
    gap: 48,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    alignSelf: "stretch",
  },
  innerContainer: {
    alignItems: "flex-start",
    gap: 12,
    alignSelf: "stretch",
  },
  title: {
    color: "#000",
    fontFamily: "Outfit",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 0,
    letterSpacing: 0.48,
  },
});

const itemStyles = StyleSheet.create({
  container: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 10,
    alignSelf: "stretch",
  },
  imagesContainer: {
    width: 46,
    height: 36,
  },
  mainImage: {
    width: 46,
    height: 46,
    flexShrink: 0,
  },
  mainImageContainer: {
    width: 46,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    borderRadius: 6,
  },
  profileImage: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    alignSelf: "stretch",
    borderRadius: 22,
  },
  profileImageContainer: {
    width: 22,
    height: 22,
    alignItems: "flex-start",
    gap: 10,
    flexShrink: 0,
  },
  textOuterContainer: {
    alignItems: "center",
    gap: 14,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
  },
  textInnerContainer: {
    width: 190,
    paddingVertical: 0,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 1,
  },
  trackNameContainer: {
    alignItems: "center",
    alignSelf: "stretch",
  },
  text: {
    fontFamily: "Outfit",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  textTop: {
    color: "#000",
  },
  textBottom: {
    color: "#C3C3C3",
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
