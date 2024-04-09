import { StreamingService } from "commons/database-types-utils";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text } from "react-native";

import Alert from "./Alert";
import { View } from "./Themed";
import Colors from "../constants/Colors";
import { supabase } from "../lib/supabase";
import { useUserProfile } from "../lib/userProfile";

interface ServicesListProps {
  handleServiceChange: (serviceId: string) => void;
}

export default function ServicesList({
  handleServiceChange,
}: ServicesListProps) {
  const [selectedService, setSelectedService] =
    useState<StreamingService["service_id"]>();
  const [availableServices, setAvailableServices] =
    useState<StreamingService[]>();
  const user = useUserProfile();

  useEffect(() => {
    if (!user) return;
    const userId = user.user_profile_id;
    (async () => {
      const { error, data } = await supabase
        .from("bound_services")
        .select("streaming_services(*)")
        .eq("user_profile_id", userId)
        // temporary disabled soundcloud service (always available)
        .neq("service_id", "c99631a2-f06c-4076-80c2-13428944c3a8");

      if (error) {
        Alert.alert("Une erreur est survenue, veuillez réessayer plus tard");
        return;
      }
      if (!data) {
        Alert.alert("Aucune salle trouvée");
        return;
      }

      const { data: servicesWithoutAccount } = await supabase
        .from("streaming_services")
        .select("*")
        .eq("need_account", false);

      const services: StreamingService[] = [];
      data.forEach((elem) => {
        if (elem.streaming_services) services.push(elem.streaming_services);
      });

      if (servicesWithoutAccount) services.push(...servicesWithoutAccount);

      setAvailableServices(services);
    })();
  }, [user]);

  const toggleSelect = (item: StreamingService) => {
    if (item.service_id === selectedService) {
      setSelectedService(undefined);
      handleServiceChange("");
    } else {
      setSelectedService(item.service_id);
      handleServiceChange(item.service_id);
    }
  };

  if (availableServices === undefined)
    return (
      <FlatList
        data={[{}, {}]}
        key={2}
        columnWrapperStyle={styles.list}
        numColumns={2}
        renderItem={({ item }) => (
          <View
            style={{ ...styles.items, backgroundColor: Colors.light.gray }}
          />
        )}
      />
    );

  return (
    <FlatList
      key={availableServices.length > 1 ? availableServices.length : 2}
      showsHorizontalScrollIndicator={Platform.OS === "web"}
      data={availableServices}
      columnWrapperStyle={styles.list}
      numColumns={availableServices.length > 1 ? availableServices.length : 2}
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
