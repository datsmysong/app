import FontAwesome from "@expo/vector-icons/FontAwesome";
import { JSONTrack } from "commons/Backend-types";
import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";

import HView from "../HView";
import { Text, View } from "../Themed";

export default function TrackItem(prop: { track: JSONTrack; index: number }) {
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
}

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
