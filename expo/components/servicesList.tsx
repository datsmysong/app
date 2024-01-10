import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import React from "react";

interface ServicesListProps {
  selectedService: { [key: string]: boolean };
  setSelectedService: (
    value: (prevState: { [key: string]: boolean }) => any,
  ) => void;
}

export default function ServicesList({
  selectedService,
  setSelectedService,
}: ServicesListProps) {
  const images = new Map<string, any>([
    ["Spotify", require("../assets/images/spotify.png")],
    ["SoundCloud", require("../assets/images/soundcloud.png")],
  ]);

  const toggleSelect = (item: string) => {
    if (
      !selectedService[item] &&
      Object.values(selectedService).includes(true)
    ) {
      for (const elem in selectedService) {
        if (elem !== item)
          setSelectedService((prevState) => ({
            ...prevState,
            [elem]: !prevState[elem],
          }));
      }
    }

    setSelectedService((prevState) => ({
      ...prevState,
      [item]: !prevState[item],
    }));
  };

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={Platform.OS === "web"}
      data={Array.from(images.keys())}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => toggleSelect(item)}>
          <View
            style={[styles.items, selectedService[item] ? styles.selected : {}]}
          >
            <Image
              style={styles.image}
              contentFit={"contain"}
              source={images.get(item)}
              key={item}
            />
            <Text style={styles.labelText}>{item}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
  items: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginRight: 20,
    padding: 5,
  },
  selected: {
    borderColor: "grey",
    borderWidth: 3,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
});
