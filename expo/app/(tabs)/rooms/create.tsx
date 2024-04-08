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
import Button from "../../../components/Button";
import CustomTextInput from "../../../components/CustomTextInput";
import ParametersList from "../../../components/ParametersList";
import ServiceList from "../../../components/ServicesList";
import Warning from "../../../components/Warning";
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
  const [percentageVoteToSkipAMusic, setPercentageVote] = useState(70);
  const [maxMusicPerUser, setMaxMusicPerUser] = useState("3");
  const [maxMusicDuration, setMaxMusicDuration] = useState("300");
  const [canVote, setCanVote] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedService, setSelectedService] =
    useState<StreamingService["service_id"]>();
  const [error, setError] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const baseUrl = getApiUrl();

  useEffect(() => {
    if (roomName && roomCode && selectedService) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [roomName, roomCode, selectedService]);

  useEffect(() => {
    if (error) {
      setError(false);
      setErrorMessage("");
      router.replace("/rooms/create");
    }
  }, []);

  function checkConstraints(body: CreateRoomFormBody): { error: true | null } {
    if (body.voteSkippingNeeded > 100 || body.voteSkippingNeeded < 0) {
      setErrorMessage(
        "Mauvais pourcentage : Le pourcentage doit être entre 0 et 100"
      );
      return { error: true };
    }

    if (body.maxMusicPerUser <= 0) {
      setErrorMessage(
        "Mauvais nombre de musique : Le nombre maximum de musique par utilisateur doit être positif ou au moins supérieur à 1"
      );
      return { error: true };
    }

    if (body.maxMusicDuration <= 0) {
      setErrorMessage(
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
      voteSkippingNeeded: percentageVoteToSkipAMusic,
      maxMusicPerUser: parseInt(maxMusicPerUser, 10),
      maxMusicDuration: parseInt(maxMusicDuration, 10),
    };

    const { error } = checkConstraints(body);
    if (error !== null) {
      setError(true);
      return;
    }

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
        if (response.status === 409) {
          setError(true);
          setErrorMessage("Ce code de salle est déjà utilisé");
          return;
        }
        Alert.alert("Une erreur est survenue lors de la création de la salle");
        return;
      }

      const jsonResponse = await response.json();

      const roomId = jsonResponse.data.room_id;
      router.push(`/rooms/${roomId}`);
    } catch (error) {
      console.error(error);
      setError(true);
      setErrorMessage(
        "Une erreur est survenue lors de la création de la salle"
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.labelText}>
        Nom de la salle
        <Text style={[{ color: "red" }, styles.labelText]}>*</Text>
      </Text>
      <CustomTextInput
        placeholder="Ma salle"
        value={roomName}
        onChangeText={setRoomName}
      />
      <Text style={styles.labelText}>
        Code de la salle{" "}
        <Text style={[{ color: "red" }, styles.labelText]}>*</Text>{" "}
      </Text>
      <CustomTextInput
        placeholder="ABC123"
        value={roomCode}
        onChangeText={setRoomCode}
      />
      <Text style={styles.labelText}>
        Platform de streaming à utiliser{" "}
        <Text style={[{ color: "red" }, styles.labelText]}>*</Text>
      </Text>
      <ServiceList handleServiceChange={setSelectedService} />
      <ParametersList
        percentageVoteToSkipAMusic={percentageVoteToSkipAMusic}
        setPercentageVote={setPercentageVote}
        maxMusicDuration={maxMusicDuration}
        setMaxMusicDuration={setMaxMusicDuration}
        maxMusicPerUser={maxMusicPerUser}
        setMaxMusicPerUser={setMaxMusicPerUser}
        canSkip={canVote}
        setCanSkip={setCanVote}
        create
      />
      {error && <Warning label={errorMessage || ""} variant="warning" />}
      {/* <TouchableOpacity
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>Créer une salle d'écoute</Text>
      </TouchableOpacity> */}
      <View
        style={{
          flexDirection: "column",
          gap: 8,
        }}
      >
        <Button onPress={onSubmit} disabled={!isFormValid} block>
          Créer une salle d'écoute
        </Button>
        <Button href="/rooms" type="outline" block>
          Abandonner
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    // paddingLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: 20,
    // paddingTop: 20,
    paddingBottom: 20,
    // justifyContent: "center",
    // alignItems: "center",
    // // flex: 1,
    // flexDirection: "column",
    alignSelf: "stretch",
    // gap: 8,
  },
  labelText: {
    fontSize: 20,
    fontFamily: "Outfit-Bold",
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: "#7f7f7f",
  },
});
