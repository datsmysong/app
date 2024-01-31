import Slider from "@react-native-community/slider";
import { Image } from "expo-image";
import React from "react";
import { ImageURISource, StyleSheet } from "react-native";

import { Text, View } from "./Themed";

interface ParametersListProps {
  value: number;
  setValue: (value: number) => void;
  maximumValue: number;
  minimumValue: number;
  maximumTrackTintColor: string;
  minimumTrackTintColor: string;
  step: number;
  thumbImage: ImageURISource | undefined;
  onSlidingComplete?: () => void;
  disabled?: boolean;
}

export default function CustomSlider({
  value,
  setValue,
  maximumValue,
  minimumValue,
  maximumTrackTintColor,
  minimumTrackTintColor,
  step,
  thumbImage,
  onSlidingComplete,
  disabled = false,
}: ParametersListProps) {
  const sliderPolygon = require("../assets/images/SliderPolygon.svg");

  return (
    <View>
      <Text
        style={[
          styles.thumbLabel,
          {
            left:
              (value - minimumValue) *
                ((350 - 20) / Math.floor(maximumValue - minimumValue)) -
              6,
          },
        ]}
      >
        {value}
      </Text>
      <Image
        source={sliderPolygon}
        style={[
          styles.sliderPolygon,
          {
            left:
              (value - minimumValue) *
                ((350 - 20) / Math.floor(maximumValue - minimumValue)) +
              5.5,
          },
        ]}
      />
      <Slider
        style={styles.sliderBar}
        maximumValue={maximumValue}
        minimumValue={minimumValue}
        maximumTrackTintColor={maximumTrackTintColor}
        minimumTrackTintColor={minimumTrackTintColor}
        thumbImage={thumbImage}
        value={value}
        onValueChange={setValue}
        step={step}
        onSlidingComplete={onSlidingComplete}
        disabled={disabled}
      />
      <View style={styles.sliderDuration}>
        <Text>{minimumValue}</Text>
        <Text>{maximumValue}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slider: {
    justifyContent: "center",
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

  thumbLabel: {
    bottom: "100%",
    borderRadius: 16,
    width: 34,
    height: 19,
    backgroundColor: "#1A1A1A",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 2,
  },

  sliderPolygon: {
    width: 10,
    height: 8,
    flexShrink: 0,
  },
});
