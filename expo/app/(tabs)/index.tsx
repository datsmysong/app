// import * as WebBrowser from "expo-web-browser";
import { JSONTrack } from "commons/backend-types";
import ClockCounterClockwise from "phosphor-react-native/src/icons/ClockCounterClockwise";
import MusicNote from "phosphor-react-native/src/icons/MusicNote";
import React, { useEffect, useState } from "react";
import { FlatList, View as NativeView, ScrollView } from "react-native";

import Button from "../../components/Button";
import { TrackCard } from "../../components/Music";
import { View } from "../../components/Themed";
import { RoomHistoryList } from "../../components/UserRoomHistory";
import H1 from "../../components/text/H1";
import H2 from "../../components/text/H2";
import { getApiUrl } from "../../lib/apiUrl";
import { useUserProfile } from "../../lib/userProfile";

function RecentMusicsSkeletonLoader() {
  return (
    <FlatList
      data={[{}, {}, {}, {}, {}]}
      renderItem={() => <TrackCard.Skeleton />}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    />
  );
}

type RecentMusicsProps = {
  loading?: React.ReactElement;
};

function RecentMusics({ loading }: RecentMusicsProps) {
  const userProfile = useUserProfile();
  const [recentMusics, setRecentMusics] = useState<JSONTrack[]>();
  const apiUrl = getApiUrl();

  useEffect(() => {
    if (!userProfile) return;

    const fetchRecentMusics = async () => {
      const query = await fetch(`${apiUrl}/recent-musics`, {
        credentials: "include",
      });
      if (!query.ok)
        return setRecentMusics([
          {
            id: "error",
            title: "Impossible de charger les musiques récentes",
            artistsName: "Erreur",
            duration: 0,
            imgUrl: "https://unsplash.it/300/300",
            albumName: "Erreur",
            genres: ["Erreur"],
            url: "https://unsplash.it/300/300",
          },
        ]);
      const data = await query.json();
      setRecentMusics(data);
    };

    fetchRecentMusics();
  }, [userProfile]);

  if (recentMusics === undefined) {
    return loading ?? <View />;
  }

  return (
    <FlatList
      data={recentMusics}
      renderItem={({ item }) => <TrackCard key={item.id} music={item} />}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    />
  );
}

export default function HomeTab() {
  // This shouldn't be needed, but I'm leaving this here just in case that breaks something
  // WebBrowser.maybeCompleteAuthSession();

  return (
    <ScrollView contentContainerStyle={{ gap: 36, padding: 24 }}>
      <View
        style={{
          gap: 12,
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <TitleIcon
          title="Votre dernière salle"
          icon={<ClockCounterClockwise />}
        />
        <View style={{ width: "100%" }}>
          <RoomHistoryList limit={1} />
        </View>
      </View>
      <View
        style={{
          gap: 12,
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <TitleIcon
          title="Vos dernières musiques partagées"
          icon={<MusicNote />}
        />
        <View style={{ width: "100%" }}>
          <RecentMusics loading={<RecentMusicsSkeletonLoader />} />
        </View>
      </View>
    </ScrollView>
  );
}

type TitleIconProps = {
  icon: React.ReactNode;
  title: string;
};

function TitleIcon({ icon, title }: TitleIconProps) {
  return (
    <View
      style={{
        gap: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {icon}
      <H2>{title}</H2>
    </View>
  );
}

export function HomeTabHeader() {
  const userProfile = useUserProfile();

  return (
    <NativeView
      style={{
        flexDirection: "column",
        backgroundColor: "#E6E6E6",
        flex: 1,
        padding: 24,
        gap: 36,
      }}
    >
      <NativeView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <H1>Salut {userProfile?.profile?.nickname ?? ""} 👋</H1>
      </NativeView>
      <NativeView style={{ flex: 1, gap: 8, paddingVertical: 12 }}>
        <Button block href="/rooms/create">
          Créer une salle
        </Button>
        <Button block type="outline" href="/rooms/join">
          Rejoindre une salle
        </Button>
      </NativeView>
    </NativeView>
  );
}
