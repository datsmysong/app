import { useLocalSearchParams } from "expo-router";
import ActiveRoomView from "../../../../components/ActiveRoomView";
import { Text, View } from "../../../../components/Themed";
import useRoom from "../../../../lib/useRoom";

export default function RoomView() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const room = useRoom(id);


  return (
    <View style={{ flex: 1 }}>
      {room && room.is_active && <ActiveRoomView room={room} />}
      {room && !room.is_active && <Text>TODO</Text>}
      {!room && (
        <Text>
          Vous semblez perdu, la salle à laquelle vous essayez d'accéder
          n'existe pas, ou vous n'êtes pas autorisé à y accéder.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  title: {
    color: "#000",
    fontFamily: "Outfit-Bold",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "700",
    letterSpacing: 0.48,
  },
  list: {
    marginVertical: 12,
  },
  floatingContainer: {
    position: "absolute",
    bottom: 24,
    right: 24,
  },
  text: {
    color: "#FFF",
    fontFamily: "Outfit",
    fontSize: 50,
  },
  headerContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 14,
    gap: 10,
  },
  buttonContainer: {
    gap: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
  },
  titleLayout: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  settingsIcon: {
    display: "flex",
    width: 32,
    height: 32,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
