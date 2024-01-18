import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Checkbox from "expo-checkbox";
import CustomTextInput from "./CustomTextInput";
import React, { useState } from "react";

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
  const [isPressed, setIsPressed] = useState(false);
  const TriangleRight = () => {
    return <View style={[styles.triangle, styles.triangleRight]} />;
  };

  const TriangleDown = () => {
    return <View style={[styles.triangle, styles.triangleDown]} />;
  };

  return (
    <View>
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
        <View>
          <View style={styles.checkboxContainer}>
            <Text style={styles.labelText}>
              Autoriser à lancer un vote pour passer une musique
            </Text>
            <Checkbox
              style={styles.checkbox}
              disabled={false}
              value={canVote}
              color={"black"}
              onValueChange={(newValue) => setCanVote(newValue)}
            />
          </View>

          <Text style={styles.labelText}>
            Pourcentage de votes pour passer une musique
          </Text>
          <CustomTextInput
            style={[styles.input, !canVote && styles.inputDisabled]}
            inputMode={"numeric"}
            value={canVote ? percentageVoteToSkipAMusic : ""}
            onChangeText={setPercentageVote}
            disabled={!canVote}
          />
          <Text style={styles.labelText}>
            Nombre maximum de musique par utilisateur
          </Text>
          <CustomTextInput
            style={styles.input}
            inputMode={"numeric"}
            value={maxMusicPerUser}
            onChangeText={setMaxMusicPerUser}
          />
          <Text style={styles.labelText}>Durée maximale d'une musique</Text>
          <CustomTextInput
            style={styles.input}
            inputMode={"numeric"}
            value={maxMusicDuration}
            onChangeText={setMaxMusicDuration}
          />
        </View>
      )}
      {!isPressed && <View />}
    </View>
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
