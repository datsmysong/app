import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import CustomCheckbox from "./CustomCheckbox";
import CustomSlider from "./CustomSlider";
import CustomTextInput from "./CustomTextInput";
import H2 from "./text/H2";

export type RoomParameters = {
  maxParticipants: number;
  allowGuests: boolean;

  allowVoteSkip: boolean;
  voteSkipPercentage: number;

  maxMusicDuration: number;
  maxMusicPerUser: number;
};

interface ParametersListProps {
  handleSettingsChange: (settings: RoomParameters) => void;
}

export default function ParametersList({
  handleSettingsChange,
}: ParametersListProps) {
  const [parameters, setParameters] = useState<RoomParameters>({
    maxParticipants: 10,
    allowGuests: false,
    allowVoteSkip: false,
    voteSkipPercentage: 50,
    maxMusicDuration: 180,
    maxMusicPerUser: 10,
  });

  return (
    <View
      style={{
        gap: 12,
      }}
    >
      <ParameterCard title="Participants">
        <CustomSlider
          maximumValue={20}
          minimumValue={2}
          maximumTrackTintColor="#CCCCCC"
          minimumTrackTintColor="#1A1A1A"
          // Doesn't change anything, don't really understand why, but I'll need to find a
          // solution to this later
          value={parameters.maxParticipants}
          setValue={(value) =>
            setParameters((prev) => ({ ...prev, maxParticipants: value }))
          }
          // The column is not on the table room_configuration
          // onSlidingComplete={handleSave}
          step={1}
        />
        <CustomCheckbox
          disabled
          value={parameters.allowGuests}
          setValue={(value) =>
            setParameters((prev) => ({ ...prev, allowGuests: value }))
          }
          label="Autoriser les utilisateurs anonymes"
        />
      </ParameterCard>

      <ParameterCard title="Votes">
        <CustomCheckbox
          value={parameters.allowVoteSkip}
          setValue={(value) =>
            setParameters((prev) => ({ ...prev, allowVoteSkip: value }))
          }
          label="Activer le vote skipping"
        />
        <CustomSlider
          maximumValue={100}
          minimumValue={1}
          maximumTrackTintColor="#CCCCCC"
          minimumTrackTintColor={parameters.allowVoteSkip ? "#1A1A1A" : "grey"}
          value={parameters.voteSkipPercentage}
          setValue={(value) => {
            setParameters((prev) => ({ ...prev, voteSkipPercentage: value }));
          }}
          step={5}
          disabled={!parameters.allowVoteSkip}
        />
      </ParameterCard>

      <ParameterCard title="Musiques">
        <CustomTextInput
          value={parameters.maxMusicDuration + ""}
          onChangeText={(value) =>
            setParameters((prev) => ({
              ...prev,
              maxMusicDuration: parseInt(value, 10),
            }))
          }
          style={styles.input}
        />
        <CustomTextInput
          value={parameters.maxMusicPerUser + ""}
          onChangeText={(value) =>
            setParameters((prev) => ({
              ...prev,
              maxMusicPerUser: parseInt(value, 10),
            }))
          }
          style={styles.input}
        />
      </ParameterCard>
    </View>
  );

  function ParameterCard({
    title = "Titre à définir",
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <View style={styles.card}>
        <H2>{title}</H2>
        <ParameterCardOptions>{children}</ParameterCardOptions>
      </View>
    );
  }

  function ParameterCardOptions({ children }: { children: React.ReactNode }) {
    return <View style={styles.cardOptions}>{children}</View>;
  }
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
  },
  cardOptions: {
    gap: 8,
  },
  title: {
    color: "#000",
    fontFamily: "Outfit-Regular",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "700",
    letterSpacing: 0.48,
    padding: 10,
  },
  slider: {
    justifyContent: "center",
    marginLeft: 10,
    flex: 1,
  },

  sliderBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },

  sliderDuration: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
  },

  labelText: {
    fontFamily: "Outfit-Bold",
    fontSize: 17,
    fontStyle: "normal",
  },
  inputLayout: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "stretch",
    gap: 8,
  },
  input: {
    color: "grey",
    fontSize: 14,
    width: "100%",
  },
  thumbLabel: {
    position: "absolute",
    bottom: "100%",
    borderRadius: 16,
    width: "10%",
    height: 19,
    backgroundColor: "#1A1A1A",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 2,
  },

  sliderPolygon: {
    width: "3%",
    height: 8,
    flexShrink: 0,
  },
});
