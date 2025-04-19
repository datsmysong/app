import { BoundService, StreamingService } from "commons/database-types-utils";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import Alert from "../../../../components/Alert";
import { Text, View } from "../../../../components/Themed";
import Button from "../../../../components/ui/Button";
import { Subtitle } from "../../../../components/ui/typography/Paragraphs";
import { H2 } from "../../../../components/ui/typography/Titles";
import { useAsyncError } from "../../../../lib/AsyncError";
import { getApiUrl } from "../../../../lib/apiUrl";
import { bindServiceToAccount } from "../../../../lib/providerMethods";

export default function ProfileIntegration() {
  const [servicesData, setServicesData] = useState([] as StreamingService[]);
  const [boundServices, setBoundServices] = useState([] as BoundService[]); // To know which services are bound to the currrent user
  const throwError = useAsyncError();

  const baseUrl = getApiUrl();

  useEffect(() => {
    const fetchStreamingServicesData = async () => {
      const services = await fetch(baseUrl + "/streaming-services");
      if (!services.ok) {
        Alert.alert(
          "Erreur serveur, revenez plus tard ou contactez un administrateur"
        );
        return;
      }
      const data = await services.json();
      setServicesData(data);
    };

    fetchStreamingServicesData().catch(throwError);

    const fetchBoundServices = async () => {
      const responseBoundServices = await fetch(baseUrl + "/user/bound", {
        credentials: "include",
      });
      if (!responseBoundServices.ok) {
        throw new Error(
          "Impossible de récupérer les services liés à votre compte"
        );
      }
      const dataBoundServices = await responseBoundServices.json();

      setBoundServices(dataBoundServices);
    };

    fetchBoundServices().catch(throwError);
  }, []);

  const getServiceIds = (boundServices: BoundService[]) => {
    const serviceIds = [];
    for (const [, value] of Object.entries(boundServices)) {
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

  const unbindService = (serviceId: string) => {
    fetch(baseUrl + "/streaming-service/" + serviceId, {
      method: "DELETE",
      credentials: "include",
    })
      .then((resUnbound) => {
        if (!resUnbound.ok) {
          Alert.alert(
            "Erreur lors de la déconnexion du service, veuillez réessayer plus tard"
          );
        } else {
          Alert.alert("Service déconnecté avec succès");
          router.replace("/profile");
        }
      })
      .catch((error) => {
        Alert.alert(error);
      });
  };

  const bindService = (serviceName: string) => {
    bindServiceToAccount(serviceName);
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      {servicesData &&
        servicesData.map((service: StreamingService) => {
          return (
            <View key={service.service_id} style={styles.layout}>
              <View style={styles.info}>
                <Image
                  contentFit="contain"
                  source={service.image_url}
                  alt={service.service_name}
                  style={styles.image}
                />
                <View style={styles.details}>
                  <H2>{service.service_name}</H2>
                  <Subtitle>{service.description}</Subtitle>
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
              {isBound(service.service_id) ? (
                <Button
                  onPress={() => unbindService(service.service_id)}
                  type="outline"
                  color="danger"
                  block
                >
                  Déconnecter mon compte
                </Button>
              ) : (
                <Button
                  onPress={() => bindService(service.service_name)}
                  type="filled"
                  color="primary"
                  block
                >
                  Lier mon compte
                </Button>
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
    width: "100%",
    paddingVertical: 32,
    paddingHorizontal: 18,
    flexDirection: "column",
    alignItems: "center",
    gap: 24,
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
    maxWidth: 500,
    padding: 20,
    flexDirection: "column",
    alignItems: "center",
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
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
  },

  tag: {
    borderRadius: 16,
    textAlign: "center",
    fontFamily: "Outfit-Medium",
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  trueTag: {
    backgroundColor: "#D2F9E0",
    color: "#13863C",
    gap: 8,
  },

  falseTag: {
    backgroundColor: "#F9D2D2",
    color: "#D71E1E",
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#fff",
  },
});
