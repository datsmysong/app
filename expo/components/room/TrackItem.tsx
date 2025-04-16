import FontAwesome from "@expo/vector-icons/FontAwesome";
import { JSONTrack } from "commons/backend-types";
import { Image } from "expo-image";
import { X } from "phosphor-react-native";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import MinimalistTrackItem from "./MinimalistTrackItem";
import SocketIo from "../../lib/socketio";
import CustomMenuOption from "../CustomMenuOption";
import Avatar from "../profile/Avatar";

export default function TrackItem(prop: {
  track: JSONTrack;
  index: number;
  roomId: string;
  isMenuDisabled: boolean;
  handleDislike: () => void;
  disliked: boolean;
  addedBy: string;
}) {
  const {
    title,
    artistsName: artists,
    albumName: album,
    imgUrl: rawImageUrl,
  } = prop.track;
  const [dislike, setDislike] = useState(prop.disliked);

  const removeTrack = () => {
    SocketIo.getInstance()
      .getSocket(`/room/${prop.roomId}`)
      .emit("queue:remove", prop.index);
  };

  const handleDislike = () => {
    if (!prop.handleDislike) return;
    const disliked = !dislike;
    setDislike(disliked);
    prop.handleDislike();
  };

  return (
    <MinimalistTrackItem
      title={prop.index + 1 + ". " + title}
      artistsName={artists}
      imgUrl={rawImageUrl}
      profilePictureImage={
        prop.addedBy ? (
          <Avatar id={prop.addedBy} style={itemStyles.profileImage} />
        ) : (
          <Image
            source={require("../../assets/images/album-cover.jpg")}
            style={itemStyles.profileImage}
          />
        )
      }
    >
      <Pressable onPress={handleDislike}>
        <FontAwesome
          name={`thumbs-${!dislike ? "o-" : ""}down`}
          style={itemStyles.icon}
        />
      </Pressable>
      {!prop.isMenuDisabled && (
        <>
          <Menu>
            <MenuTrigger>
              <FontAwesome name="ellipsis-v" style={itemStyles.icon} />
            </MenuTrigger>
            <MenuOptions customStyles={optionsStyles}>
              <CustomMenuOption
                onSelect={removeTrack}
                icon={<X size={28} color="red" />}
                textStyle={optionsStyles.optionText}
              >
                Supprimer
              </CustomMenuOption>
            </MenuOptions>
          </Menu>
        </>
      )}
    </MinimalistTrackItem>
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

const optionsStyles = StyleSheet.create({
  optionsContainer: {
    width: 241,
    display: "flex",
    alignItems: "stretch",
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#D2D2D2",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  optionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 0,
  },
  optionText: {
    color: "red",
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
});
