import { makeRedirectUri } from "expo-auth-session";
import { ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Text, View } from "../../../components/Tamed";
import { Image } from "expo-image";
import ConnectWithSpotify from "../../auth/connect-with-spotify";
import ConnectWithSoundcloud from "../../auth/connect-with-soundcloud";
import { router } from "expo-router";
import Alert from "../../../components/Alert";

type StreamingService = {
  service_id: string;
  service_name: string;
  description: string;
  image_url: string;
  playback_available: boolean;
  playlists_available: boolean;
  likes_available: boolean;
};

export default function ProfileIntegration() {
  const [servicesData, setServicesData] = useState([]);
  const [userId, setUserId] = useState("");
  const [boundServices, setBoundServices] = useState([] as any[]); // To know which services are bound to the currrent user

  const directUri = makeRedirectUri();
  const baseUrl = directUri.includes("exp://")
    ? "http://" + directUri.split(":8081")[0].split("//")[1]
    : directUri.split(":8081")[0];

  useEffect(() => {
    const fetchStreamingServicesData = async () => {
      const services = await fetch(baseUrl + ":3000/streaming-services");
      const data = await services.json();
      setServicesData(data);
    };

    const fetchUserData = async () => {
      const responseUser = await fetch(baseUrl + ":3000/user/current", {
        credentials: "include",
      });
      const dataUser = await responseUser.json();
      setUserId(dataUser.userId);
    };

    fetchStreamingServicesData().catch((err) => {
      Alert.alert(err);
    });

    fetchUserData().catch((err) => {
      Alert.alert(err);
    });
  }, []);

  useEffect(() => {
    const url = new URL(baseUrl + ":3000/bounded");
    url.searchParams.append("userId", userId);
    const fetchBoundServices = async () => {
      const responseBoundServices = await fetch(url.toString());
      const dataBoundServices = await responseBoundServices.json();

      setBoundServices(dataBoundServices);
    };

    if (userId) {
      fetchBoundServices().catch((err) => {
        Alert.alert(err);
      });
    }
  }, [userId]);

  const getServiceIds = (boundServices: any[]) => {
    const serviceIds = [];
    for (const [key, value] of Object.entries(boundServices)) {
      if (value) {
        serviceIds.push(value.service_id);
      }
    }
    return serviceIds;
  };

  const serviceIds = getServiceIds(boundServices);

  const isBound = (serviceId: string) => {
    return serviceIds.includes(serviceId);
  };

  const unboundService = (serviceId: string) => {
    const body = {
      userId: userId,
      serviceId: serviceId,
    };

    fetch(baseUrl + ":3000/unbound", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((resUnbound) => {
        if (!resUnbound.ok) {
          Alert.alert("Erreur lors de la déconnexion du service");
        } else {
          router.push("/profile");
        }
      })
      .catch((error) => {
        Alert.alert(error);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      {servicesData &&
        servicesData.map((service: StreamingService) => {
          return (
            <View key={service.service_id} style={styles.layout}>
              <View style={styles.info}>
                <Image
                  contentFit={"contain"}
                  source={service.image_url}
                  alt={service.service_name}
                  style={styles.image}
                />
                <View style={styles.details}>
                  <Text style={styles.title}>{service.service_name}</Text>
                  <Text style={styles.description}>{service.description}</Text>
                </View>
              </View>
              <View style={styles.tags}>
                <Text
                  style={[
                    styles.tag,
                    service.playback_available
                      ? styles.trueTag
                      : styles.falseTag,
                  ]}
                >
                  Lecture des musiques
                </Text>
                <Text
                  style={[
                    styles.tag,
                    service.playlists_available
                      ? styles.trueTag
                      : styles.falseTag,
                  ]}
                >
                  Gestion des playlists
                </Text>
                <Text
                  style={[
                    styles.tag,
                    service.likes_available ? styles.trueTag : styles.falseTag,
                  ]}
                >
                  Gestion des titres aimés
                </Text>
              </View>
              {service.service_name == "Spotify" ? (
                <ConnectWithSpotify
                  title={
                    isBound(service.service_id)
                      ? "Déconnecter mon compte"
                      : "Lier mon compte"
                  }
                  isBound={isBound(service.service_id)}
                  onPress={() => unboundService(service.service_id)}
                />
              ) : (
                <ConnectWithSoundcloud
                  title={
                    isBound(service.service_id)
                      ? "Déconnecter mon compte"
                      : "Lier mon compte"
                  }
                  isBound={isBound(service.service_id)}
                  onPress={() => unboundService(service.service_id)}
                />
              )}
            </View>
          );
        })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    display: "flex",
    width: 430,
    paddingVertical: 32,
    paddingHorizontal: 18,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 24,
    flex: 1,
  },

  image: {
    display: "flex",
    width: 73,
    height: 73,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },

  layout: {
    display: "flex",
    width: 394,
    padding: 20,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 24,
    borderRadius: 24,
    backgroundColor: "#fff",
  },

  info: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: 12,
    alignSelf: "stretch",
  },

  details: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 8,
    flex: 1,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    alignSelf: "stretch",
  },

  title: {
    color: "#000",
    textAlign: "center",
    fontFamily: "Outfit-Regular",
    fontSize: 18,
    fontStyle: "normal",
    fontWeight: "700",
  },

  description: {
    color: "#808080",
    fontFamily: "Outfit-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
  },

  tag: {
    borderRadius: 16,
    display: "flex",
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: "flex-start",
    gap: 10,
    textAlign: "center",
    fontFamily: "Outfit-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "500",
  },

  trueTag: {
    backgroundColor: "#D2F9E0",
    color: "#13863C",
  },

  falseTag: {
    backgroundColor: "#F9D2D2",
    color: "#D71E1E",
  },

  tags: {
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    gap: 7,
    flexDirection: "row",
    alignSelf: "stretch",
    flexWrap: "wrap",
  },
});