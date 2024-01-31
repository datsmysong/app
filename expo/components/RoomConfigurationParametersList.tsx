import { RoomConfiguration } from "commons/database-types-utils";
import Checkbox from "expo-checkbox";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

import Alert from "./Alert";
import CustomSlider from "./CustomSlider";
import CustomTextInput from "./CustomTextInput";
import { Text, View } from "./Themed";
import { getApiUrl } from "../lib/apiUrl";

interface ParametersListProps {
  roomId: string;
}

export default function RoomConfigurationParametersList({
  roomId,
}: ParametersListProps) {
  const baseUrl = getApiUrl();
  const didMountRef = React.useRef(false);

  const [roomConfigurationId, setRoomConfigurationId] =
    React.useState<string>();
  const [sliderParticipantValue, setSliderParticipantValue] =
    React.useState(10);
  const [canBeAnonymous, setCanBeAnonymous] = React.useState(false);
  const [canSkip, setCanSkip] = React.useState(true);
  const [sliderPercentageValue, setSliderPercentageValue] = React.useState(70);
  const [maxMusicDuration, setMaxMusicDuration] = React.useState("150");
  const [maxMusicPerUser, setMaxMusicPerUser] = React.useState("5");
  const thumbImage = require("../assets/images/SliderElipse.svg");

  // To get current room configuration id
  useEffect(() => {
    (async () => {
      const room = await fetch(baseUrl + "/rooms?id=" + roomId);

      const roomJSON = await room.json();
      setRoomConfigurationId(roomJSON.configuration_id);
    })();
  }, []);

  // To get current room configuration
  useEffect(() => {
    if (!roomConfigurationId) return;
    (async () => {
      const roomConfiguration = await fetch(
        baseUrl + "/room/configuration/" + roomConfigurationId
      );

      const roomConfigurationJSON: RoomConfiguration =
        await roomConfiguration.json();
      setCanSkip(roomConfigurationJSON.vote_skipping);
      setSliderPercentageValue(
        roomConfigurationJSON.vote_skipping_needed_percentage
      );
      setMaxMusicDuration(roomConfigurationJSON.max_music_duration.toString());
      setMaxMusicPerUser(
        roomConfigurationJSON.max_music_count_in_queue_per_participant.toString()
      );
    })();
  }, [roomConfigurationId]);

  // To update the room configuration
  const handleSave = async () => {
    const roomConfiguration = await fetch(
      baseUrl + "/room/configuration/" + roomConfigurationId + "/update",
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
    }
  };
  // Only for canSkip checkbox
  useEffect(() => {
    // Using this because the first time the component is mounted, it will trigger otherwise
    if (didMountRef.current) {
      handleSave();
    } else {
      didMountRef.current = true;
    }
    // canBeAnonymous is not on the table room_configuration
  }, [canSkip]);

  return (
    <View style={styles.page}>
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
      <View style={styles.checkboxLayout}>
        <Checkbox
          value={canBeAnonymous}
          onValueChange={setCanBeAnonymous}
          style={styles.checkbox}
          color="black"
        />
        <Text style={styles.checkboxText}>
          Autoriser les participants anonymes
        </Text>
        <View />
      </View>
      <View style={styles.separator} />
      <View style={styles.checkboxLayout}>
        <Checkbox
          value={canSkip}
          onValueChange={setCanSkip}
          style={styles.checkbox}
          color="black"
        />
        <Text style={styles.checkboxText}>Activer le vote skipping</Text>
      </View>
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
          onSlidingComplete={handleSave}
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
          onSubmitEditing={handleSave}
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
          onSubmitEditing={handleSave}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    maxWidth: 394,
    gap: 12,
    paddingBottom: 20,
    paddingTop: 20,
  },

  slider: {
    justifyContent: "center",
    marginLeft: 10,
    width: 350,
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
    maxWidth: 300,
    marginBottom: 25,
  },

  checkboxLayout: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
    marginLeft: 10,
    alignItems: "center",
    gap: 10,
    alignSelf: "stretch",
  },

  checkboxText: {
    fontFamily: "Outfit-Regular",
    fontSize: 17,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#1A1A1A",
    backgroundColor: "#FFF",
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
