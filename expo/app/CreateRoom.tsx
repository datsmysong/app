import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import ServiceList from "../components/ServicesList";
import ParametersList from "../components/ParametersList";
import CustomTextInput from "../components/CustomTextInput";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { router } from "expo-router";

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [percentageVoteToSkipAMusic, setPercentageVote] = useState("70");
  const [maxMusicPerUser, setMaxMusicPerUser] = useState("3");
  const [maxMusicDuration, setMaxMusicDuration] = useState("300");
  const [canVote, setCanVote] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    [key: string]: boolean;
  }>({});
  const [images, setImages] = useState<Map<string, any>>(new Map());
  const [servicesId, setServicesId] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const fetchServices = async () => {
      const response = await fetch("http://localhost:3000/streamingServices");
      const data = await response.json();
      const images = new Map<string, any>();
      const initialSelectedService: { [key: string]: boolean } = {};
      const services = new Map<string, string>();

      data.forEach((service: any) => {
        images.set(service.service_name, service.image_url);
        initialSelectedService[service.service_name] = false;
        services.set(service.service_name, service.service_id);
      });

      initialSelectedService["Spotify"] = true;
      setSelectedService(initialSelectedService);
      setImages(images);
      setServicesId(services);
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (roomName && roomCode && Object.values(selectedService).includes(true)) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [roomName, roomCode, selectedService]);

  function checkConstraints(body: {
    maxMusicPerUserDuration: number;
    voteSkipping: boolean;
    code: string;
    voteSkippingNeeded: number;
    maxMusicPerUser: number;
    service: string | undefined;
    name: string;
  }) {
    if (body.voteSkippingNeeded > 100 || body.voteSkippingNeeded < 0) {
      Alert.alert(
        "Mauvais pourcentage",
        "Le pourcentage doit être entre 0 et 100",
      );
    }

    if (body.maxMusicPerUser <= 0) {
      Alert.alert(
        "Mauvais nombre de musique",
        "Le nombre maximum de musique par utilisateur doit être positif ou au moins supérieur à 1",
      );
    }

    if (body.maxMusicPerUserDuration <= 0) {
      Alert.alert(
        "Mauvaise durée de musique",
        "La durée maximale d'une musique doit être positive ou au moins supérieur à 1 seconde",
      );
    }
  }

  const onSubmit = async () => {
    const service =
      Object.keys(selectedService).find((key) => selectedService[key]) ||
      "Spotify";

    const body = {
      name: roomName,
      code: roomCode,
      service: servicesId.get(service),
      voteSkipping: canVote,
      voteSkippingNeeded: parseInt(percentageVoteToSkipAMusic),
      maxMusicPerUser: parseInt(maxMusicPerUser),
      maxMusicPerUserDuration: parseInt(maxMusicDuration),
    };

    checkConstraints(body);

    if (!body.voteSkipping) body.voteSkippingNeeded = 0;

    // TODO : review
    try {
      const response = await axios.post(
        "http://127.0.0.1:3000/createRoom",
        body,
      );
      console.log({ code: response.data.code, message: response.data.message });
    } catch (error) {
      return error;
    }

    router.push("/Rooms");
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.labelText}>Nom de la salle</Text>
      <CustomTextInput
        placeholder={"Ma salle"}
        value={roomName}
        onChangeText={setRoomName}
      />
      <Text style={styles.labelText}>Code de la salle</Text>
      <CustomTextInput
        placeholder={"1234"}
        value={roomCode}
        onChangeText={setRoomCode}
      />
      <Text style={styles.labelText}>Plateforme de streaming à utiliser</Text>
      <ServiceList
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        images={images}
      />
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
  },
  labelText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  buttonDisabled: {
    backgroundColor: "#7f7f7f",
  },
});
