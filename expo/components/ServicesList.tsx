import { Image } from "expo-image";
import React, { useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text } from "react-native";

import { StreamingService } from "../app/(tabs)/rooms/create";

interface ServicesListProps {
  availableServices: StreamingService[];
  handleServiceChange: (serviceId: string) => void;
}

export default function ServicesList({
  availableServices,
  handleServiceChange,
}: ServicesListProps) {
  const [selectedService, setSelectedService] =
    useState<StreamingService["service_id"]>();

  const toggleSelect = (item: StreamingService) => {
    if (item.service_id === selectedService) {
      setSelectedService(undefined);
      handleServiceChange("");
    } else {
      setSelectedService(item.service_id);
      handleServiceChange(item.service_id);
    }
  };

  return (
    <FlatList
      showsHorizontalScrollIndicator={Platform.OS === "web"}
      data={availableServices}
      columnWrapperStyle={styles.list}
      numColumns={3}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => toggleSelect(item)}
          style={[
            styles.items,
            item.service_id === selectedService ? styles.selected : {},
          ]}
        >
          <Image
            style={styles.image}
            contentFit="contain"
            source={item.image_url}
            alt={item.service_name}
          />
          <Text
            style={{
              ...styles.labelText,
              color:
                item.service_id === selectedService ? "#FFFFFF" : "#1A1A1A",
            }}
          >
            {item.service_name}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
  },
  list: {
    gap: 10,
  },
  items: {
    borderColor: "#1A1A1A",
    borderWidth: 1,
    borderStyle: "solid",
    width: 138,
    height: 138,
    borderCurve: "continuous",
    borderRadius: 36,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 18,
  },
  selected: {
    backgroundColor: "#1A1A1A",
  },
  labelText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Outfit-Bold",
  },
});
