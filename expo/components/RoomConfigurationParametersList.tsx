import { router } from "expo-router";
import { Trash } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import Alert from "./Alert";
import ParametersList from "./ParametersList";
import { View } from "./Themed";
import Button from "./ui/Button";
import { getApiUrl } from "../lib/apiUrl";
import { supabase } from "../lib/supabase";

interface ParametersListProps {
  roomId: string;
}

export default function RoomConfigurationParametersList({
  roomId,
}: ParametersListProps) {
  const baseUrl = getApiUrl();
  const [roomConfigurationId, setRoomConfigurationId] = useState<string>("");
  const [canSkip, setCanSkip] = useState(true);
  const [sliderPercentageValue, setSliderPercentageValue] = useState(70);
  const [maxMusicDuration, setMaxMusicDuration] = useState("150");
  const [maxMusicPerUser, setMaxMusicPerUser] = useState("5");

  // To get current room configuration id
  useEffect(() => {
    (async () => {
      const { error, data } = await supabase
        .from("rooms")
        .select("*, room_configurations(*)")
        .eq("id", roomId)
        .single();

      if (error) {
        Alert.alert(
          "Une erreur est survenue lors de la récupération des paramètres de la salle"
        );
        return;
      }
      if (!data) {
        Alert.alert("Aucune salle trouvée");
        return;
      }
      if (!data.room_configurations) {
        Alert.alert("Aucune configuration trouvée pour cette salle");
        return;
      }

      const config = data.room_configurations;
      setRoomConfigurationId(data.configuration_id ?? "");
      setCanSkip(config.vote_skipping);
      setSliderPercentageValue(config.vote_skipping_needed_percentage);
      setMaxMusicDuration(config.max_music_duration.toString());
      setMaxMusicPerUser(
        config.max_music_count_in_queue_per_participant.toString()
      );
    })();
  }, []);

  // To update the room configuration
  const handleSave = async () => {
    const roomConfiguration = await fetch(
      baseUrl + "/room/configuration/" + roomConfigurationId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voteSkipping: canSkip,
          voteSkippingPercentage: sliderPercentageValue,
          maxMusicPerUser: parseInt(maxMusicPerUser, 10),
          maxMusicDuration: parseInt(maxMusicDuration, 10),
        }),
      }
    );

    if (!roomConfiguration.ok) {
      Alert.alert(
        "Une erreur est survenue lors de la sauvegarde des paramètres"
      );
      return;
    }
    if (router.canGoBack()) router.back();
    router.push(("/rooms/" + roomId) as any);
  };

  const deleteRoom = async () => {
    const url: URL = new URL("/room/" + roomId, getApiUrl());

    const response = await fetch(url + "/end", { credentials: "include" });
    if (!response.ok && process.env.NODE_ENV !== "production") {
      Alert.alert(await response.text());
    }
  };

  return (
    <View style={styles.page}>
      <ParametersList
        percentageVoteToSkipAMusic={sliderPercentageValue}
        setPercentageVote={setSliderPercentageValue}
        maxMusicPerUser={maxMusicPerUser}
        setMaxMusicPerUser={setMaxMusicPerUser}
        maxMusicDuration={maxMusicDuration}
        setMaxMusicDuration={setMaxMusicDuration}
        canSkip={canSkip}
        setCanSkip={setCanSkip}
        create={false}
      />
      <Button type="filled" onPress={handleSave} block>
        Sauvegarder
      </Button>
      <Button onPress={deleteRoom} color="danger" block prependIcon={<Trash />}>
        Supprimer la salle
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    maxWidth: 700,
    width: "80%",
    gap: 30,
    paddingVertical: 20,
    flex: 1,
  },
});
