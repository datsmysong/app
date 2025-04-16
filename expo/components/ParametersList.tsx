import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import CustomCheckbox from "./CustomCheckbox";
import CustomSlider from "./CustomSlider";
import CustomTextInput from "./CustomTextInput";

interface ParametersListProps {
  percentageVoteToSkipAMusic: number;
  setPercentageVote: (text: number) => void;
  maxMusicPerUser: string;
  setMaxMusicPerUser: (text: string) => void;
  maxMusicDuration: string;
  setMaxMusicDuration: (text: string) => void;
  canSkip: boolean;
  setCanSkip: (value: boolean) => void;
  create: boolean;
}

export default function ParametersList({
  percentageVoteToSkipAMusic,
  setPercentageVote,
  maxMusicPerUser,
  setMaxMusicPerUser,
  maxMusicDuration,
  setMaxMusicDuration,
  canSkip,
  setCanSkip,
  create,
}: ParametersListProps) {
  const [canBeAnonymous, setCanBeAnonymous] = useState(false);
  const [sliderParticipantValue, setSliderParticipantValue] = useState(10);
  return (
    <View style={{ marginVertical: 10 }}>
      <View
        style={{
          gap: 16,
        }}
      >
        <View style={styles.slider}>
          <Text style={styles.labelText}>
            Limite de participants{" "}
            {!create && <Text style={{ color: "red" }}>*</Text>}
          </Text>
          <CustomSlider
            maximumValue={20}
            minimumValue={2}
            maximumTrackTintColor="#CCCCCC"
            minimumTrackTintColor="#1A1A1A"
            // Doesn't change anything, don't really understand why, but I'll need to find a
            // solution to this later
            value={sliderParticipantValue}
            setValue={(value) => setSliderParticipantValue(value)}
            // The column is not on the table room_configuration
            // onSlidingComplete={handleSave}
            step={1}
          />
        </View>
        <CustomCheckbox
          disabled
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
            Pourcentage nécessaire{" "}
            {!create && <Text style={{ color: "red" }}>*</Text>}
          </Text>
          <CustomSlider
            maximumValue={100}
            minimumValue={1}
            maximumTrackTintColor="#CCCCCC"
            minimumTrackTintColor={canSkip ? "#1A1A1A" : "grey"}
            value={percentageVoteToSkipAMusic}
            setValue={(value) => setPercentageVote(value)}
            step={5}
            disabled={!canSkip}
          />
        </View>
        <View style={styles.separator} />
        <View style={styles.inputLayout}>
          <Text style={styles.labelText}>
            Durée maximale d'une musique{" "}
            {!create && <Text style={{ color: "red" }}>*</Text>}
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
            {!create && <Text style={{ color: "red" }}>*</Text>}
          </Text>
          <CustomTextInput
            value={maxMusicPerUser}
            onChangeText={setMaxMusicPerUser}
            style={styles.input}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    gap: 8,
  },
  input: {
    color: "grey",
    fontSize: 14,
    width: "100%",
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
