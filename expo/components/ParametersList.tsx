import Checkbox from "expo-checkbox";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import CustomTextInput from "./CustomTextInput";

interface ParametersListProps {
  percentageVoteToSkipAMusic: string;
  setPercentageVote: (text: string) => void;
  maxMusicPerUser: string;
  setMaxMusicPerUser: (text: string) => void;
  maxMusicDuration: string;
  setMaxMusicDuration: (text: string) => void;
  canVote: boolean;
  setCanVote: (value: boolean) => void;
}

export default function ParametersList({
  percentageVoteToSkipAMusic,
  setPercentageVote,
  maxMusicPerUser,
  setMaxMusicPerUser,
  maxMusicDuration,
  setMaxMusicDuration,
  canVote,
  setCanVote,
}: ParametersListProps) {
  return (
    <View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.labelText}>
          Autoriser à lancer un vote pour passer une musique
        </Text>
        <Checkbox
          style={styles.checkbox}
          disabled={false}
          value={canVote}
          color="black"
          onValueChange={(newValue) => setCanVote(newValue)}
        />
      </View>

      <Text style={styles.labelText}>
        Pourcentage de votes pour passer une musique
      </Text>
      <CustomTextInput
        style={[styles.input, !canVote && styles.inputDisabled]}
        inputMode="numeric"
        value={canVote ? percentageVoteToSkipAMusic : ""}
        onChangeText={setPercentageVote}
        disabled={!canVote}
      />
      <Text style={styles.labelText}>
        Nombre maximum de musique par utilisateur
      </Text>
      <CustomTextInput
        style={styles.input}
        inputMode="numeric"
        value={maxMusicPerUser}
        onChangeText={setMaxMusicPerUser}
      />
      <Text style={styles.labelText}>Durée maximale d'une musique</Text>
      <CustomTextInput
        style={styles.input}
        inputMode="numeric"
        value={maxMusicDuration}
        onChangeText={setMaxMusicDuration}
      />
      <Text style={styles.labelText}>
        Pourcentage de votes pour passer une musique
      </Text>
      <CustomTextInput
        style={[styles.input, !canVote && styles.inputDisabled]}
        inputMode="numeric"
        value={canVote ? percentageVoteToSkipAMusic : ""}
        onChangeText={setPercentageVote}
        disabled={!canVote}
      />
      <Text style={styles.labelText}>
        Nombre maximum de musique par utilisateur
      </Text>
      <CustomTextInput
        style={styles.input}
        inputMode="numeric"
        value={maxMusicPerUser}
        onChangeText={setMaxMusicPerUser}
      />
      <Text style={styles.labelText}>Durée maximale d'une musique</Text>
      <CustomTextInput
        style={styles.input}
        inputMode="numeric"
        value={maxMusicDuration}
        onChangeText={setMaxMusicDuration}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    margin: 10,
  },

  checkboxContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  input: {
    textAlign: "center",
  },

  inputDisabled: {
    backgroundColor: "#ddd",
  },

  labelText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
});
