import { Room, RoomConfiguration } from "commons/database-types-utils";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import Alert from "./Alert";
import Button from "./Button";
import CustomCheckbox from "./CustomCheckbox";
import CustomSlider from "./CustomSlider";
import CustomTextInput from "./CustomTextInput";
import { Text, View } from "./Themed";
import { getApiUrl } from "../lib/apiUrl";
import { supabase } from "../lib/supabase";

interface ParametersListProps {
  roomId: string;
}

type RoomAndConfiguration = Room & {
  room_configurations: RoomConfiguration;
};

export default function RoomConfigurationParametersList({
  roomId,
}: ParametersListProps) {
  const baseUrl = getApiUrl();
  const [roomConfigurationId, setRoomConfigurationId] = useState<string>("");
  const [sliderParticipantValue, setSliderParticipantValue] = useState(10);
  const [canBeAnonymous, setCanBeAnonymous] = useState(false);
  const [canSkip, setCanSkip] = useState(true);
  const [sliderPercentageValue, setSliderPercentageValue] = useState(70);
  const [maxMusicDuration, setMaxMusicDuration] = useState("150");
  const [maxMusicPerUser, setMaxMusicPerUser] = useState("5");
  const thumbImage = require("../assets/images/SliderElipse.svg");

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
    router.back();
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Paramètres de la salle</Text>
      <View style={styles.slider}>
        <Text style={styles.labelText}>
          Limite de participants <Text style={{ color: "red" }}>*</Text>
        </Text>
        <CustomSlider
          maximumValue={20}
          minimumValue={2}
          maximumTrackTintColor="#CCCCCC"
          minimumTrackTintColor="#1A1A1A"
          // Doesn't change anything, don't really understand why, but I'll need to find a
          // solution to this later
          thumbImage={thumbImage}
          value={sliderParticipantValue}
          setValue={(value) => setSliderParticipantValue(value)}
          // The column is not on the table room_configuration
          // onSlidingComplete={handleSave}
          step={1}
        />
      </View>
      <CustomCheckbox
        value={canBeAnonymous}
        setValue={setCanBeAnonymous}
        label="Autoriser les utilisateurs anonymes"
      />
      <View style={styles.separator} />
      <CustomCheckbox
        value={canSkip}
        setValue={setCanSkip}
        label="Activer le vote skipping"
      />
      <View style={styles.slider}>
        <Text style={styles.labelText}>
          Pourcentage nécessaire <Text style={{ color: "red" }}>*</Text>
        </Text>
        <CustomSlider
          maximumValue={100}
          minimumValue={1}
          maximumTrackTintColor="#CCCCCC"
          minimumTrackTintColor={canSkip ? "#1A1A1A" : "grey"}
          thumbImage={thumbImage}
          value={sliderPercentageValue}
          setValue={(value) => setSliderPercentageValue(value)}
          step={5}
          disabled={!canSkip}
        />
      </View>
      <View style={styles.separator} />
      <View style={styles.inputLayout}>
        <Text style={styles.labelText}>
          Durée maximale d'une musique <Text style={{ color: "red" }}>*</Text>
        </Text>
        <CustomTextInput
          value={maxMusicDuration}
          onChangeText={setMaxMusicDuration}
          style={styles.input}
        />
      </View>
      <View style={styles.inputLayout}>
        <Text style={styles.labelText}>
          Nombre de musiques maximal par participant{" "}
          <Text style={{ color: "red" }}>*</Text>
        </Text>
        <CustomTextInput
          value={maxMusicPerUser}
          onChangeText={setMaxMusicPerUser}
          style={styles.input}
        />
      </View>
      <Button
        type="filled"
        onPress={handleSave}
        style={{ alignSelf: "center" }}
      >
        {" "}
        Sauvegarder{" "}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    maxWidth: 700,
    width: "80%",
    gap: 12,
    paddingBottom: 20,
    paddingTop: 20,
    flex: 1,
  },
  title: {
    color: "#000",
    fontFamily: "Outfit-Regular",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "700",
    letterSpacing: 0.48,
    padding: 10,
  },
  slider: {
    justifyContent: "center",
    marginLeft: 10,
    flex: 1,
  },

  sliderBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },

  sliderDuration: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },

  labelText: {
    fontFamily: "Outfit-Bold",
    fontSize: 17,
    fontStyle: "normal",
    marginBottom: 25,
  },
  separator: {
    height: 2,
    width: "80%",
    backgroundColor: "grey",
    marginLeft: "10%",
    marginRight: "10%",
  },

  inputLayout: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "stretch",
    gap: 10,
    marginLeft: 20,
  },

  input: {
    color: "grey",
    width: "90%",
    marginRight: "10%",
    fontSize: 14,
  },

  thumbLabel: {
    position: "absolute",
    bottom: "100%",
    borderRadius: 16,
    width: "10%",
    height: 19,
    backgroundColor: "#1A1A1A",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 2,
  },

  sliderPolygon: {
    width: "3%",
    height: 8,
    flexShrink: 0,
  },
});
