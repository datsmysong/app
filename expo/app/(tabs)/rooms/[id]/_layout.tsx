import { Stack, useLocalSearchParams } from "expo-router";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket } from "socket.io-client";

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

  useEffect(() => {
    const url: URL = new URL("/room/" + roomId, getApiUrl());

    const socketInstance = SocketIo.getInstance().getSocket(url.pathname);
    setWebSocket(socketInstance);
    console.log("Socket connecté");

    return () => {
      socketInstance.disconnect();
      console.log("Socket déconnecté");
    };
  }, [roomId]);

  return (
    <WebSocketContext.Provider value={webSocket}>
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
        <Stack.Screen
          name="search-music"
          options={{ title: "Ajouter une musique" }}
        />
      </Stack>
      <Stack.Screen name="settings" options={{ title: "Paramètres" }} />
    </WebSocketProvider>
  );
}
