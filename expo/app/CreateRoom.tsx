import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import ServiceList from "../components/servicesList";
import ParametersList from "../components/parametersList";
import CustomTextInput from "../components/customTextInput";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [selectedService, setSelectedService] = useState({
    ["Spotify"]: true,
    ["SoundCloud"]: false,
  } as { [key: string]: boolean });
  const [percentageVoteToSkipAMusic, setPercentageVote] = useState("70");
  const [maxMusicPerUser, setMaxMusicPerUser] = useState("3");
  const [maxMusicDuration, setMaxMusicDuration] = useState("300");
  const [canVote, setCanVote] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (roomName && roomCode && Object.values(selectedService).includes(true)) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [roomName, roomCode, selectedService]);

  const onSubmit = async () => {
    const service = Object.keys(selectedService).find(
      (key) => selectedService[key],
    );

    const body = {
      name: roomName,
      code: roomCode,
      service: service,
      voteSkipping: canVote,
      voteSkippingNeeded: parseInt(percentageVoteToSkipAMusic),
      maxMusicPerUser: parseInt(maxMusicPerUser),
      maxMusicPerUserDuration: parseInt(maxMusicDuration),
    };

    if (body.voteSkippingNeeded > 100 || body.voteSkippingNeeded < 0) {
      alert("Le pourcentage doit être entre 0 et 100");
      return;
    }

    if (body.maxMusicPerUser <= 0) {
      alert(
        "Le nombre maximum de musique par utilisateur doit être positif ou au moins supérieur à 1",
      );
      return;
    }

    if (body.maxMusicPerUserDuration <= 0) {
      alert(
        "La durée maximale d'une musique doit être positive ou au moins supérieur à 1 seconde",
      );
      return;
    }

    if (!body.voteSkipping) body.voteSkippingNeeded = 0;

    try {
      const response = await axios.post(
        "http://127.0.0.1:3000/createRoom",
        body,
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
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
    borderWidth: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  text: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    padding: 10,
    marginTop: 20,
    width: 300,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  page: {
    paddingTop: 20,
    paddingLeft: 20,
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
