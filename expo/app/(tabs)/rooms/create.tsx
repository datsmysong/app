import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Alert from "../../../components/Alert";
import CustomTextInput from "../../../components/CustomTextInput";
import ParametersList from "../../../components/ParametersList";
import ServiceList from "../../../components/ServicesList";
import { getApiUrl } from "../../../lib/apiUrl";

type CreateRoomFormBody = {
  name: string;
  code: string;
  service: string;
  voteSkipping: boolean;
  voteSkippingNeeded: number;
  maxMusicPerUser: number;
  maxMusicDuration: number;
};

export type StreamingService = {
  service_id: string;
  service_name: string;
  image_url: string;
};

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [percentageVoteToSkipAMusic, setPercentageVote] = useState("70");
  const [maxMusicPerUser, setMaxMusicPerUser] = useState("3");
  const [maxMusicDuration, setMaxMusicDuration] = useState("300");
  const [canVote, setCanVote] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [services, setServices] = useState<StreamingService[]>([]);
  const [selectedService, setSelectedService] =
    useState<StreamingService["service_id"]>();
  const [isPressed, setIsPressed] = useState(false);

  const baseUrl = getApiUrl();

  const TriangleRight = () => {
    return <View style={[styles.triangle, styles.triangleRight]} />;
  };

  const TriangleDown = () => {
    return <View style={[styles.triangle, styles.triangleDown]} />;
  };

  useEffect(() => {
    const fetchServices = async () => {
      const response = await fetch(baseUrl + "/streaming-services");
      const data = await response.json();

      const services: StreamingService[] = [];

      data.forEach((service: StreamingService) => {
        services.push(service);
      });
      setServices(services);
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (roomName && roomCode && selectedService) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [roomName, roomCode, selectedService]);

  function checkConstraints(body: CreateRoomFormBody): { error: true | null } {
    if (body.voteSkippingNeeded > 100 || body.voteSkippingNeeded < 0) {
      Alert.alert(
        "Mauvais pourcentage : Le pourcentage doit être entre 0 et 100"
      );
      return { error: true };
    }

    if (body.maxMusicPerUser <= 0) {
      Alert.alert(
        "Mauvais nombre de musique : Le nombre maximum de musique par utilisateur doit être positif ou au moins supérieur à 1"
      );
      return { error: true };
    }

    if (body.maxMusicDuration <= 0) {
      Alert.alert(
        "Mauvaise durée de musique : La durée maximale d'une musique doit être positive ou au moins supérieur à 1 seconde"
      );
      return { error: true };
    }
    return { error: null };
  }

  const onSubmit = async () => {
    if (!selectedService) return;

    const body: CreateRoomFormBody = {
      name: roomName,
      code: roomCode,
      service: selectedService,
      voteSkipping: canVote,
      voteSkippingNeeded: parseInt(percentageVoteToSkipAMusic, 10),
      maxMusicPerUser: parseInt(maxMusicPerUser, 10),
      maxMusicDuration: parseInt(maxMusicDuration, 10),
    };

    const { error } = checkConstraints(body);
    if (error !== null) return;

    if (!body.voteSkipping) body.voteSkippingNeeded = 0;

    try {
      const response = await fetch(baseUrl + "/rooms/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 409)
          return Alert.alert("Ce code de salle est déjà utilisé");

        return Alert.alert(response.statusText);
      }

      const jsonResponse = await response.json();

      const roomId = jsonResponse.data.room_id;
      router.push(`/rooms/${roomId}`);
    } catch (error) {
      console.error(error);
      Alert.alert("Une erreur est survenue lors de la création de la salle");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.labelText}>Nom de la salle</Text>
      <CustomTextInput
        placeholder="Ma salle"
        value={roomName}
        onChangeText={setRoomName}
      />
      <Text style={styles.labelText}>Code de la salle</Text>
      <CustomTextInput
        placeholder="ABC123"
        value={roomCode}
        onChangeText={setRoomCode}
      />
      <Text style={styles.labelText}>Plateforme de streaming à utiliser</Text>
      <ServiceList
        availableServices={services}
        handleServiceChange={setSelectedService}
      />

      <TouchableOpacity
        onPress={() => {
          setIsPressed(!isPressed);
        }}
      >
        <View style={styles.items}>
          {isPressed ? <TriangleDown /> : <TriangleRight />}
          <Text style={styles.item}>Paramètres supplémentaires</Text>
        </View>
      </TouchableOpacity>

      {isPressed && (
        <ParametersList
          percentageVoteToSkipAMusic={percentageVoteToSkipAMusic}
          setPercentageVote={setPercentageVote}
          maxMusicDuration={maxMusicDuration}
          setMaxMusicDuration={setMaxMusicDuration}
          maxMusicPerUser={maxMusicPerUser}
          setMaxMusicPerUser={setMaxMusicPerUser}
          canVote={canVote}
          setCanVote={setCanVote}
        />
      )}
      <TouchableOpacity
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Créer une salle d'écoute</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 14,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "black",
  },

  triangleRight: {
    transform: "rotateZ(90deg)",
  },

  triangleDown: {
    transform: "rotateX(180deg)",
  },

  items: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    paddingLeft: 10,
  },

  item: {
    marginLeft: 10,
  },

  input: {
    height: 40,
    width: 200,
    margin: 12,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    width: 300,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  page: {
    paddingTop: 20,
    paddingLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  labelText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  buttonDisabled: {
    backgroundColor: "#7f7f7f",
  },
});
