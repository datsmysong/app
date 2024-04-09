import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import HView from "../HView";
import { Text, View } from "../Themed";

export default function MinimalistTrackItem({
  title,
  artistsName,
  imgUrl,
  profilePictureImage,
  children,
}: {
  title: string;
  artistsName: string;
  imgUrl: string;
  children?: React.ReactNode;
  profilePictureImage?: React.ReactNode;
}) {
  if (!imgUrl) imgUrl = require("../../assets/images/album-cover.jpg");

  return (
    <HView style={itemStyles.container}>
      <View style={[itemStyles.imagesContainer]}>
        <Image source={imgUrl} style={itemStyles.mainImage} />
        {profilePictureImage}
      </View>
      <View style={[itemStyles.textContainer]}>
        <HView>
          <Text style={[itemStyles.text, itemStyles.textTop]}>{title}</Text>
        </HView>
        <Text style={[itemStyles.text, itemStyles.textBottom]}>
          {artistsName}
        </Text>
      </View>
      {children}
    </HView>
  );
}

const itemStyles = StyleSheet.create({
  container: {
    marginVertical: 12,
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
