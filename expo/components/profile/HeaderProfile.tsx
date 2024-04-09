import User from "phosphor-react-native/src/bold/User";
import { StyleSheet, View } from "react-native";

import Avatar from "./Avatar";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import { useUserFullProfile } from "../../lib/userProfile";
import Button from "../Button";
import { Text } from "../Themed";
import H1 from "../text/H1";

export const ProfileHeader = () => {
  const profile = useUserFullProfile();

  return (
    <View
      style={{
        flexDirection: "column",
        backgroundColor: "#E6E6E6",
        flex: 1,
        paddingVertical: 18,
        rowGap: 18,
        paddingHorizontal: 38,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <H1>Profil</H1>
        <View>
          <Button
            href="/(tabs)/profile/account"
            size="small"
            prependIcon={<User />}
          >
            Mon compte
          </Button>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          height: 50,
          alignItems: "center",
        }}
      >
        <View style={{ width: 40 }}>
          <Avatar id={profile ? profile.user_profile_id : ""} />
        </View>
        <View style={profileStyles.personalityView}>
          <Text style={profileStyles.username}>
            {profile?.profile ? profile.profile?.nickname : "chargement"}
          </Text>
          <Text style={profileStyles.nickname}>@{profile?.username}</Text>
        </View>
      </View>
    </View>
  );
};

const profileStyles = StyleSheet.create({
  personalityView: {
    flexDirection: "column",
    marginHorizontal: 12,
  },
  username: {
    fontSize: 16,
    fontFamily: Font.Outfit.Medium,
    letterSpacing: 0.32,
  },
  nickname: {
    fontSize: 14,
    fontFamily: Font.Outfit.Regular,
    color: Colors.light.gray,
  },
});
