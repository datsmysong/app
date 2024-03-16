import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Text, View } from "react-native";
import { Socket } from "socket.io-client";

import Button from "../../../../components/Button";
import ErrorBoundary from "../../../../components/ErrorBoundary";
import { getApiUrl } from "../../../../lib/apiUrl";
import SocketIo from "../../../../lib/socketio";

const WebSocketContext = createContext<Socket | null>(null);

const WebSocketProvider = ({
  children,
  roomId,
}: {
  children: ReactNode;
  roomId: string;
}) => {
  const [webSocket, setWebSocket] = useState<Socket | null>(null);

  const [socketError, setSockerError] = useState<Error | null>(null);

  useEffect(() => {
    const url: URL = new URL("/room/" + roomId, getApiUrl());

    const socketInstance = SocketIo.getInstance().getSocket(url.pathname);
    setWebSocket(socketInstance);
    console.log("Socket connecté");

    socketInstance.on("connect_error", (error) => {
      setSockerError(error);
    });

    socketInstance.on("connect", () => {
      setSockerError(null);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [roomId]);

  const handleReconnect = () => {
    setSockerError(null);
    webSocket?.disconnect();
    webSocket?.connect();
  };

  return (
    <WebSocketContext.Provider value={webSocket}>
      {socketError && (
        <View
          style={{
            backgroundColor: "#fffbe6",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              padding: 10,
              gap: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="warning" size={24} color="red" />
            <Text>Vous n'êtes plus connecté au serveur</Text>
            <Button type="outline" size="small" onPress={handleReconnect}>
              Ressayer
            </Button>
          </View>
        </View>
      )}
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export default function RoomTabLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <WebSocketProvider roomId={id}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Nom de la salle" }} />
        <Stack.Screen
          name="invite"
          options={{ presentation: "modal", title: "Menu d'invitation" }}
        />
        <Stack.Screen
          name="qrcode"
          options={{
            title: "Rejoindre la salle",
            presentation: "transparentModal",
          }}
        />
        <Stack.Screen name="add" options={{ title: "Ajouter une musique" }} />
        <Stack.Screen name="settings" options={{ title: "Paramètres" }} />
      </Stack>
    </WebSocketProvider>
  );
}
