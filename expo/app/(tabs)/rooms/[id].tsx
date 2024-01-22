import { ActiveRoom } from "commons/database-types-utils";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import Alert from "../../../components/Alert";
import Button from "../../../components/Button";
import { supabase } from "../../../lib/supabase";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { JSONTrack } from "commons/Backend-types";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import SocketIo from "../../../lib/socketio";

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
  const { style, ...others } = props;
  return <View style={[style, { flexDirection: "row" }]} {...others} />;
};

const generatedInvitationLink = (currentUrl: string, roomCode: string) => {
  const production = process.env.NODE_ENV === "production";
  if (production) {
    return `https://datsmysong.app/join/${roomCode}`;
  } else {
    const mobile = Platform.OS === "ios" || Platform.OS === "android";
    if (mobile) {
      const baseUrl = "http://" + currentUrl.split("/").slice(2, 3).join("/");
      return `${baseUrl}/join/${roomCode}`;
    } else {
      const host = currentUrl.split("/").slice(0, 3).join("/");
      return `${host}/join/${roomCode}`;
    }
  }
};

const TrackItem = (prop: { track: JSONTrack; index: number }) => {
  const {
    title,
    artistName: artist,
    albumName: album,
    imgUrl: rawImageUrl,
  } = prop.track;
  const imageSrc = new URL(rawImageUrl).toString();
  // mock image
  const imageProfileSrc = new URL(
    "https://s3-alpha-sig.figma.com/img/942f/8c54/9dd5171d2934478c6b2e1f64eea7d81b?Expires=1706486400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QQWwtvI8wCX3aN6TZggpc-IcOeYA21PftgQkCXnuVhcMue0uffDuBhvHDIu9SSuWJYc9AGBj8L7RpwV6Yv1X7fD1A0rdOYwTpbZuP1FbYHWxFjD9uyYEo8CpOXJQEzOndM~jtj9pNysYNWzhfJ5LnX5grgKEoU1AnXR5SFu0AAfCiB4PrFYLpOlhKwMQsv7uPQA5ftH9YNYq4yzgVsSbZX69jHCTYhTO0XOwEtu6DKNOhTMzl9naajFenIAHChgKxqlDrF-UvXsVwh7dwq4-jYPlFxV8-6QB-o0ffog60CHpBsfLnYs-KgaAqeTleydiBKjtYOk1zKBp9uHAOcjOAg__"
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
  const { id } = useLocalSearchParams() as MusicRoomParams;
  const currentPageLink = Linking.useURL();

  const [room, setRoom] = useState<ActiveRoom>();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();
      if (error) {
        Alert.alert(
          "Une erreur est survenue lors de la récupération de la salle"
        );
        return;
      }
      setRoom(data);
    };

    fetchData();
  }, []);

  const handleShare = async () => {
    if (!currentPageLink) {
      Alert.alert("Aucun lien n'a été retourné");
      return;
    }

    const roomCode = room?.code ?? "";
    const invitationLink = generatedInvitationLink(currentPageLink, roomCode);

    await Clipboard.setStringAsync(invitationLink);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const url: URL = new URL("/room/" + activeRoomId, ENDPOINT);

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
    <View style={headerStyles.headerContainer}>
      {room && (
        <View>
          <Text style={headerStyles.title}>Salle "{room.name}"</Text>
          <View style={headerStyles.buttonContainer}>
            {isCopied ? (
              <Button block prependIcon="check" onPress={handleShare}>
                Lien copié
              </Button>
            ) : (
              <Button block onPress={handleShare}>
                Partager
              </Button>
            )}
          </View>
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
        </View>
      )}
    </View>
  );
}

const headerStyles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 14,
    gap: 10,
  },
  buttonContainer: {
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
});

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
    fontFamily: "Outfit-Bold",
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
    fontFamily: "Outfit-Regular",
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
