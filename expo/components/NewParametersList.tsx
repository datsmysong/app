import Slider from "@react-native-community/slider";
import Checkbox from "expo-checkbox";
import React from "react";
import { StyleSheet } from "react-native";

import CustomTextInput from "./CustomTextInput";
import { View, Text } from "./Themed";

export default function ParametersList() {
  const [sliderParticipantValue, setSliderParticipantValue] = React.useState(1);
  const [canBeAnonymous, setCanBeAnonymous] = React.useState(false);
  const [canSkip, setCanSkip] = React.useState(true);
  const [sliderPercentageValue, setSliderPercentageValue] = React.useState(1);
  const [maxMusicDuration, setMaxMusicDuration] = React.useState("150");
  const [maxMusicPerUser, setMaxMusicPerUser] = React.useState("5");
  const thumbImage = require("../assets/images/SliderElipse.svg");

  return (
    <View style={styles.page}>
      <View style={styles.slider}>
        <Text style={styles.labelText}>
          Limite de participants <Text style={{ color: "red" }}>*</Text>
        </Text>
        <Text
          style={{
            marginLeft: "50%",
            textAlign: "center",
            marginTop: 32,
          }}
        >
          {sliderParticipantValue}
        </Text>
        <Slider
          style={styles.sliderBar}
          maximumValue={20}
          minimumValue={1}
          maximumTrackTintColor={"#CCCCCC"}
          minimumTrackTintColor={"#1A1A1A"}
          // Doesn't change anything, don't really understand why, but i'll need to find a
          // solution to this later
          thumbImage={thumbImage}
          value={sliderParticipantValue}
          onValueChange={(value) => setSliderParticipantValue(value)}
          step={1}
        />
        <View style={styles.sliderDuration}>
          <Text>1</Text>
          <Text>20</Text>
        </View>
      </View>
      <View style={styles.checkboxLayout}>
        <Checkbox
          value={canBeAnonymous}
          onValueChange={setCanBeAnonymous}
          style={styles.checkbox}
          color={"black"}
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
          color={"black"}
        />
        <Text style={styles.checkboxText}>Activer le vote skipping</Text>
      </View>
      <View style={styles.slider}>
        <Text style={styles.labelText}>
          Pourcentage nécessaire <Text style={{ color: "red" }}>*</Text>
        </Text>
        <Text
          style={{
            marginLeft: "50%",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          {sliderPercentageValue}
        </Text>
        <Slider
          style={styles.sliderBar}
          maximumValue={100}
          minimumValue={1}
          maximumTrackTintColor={"#CCCCCC"}
          minimumTrackTintColor={"#1A1A1A"}
          thumbImage={thumbImage}
          value={sliderPercentageValue}
          onValueChange={(value) => setSliderPercentageValue(value)}
          step={5}
        />
        <View style={styles.sliderDuration}>
          <Text>1</Text>
          <Text>100</Text>
        </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    display: "flex",
    width: 394,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 12,
    paddingBottom: 20,
    paddingTop: 20,
  },

  slider: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 20,
    width: "90%",
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
    textAlign: "center",
    color: "grey",
    width: "90%",
    marginRight: "10%",
  },
});
