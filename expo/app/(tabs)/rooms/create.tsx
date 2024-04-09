import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Alert from "../../../components/Alert";
import Button from "../../../components/Button";
import ControlledInput from "../../../components/ControlledInput";
import CustomTextInput from "../../../components/CustomTextInput";
import ParametersList, {
  RoomParameters,
} from "../../../components/ParametersList";
import ServiceList from "../../../components/ServicesList";
import Warning from "../../../components/Warning";
import H1 from "../../../components/text/H1";
import Colors from "../../../constants/Colors";
import { getApiUrl } from "../../../lib/apiUrl";

type CreateRoomForm = RoomParameters & {
  roomName: string;
  roomCode: string;
  selectedService: string;
};

export type StreamingService = {
  service_id: string;
  service_name: string;
  image_url: string;
};

export function CreateRoomHeader() {
  return (
    <View
      style={{
        gap: 36,
        padding: 24,
        backgroundColor: Colors.light.headerBackground,
      }}
    >
      <H1>Nouvelle salle</H1>
    </View>
  );
}

export default function CreateRoom() {
  const baseUrl = getApiUrl();

  const {
    control,
    setValue,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm<CreateRoomForm>({
    defaultValues: {
      roomName: "",
      roomCode: "",
      selectedService: "",
      allowGuests: false,
      allowVoteSkip: false,
      maxMusicDuration: 600,
      maxMusicPerUser: 5,
      maxParticipants: 10,
      voteSkipPercentage: 50,
    },
    shouldFocusError: true,
  });

  const onSubmit = async (data: CreateRoomForm) => {
    try {
      const response = await fetch(baseUrl + "/rooms/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 409) {
          return setFormError("roomCode", {
            message: "Ce code de salle est déjà utilisé",
          });
        }
        return Alert.alert(
          "Une erreur est survenue lors de la création de la salle"
        );
      }

      const jsonResponse = await response.json();

      const roomId = jsonResponse.data.room_id;
      router.push(`/rooms/${roomId}`);
    } catch (error) {
      console.error(error);
      setFormError("root", {
        message: `Une erreur est survenue lors de la création de la salle. Erreur: ${error}`,
      });
    }
  };

  function handleServiceChange(serviceId: string): void {
    setValue("selectedService", serviceId);
  }

  function handleSettingsChange(settings: RoomParameters): void {
    setValue("voteSkipPercentage", settings.voteSkipPercentage);
    setValue("allowGuests", settings.allowGuests);
    setValue("allowVoteSkip", settings.allowVoteSkip);
    setValue("maxMusicPerUser", settings.maxMusicPerUser);
    setValue("maxMusicDuration", settings.maxMusicDuration);
    setValue("maxParticipants", settings.maxParticipants);
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={{ gap: 10 }}>
        <ControlledInput
          control={control}
          label="Nom de la salle"
          name="roomName"
          rules={{ required: "Nom de la salle est requis" }}
          placeholder="Ma salle"
          errorMessage={errors.roomName && errors.roomName.message}
        />
        <ControlledInput
          control={control}
          label="Code de la salle"
          name="roomCode"
          rules={{ required: "Code de la salle est requis" }}
          placeholder="ABC123"
          errorMessage={errors.roomCode && errors.roomCode.message}
        />
        <ServiceList handleServiceChange={handleServiceChange} />
        <ParametersList handleSettingsChange={handleSettingsChange} />
      </View>

      <Button onPress={handleSubmit(onSubmit)} block>
        Créer la salle
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingVertical: 32,
    paddingHorizontal: 18,
    gap: 10,
    justifyContent: "center",
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
  labelText: {
    fontSize: 20,
    fontFamily: "Outfit-Bold",
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: "#7f7f7f",
  },
});
