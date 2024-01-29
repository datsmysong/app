import React from "react";
import { StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { View, Text } from "./Themed";

export default function ParametersList() {
  const [sliderValue, setSliderValue] = React.useState(0);
  const thumbImage = require("../assets/images/SliderElipse.svg");

  return (
    <View>
      <View style={styles.slider}>
        <Text style={styles.labelText}>Limite de participants *</Text>
        <Text
          style={{
            marginLeft: 100,
            textAlign: "center",
            marginTop: 32,
          }}
        >
          {Math.floor(sliderValue)}
        </Text>
        <Slider
          style={styles.sliderBar}
          maximumValue={20}
          minimumValue={1}
          maximumTrackTintColor={"#CCCCCC"}
          minimumTrackTintColor={"#1A1A1A"}
          thumbImage={thumbImage}
          value={sliderValue}
          onValueChange={(value) => setSliderValue(value)}
        />
        <View style={styles.sliderDuration}>
          <Text>1</Text>
          <Text>20</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slider: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 20,
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
    color: "#1A1A1A",
    fontFamily: "Outfit",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "700",
  },
});
