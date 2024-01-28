import FontAwesome from "@expo/vector-icons/FontAwesome";
import { JSONTrack } from "commons/Backend-types";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

import HView from "../HView";
import { Text, View } from "../Themed";

export default function TrackItem(prop: { track: JSONTrack; index: number }) {
  const {
    title,
    artistsName: artists,
    albumName: album,
    imgUrl: rawImageUrl,
  } = prop.track;
  const [dislike, setDislike] = useState(false);

  const imageSrc = new URL(rawImageUrl).toString();
  // mock image
  const imageProfileSrc = new URL(
    "https://s3-alpha-sig.figma.com/img/942f/8c54/9dd5171d2934478c6b2e1f64eea7d81b?Expires=1706486400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=QQWwtvI8wCX3aN6TZggpc-IcOeYA21PftgQkCXnuVhcMue0uffDuBhvHDIu9SSuWJYc9AGBj8L7RpwV6Yv1X7fD1A0rdOYwTpbZuP1FbYHWxFjD9uyYEo8CpOXJQEzOndM~jtj9pNysYNWzhfJ5LnX5grgKEoU1AnXR5SFu0AAfCiB4PrFYLpOlhKwMQsv7uPQA5ftH9YNYq4yzgVsSbZX69jHCTYhTO0XOwEtu6DKNOhTMzl9naajFenIAHChgKxqlDrF-UvXsVwh7dwq4-jYPlFxV8-6QB-o0ffog60CHpBsfLnYs-KgaAqeTleydiBKjtYOk1zKBp9uHAOcjOAg__"
  ).toString();

  return (
    <HView style={itemStyles.container}>
      <View style={[itemStyles.imagesContainer]}>
        <Image source={imageSrc} style={itemStyles.mainImage} />
        <Image source={imageProfileSrc} style={itemStyles.profileImage} />
      </View>
      <View style={[itemStyles.textContainer]}>
        <HView>
          <Text style={[itemStyles.text, itemStyles.textTop]}>
            {prop.index}
          </Text>
          <Text style={[itemStyles.text, itemStyles.textTop, { width: 10 }]}>
            .
          </Text>
          <Text style={[itemStyles.text, itemStyles.textTop]}>{title}</Text>
        </HView>
        <Text style={[itemStyles.text, itemStyles.textBottom]}>{artists}</Text>
      </View>
      <View>
        <Pressable onPress={() => setDislike(!dislike)}>
          <FontAwesome
            name={`thumbs-${!dislike ? "o-" : ""}down`}
            style={itemStyles.icon}
          />
        </Pressable>
      </View>
      <View>
        <Pressable>
          <FontAwesome name="ellipsis-v" style={itemStyles.icon} />
        </Pressable>
      </View>
    </HView>
  );
}

const itemStyles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingVertical: 9,
    paddingHorizontal: 10,
    gap: 10,
    alignItems: "center",
  },
  imagesContainer: {
    width: 46,
    height: 46,
  },
  mainImage: {
    width: 46,
    height: 46,
    borderRadius: 6,
  },
  profileImage: {
    width: 22,
    height: 22,
    borderRadius: 22,
    position: "absolute",
    right: -8,
    bottom: -8,
  },
  textContainer: {
    paddingHorizontal: 12,
    flexGrow: 1,
    flexShrink: 1,
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
  icon: {
    width: 24,
    height: 24,
    fontSize: 24,
    textAlign: "center",
  },
});
